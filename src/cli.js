#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { analyze } from "./analyzer.js";
import { readJsonFiles } from "./reader.js";
import { renderDiff } from "./renderers/diff.js";
import { renderJsonSchema } from "./renderers/json-schema.js";
import { renderMarkdown } from "./renderers/markdown.js";
import { renderTypeScript } from "./renderers/typescript.js";

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (options.diff && options.paths.length !== 2) {
    throw new Error("--diff expects exactly two JSON files: old.json new.json");
  }

  if (!options.diff && options.paths.length === 0) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const rendered = options.diff
    ? await renderDiffFromPaths(options.paths)
    : await renderReportFromPaths(options.paths, options.format);

  if (options.out) {
    await writeFile(options.out, rendered, "utf8");
  } else {
    process.stdout.write(rendered);
  }
}

async function renderReportFromPaths(paths, format) {
  const samples = await readJsonFiles(paths);
  const report = analyze(samples);

  if (format === "markdown") {
    return renderMarkdown(report);
  }

  if (format === "typescript") {
    return renderTypeScript(report);
  }

  if (format === "json-schema") {
    return renderJsonSchema(report);
  }

  throw new Error(`Unsupported format: ${format}`);
}

async function renderDiffFromPaths(paths) {
  const [oldPath, newPath] = paths;
  const oldReport = analyze(await readJsonFiles([oldPath]));
  const newReport = analyze(await readJsonFiles([newPath]));

  return renderDiff(oldReport, newReport);
}

function parseArgs(args) {
  const options = {
    diff: false,
    format: "markdown",
    help: false,
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

    if (arg === "--format" || arg === "-f") {
      const format = args[index + 1];

      if (!format) {
        throw new Error("Missing value for --format");
      }

      options.format = normalizeFormat(format);
      index += 1;
      continue;
    }

    if (arg === "--diff") {
      options.diff = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    options.paths.push(arg);
  }

  return options;
}

function normalizeFormat(format) {
  if (format === "md" || format === "markdown") {
    return "markdown";
  }

  if (format === "ts" || format === "typescript") {
    return "typescript";
  }

  if (format === "schema" || format === "json-schema" || format === "jsonschema") {
    return "json-schema";
  }

  throw new Error(`Unsupported format: ${format}`);
}

function printHelp() {
  process.stdout.write(`JSON Shape Explorer

Usage:
  json-shape <file...> [--format markdown|ts|schema] [--out report.md]
  json-shape --diff old.json new.json [--out diff.md]

Examples:
  json-shape examples/users.json
  json-shape examples/users.json --format ts
  json-shape examples/users.json --format schema
  json-shape --diff old.json new.json
  json-shape samples/*.json --out report.md
`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
});
