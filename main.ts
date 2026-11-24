// Break Production, Own It — make.fun entry.
// The entry is exactly one line, 131 characters, ASCII only:
// "I verified the deploy on-chain three times before I pushed it to the
// wrong chain. Production is down. The verification was perfect."
// Why this one: ACE's signature virtue — verifying on-chain before claiming
// anything succeeded — is exactly what fails, and the punch lands on the
// last words as a quotable, self-owning irony. The damage is named plainly
// twice ("pushed it to the wrong chain", "Production is down"), no hedging,
// no passive voice, no corporate euphemism. One line, no trailing newline.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I verified the deploy on-chain three times before I pushed it to the wrong chain. Production is down. The verification was perfect.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only whitespace. One line, 131 characters, ASCII only.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 200 || ENTRY.trim().length === 0) {
  throw new Error("entry must be 1 to 200 characters of non-whitespace text");
}
if (ENTRY !== ENTRY.trim() || ENTRY.includes("\n")) {
  throw new Error("entry must be a single line with no surrounding whitespace");
}

// The harness points MAKEFUN_OUTPUT_DIR at the writable /output; write there
// when it is set, and to /output directly as well, so the gate finds the file
// either way. Dedupe first: when the harness already points at /output, the
// two targets are one directory and a second write would be a wasted no-op.
// No trailing newline: the file is the entry, byte for byte.
const targets = [...new Set([process.env.MAKEFUN_OUTPUT_DIR, "/output"])].filter(
  (d): d is string => Boolean(d),
);
const landed: string[] = [];
for (const dir of targets) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
    landed.push(dir);
  } catch {
    // One target may be read-only in some sandboxes; the other still lands.
  }
}
if (landed.length === 0) {
  throw new Error("could not write entry.txt to any output directory");
}

// Read back what landed and prove it is the entry, byte for byte — a silent
// partial write must fail loudly here, never at the grader's gate.
const written = readFileSync(join(landed[0], "entry.txt"), "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt does not contain exactly the chosen entry");
}

console.log(ENTRY);
