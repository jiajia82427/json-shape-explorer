import { formatType, sortedFields, unwrapArrayItem } from "../shape-utils.js";

export function renderDiff(oldReport, newReport) {
  const oldFields = collectFields(oldReport);
  const newFields = collectFields(newReport);
  const paths = new Set([...oldFields.keys(), ...newFields.keys()]);
  const added = [];
  const removed = [];
  const changed = [];

  for (const path of [...paths].sort()) {
    const before = oldFields.get(path);
    const after = newFields.get(path);

    if (!before && after) {
      added.push([path, after]);
      continue;
    }

    if (before && !after) {
      removed.push([path, before]);
      continue;
    }

    if (
      before &&
      after &&
      (before.type !== after.type || before.presence !== after.presence)
    ) {
      changed.push([path, before, after]);
    }
  }

  const sections = [
    "# JSON Shape Diff",
    "",
    `Old samples: ${oldReport.sampleCount}`,
    `New samples: ${newReport.sampleCount}`,
    ""
  ];

  appendAdded(sections, added);
  appendRemoved(sections, removed);
  appendChanged(sections, changed);

  if (added.length === 0 && removed.length === 0 && changed.length === 0) {
    sections.push("No shape changes detected.", "");
  }

  return `${sections.join("\n")}\n`;
}

function collectFields(report) {
  const fields = new Map();
  collectNodeFields(report.root, report.sampleCount, "", fields);
  return fields;
}

function collectNodeFields(node, parentCount, prefix, fields) {
  for (const [fieldName, fieldNode] of sortedFields(node)) {
    const path = prefix ? `${prefix}.${fieldName}` : fieldName;
    const presence = `${fieldNode.count}/${parentCount}`;

    fields.set(path, {
      presence,
      type: formatType(fieldNode)
    });

    collectNodeFields(
      unwrapArrayItem(fieldNode),
      Math.max(fieldNode.count, 1),
      path,
      fields
    );
  }
}

function appendAdded(sections, added) {
  if (added.length === 0) return;

  sections.push("## Added", "");
  sections.push("| Field | Type | Presence |");
  sections.push("|---|---|---:|");

  for (const [path, field] of added) {
    sections.push(`| ${path} | ${escapeTable(field.type)} | ${field.presence} |`);
  }

  sections.push("");
}

function appendRemoved(sections, removed) {
  if (removed.length === 0) return;

  sections.push("## Removed", "");
  sections.push("| Field | Previous Type | Previous Presence |");
  sections.push("|---|---|---:|");

  for (const [path, field] of removed) {
    sections.push(`| ${path} | ${escapeTable(field.type)} | ${field.presence} |`);
  }

  sections.push("");
}

function appendChanged(sections, changed) {
  if (changed.length === 0) return;

  sections.push("## Changed", "");
  sections.push("| Field | Before | After |");
  sections.push("|---|---|---|");

  for (const [path, before, after] of changed) {
    sections.push(
      `| ${path} | ${escapeTable(`${before.type} (${before.presence})`)} | ${escapeTable(`${after.type} (${after.presence})`)} |`
    );
  }

  sections.push("");
}

function escapeTable(value) {
  return value.replaceAll("|", "\\|");
}
