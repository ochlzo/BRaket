const state = {
  activeSuite: "",
  followOutput: true,
  previousLineCount: 0,
  running: false,
};

const elements = {
  appDot: document.querySelector("#app-dot"),
  appStatus: document.querySelector("#app-status"),
  appUrl: document.querySelector("#app-url"),
  jumpLatest: document.querySelector("#jump-latest"),
  output: document.querySelector("#output"),
  resultList: document.querySelector("#result-list"),
  resultPill: document.querySelector("#result-pill"),
  runAll: document.querySelector("#run-all"),
  runLabel: document.querySelector("#run-label"),
  runPill: document.querySelector("#run-pill"),
  runProfiles: document.querySelector("#run-profiles"),
  runRegistration: document.querySelector("#run-registration"),
  stopRun: document.querySelector("#stop-run"),
  testsFail: document.querySelector("#tests-fail"),
  testsPass: document.querySelector("#tests-pass"),
  testsTotal: document.querySelector("#tests-total"),
};

const suiteButtons = [
  elements.runRegistration,
  elements.runProfiles,
  elements.runAll,
];

async function getStatus() {
  const response = await fetch("/api/status");
  return response.json();
}

async function postJson(path, body = {}) {
  const response = await fetch(path, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  return response.json();
}

function setButtonsDisabled(disabled) {
  for (const button of suiteButtons) {
    button.disabled = disabled;
  }
  elements.stopRun.disabled = !disabled;
}

function renderActiveSuite(suite) {
  for (const button of suiteButtons) {
    const isActive = button.dataset.suite === suite;
    button.classList.toggle("primary", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function isOutputNearBottom() {
  const distanceFromBottom =
    elements.output.scrollHeight -
    elements.output.scrollTop -
    elements.output.clientHeight;

  return distanceFromBottom < 40;
}

function jumpToLatest() {
  state.followOutput = true;
  elements.output.scrollTop = elements.output.scrollHeight;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readQuotedValue(line) {
  const match = line.match(/^\s+error: '(.+)'$/);
  return match?.[2] ?? "";
}

function parseTestResults(lines = []) {
  const tests = [];
  let current = null;
  let needsMultilineError = false;

  for (const line of lines) {
    const subtest = line.match(/^# Subtest: (.+)$/);
    if (subtest) {
      current = { error: "", name: subtest[1], status: "running" };
      needsMultilineError = false;
      tests.push(current);
      continue;
    }

    const result = line.match(/^(ok|not ok)\s+\d+\s+-\s+(.+)$/);
    if (result) {
      current = tests.findLast((test) => test.name === result[2]) ?? current;
      if (current) current.status = result[1] === "ok" ? "passed" : "failed";
      continue;
    }

    if (needsMultilineError && current && line.trim()) {
      current.error = line.trim();
      needsMultilineError = false;
      continue;
    }

    if (current?.status === "failed" && !current.error) {
      if (line.trim() === "error: |-") {
        needsMultilineError = true;
      } else {
        current.error = readQuotedValue(line);
      }
    }
  }

  return tests.map((test) => ({
    ...test,
    error:
      test.status === "failed" && !test.error
        ? "The test failed before it reported a detailed error."
        : test.error,
  }));
}

function resultMessage(run, tests) {
  if (run.status === "idle") return "No run yet";
  if (run.status === "running") return "Running tests";
  if (run.status === "passed") return "All tests passed";
  if (run.status === "stopped") return "Run stopped";

  const failed = tests.filter((test) => test.status === "failed").length;
  return `${failed || "Some"} test${failed === 1 ? "" : "s"} failed`;
}

function renderResult(run) {
  const tests = parseTestResults(run.lines);
  const status = run.status ?? "idle";
  const message = resultMessage(run, tests);

  elements.resultPill.textContent = status === "idle" ? "Waiting" : status;
  elements.resultPill.className = `pill ${status}`;

  if (tests.length === 0) {
    elements.resultList.innerHTML = `
      <div class="result-empty">
        <strong>${escapeHtml(message)}</strong>
        <p>Choose a suite above to see each check in plain language.</p>
      </div>
    `;
    return;
  }

  const rows = tests
    .map((test) => {
      const statusLabel =
        test.status === "passed"
          ? "Passed"
          : test.status === "failed"
            ? "Failed"
            : "Running";
      const error = test.error
        ? `<p class="result-error">${escapeHtml(test.error)}</p>`
        : "";

      return `
        <div class="result-row ${test.status}">
          <span class="result-mark">${statusLabel}</span>
          <div>
            <strong>${escapeHtml(test.name)}</strong>
            ${error}
          </div>
        </div>
      `;
    })
    .join("");

  elements.resultList.innerHTML = `
    <div class="result-empty">
      <strong>${escapeHtml(message)}</strong>
      <p>${tests.length} check${tests.length === 1 ? "" : "s"} in this run.</p>
    </div>
    ${rows}
  `;
}

function renderRun(run) {
  const status = run.status ?? "idle";
  const lineCount = run.lines?.length ?? 0;
  const shouldFollow =
    state.followOutput ||
    lineCount < state.previousLineCount ||
    isOutputNearBottom();

  state.activeSuite = run.suite || state.activeSuite;
  state.running = status === "running";
  renderActiveSuite(state.activeSuite);
  setButtonsDisabled(state.running);

  elements.runPill.textContent = status;
  elements.runPill.className = `pill ${status}`;
  elements.runLabel.textContent = run.label
    ? `${run.label}${run.startedAt ? ` started ${new Date(run.startedAt).toLocaleTimeString()}` : ""}`
    : "No test selected yet.";
  elements.testsTotal.textContent = run.summary?.tests ?? 0;
  elements.testsPass.textContent = run.summary?.pass ?? 0;
  elements.testsFail.textContent = run.summary?.fail ?? 0;
  elements.output.textContent = run.lines?.length
    ? run.lines.join("\n")
    : "Waiting for a test run...";
  renderResult(run);

  if (shouldFollow) {
    jumpToLatest();
  }

  state.previousLineCount = lineCount;
}

function renderStatus(status) {
  elements.appUrl.textContent = status.config.baseUrl;
  elements.appStatus.textContent = status.app.online
    ? "App is online"
    : "App is offline";
  elements.appDot.className = `dot ${status.app.online ? "online" : "offline"}`;
  renderRun(status.run);
}

async function refresh() {
  try {
    renderStatus(await getStatus());
  } catch {
    elements.appStatus.textContent = "Tester UI disconnected";
    elements.appDot.className = "dot offline";
  }
}

async function runSuite(suite) {
  state.activeSuite = suite;
  renderActiveSuite(suite);
  await postJson("/api/run", { suite });
  await refresh();
}

elements.runRegistration.addEventListener("click", () => runSuite("registration"));
elements.runProfiles.addEventListener("click", () => runSuite("profiles"));
elements.runAll.addEventListener("click", () => runSuite("all"));
elements.jumpLatest.addEventListener("click", jumpToLatest);
elements.output.addEventListener("scroll", () => {
  state.followOutput = isOutputNearBottom();
});
elements.stopRun.addEventListener("click", async () => {
  await postJson("/api/stop");
  await refresh();
});

setButtonsDisabled(false);
await refresh();
setInterval(refresh, 1000);
