# JSON Shape Explorer

Understand unknown JSON datasets in seconds.

JSON Shape Explorer is a small CLI tool that reads one or more JSON samples and summarizes their structure, field types, and optional fields in a readable Markdown report.

## Why

When you receive unfamiliar API responses, logs, exports, or configuration files, it is often hard to answer simple questions:

- Which fields always exist?
- Which fields are optional?
- Do arrays contain objects, strings, or mixed values?
- What nested structure is hiding inside the data?

This project helps answer those questions quickly.

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
| id | number | 3/3 | 1 |
| name | string | 3/3 | "Ada Lovelace" |
| email | string \| null | 2/3 | "ada@example.com" |
```

## Commands

```bash
json-shape examples/users.json
json-shape samples/*.json --out report.md
```

During local development:

```bash
node src/cli.js examples/users.json
node --test
```

## Roadmap

- Markdown shape reports
- TypeScript interface output
- JSON Schema output
- JSONL support
- Field format detection, such as email, URL, UUID, and datetime
- Shape diff for comparing old and new API responses

## License

MIT
