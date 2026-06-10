import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyze } from "../src/analyzer.js";
import { renderDiff } from "../src/renderers/diff.js";
import { renderJsonSchema } from "../src/renderers/json-schema.js";
import { renderMarkdown } from "../src/renderers/markdown.js";
import { renderTypeScript } from "../src/renderers/typescript.js";

describe("analyze", () => {
  it("tracks field presence and mixed types", () => {
    const report = analyze([
      { id: 1, email: "ada@example.com" },
      { id: 2, email: null },
      { id: 3 }
    ]);

    const id = report.root.fields.get("id");
    const email = report.root.fields.get("email");

    assert.equal(report.sampleCount, 3);
    assert.equal(id?.count, 3);
    assert.equal(id?.kinds.has("number"), true);
    assert.equal(email?.count, 2);
    assert.equal(email?.kinds.has("string"), true);
    assert.equal(email?.kinds.has("null"), true);
  });
});

describe("renderMarkdown", () => {
  it("renders a field table", () => {
    const markdown = renderMarkdown(
      analyze([{ id: 1, name: "Ada" }, { id: 2 }])
    );

    assert.match(markdown, /# JSON Shape Report/);
    assert.match(markdown, /\| id \| number \| 2\/2 \| 1 \|/);
    assert.match(markdown, /\| name \| string \| 1\/2 \| "Ada" \|/);
  });
});

describe("renderTypeScript", () => {
  it("renders required, optional, nullable, array, and nested fields", () => {
    const typescript = renderTypeScript(
      analyze([
        {
          id: 1,
          email: "ada@example.com",
          roles: ["admin"],
          profile: { active: true }
        },
        {
          id: 2,
          email: null,
          roles: [],
          profile: { active: false, timezone: "UTC" }
        }
      ])
    );

    assert.match(typescript, /export interface Root/);
    assert.match(typescript, /id: number;/);
    assert.match(typescript, /email: null \| string;/);
    assert.match(typescript, /roles: string\[\];/);
    assert.match(typescript, /profile: RootProfile;/);
    assert.match(typescript, /timezone\?: string;/);
  });
});

describe("renderJsonSchema", () => {
  it("renders a JSON Schema object with required fields", () => {
    const schema = JSON.parse(
      renderJsonSchema(analyze([{ id: 1, name: "Ada" }, { id: 2 }]))
    );

    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
    assert.equal(schema.type, "object");
    assert.equal(schema.properties.id.type, "number");
    assert.equal(schema.properties.name.type, "string");
    assert.deepEqual(schema.required, ["id"]);
  });
});

describe("renderDiff", () => {
  it("renders added, removed, and changed fields", () => {
    const diff = renderDiff(
      analyze([{ id: 1, email: "ada@example.com" }]),
      analyze([{ id: "user_1", roles: ["admin"] }])
    );

    assert.match(diff, /## Added/);
    assert.match(diff, /\| roles \| string\[\] \| 1\/1 \|/);
    assert.match(diff, /## Removed/);
    assert.match(diff, /\| email \| string \| 1\/1 \|/);
    assert.match(diff, /## Changed/);
    assert.match(diff, /\| id \| number \(1\/1\) \| string \(1\/1\) \|/);
  });
});
