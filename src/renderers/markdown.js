import {
  formatExample,
  formatType,
  sortedFields,
  unwrapArrayItem
} from "../shape-utils.js";

export function renderMarkdown(report) {
  const sections = [
    "# JSON Shape Report",
    "",
    `Analyzed ${report.sampleCount} ${pluralize("sample", report.sampleCount)}.`,
    "",
    "## Root",
    "",
    `Type: ${formatType(report.root)}`,
    ""
  ];

  appendObjectSection(sections, "Fields", report.root, report.sampleCount);

  return `${sections.join("\n")}\n`;
}

function appendObjectSection(sections, title, node, parentCount) {
  if (node.fields.size === 0) {
    return;
  }

  sections.push(`## ${title}`, "");
  sections.push("| Field | Type | Presence | Example |");
  sections.push("|---|---|---:|---|");

  const fields = sortedFields(node);

  for (const [name, fieldNode] of fields) {
    sections.push(
      `| ${escapeTable(name)} | ${escapeTable(formatType(fieldNode))} | ${fieldNode.count}/${parentCount} | ${escapeTable(formatExample(fieldNode.examples[0]))} |`
    );
  }

  sections.push("");

  for (const [name, fieldNode] of fields) {
    appendObjectSection(
      sections,
      `Nested: ${name}`,
      unwrapArrayItem(fieldNode),
      Math.max(fieldNode.count, 1)
    );
  }
}

function escapeTable(value) {
  return value.replaceAll("|", "\\|");
}

function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}
