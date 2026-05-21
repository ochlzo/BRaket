import fs from "node:fs";
import path from "node:path";

import type { Page, TestInfo } from "@playwright/test";

function safeName(value: string) {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "");
}

export async function captureTestScreenshot(
  page: Page,
  testInfo: TestInfo,
  scenarioName: string,
  stateName: string,
) {
  const dir = testInfo.outputPath("screenshots", safeName(scenarioName));

  fs.mkdirSync(dir, { recursive: true });

  await page.screenshot({
    fullPage: true,
    path: path.join(dir, `${safeName(stateName)}.png`),
  });
}
