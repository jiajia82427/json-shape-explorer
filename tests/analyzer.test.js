import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyze } from "../src/analyzer.js";
import { renderMarkdown } from "../src/renderers/markdown.js";

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
