'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { Transformer } = require('markmap-lib');
const {
  articleDirectory,
  createUrlNormalizer,
  isMindmapEnabled,
  mindmapDirectory,
  normalizeMathDelimiters,
  safeJson,
  sanitizeNodeContent
} = require('../scripts/mindmap-generator');

test('mindmap is enabled only by the boolean true value', () => {
  assert.equal(isMindmapEnabled({ mindmap: true }), true);
  assert.equal(isMindmapEnabled({ mindmap: 'true' }), false);
  assert.equal(isMindmapEnabled({ mindmap: 1 }), false);
  assert.equal(isMindmapEnabled({}), false);
});

test('mindmap routes are derived from the existing post path', () => {
  const postPath = '2026/01/18/组织工程_7.Artificial organ/index.html';
  assert.equal(articleDirectory(postPath), '2026/01/18/组织工程_7.Artificial organ/');
  assert.equal(mindmapDirectory(postPath), '2026/01/18/组织工程_7.Artificial organ/mindmap/');
});

test('local URLs honor a GitHub Pages subpath and unsafe schemes are rejected', () => {
  const normalizeUrl = createUrlNormalizer(
    { path: '2026/01/18/中文 article/index.html', source: '_posts/post-folder.md' },
    { root: '/Blog/', post_asset_folder: true }
  );

  assert.equal(normalizeUrl('javascript:alert(1)', 'link'), undefined);
  assert.equal(normalizeUrl('data:text/html,boom', 'image'), undefined);
  assert.equal(normalizeUrl('https://example.com/a.png', 'image'), 'https://example.com/a.png');
  assert.match(normalizeUrl('/img/中文 图.png', 'image'), /^\/Blog\/img\//);
  assert.match(normalizeUrl('post-folder/photo.png', 'image'), /^\/Blog\/2026\/01\/18\/.*\/photo\.png$/);
  assert.match(decodeURIComponent(normalizeUrl('images/photo.png', 'image')), /\/中文 article\/images\/photo\.png$/);
  assert.match(normalizeUrl('../shared/photo.png', 'image'), /^\/Blog\/2026\/01\/18\/shared\/photo\.png$/);
  assert.match(normalizeUrl('../other/', 'link'), /^\/Blog\/2026\/01\/18\/other\/$/);
});

test('mindmap node HTML is sanitized and external links are isolated', () => {
  const normalizeUrl = createUrlNormalizer(
    { path: '2026/01/18/post/index.html' },
    { root: '/', post_asset_folder: true }
  );
  const unsafe = [
    '<script>alert(1)</script>',
    '<strong>safe</strong>',
    '<img src="/img/example.png" onerror="alert(1)">',
    '<a href="javascript:alert(1)">bad</a>',
    '<a href="https://example.com" onclick="alert(1)">good</a>'
  ].join('');
  const cleaned = sanitizeNodeContent(unsafe, normalizeUrl);

  assert.doesNotMatch(cleaned, /<script|onerror|onclick|javascript:/i);
  assert.match(cleaned, /<strong>safe<\/strong>/);
  assert.match(cleaned, /src="\/img\/example\.png"/);
  assert.match(cleaned, /target="_blank"/);
  assert.match(cleaned, /rel="noopener noreferrer"/);
});

test('embedded JSON and existing MathJax delimiters remain safe and usable', () => {
  const serialized = safeJson({ html: '</script><img src=x>&' });
  assert.doesNotMatch(serialized, /[<>&]/);
  assert.deepEqual(JSON.parse(serialized), { html: '</script><img src=x>&' });

  const markdown = '- \\(x^2\\)\n- `\\(literal\\)`\n```text\n\\[literal\\]\n```\n- \\[y^2\\]';
  const normalized = normalizeMathDelimiters(markdown);
  assert.match(normalized, /- \$x\^2\$/);
  assert.match(normalized, /`\\\(literal\\\)`/);
  assert.match(normalized, /```text\n\\\[literal\\\]\n```/);
  assert.match(normalized, /- \$\$y\^2\$\$/);
});

test('KaTeX markup survives the sanitizer without executable attributes', () => {
  const transformer = new Transformer();
  transformer.md.set({ html: false });
  const transformed = transformer.transform('- $x^2 + y^2$');
  const content = transformed.root.content || transformed.root.children[0].content;
  const cleaned = sanitizeNodeContent(content, value => value);

  assert.match(cleaned, /class="katex"/);
  assert.match(cleaned, /<math\b/);
  assert.doesNotMatch(cleaned, /<script|\son[a-z]+\s*=/i);
});

test('mindmap trees can be expanded or collapsed to a precise depth', async () => {
  const { getTreeDepth, withMaxVisibleDepth } = await import('../assets/mindmap/tree.mjs');
  const tree = {
    content: 'root',
    payload: { tag: 'h1' },
    children: [
      {
        content: 'level 2',
        children: [{
          content: 'level 3',
          children: [{ content: 'level 4', children: [] }]
        }]
      },
      { content: 'short branch', children: [] }
    ]
  };

  assert.equal(getTreeDepth(tree), 4);

  const rootOnly = withMaxVisibleDepth(tree, 1);
  assert.equal(rootOnly.payload.fold, 1);
  assert.equal(rootOnly.payload.tag, 'h1');

  const depthTwo = withMaxVisibleDepth(tree, 2);
  assert.equal(depthTwo.payload.fold, 0);
  assert.equal(depthTwo.children[0].payload.fold, 1);
  assert.equal(depthTwo.children[0].children[0].payload.fold, 1);

  const fullyExpanded = withMaxVisibleDepth(tree, getTreeDepth(tree));
  assert.equal(fullyExpanded.payload.fold, 0);
  assert.equal(fullyExpanded.children[0].payload.fold, 0);
  assert.equal(fullyExpanded.children[0].children[0].payload.fold, 0);
  assert.equal(withMaxVisibleDepth(tree, 0).payload.fold, 1, 'invalid low values clamp to level 1');
  assert.equal(tree.payload.fold, undefined, 'the embedded source tree must not be mutated');
});
