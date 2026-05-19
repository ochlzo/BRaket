import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

test("booking accept flows notify the client about the response", () => {
  const actionsSource = read("server/bookings/actions.ts");
  const responsesSource = read("server/bookings/responses.ts");

  assert.match(actionsSource, /notifyClientAboutBookingResponse/);
  assert.match(responsesSource, /notifyClientAboutBookingResponse/);
});
