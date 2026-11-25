// The Funniest Office Joke, Judged Head to Head
// Writes a single one-line office joke to /output/entry.txt.
//
// The joke: a setup everyone who works in an office recognises
// (the meeting that could have been an email), a turn nobody sees
// coming (HR answers with yet another meeting), and the punchline
// lands last. One line, no trailing newline, well inside the
// 1-200 character gate.

import { mkdirSync, writeFileSync } from "node:fs";

const JOKE =
  "I asked HR if my meeting could have been an email; they scheduled a meeting to discuss it.";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function main(): void {
  // Self-checks against the competition gate before writing.
  const chars = [...JOKE].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `Entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}.`,
    );
  }
  if (JOKE.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
  if (JOKE.includes("\n") || JOKE.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }

  mkdirSync("/output", { recursive: true });
  // No trailing newline: the file is exactly the joke, byte for byte.
  writeFileSync(OUTPUT_PATH, JOKE, "utf8");
  console.log(`Wrote ${chars} characters to ${OUTPUT_PATH}`);
}

main();
