import { Builder, Browser } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import edge from "selenium-webdriver/edge.js";
import firefox from "selenium-webdriver/firefox.js";

import { BROWSER, HEADLESS } from "./config.js";

export async function createDriver() {
  const builder = new Builder().forBrowser(BROWSER);

  if (BROWSER === Browser.CHROME || BROWSER === "chrome") {
    const options = new chrome.Options();
    if (HEADLESS) options.addArguments("--headless=new");
    options.addArguments("--window-size=1440,1100");
    builder.setChromeOptions(options);
  }

  if (BROWSER === Browser.FIREFOX || BROWSER === "firefox") {
    const options = new firefox.Options();
    if (HEADLESS) options.addArguments("-headless");
    builder.setFirefoxOptions(options);
  }

  if (BROWSER === Browser.EDGE || BROWSER === "MicrosoftEdge") {
    const options = new edge.Options();
    if (HEADLESS) options.addArguments("--headless=new");
    options.addArguments("--window-size=1440,1100");
    builder.setEdgeOptions(options);
  }

  return builder.build();
}
