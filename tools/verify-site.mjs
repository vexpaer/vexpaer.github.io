import { access, readFile, readdir, stat } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'public');
const warningBytes = 1_000_000_000;
const maxBytes = 1_073_741_824;
const required = [
  'index.html',
  '2021/05/22/初中の英语笔记/index.html',
  '2026/01/18/组织工程_7.Artificial organ/index.html',
  '2026/01/18/组织工程_7.Artificial organ/mindmap/index.html',
  'css/vexpaer-home.css',
  'css/mindmap.css',
  'js/vexpaer-home.js',
  'vendor/mindmap/katex.min.css',
  'vendor/mindmap/mindmap.min.js',
  'files/background/bg15.jpg'
];

for (const path of required) {
  await access(resolve(root, ...path.split('/')));
}

const exampleDirectory = resolve(root, '2026/01/18/组织工程_7.Artificial organ');
const outlineHtml = await readFile(resolve(exampleDirectory, 'index.html'), 'utf8');
const mindmapHtml = await readFile(resolve(exampleDirectory, 'mindmap/index.html'), 'utf8');

function assertIncludes(content, expected, label) {
  if (!content.includes(expected)) throw new Error(`${label} is missing ${expected}.`);
}

assertIncludes(outlineHtml, 'mindmap-mode-switch', 'Mindmap-enabled outline page');
assertIncludes(outlineHtml, '/css/mindmap.css', 'Mindmap-enabled outline page');
assertIncludes(outlineHtml, '/mindmap/', 'Mindmap-enabled outline page');
if (outlineHtml.includes('/vendor/mindmap/mindmap.min.js')) {
  throw new Error('The interactive Markmap bundle must not load in outline mode.');
}

assertIncludes(mindmapHtml, 'mindmap-mode-switch', 'Mindmap page');
assertIncludes(mindmapHtml, 'data-mindmap-reader', 'Mindmap page');
assertIncludes(mindmapHtml, 'data-mindmap-depth', 'Mindmap page');
assertIncludes(mindmapHtml, 'data-mindmap-action="set-depth"', 'Mindmap page');
assertIncludes(mindmapHtml, '/vendor/mindmap/mindmap.min.js', 'Mindmap page');
assertIncludes(mindmapHtml, '/vendor/mindmap/katex.min.css', 'Mindmap page');
if (mindmapHtml.includes('id="readmode"')) {
  throw new Error('The theme read-mode control must not hide the interactive mindmap reader.');
}
if (/https?:\/\/[^"']*(?:markmap|katex)/i.test(mindmapHtml)) {
  throw new Error('Mindmap page references a third-party Markmap or KaTeX CDN.');
}

const dataMatch = mindmapHtml.match(/<script[^>]*data-mindmap-data[^>]*>([\s\S]*?)<\/script>/i);
if (!dataMatch) throw new Error('Mindmap page does not contain embedded build-time data.');
const mindmap = JSON.parse(dataMatch[1]);
let mindmapNodes = 0;
let mindmapDepth = 0;
let mindmapImages = 0;

function inspectMindmap(node, depth = 1) {
  mindmapNodes++;
  mindmapDepth = Math.max(mindmapDepth, depth);
  if (/<img\b/i.test(node.content || '')) mindmapImages++;
  for (const child of node.children || []) inspectMindmap(child, depth + 1);
}

inspectMindmap(mindmap);
if (mindmap.content !== '组织工程_7.Artificial organ' || mindmapNodes < 50 || mindmapDepth < 5 || mindmapImages < 5) {
  throw new Error(`Unexpected mindmap tree: ${mindmapNodes} nodes, depth ${mindmapDepth}, ${mindmapImages} images.`);
}
if (/<script\b|\son[a-z]+\s*=|javascript:/i.test(JSON.stringify(mindmap))) {
  throw new Error('Unsafe executable HTML or URL found in mindmap data.');
}

let files = 0;
let bytes = 0;
let html = 0;
let mindmapOutlines = 0;
let mindmapReaders = 0;
let ordinaryPosts = 0;
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
        const content = await readFile(path, 'utf8');
        const route = relative(root, path).replace(/\\/g, '/');
        const isArticle = /<article\b[^>]*\bid=["']article-container["']/i.test(content);
        const hasSwitch = content.includes('mindmap-mode-switch');
        const hasReader = content.includes('data-mindmap-reader');
        const hasMindmapCss = /href=["'][^"']*\/css\/mindmap\.css(?:[?"'])/i.test(content);
        const hasMindmapVendor = /(?:href|src)=["'][^"']*\/vendor\/mindmap\//i.test(content);
        const isMindmapRoute = route.endsWith('/mindmap/index.html');

        if (content.includes('/.io//')) brokenAssetPaths.push(path);

        if (isArticle && hasSwitch) {
          mindmapOutlines++;
          if (!hasMindmapCss || hasMindmapVendor || hasReader) {
            throw new Error(`Mindmap-enabled outline has incorrect resources: ${route}`);
          }
        } else if (isArticle) {
          ordinaryPosts++;
          if (hasMindmapCss || hasMindmapVendor || hasReader) {
            throw new Error(`A regular post received mindmap UI or resources: ${route}`);
          }
        }

        if (hasReader) {
          mindmapReaders++;
          if (!isMindmapRoute || !hasSwitch || !hasMindmapCss || !hasMindmapVendor) {
            throw new Error(`Mindmap reader has an invalid route or resource set: ${route}`);
          }
        } else if (isMindmapRoute) {
          throw new Error(`Mindmap route is missing its reader: ${route}`);
        }
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

if (!mindmapOutlines || mindmapOutlines !== mindmapReaders) {
  throw new Error(`Mindmap page mismatch: ${mindmapOutlines} outlines and ${mindmapReaders} readers.`);
}

if (brokenAssetPaths.length) {
  throw new Error(`Broken /.io// asset paths found in ${brokenAssetPaths.length} HTML files.`);
}

console.log(
  `Verified ${files} files (${html} HTML), ${mindmapReaders} mindmaps and ${ordinaryPosts} regular posts, `
  + `${(bytes / 1_000_000_000).toFixed(3)} GB; photos are unchanged.`
);
