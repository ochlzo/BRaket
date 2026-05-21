import type { Page } from "@playwright/test";
import type { TestInfo } from "@playwright/test";

import { captureTestScreenshot } from "./test-screenshot";

export async function captureBookingStatusScreenshot(
  page: Page,
  testInfo: TestInfo,
  stepName: string,
  stateName: string,
) {
  await captureTestScreenshot(page, testInfo, stepName, stateName);
}
