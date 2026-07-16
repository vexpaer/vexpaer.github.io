'use strict';

const path = require('node:path');
const sanitizeHtml = require('sanitize-html');
const { Transformer } = require('markmap-lib');
const { escapeHTML, full_url_for } = require('hexo-util');

const MATHML_TAGS = [
  'math', 'semantics', 'annotation', 'mrow', 'mi', 'mn', 'mo', 'ms', 'mtext', 'mspace',
  'msup', 'msub', 'msubsup', 'mfrac', 'msqrt', 'mroot', 'mover', 'munder', 'munderover',
  'mtable', 'mtr', 'mtd', 'mstyle', 'mpadded', 'mphantom', 'menclose', 'mmultiscripts',
  'mprescripts', 'none', 'maction', 'merror', 'mglyph'
];

const ALLOWED_TAGS = [
  'a', 'blockquote', 'br', 'code', 'del', 'em', 'img', 'ins', 'mark', 'ol', 'p', 'pre',
  'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
  'svg', 'path', ...MATHML_TAGS
];

function articleDirectory(postPath) {
  const normalized = String(postPath || '').replace(/\\/g, '/');
  if (normalized.endsWith('/index.html')) return normalized.slice(0, -'index.html'.length);
  if (normalized.endsWith('/')) return normalized;
  if (normalized.endsWith('.html')) return `${normalized.slice(0, -'.html'.length)}/`;
  return `${normalized}/`;
}

function mindmapDirectory(postPath) {
  return `${articleDirectory(postPath)}mindmap/`;
}

function normalizeRoot(root) {
  const value = `/${String(root || '/').replace(/^\/+|\/+$/g, '')}/`;
  return value === '//' ? '/' : value;
}

function withSiteRoot(urlPath, root) {
  const absolute = `/${String(urlPath || '').replace(/^\/+/, '')}`;
  if (root === '/') return absolute;
  const rootWithoutTrailingSlash = root.slice(0, -1);
  if (absolute === rootWithoutTrailingSlash || absolute.startsWith(root)) return absolute;
  return `${rootWithoutTrailingSlash}${absolute}`;
}

function createUrlNormalizer(post, config) {
  const siteRoot = normalizeRoot(config.root);
  const outlinePath = withSiteRoot(articleDirectory(post.path), siteRoot);
  const baseUrl = new URL(outlinePath, 'https://mindmap.invalid');
  const sourcePath = String(post.source || '').replace(/\\/g, '/');
  const assetFolder = path.posix.basename(sourcePath).replace(/\.[^.]+$/, '');

  return (input, type) => {
    if (typeof input !== 'string') return undefined;
    let value = input.trim().replace(/\\/g, '/');
    if (!value || /[\u0000-\u001f\u007f]/.test(value)) return undefined;

    if (/^\/\//.test(value)) value = `https:${value}`;
    if (/^https?:/i.test(value)) return value;
    if (type === 'link' && /^(?:mailto|tel):/i.test(value)) return value;
    if (/^[a-z][a-z\d+.-]*:/i.test(value)) return undefined;

    if (type === 'image' && !value.startsWith('/')) {
      const parts = value.split('/').filter(part => part && part !== '.');
      const firstPart = parts[0];
      let decodedFirstPart = firstPart;
      try {
        decodedFirstPart = decodeURIComponent(firstPart);
      } catch {
        // Keep the original component when malformed escapes are present.
      }
      if (config.post_asset_folder && parts.length > 1 && decodedFirstPart === assetFolder) parts.shift();
      value = parts.join('/');
    }

    try {
      if (value.startsWith('/')) {
        const resolved = new URL(withSiteRoot(value, siteRoot), baseUrl);
        return `${resolved.pathname}${resolved.search}${resolved.hash}`;
      }
      const resolved = new URL(value, baseUrl);
      return `${resolved.pathname}${resolved.search}${resolved.hash}`;
    } catch {
      return undefined;
    }
  };
}

function sanitizeNodeContent(content, normalizeUrl) {
  return sanitizeHtml(String(content || ''), {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      '*': ['class', 'aria-hidden'],
      a: ['href', 'title', 'target', 'rel'],
      annotation: ['encoding'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      math: ['xmlns', 'display'],
      mo: ['fence', 'form', 'lspace', 'maxsize', 'minsize', 'rspace', 'separator', 'stretchy', 'symmetric'],
      path: ['d', 'fill', 'fill-rule', 'clip-rule'],
      span: ['class', 'style', 'aria-hidden'],
      svg: ['width', 'height', 'viewBox', 'preserveAspectRatio', 'focusable', 'aria-hidden']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    enforceHtmlBoundary: true,
    parser: {
      lowerCaseAttributeNames: false
    },
    transformTags: {
      a: (tagName, attributes) => {
        const href = normalizeUrl(attributes.href, 'link');
        if (!href) return { tagName: 'span', attribs: {} };
        const external = /^https?:/i.test(href);
        return {
          tagName,
          attribs: {
            href,
            ...(attributes.title ? { title: attributes.title } : {}),
            ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})
          }
        };
      },
      img: (tagName, attributes) => {
        const src = normalizeUrl(attributes.src, 'image');
        if (!src) return { tagName: 'span', attribs: { class: 'mindmap-image-removed' } };
        return {
          tagName,
          attribs: {
            src,
            alt: attributes.alt || '',
            ...(attributes.title ? { title: attributes.title } : {})
          }
        };
      }
    }
  });
}

function sanitizeTree(node, normalizeUrl) {
  return {
    content: sanitizeNodeContent(node.content, normalizeUrl),
    children: Array.isArray(node.children) ? node.children.map(child => sanitizeTree(child, normalizeUrl)) : [],
    ...(node.payload ? { payload: node.payload } : {})
  };
}

function normalizeMathDelimiters(markdown) {
  const codePattern = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g;
  return String(markdown || '')
    .split(codePattern)
    .map((part, index) => {
      if (index % 2) return part;
      return part
        .replace(/\\\[([\s\S]*?)\\\]/g, (_, expression) => `$$${expression}$$`)
        .replace(/\\\(([\s\S]*?)\\\)/g, (_, expression) => `$${expression}$`);
    })
    .join('');
}

function safeJson(data) {
  return JSON.stringify(data)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function plainTaxonomy(query) {
  const data = query.toArray().map(item => ({
    name: item.name,
    path: item.path
  }));
  const collection = [...data];
  collection.data = data;
  return collection;
}

function isMindmapEnabled(post) {
  return post.mindmap === true;
}

function registerMindmap(hexoInstance) {
  const transformer = new Transformer();
  transformer.md.set({ html: false });

  hexoInstance.extend.helper.register('mindmap_outline_url', function (page) {
    return this.url_for(page.mindmap_source_path || page.path);
  });

  hexoInstance.extend.helper.register('mindmap_page_url', function (page) {
    return this.url_for(mindmapDirectory(page.mindmap_source_path || page.path));
  });

  hexoInstance.extend.generator.register('mindmap', locals => {
    return locals.posts.toArray().filter(isMindmapEnabled).map(post => {
      if (post.encrypt === true) {
        throw new Error(`[mindmap] Encrypted post "${post.title}" cannot expose a plaintext mindmap.`);
      }

      const transformed = transformer.transform(normalizeMathDelimiters(post._content));
      const normalizeUrl = createUrlNormalizer(post, hexoInstance.config);
      const bodyRoot = sanitizeTree(transformed.root, normalizeUrl);
      const root = {
        content: escapeHTML(String(post.title || '思维导图')),
        children: bodyRoot.content ? [bodyRoot] : bodyRoot.children,
        payload: { tag: 'h1' }
      };
      const outputDirectory = mindmapDirectory(post.path);
      const categories = plainTaxonomy(post.categories);
      const tags = plainTaxonomy(post.tags);
      const page = {
        __post: true,
        aside: false,
        categories,
        comments: false,
        content: '',
        cover: post.cover,
        date: new Date(post.date.valueOf()),
        description: `${post.title}的思维导图阅读模式`,
        encrypt: false,
        excerpt: '',
        katex: false,
        keywords: post.keywords,
        lang: post.lang,
        mathjax: false,
        mindmap: true,
        mindmap_data: safeJson(root),
        mindmap_page: true,
        mindmap_source_path: post.path,
        more: '',
        path: outputDirectory,
        permalink: full_url_for.call(hexoInstance, outputDirectory),
        photos: Array.from(post.photos || []),
        source: post.source,
        tags,
        title: post.title,
        toc: false,
        updated: new Date(post.updated.valueOf())
      };

      return {
        path: path.posix.join(outputDirectory, 'index.html'),
        layout: ['mindmap', 'post', 'page', 'index'],
        data: page
      };
    });
  });
}

if (typeof hexo !== 'undefined') registerMindmap(hexo);

module.exports = {
  articleDirectory,
  createUrlNormalizer,
  isMindmapEnabled,
  mindmapDirectory,
  normalizeMathDelimiters,
  safeJson,
  sanitizeNodeContent
};
