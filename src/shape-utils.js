export function sortedFields(node) {
  return [...node.fields.entries()].sort(([left], [right]) =>
    left.localeCompare(right)
  );
}

export function unwrapArrayItem(node) {
  if (node.kinds.has("array") && node.item?.fields.size) {
    return node.item;
  }

  return node;
}

export function formatType(node) {
  const types = [...node.kinds].sort().map((kind) => {
    if (kind === "array") {
      return `${node.item ? formatType(node.item) : "unknown"}[]`;
    }

    return kind;
  });

  return types.join(" | ");
}

export function formatExample(value) {
  if (value === undefined) {
    return "";
  }

  return JSON.stringify(value);
}

export function toPascalCase(value) {
  const normalized = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();

  if (!normalized) {
    return "Value";
  }

  return normalized
    .split(/\s+/)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

export function isIdentifier(value) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value);
}
