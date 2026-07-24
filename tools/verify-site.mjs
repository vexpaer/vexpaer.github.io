import { access, readFile, readdir, stat } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'public');
const warningBytes = 1_000_000_000;
const maxBytes = 1_073_741_824;
const required = [
  'index.html',
  'blog/index.html',
  'blog/page/2/index.html',
  '2021/05/22/初中の英语笔记/index.html',
  '2026/01/18/组织工程_7.Artificial organ/index.html',
  '2026/01/18/组织工程_7.Artificial organ/mindmap/index.html',
  'css/vexpaer-home.css',
  'css/vexpaer-explore.css',
  'css/mindmap.css',
  'js/vexpaer-home.js',
  'js/vendor/three.module.min.js',
  'js/vendor/three.core.min.js',
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
const homeScript = await readFile(resolve(root, 'js/vexpaer-home.js'), 'utf8');
const landingHtml = await readFile(resolve(root, 'index.html'), 'utf8');
const blogHtml = await readFile(resolve(root, 'blog/index.html'), 'utf8');

function assertIncludes(content, expected, label) {
  if (!content.includes(expected)) throw new Error(`${label} is missing ${expected}.`);
}

assertIncludes(homeScript, "import('./vendor/three.module.min.js')", 'Homepage script');
assertIncludes(homeScript, 'gsap.registerPlugin(ScrollTrigger)', 'Homepage script');
assertIncludes(homeScript, 'gsap.matchMedia()', 'Homepage script');
assertIncludes(homeScript, "document.querySelectorAll('[data-explore-root]')", 'Homepage script');
assertIncludes(landingHtml, 'id="vexpaer-home"', 'Landing page');
assertIncludes(landingHtml, 'id="vexpaer-blog-gateway"', 'Landing page');
assertIncludes(landingHtml, 'id="vexpaer-quick-access"', 'Landing page');
assertIncludes(landingHtml, 'id="vexpaer-explore-media"', 'Landing page');
assertIncludes(landingHtml, 'id="vexpaer-explore-start"', 'Landing page');
assertIncludes(landingHtml, 'id="vexpaer-explore-incremental"', 'Landing page');
assertIncludes(landingHtml, '/gsap@3.13.0/dist/gsap.min.js', 'Landing page');
assertIncludes(landingHtml, '/gsap@3.13.0/dist/ScrollTrigger.min.js', 'Landing page');
assertIncludes(landingHtml, '/css/vexpaer-explore.css', 'Landing page');
assertIncludes(blogHtml, 'id="recent-posts"', 'Blog index');

const exploreRootCount = (landingHtml.match(/\bdata-explore-root(?:[=\s>])/g) || []).length;
if (exploreRootCount !== 3) {
  throw new Error(`Landing page must contain exactly 3 exploration sections, found ${exploreRootCount}.`);
}

const sectionIndices = {
  media: landingHtml.indexOf('id="vexpaer-explore-media"'),
  start: landingHtml.indexOf('id="vexpaer-explore-start"'),
  incremental: landingHtml.indexOf('id="vexpaer-explore-incremental"')
};
const mediaSection = landingHtml.slice(sectionIndices.media, sectionIndices.start);
const startSection = landingHtml.slice(sectionIndices.start, sectionIndices.incremental);
const incrementalSection = landingHtml.slice(sectionIndices.incremental);

assertIncludes(mediaSection, 'https://vexpaer.github.io/film_wall/', 'Media exploration section');
assertIncludes(mediaSection, 'https://vexpaer.github.io/game_wall/', 'Media exploration section');
assertIncludes(startSection, 'https://vexpaer.github.io/vexpaer_go', 'Start exploration section');
assertIncludes(incrementalSection, 'https://vexpaer.github.io/ZhenHuanTree/', 'Incremental exploration section');
assertIncludes(incrementalSection, 'https://vexpaer.github.io/ZhenHuanCompany/', 'Incremental exploration section');

if (mediaSection.includes('ZhenHuanCompany') || startSection.includes('film_wall') || incrementalSection.includes('game_wall')) {
  throw new Error('Explore projects are rendered in the wrong homepage section.');
}
if (/href=["'][^"']*\/explore\/(?:media|start|incremental)\//.test(landingHtml)) {
  throw new Error('Landing page still links to obsolete standalone exploration routes.');
}
if (landingHtml.includes('/js/vexpaer-explore.js')) {
  throw new Error('Landing page must use the unified homepage motion script.');
}

const landingOrder = [
  landingHtml.indexOf('id="vexpaer-home"'),
  landingHtml.indexOf('id="vexpaer-blog-gateway"'),
  sectionIndices.media,
  sectionIndices.start,
  sectionIndices.incremental
];
if (landingOrder.some(index => index < 0) || !landingOrder.every((index, position) => position === 0 || landingOrder[position - 1] < index)) {
  throw new Error('Landing page sections are not ordered as hero, blog, media, start and incremental.');
}
if (landingHtml.includes('id="recent-posts"')) {
  throw new Error('Landing page must not contain the article index.');
}
if (blogHtml.includes('id="vexpaer-home"') || blogHtml.includes('id="vexpaer-blog-gateway"') || blogHtml.includes('data-explore-root')) {
  throw new Error('Blog index incorrectly received landing-page sections.');
}
if (blogHtml.includes('/css/vexpaer-explore.css')) {
  throw new Error('Blog index incorrectly received homepage exploration styles.');
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
