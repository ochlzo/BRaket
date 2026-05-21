import dotenv from "dotenv";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testerRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(__dirname, "public");
const envPath = path.join(testerRoot, ".env");

function loadTesterEnv() {
  dotenv.config({ path: envPath, override: true });
}

loadTesterEnv();

const port = Number(process.env.QA_UI_PORT ?? 4188);
const suites = {
  all: {
    args: [
      "--test",
      "features/registration.input-validation.test.js",
      "features/profile-creation.input-validation.test.js",
    ],
    label: "All QA Tests",
  },
  profiles: {
    args: ["--test", "features/profile-creation.input-validation.test.js"],
    label: "Profile Creation",
  },
  registration: {
    args: ["--test", "features/registration.input-validation.test.js"],
    label: "Registration",
  },
};
const envGroups = {
  profiles: [
    "QA_CLIENT_EMAIL",
    "QA_CLIENT_PASSWORD",
    "QA_DUPLICATE_USERNAME",
    "QA_TALENT_EMAIL",
    "QA_TALENT_PASSWORD",
  ],
  registration: ["QA_DUPLICATE_EMAIL"],
};

let activeProcess = null;
let runState = {
  exitCode: null,
  finishedAt: null,
  label: "",
  lines: [],
  startedAt: null,
  status: "idle",
  suite: "",
};

function getBaseUrl() {
  return process.env.QA_BASE_URL ?? "http://localhost:3000";
}

function sendJson(response, statusCode, value) {
  response.writeHead(statusCode, { "content-type": "application/json" });
  response.end(JSON.stringify(value));
}

function stripAnsi(value) {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}

function appendLines(chunk) {
  const text = stripAnsi(String(chunk));
  const nextLines = text.split(/\r?\n/).filter(Boolean);
  runState.lines = [...runState.lines, ...nextLines].slice(-800);
}

function parseSummary(lines) {
  const summary = { fail: 0, pass: 0, tests: 0 };

  for (const line of lines) {
    const match = line.match(/^#\s+(fail|pass|tests)\s+(\d+)/);
    if (match) summary[match[1]] = Number(match[2]);
  }

  return summary;
}

function publicConfig() {
  loadTesterEnv();
  const envStatus = {};

  for (const [group, keys] of Object.entries(envGroups)) {
    envStatus[group] = keys.map((key) => ({
      key,
      present: Boolean(process.env[key]),
    }));
  }

  return {
    baseUrl: getBaseUrl(),
    browser: process.env.QA_BROWSER ?? "chrome",
    headless: process.env.QA_HEADLESS !== "false",
    envStatus,
    suites: Object.fromEntries(
      Object.entries(suites).map(([key, suite]) => [key, suite.label]),
    ),
  };
}

async function appStatus() {
  const baseUrl = getBaseUrl();
  const urls = [baseUrl];

  if (baseUrl.startsWith("http://localhost:")) {
    urls.push(baseUrl.replace("http://localhost:", "http://127.0.0.1:"));
  }

  for (const url of urls) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      return { online: true, status: response.status };
    } catch {
      // Try the loopback fallback when localhost resolves poorly.
    } finally {
      clearTimeout(timeout);
    }
  }

  return { online: false, status: null };
}

async function requestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function startRun(suiteKey) {
  loadTesterEnv();
  const suite = suites[suiteKey];
  if (!suite) return { error: "Unknown test suite." };
  if (activeProcess) return { error: "A test run is already active." };

  runState = {
    exitCode: null,
    finishedAt: null,
    label: suite.label,
    lines: [`Starting ${suite.label}...`],
    startedAt: new Date().toISOString(),
    status: "running",
    suite: suiteKey,
  };

  try {
    activeProcess = spawn(process.execPath, suite.args, {
      cwd: testerRoot,
      env: process.env,
      shell: false,
      windowsHide: true,
    });
  } catch (error) {
    runState.exitCode = 1;
    runState.finishedAt = new Date().toISOString();
    runState.lines.push(`Failed to start test process: ${error.message}`);
    runState.status = "failed";
    activeProcess = null;
    return { error: error.message };
  }

  activeProcess.stdout?.on("data", appendLines);
  activeProcess.stderr?.on("data", appendLines);
  activeProcess.on("error", (error) => {
    runState.exitCode = 1;
    runState.finishedAt = new Date().toISOString();
    runState.lines.push(`Test process error: ${error.message}`);
    runState.status = "failed";
    activeProcess = null;
  });
  activeProcess.on("close", (code) => {
    runState.exitCode = code;
    runState.finishedAt = new Date().toISOString();
    runState.status = code === 0 ? "passed" : "failed";
    activeProcess = null;
  });

  return { ok: true };
}

function stopRun() {
  if (!activeProcess) return { ok: true };
  activeProcess.kill();
  runState.status = "stopped";
  runState.finishedAt = new Date().toISOString();
  activeProcess = null;
  return { ok: true };
}

async function serveStatic(request, response) {
  const url = new URL(request.url, "http://localhost");
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(publicRoot, pathname);
  const extension = path.extname(filePath);
  const contentType =
    extension === ".css"
      ? "text/css"
      : extension === ".js"
        ? "text/javascript"
        : "text/html";

  try {
    const contents = await readFile(filePath);
    response.writeHead(200, { "content-type": contentType });
    response.end(contents);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");

  if (url.pathname === "/api/status") {
    sendJson(response, 200, {
      app: await appStatus(),
      config: publicConfig(),
      run: { ...runState, summary: parseSummary(runState.lines) },
    });
    return;
  }

  if (url.pathname === "/api/run" && request.method === "POST") {
    const body = await requestBody(request);
    const result = startRun(body.suite);
    sendJson(response, result.error ? 400 : 200, result);
    return;
  }

  if (url.pathname === "/api/stop" && request.method === "POST") {
    sendJson(response, 200, stopRun());
    return;
  }

  await serveStatic(request, response);
});

function openBrowser(url) {
  if (process.env.QA_UI_OPEN_BROWSER === "false") return;
  const command = process.platform === "win32" ? "cmd" : "open";
  const args =
    process.platform === "win32" ? ["/c", "start", "", url] : [url];

  spawn(command, args, { detached: true, stdio: "ignore" }).unref();
}

server.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`BRaket QA Tester UI: ${url}`);
  openBrowser(url);
});
