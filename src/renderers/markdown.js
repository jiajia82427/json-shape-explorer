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

  const fields = [...node.fields.entries()].sort(([left], [right]) =>
    left.localeCompare(right)
  );

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

function unwrapArrayItem(node) {
  if (node.kinds.has("array") && node.item?.fields.size) {
    return node.item;
  }

  return node;
}

function formatType(node) {
  const types = [...node.kinds].sort().map((kind) => {
    if (kind === "array") {
      return `${node.item ? formatType(node.item) : "unknown"}[]`;
    }

    return kind;
  });

  return types.join(" | ");
}

function formatExample(value) {
  if (value === undefined) {
    return "";
  }

  return JSON.stringify(value);
}

function escapeTable(value) {
  return value.replaceAll("|", "\\|");
}

function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}
