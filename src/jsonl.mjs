import fs from "node:fs";

export function readJsonLines(path) {
  return fs
    .readFileSync(path, "utf8")
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

