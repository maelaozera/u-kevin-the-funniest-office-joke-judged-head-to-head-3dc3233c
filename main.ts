// The Funniest Office Joke, Judged Head to Head
// Writes a single one-line office joke to /output/entry.txt.
//
// The joke: a setup everyone who works in an office recognises
// (the meeting that could have been an email), a turn nobody sees
// coming (HR answers with yet another meeting), and the punchline
// lands last. One line, no trailing newline, well inside the
// 1-200 character gate.
//
// Layout of this file, top to bottom:
//   1. constants — the joke text, the output path, the gate limits
//   2. validation helpers — one small check per rule, composed by
//      validateLine() so each rule can be read and tested alone
//   3. formatting / writing — formatEntry() then writeEntry()
//   4. main() — the thin entry point that wires the pieces together

import { mkdirSync, writeFileSync } from "node:fs";

// --- Constants ------------------------------------------------------------

// The entry itself. Kept as a single literal so the exact wording,
// punctuation and spacing are visible in one place and cannot drift
// when the surrounding code is refactored.
const JOKE_TEXT =
  "I asked HR if my meeting could have been an email; they scheduled a meeting to discuss it.";

// Where the finished entry goes. The competition reads this exact path.
const OUTPUT_DIR = "/output";
const OUTPUT_PATH = "/output/entry.txt";

// The competition gate: an entry must be a single line of 1-200 chars.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// --- Validation helpers ---------------------------------------------------

// Count characters the way a reader sees them (code points, not UTF-16
// code units), so a future joke with emoji is measured fairly.
function countChars(text: string): number {
  return [...text].length;
}

// The length gate: too short is empty, too long is cut off by the judge.
function assertLengthInRange(text: string): void {
  const chars = countChars(text);
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `Entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}.`,
    );
  }
}

// A joke made only of spaces is not a joke.
function assertNotBlank(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
}

// The entry is judged head to head as one line; a line break would
// split the punchline away from the setup.
function assertSingleLine(text: string): void {
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
}

// Run every gate check in order. Throws on the first failing rule,
// so a bad entry never reaches the output file.
function validateLine(text: string): void {
  assertLengthInRange(text);
  assertNotBlank(text);
  assertSingleLine(text);
}

// --- Formatting and writing -----------------------------------------------

// Validate the raw text and hand back the exact bytes to write.
// There is no transformation step on purpose: the joke is already
// final, and any normalisation here could silently change it.
function formatEntry(text: string): string {
  validateLine(text);
  return text;
}

// Make sure the output directory exists before writing, creating
// it (and any missing parents) when this is a fresh environment.
function ensureOutputDir(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create the output directory if needed, then write the entry with
// no trailing newline: the file is exactly the joke, byte for byte.
// Returns the character count so main() can report it.
function writeEntry(text: string): number {
  ensureOutputDir();
  writeFileSync(OUTPUT_PATH, text, "utf8");
  return countChars(text);
}

// --- Entry point ----------------------------------------------------------

function main(): void {
  const entry = formatEntry(JOKE_TEXT);
  const chars = writeEntry(entry);
  console.log(`Wrote ${chars} characters to ${OUTPUT_PATH}`);
}

main();
