import { readFile } from "node:fs/promises";

export async function readJsonFiles(paths) {
  const samples = [];

  for (const path of paths) {
    const content = await readFile(path, "utf8");
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
      samples.push(...parsed);
    } else {
      samples.push(parsed);
    }
  }

  return samples;
}
