#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function main() {
  const sourceDir = path.join(rootDir, 'assets/legacy/js');
  const targetDir = path.join(rootDir, 'recovered/pretty');
  await mkdir(targetDir, { recursive: true });
  const files = (await readdir(sourceDir)).filter((entry) => entry.endsWith('.js'));

  for (const file of files) {
    const input = await readFile(path.join(sourceDir, file), 'utf8');
    const output = input
      .replace(/;/g, ';\n')
      .replace(/\{/g, '{\n')
      .replace(/\}/g, '}\n')
      .replace(/\n{3,}/g, '\n\n');
    await writeFile(path.join(targetDir, file), output, 'utf8');
  }
}

await main();
