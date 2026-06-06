export function analyze(samples) {
  const root = createShapeNode();

  for (const sample of samples) {
    visit(sample, root);
  }

  return {
    root,
    sampleCount: samples.length
  };
}

export function createShapeNode() {
  return {
    count: 0,
    examples: [],
    fields: new Map(),
    kinds: new Set(),
    objectCount: 0
  };
}

function visit(value, node) {
  const kind = getKind(value);

  node.count += 1;
  node.kinds.add(kind);
  addExample(node, value);

  if (kind === "object") {
    node.objectCount += 1;

    for (const [fieldName, fieldValue] of Object.entries(value)) {
      let fieldNode = node.fields.get(fieldName);

      if (!fieldNode) {
        fieldNode = createShapeNode();
        node.fields.set(fieldName, fieldNode);
      }

      visit(fieldValue, fieldNode);
    }
  }

  if (kind === "array") {
    if (!node.item) {
      node.item = createShapeNode();
    }

    for (const item of value) {
      visit(item, node.item);
    }
  }
}

function getKind(value) {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  return typeof value;
}

function addExample(node, value) {
  if (node.examples.length >= 3) {
    return;
  }

  if (value === null || typeof value !== "object") {
    node.examples.push(value);
    return;
  }

  if (Array.isArray(value) && value.length <= 3) {
    node.examples.push(value);
  }
}
