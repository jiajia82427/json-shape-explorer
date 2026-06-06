#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { analyze } from "./analyzer.js";
import { readJsonFiles } from "./reader.js";
import { renderMarkdown } from "./renderers/markdown.js";

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.paths.length === 0) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const samples = await readJsonFiles(options.paths);
  const report = analyze(samples);
  const rendered = renderMarkdown(report);

  if (options.out) {
    await writeFile(options.out, rendered, "utf8");
  } else {
    process.stdout.write(rendered);
  }
}

function parseArgs(args) {
  const options = {
    paths: []
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--out" || arg === "-o") {
      const out = args[index + 1];

      if (!out) {
        throw new Error("Missing value for --out");
      }

      options.out = out;
      index += 1;
      continue;
    }

    options.paths.push(arg);
  }

  return options;
}

function printHelp() {
  process.stdout.write(`JSON Shape Explorer

Usage:
  json-shape <file...> [--out report.md]

Examples:
  json-shape examples/users.json
  json-shape samples/*.json --out report.md
`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
});
