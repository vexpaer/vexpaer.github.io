// Rasterizes live page content into a canvas the glass renderer can sample.
//
// The native build reads the desktop below the lens with GDI BitBlt.  A web
// page cannot read its own compositor output, so the region underneath the
// glass is serialized into an SVG <foreignObject> and drawn through an Image
// instead.  SVG-as-image is a sandboxed document: it can reach no network, so
// fonts, images, canvases and CSS background images are inlined as data URLs
// before serialization.  Everything the glass refracts has to exist as pixels
// in that texture.

const RESOURCE_CACHE = new Map();
const DEFAULT_STYLE_CACHE = new Map();
const EXCLUDE_ATTRIBUTE = 'data-liquid-glass-exclude';

const SKIPPED_TAGS = new Set([
  'SCRIPT', 'NOSCRIPT', 'TEMPLATE', 'LINK', 'META', 'TITLE', 'BASE', 'HEAD',
]);

// Properties that visibly affect rasterization.  Copying every computed
// property would inflate the serialized markup by megabytes; this curated set
// keeps the snapshot small enough to encode once per capture.
const COPIED_PROPERTIES = [
  'position', 'top', 'right', 'bottom', 'left', 'z-index', 'display', 'float',
  'clear', 'width', 'height', 'min-width', 'min-height', 'max-width',
  'max-height', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'overflow-x', 'overflow-y', 'vertical-align', 'aspect-ratio',
  'flex-direction', 'flex-wrap', 'justify-content', 'align-items',
  'align-content', 'align-self', 'flex-grow', 'flex-shrink', 'flex-basis',
  'order', 'row-gap', 'column-gap', 'grid-template-columns',
  'grid-template-rows', 'grid-template-areas', 'grid-area', 'grid-auto-flow',
  'grid-auto-rows', 'grid-auto-columns', 'place-items', 'place-content',
  'background-color', 'background-image', 'background-size',
  'background-position', 'background-repeat', 'background-clip',
  'background-origin', 'border-top-width', 'border-right-width',
  'border-bottom-width', 'border-left-width', 'border-top-style',
  'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color',
  'border-left-color', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-right-radius', 'border-bottom-left-radius', 'box-shadow',
  'outline-width', 'outline-style', 'outline-color', 'outline-offset',
  'opacity', 'filter', 'mix-blend-mode', 'transform', 'transform-origin',
  'clip-path', 'mask-image', 'mask-size', 'mask-position',
  'color', 'font-family', 'font-size', 'font-weight', 'font-style',
  'font-variant', 'font-stretch', 'line-height', 'letter-spacing',
  'word-spacing', 'text-align', 'text-decoration-line',
  'text-decoration-color', 'text-decoration-style', 'text-transform',
  'text-shadow', 'text-indent', 'text-overflow', 'white-space', 'word-break',
  'overflow-wrap', 'direction', 'writing-mode', 'visibility',
  '-webkit-text-fill-color', '-webkit-text-stroke-color',
  '-webkit-text-stroke-width', '-webkit-background-clip',
  'list-style-type', 'list-style-position', 'border-collapse',
  'border-spacing', 'table-layout', 'object-fit', 'object-position',
];

// Inherited properties are skipped when they match the parent, which removes
// the bulk of repeated font and colour declarations in text-heavy pages.
const INHERITED_PROPERTIES = new Set([
  'color', 'font-family', 'font-size', 'font-weight', 'font-style',
  'font-variant', 'font-stretch', 'line-height', 'letter-spacing',
  'word-spacing', 'text-align', 'text-transform', 'text-indent',
  'text-shadow', 'white-space', 'word-break', 'overflow-wrap', 'direction',
  'visibility', 'list-style-type', 'list-style-position', 'border-collapse',
  'border-spacing', '-webkit-text-fill-color', '-webkit-text-stroke-color',
  '-webkit-text-stroke-width',
]);

const PSEUDO_PROPERTIES = COPIED_PROPERTIES.concat(['content']);

function isExcluded(element, excluded) {
  if (element.hasAttribute && element.hasAttribute(EXCLUDE_ATTRIBUTE)) {
    return true;
  }
  for (const node of excluded) {
    if (node === element || (node.contains && node.contains(element))) {
      return true;
    }
  }
  return false;
}

let probeHost = null;

// The probe container stays in the document for the lifetime of the page.
// Adding and removing it per lookup would fire the renderer's own mutation
// observer and schedule an endless chain of re-captures.
function ensureProbeHost() {
  if (probeHost && probeHost.isConnected) return probeHost;
  probeHost = document.createElement('div');
  probeHost.setAttribute(EXCLUDE_ATTRIBUTE, '');
  probeHost.style.cssText =
      'position:absolute;left:-99999px;top:0;width:0;height:0;' +
      'overflow:hidden;contain:strict';
  document.body.appendChild(probeHost);
  return probeHost;
}

function defaultStyleFor(tagName) {
  const cached = DEFAULT_STYLE_CACHE.get(tagName);
  if (cached) return cached;
  const host = ensureProbeHost();
  let probe;
  try {
    probe = document.createElement(tagName);
  } catch (error) {
    probe = document.createElement('div');
  }
  host.appendChild(probe);
  const computed = window.getComputedStyle(probe);
  const values = new Map();
  for (const property of PSEUDO_PROPERTIES) {
    values.set(property, computed.getPropertyValue(property));
  }
  host.removeChild(probe);
  DEFAULT_STYLE_CACHE.set(tagName, values);
  return values;
}

function declarationsFor(computed, tagName, parentComputed, properties,
                        skipDefaults = true) {
  // Pseudo-elements are compared against nothing: their UA defaults differ
  // from the originating element's, so dropping a "matching" value there would
  // silently change how the pseudo lays out.
  const defaults = skipDefaults ? defaultStyleFor(tagName) : null;
  const parts = [];
  for (const property of properties) {
    const value = computed.getPropertyValue(property);
    if (!value) continue;
    if (INHERITED_PROPERTIES.has(property)) {
      // An inherited value may only be dropped when the cloned parent already
      // carries it; the probe element's own inheritance says nothing useful.
      if (parentComputed &&
          parentComputed.getPropertyValue(property) === value) {
        continue;
      }
      parts.push(`${property}:${value}`);
      continue;
    }
    if (defaults && defaults.get(property) === value) continue;
    parts.push(`${property}:${value}`);
  }
  return parts;
}

async function fetchAsDataUrl(url) {
  if (!url || url.startsWith('data:')) return url || null;
  if (RESOURCE_CACHE.has(url)) return RESOURCE_CACHE.get(url);
  const pending = (async () => {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'force-cache',
      });
      if (!response.ok) return null;
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return null;
    }
  })();
  RESOURCE_CACHE.set(url, pending);
  return pending;
}

async function inlineCssUrls(value) {
  if (!value || value === 'none' || !value.includes('url(')) return value;
  const matches = Array.from(value.matchAll(/url\((['"]?)([^)'"]+)\1\)/g));
  let result = value;
  for (const match of matches) {
    const raw = match[2].trim();
    if (raw.startsWith('data:') || raw.startsWith('#')) continue;
    let absolute;
    try {
      absolute = new URL(raw, document.baseURI).href;
    } catch (error) {
      continue;
    }
    const data = await fetchAsDataUrl(absolute);
    if (data) result = result.split(match[0]).join(`url("${data}")`);
  }
  return result;
}

let fontFaceCssPromise = null;

// Web fonts referenced by URL never load inside SVG-as-image.  Re-emitting the
// @font-face rules with embedded payloads keeps text under the lens rendered
// in the same typeface as the live page.
function collectFontFaceCss() {
  if (fontFaceCssPromise) return fontFaceCssPromise;
  fontFaceCssPromise = (async () => {
    const sources = [];
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (error) {
        continue;
      }
      if (!rules) continue;
      for (const rule of Array.from(rules)) {
        if (rule.type === CSSRule.FONT_FACE_RULE) sources.push(rule.cssText);
      }
    }
    const inlined = [];
    for (const text of sources) {
      inlined.push(await inlineCssUrls(text));
    }
    return inlined.join('\n');
  })();
  return fontFaceCssPromise;
}

function canvasToImage(source) {
  const image = document.createElement('img');
  try {
    image.setAttribute('src', source.toDataURL('image/png'));
  } catch (error) {
    return null;
  }
  return image;
}

function videoFrameToImage(video) {
  if (!video.videoWidth || !video.videoHeight) return null;
  const frame = document.createElement('canvas');
  frame.width = video.videoWidth;
  frame.height = video.videoHeight;
  const context = frame.getContext('2d');
  try {
    context.drawImage(video, 0, 0);
    return canvasToImage(frame);
  } catch (error) {
    return null;
  }
}

let pseudoCounter = 0;

function cloneElement(source, excluded, parentComputed, tasks, pseudoRules) {
  if (source.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(source.nodeValue);
  }
  if (source.nodeType !== Node.ELEMENT_NODE) return null;
  if (SKIPPED_TAGS.has(source.tagName)) return null;
  if (isExcluded(source, excluded)) return null;

  const computed = window.getComputedStyle(source);
  if (computed.display === 'none') return null;

  const tagName = source.tagName;
  let clone;
  let recurse = true;

  if (tagName === 'CANVAS') {
    clone = canvasToImage(source);
    recurse = false;
  } else if (tagName === 'VIDEO') {
    clone = videoFrameToImage(source);
    recurse = false;
  } else if (source instanceof SVGElement) {
    clone = source.cloneNode(true);
    recurse = false;
  } else if (tagName === 'BODY' || tagName === 'HTML') {
    // A nested <body> inside the foreignObject wrapper is not valid content;
    // the document root is rasterized as a plain block instead.
    clone = document.createElement('div');
  } else {
    clone = source.cloneNode(false);
  }
  if (!clone) return null;
  const styleTag = clone.tagName;

  if (tagName === 'IMG') {
    const currentSource = source.currentSrc || source.src;
    clone.removeAttribute('srcset');
    clone.removeAttribute('loading');
    tasks.push(async () => {
      const data = await fetchAsDataUrl(currentSource);
      if (data) {
        clone.setAttribute('src', data);
      } else {
        clone.removeAttribute('src');
        clone.style.setProperty('visibility', 'hidden');
      }
    });
  }
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    clone.setAttribute('value', source.value || '');
    if (tagName === 'TEXTAREA') clone.textContent = source.value || '';
    recurse = tagName !== 'TEXTAREA';
  }

  const declarations = declarationsFor(
      computed, styleTag, parentComputed, COPIED_PROPERTIES);
  // The used width/height reported by getComputedStyle is always the content
  // box, so the clone is pinned to the content-box model to reproduce it.
  declarations.push('box-sizing:content-box');
  const backgroundImage = computed.getPropertyValue('background-image');
  if (backgroundImage && backgroundImage !== 'none' &&
      backgroundImage.includes('url(')) {
    tasks.push(async () => {
      const inlined = await inlineCssUrls(backgroundImage);
      clone.style.setProperty('background-image', inlined);
    });
  }
  clone.setAttribute('style', declarations.join(';'));

  for (const pseudo of ['::before', '::after']) {
    const pseudoStyle = window.getComputedStyle(source, pseudo);
    const content = pseudoStyle.getPropertyValue('content');
    if (!content || content === 'none' || content === 'normal') continue;
    const marker = `lg-pseudo-${pseudoCounter++}`;
    clone.classList.add(marker);
    const parts = declarationsFor(
        pseudoStyle, styleTag, computed, PSEUDO_PROPERTIES, false);
    pseudoRules.push(`.${marker}${pseudo}{${parts.join(';')}}`);
  }

  if (recurse) {
    for (const child of Array.from(source.childNodes)) {
      const childClone =
          cloneElement(child, excluded, computed, tasks, pseudoRules);
      if (childClone) clone.appendChild(childClone);
    }
  }
  return clone;
}

function serializeSvg(clone, width, height, fontCss, pseudoRules) {
  const markup = new XMLSerializer().serializeToString(clone);
  const styles = [fontCss, pseudoRules.join('\n')].filter(Boolean).join('\n');
  const styleBlock =
      styles ? `<style><![CDATA[\n${styles}\n]]></style>` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" ` +
    `height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<foreignObject x="0" y="0" width="100%" height="100%">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;` +
    `width:${width}px;height:${height}px;overflow:hidden">` +
    styleBlock + markup +
    `</div></foreignObject></svg>`
  );
}

// The markup has to arrive as a data URL.  A blob: URL renders identically but
// taints the 2D canvas in Chromium, and a tainted canvas cannot be uploaded
// with texImage2D — the glass would sample nothing at all.
function loadSvgImage(markup) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      console.warn('液态玻璃：页面光栅化失败，背景纹理为空。');
      resolve(null);
    };
    image.src =
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  });
}

function resolvePageBackground() {
  const root = window.getComputedStyle(document.documentElement);
  const body = window.getComputedStyle(document.body);
  const rootColor = root.backgroundColor;
  if (rootColor && rootColor !== 'rgba(0, 0, 0, 0)' &&
      rootColor !== 'transparent') {
    return rootColor;
  }
  const bodyColor = body.backgroundColor;
  if (bodyColor && bodyColor !== 'rgba(0, 0, 0, 0)' &&
      bodyColor !== 'transparent') {
    return bodyColor;
  }
  return '#ffffff';
}

export class DomSnapshot {
  constructor(options = {}) {
    this.root = options.root || document.body;
    this.region = options.region || 'viewport';
    this.pixelRatio = options.pixelRatio || window.devicePixelRatio || 1;
    // Two canvases alternate: one holds the published frame the renderer
    // samples, the other receives the next rasterization.
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute(EXCLUDE_ATTRIBUTE, '');
    this.context = this.canvas.getContext('2d', {alpha: false});
    this.scratch = document.createElement('canvas');
    this.scratch.setAttribute(EXCLUDE_ATTRIBUTE, '');
    this.scratchContext = this.scratch.getContext('2d', {alpha: false});
    this.left = 0;
    this.top = 0;
    this.width = 1;
    this.height = 1;
    this.version = 0;
    this.capturing = false;
    this.dirty = true;
    this.excluded = new Set(options.exclude || []);
    this.canvas.width = 1;
    this.canvas.height = 1;
  }

  exclude(node) {
    this.excluded.add(node);
  }

  unexclude(node) {
    this.excluded.delete(node);
  }

  computeRegion() {
    if (this.region === 'root' && this.root !== document.body &&
        this.root !== document.documentElement) {
      const rect = this.root.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      };
    }
    return {
      left: 0,
      top: 0,
      width: Math.max(1, window.innerWidth),
      height: Math.max(1, window.innerHeight),
    };
  }

  // Serializing and rasterizing costs tens of milliseconds, so captures are
  // never issued per frame.  Callers mark the snapshot dirty; a single capture
  // runs at a time and re-runs once if the page changed while it was busy.
  async capture() {
    if (this.capturing) {
      this.dirty = true;
      return false;
    }
    this.capturing = true;
    this.dirty = false;
    try {
      await this.captureOnce();
    } finally {
      this.capturing = false;
    }
    if (this.dirty) return this.capture();
    return true;
  }

  // Rasterization is asynchronous, so it happens on a scratch canvas that is
  // published only once the image has actually been drawn.  Painting the
  // visible canvas up front would expose a blank frame to the renderer on
  // every re-capture, and the lens would spend most of its time refracting
  // the base fill colour instead of the page.
  async captureOnce() {
    const region = this.computeRegion();
    const width = Math.max(1, Math.round(region.width));
    const height = Math.max(1, Math.round(region.height));
    const ratio = this.pixelRatio;
    const excluded = Array.from(this.excluded);
    const tasks = [];
    const pseudoRules = [];
    // The clone's parent inside the SVG is a bare wrapper with UA-initial
    // inherited values, so the root emits every inherited property itself.
    const clone = cloneElement(this.root, excluded, null, tasks, pseudoRules);
    if (!clone) return;
    const background = resolvePageBackground();

    const rootRect = this.root.getBoundingClientRect();
    clone.style.setProperty('position', 'absolute');
    clone.style.setProperty('left', `${rootRect.left - region.left}px`);
    clone.style.setProperty('top', `${rootRect.top - region.top}px`);
    clone.style.setProperty('margin', '0');
    if (this.root === document.body) {
      clone.style.setProperty('width', `${rootRect.width}px`);
      clone.style.setProperty('height', `${rootRect.height}px`);
    }

    await Promise.all(tasks.map((task) => task()));
    const fontCss = await collectFontFaceCss();
    const markup = serializeSvg(clone, width, height, fontCss, pseudoRules);
    const image = await loadSvgImage(markup);
    if (!image) return;

    const scratch = this.scratch;
    const context = this.scratchContext;
    const targetWidth = Math.max(1, Math.round(width * ratio));
    const targetHeight = Math.max(1, Math.round(height * ratio));
    if (scratch.width !== targetWidth || scratch.height !== targetHeight) {
      scratch.width = targetWidth;
      scratch.height = targetHeight;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    // Publish pixels and the rectangle they cover in one step, so the shader
    // can never pair a new position with an older frame.
    this.scratch = this.canvas;
    this.scratchContext = this.context;
    this.canvas = scratch;
    this.context = context;
    this.left = region.left;
    this.top = region.top;
    this.width = width;
    this.height = height;
    this.version++;
  }
}

const SHARED_SNAPSHOTS = new Map();

// Several glass instances over the same page share one rasterization: the
// texture is identical and captures are the expensive part.
export function acquireSharedSnapshot(root, pixelRatio) {
  const key = root || document.body;
  let entry = SHARED_SNAPSHOTS.get(key);
  if (!entry) {
    entry = {snapshot: new DomSnapshot({root: key, pixelRatio}), users: 0};
    SHARED_SNAPSHOTS.set(key, entry);
  }
  entry.users++;
  return entry.snapshot;
}

export function releaseSharedSnapshot(root) {
  const key = root || document.body;
  const entry = SHARED_SNAPSHOTS.get(key);
  if (!entry) return;
  entry.users--;
  if (entry.users <= 0) SHARED_SNAPSHOTS.delete(key);
}

export {EXCLUDE_ATTRIBUTE};
