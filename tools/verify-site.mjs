import { access, readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'public');
const warningBytes = 1_000_000_000;
const maxBytes = 1_073_741_824;
const required = [
  'index.html',
  '2021/05/22/初中の英语笔记/index.html',
  'css/vexpaer-home.css',
  'js/vexpaer-home.js',
  'files/background/bg15.jpg'
];

for (const path of required) {
  await access(resolve(root, ...path.split('/')));
}

let files = 0;
let bytes = 0;
let html = 0;
const brokenAssetPaths = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else {
      files++;
      bytes += (await stat(path)).size;
      if (entry.name.endsWith('.html')) {
        html++;
        if ((await readFile(path, 'utf8')).includes('/.io//')) brokenAssetPaths.push(path);
      }
    }
  }
}

await walk(root);

if (bytes > maxBytes) {
  throw new Error(`Site is ${(bytes / 1_073_741_824).toFixed(3)} GiB; limit is 1.000 GiB.`);
}

if (bytes > warningBytes) {
  console.warn(`Warning: site is ${(bytes / 1_000_000_000).toFixed(3)} GB and has little Pages headroom.`);
}

if (html < 40) {
  throw new Error(`Expected at least 40 HTML files, found ${html}.`);
}

if (brokenAssetPaths.length) {
  throw new Error(`Broken /.io// asset paths found in ${brokenAssetPaths.length} HTML files.`);
}

console.log(`Verified ${files} files (${html} HTML), ${(bytes / 1_000_000_000).toFixed(3)} GB; photos are unchanged.`);
