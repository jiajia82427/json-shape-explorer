# JSON Shape Explorer

[简体中文说明](README.zh-CN.md)

Understand unknown JSON datasets in seconds.

JSON Shape Explorer is a tiny zero-dependency CLI that reads one or more JSON samples and summarizes their structure, field types, nested objects, arrays, and optional fields in a readable Markdown report.

It is useful when you receive unfamiliar API responses, logs, exports, fixtures, or configuration files and want to quickly answer: "What shape does this data actually have?"

## Features

- Analyze one or more JSON files
- Treat top-level arrays as multiple samples
- Detect field presence, including optional fields
- Detect primitive, object, array, and mixed types
- Summarize nested object fields
- Generate Markdown reports
- Run with plain Node.js, no install step required

## Why

JSON files are easy to open, but real datasets are often messy. A field may exist in only some records, arrays may contain nested objects, and null values can hide inside otherwise simple-looking responses.

This project helps answer questions like:

- Which fields always exist?
- Which fields are optional?
- Do arrays contain objects, strings, or mixed values?
- What nested structure is hiding inside the data?

## Quick Start

```bash
node src/cli.js examples/users.json
```

Example output:

```md
# JSON Shape Report

Analyzed 3 samples.

## Root

Type: object

## Fields

| Field | Type | Presence | Example |
|---|---|---:|---|
| email | null \| string | 2/3 | "ada@example.com" |
| id | number | 3/3 | 1 |
| name | string | 3/3 | "Ada Lovelace" |
| profile | object | 3/3 |  |
| roles | string[] | 3/3 | ["admin","analyst"] |

## Nested: profile

| Field | Type | Presence | Example |
|---|---|---:|---|
| active | boolean | 3/3 | true |
| timezone | string | 2/3 | "Europe/London" |
```

## Commands

```bash
node src/cli.js examples/users.json
node src/cli.js samples/*.json --out report.md
```

If installed as a package, the CLI name is:

```bash
json-shape examples/users.json
json-shape samples/*.json --out report.md
```

## Development

```bash
node src/cli.js examples/users.json
node --test
```

## Project Status

This is an early open-source project. The current version focuses on a small, reliable Markdown report. The next goal is to add more output formats while keeping the core analyzer simple and easy to understand.

## Roadmap

- TypeScript interface output
- JSON Schema output
- JSONL support for log-style datasets
- Field format detection, such as email, URL, UUID, and datetime
- Shape diff for comparing old and new API responses
- GitHub Action for detecting API response shape changes in pull requests

## Contributing

Ideas, issues, and pull requests are welcome. A good first contribution would be adding a new renderer, improving nested array handling, or adding more fixture-based tests.

## License

MIT
