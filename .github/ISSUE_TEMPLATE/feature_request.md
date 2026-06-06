---
name: Feature request
about: Suggest an idea for JSON Shape Explorer
title: "Add TypeScript output renderer"
labels: enhancement
assignees: ""
---

## Goal

Add a renderer that can turn an analyzed JSON shape into a TypeScript interface.

## Example

Input shape from JSON samples like:

```json
{
  "id": 1,
  "name": "Ada Lovelace",
  "email": null,
  "roles": ["admin"]
}
```

Expected output could look like:

```ts
export interface Root {
  id: number;
  name: string;
  email?: string | null;
  roles: string[];
}
```

## Notes

- Start with object roots.
- Mark fields optional when presence is less than the parent sample count.
- Keep nested objects readable with generated interface names.
- Add fixture-based tests for required, optional, nullable, array, and nested object fields.
