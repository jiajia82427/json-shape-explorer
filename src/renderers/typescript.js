import { isIdentifier, sortedFields, toPascalCase } from "../shape-utils.js";

export function renderTypeScript(report, options = {}) {
  const rootName = options.rootName ?? "Root";
  const declarations = [];
  const seen = new Set();

  renderInterface(rootName, report.root, report.sampleCount, declarations, seen);

  return `${declarations.join("\n\n")}\n`;
}

function renderInterface(name, node, parentCount, declarations, seen) {
  const interfaceName = uniqueName(name, seen);
  seen.add(interfaceName);

  const lines = [`export interface ${interfaceName} {`];

  for (const [fieldName, fieldNode] of sortedFields(node)) {
    const optional = fieldNode.count < parentCount ? "?" : "";
    const propertyName = formatPropertyName(fieldName);
    const type = toTypeScriptType(
      fieldNode,
      `${interfaceName}${toPascalCase(fieldName)}`,
      declarations,
      seen
    );

    lines.push(`  ${propertyName}${optional}: ${type};`);
  }

  lines.push("}");
  declarations.unshift(lines.join("\n"));

  return interfaceName;
}

function toTypeScriptType(node, nameHint, declarations, seen) {
  const types = [...node.kinds].sort().map((kind) => {
    if (kind === "null") return "null";
    if (kind === "string") return "string";
    if (kind === "number") return "number";
    if (kind === "boolean") return "boolean";
    if (kind === "array") {
      const itemType = node.item
        ? toTypeScriptType(node.item, `${nameHint}Item`, declarations, seen)
        : "unknown";
      return `${wrapArrayItemType(itemType)}[]`;
    }
    if (kind === "object") {
      return renderInterface(nameHint, node, Math.max(node.count, 1), declarations, seen);
    }

    return "unknown";
  });

  return types.length === 0 ? "unknown" : types.join(" | ");
}

function wrapArrayItemType(type) {
  return type.includes(" | ") ? `(${type})` : type;
}

function formatPropertyName(value) {
  return isIdentifier(value) ? value : JSON.stringify(value);
}

function uniqueName(value, seen) {
  const base = toPascalCase(value);
  let name = base;
  let index = 2;

  while (seen.has(name)) {
    name = `${base}${index}`;
    index += 1;
  }

  return name;
}
