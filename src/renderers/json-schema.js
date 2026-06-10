import { sortedFields } from "../shape-utils.js";

export function renderJsonSchema(report) {
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "Root",
    ...toSchema(report.root, report.sampleCount)
  };

  return `${JSON.stringify(schema, null, 2)}\n`;
}

function toSchema(node, parentCount) {
  const schemas = [...node.kinds].sort().map((kind) => schemaForKind(kind, node, parentCount));

  if (schemas.length === 0) {
    return {};
  }

  if (schemas.length === 1) {
    return schemas[0];
  }

  return {
    anyOf: schemas
  };
}

function schemaForKind(kind, node, parentCount) {
  if (kind === "null") {
    return { type: "null" };
  }

  if (kind === "string") {
    return { type: "string" };
  }

  if (kind === "number") {
    return { type: "number" };
  }

  if (kind === "boolean") {
    return { type: "boolean" };
  }

  if (kind === "array") {
    return {
      type: "array",
      items: node.item ? toSchema(node.item, Math.max(node.item.count, 1)) : {}
    };
  }

  if (kind === "object") {
    const properties = {};
    const required = [];

    for (const [fieldName, fieldNode] of sortedFields(node)) {
      properties[fieldName] = toSchema(fieldNode, Math.max(fieldNode.count, 1));

      if (fieldNode.count === parentCount) {
        required.push(fieldName);
      }
    }

    const schema = {
      type: "object",
      properties
    };

    if (required.length > 0) {
      schema.required = required;
    }

    return schema;
  }

  return {};
}
