// /mindmap/ 汇总页：一棵“vexpaer → 学科 → 章节 → 笔记”的总树，左边是 Markmap 导图，
// 右边是一行一节点的大纲和只画点的连接图。页面里只有骨架，每章内容从该章已有的导图页读取。
import { Markmap } from 'markmap-view';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity, zoomTransform } from 'd3-zoom';

const DATA_PATTERN = /<script[^>]*data-mindmap-data[^>]*>([\s\S]*?)<\/script>/i;
const KIND_RADIUS = { root: 7, subject: 4.6, chapter: 2.8, note: 1.3 };
// 每个学科一种颜色，取自站点的暖色系。
const PALETTE = ['#b5652d', '#6f8a5b', '#4f7a96', '#9a5f86', '#b08b3c', '#5d7f7a', '#a4574f', '#7b6aa0'];
const LAYOUT_KEY = 'vexpaer-mindmap-layout';

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function withoutImages(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('img').forEach(img => img.remove());
  return template.innerHTML.trim() || '<span class="mh-muted">〔图片〕</span>';
}

function readLayout() {
  try {
    return localStorage.getItem(LAYOUT_KEY) === 'right' ? 'right' : 'both';
  } catch {
    return 'both';
  }
}

function init() {
  const hub = document.querySelector('[data-mindmap-hub]');
  const dataElement = hub?.querySelector('[data-mh-data]');
  if (!hub || !dataElement) return;

  const svg = hub.querySelector('[data-mh-svg]');
  const crumbs = hub.querySelector('[data-mh-crumbs]');
  const status = hub.querySelector('[data-mh-status]');
  const outline = hub.querySelector('[data-mh-outline]');
  const countLabel = hub.querySelector('[data-mh-count]');
  const graphBox = hub.querySelector('[data-mh-graph]');
  const canvas = hub.querySelector('[data-mh-canvas]');
  const tip = hub.querySelector('[data-mh-tip]');
  const menu = hub.querySelector('[data-mh-menu]');

  // ---- 总树 ----
  const nodes = [];
  const chapters = [];
  function addNode(content, kind, parent, extra) {
    const node = { id: nodes.length, content, kind, parent, depth: parent ? parent.depth + 1 : 0, children: [], ...extra };
    nodes.push(node);
    if (parent) parent.children.push(node);
    return node;
  }
  const skeleton = JSON.parse(dataElement.textContent);
  const root = addNode(escapeHTML(skeleton.name), 'root', null);
  for (const subject of skeleton.children) {
    const subjectNode = addNode(escapeHTML(subject.name), 'subject', root);
    for (const chapter of subject.children) {
      chapters.push(addNode(escapeHTML(chapter.name), 'chapter', subjectNode, {
        title: chapter.title, url: chapter.url, src: chapter.src, loaded: false
      }));
    }
  }
  function addNotes(source, parent) {
    for (const child of source.children || []) addNotes(child, addNode(child.content || '', 'note', parent));
  }
  function ancestors(node) {
    const chain = [];
    for (let n = node; n; n = n.parent) chain.unshift(n);
    return chain;
  }
  function subtree(node) {
    const list = [];
    (function walk(n) {
      list.push(n);
      n.children.forEach(walk);
    })(node);
    return list;
  }
  function plainText(node) {
    const template = document.createElement('template');
    template.innerHTML = withoutImages(node.content);
    template.content.querySelectorAll('.katex-mathml').forEach(el => el.remove());
    return template.content.textContent.trim();
  }

  // 当前根节点：导图、大纲、连接图都只显示它下面的部分。
  let currentRoot = root;
  function isInside(node, top = currentRoot) {
    for (let n = node; n; n = n.parent) if (n === top) return true;
    return false;
  }

  // ---- 按需读取每章导图页里的数据，最多 4 个并发；用户点到的章节插队 ----
  const queue = [...chapters];
  const waiting = new Map();
  let active = 0;
  let loadedCount = 0;
  function pump() {
    while (active < 4 && queue.length) {
      const chapter = queue.shift();
      active++;
      fetch(chapter.src)
        .then(response => {
          if (!response.ok) throw new Error(response.status + ' ' + chapter.src);
          return response.text();
        })
        .then(html => {
          const match = html.match(DATA_PATTERN);
          if (!match) throw new Error('No mindmap data in ' + chapter.src);
          addNotes(JSON.parse(match[1]), chapter);
        })
        .catch(error => {
          chapter.failed = true;
          console.error('Mindmap chapter failed:', error);
        })
        .finally(() => {
          chapter.loaded = true;
          loadedCount++;
          active--;
          onChapterLoaded(chapter);
          waiting.get(chapter)?.forEach(resolve => resolve());
          waiting.delete(chapter);
          pump();
        });
    }
  }
  function loadChapter(chapter) {
    if (!chapter || chapter.loaded) return Promise.resolve();
    const index = queue.indexOf(chapter);
    if (index > 0) queue.unshift(...queue.splice(index, 1));
    return new Promise(resolve => {
      if (!waiting.has(chapter)) waiting.set(chapter, []);
      waiting.get(chapter).push(resolve);
    });
  }
  // 节点所在的章节，或者节点下面所有的章节，全部载入后再继续。
  function loadAround(node) {
    const above = ancestors(node).find(n => n.kind === 'chapter');
    const below = above ? [above] : subtree(node).filter(n => n.kind === 'chapter');
    return Promise.all(below.map(loadChapter));
  }

  function renderCrumbs() {
    crumbs.replaceChildren();
    const title = document.createElement('span');
    title.className = 'mh-crumb-title';
    title.textContent = 'Mindmap';
    crumbs.append(title);
    for (const node of ancestors(currentRoot)) {
      const separator = document.createElement('span');
      separator.className = 'mh-crumb-sep';
      separator.textContent = '>';
      const item = document.createElement(node === currentRoot ? 'span' : 'button');
      item.className = 'mh-crumb' + (node === currentRoot ? ' is-current' : '');
      item.textContent = node === root ? 'vexpaer' : (node.kind === 'chapter' ? node.title.replace(/^.+?_/, '') : plainText(node));
      item.title = item.textContent;
      if (node !== currentRoot) {
        item.type = 'button';
        item.dataset.mhRoot = node.id;
      }
      crumbs.append(separator, item);
    }
  }
  function updateStatus() {
    status.hidden = loadedCount >= chapters.length;
    status.textContent = `Loading ${loadedCount}/${chapters.length}`;
    countLabel.textContent = subtree(currentRoot).length.toLocaleString('en') + ' nodes';
  }

  // ---- 导图：左右两个 Markmap 共用一张 SVG，缩放拖动只由右边那个管。
  // 左边那个按常规向右排，整组水平镜像到根节点左侧，文字再用 CSS 翻回来。 ----
  let layout = readLayout();
  const mapOptions = {
    autoFit: false,
    duration: 0,
    fitRatio: 0.92,
    initialExpandLevel: -1,
    maxInitialScale: 1.4,
    maxWidth: 300,
    pan: false,
    scrollForPan: false,
    spacingHorizontal: 70,
    spacingVertical: 6,
    color: colorOf
  };
  // 左边先建且不带缩放；之后不能再对它调用 setOptions，否则会把右边挂在 SVG 上的缩放卸掉。
  const leftMap = Markmap.create(svg, { ...mapOptions, zoom: false });
  const rightMap = Markmap.create(svg, { ...mapOptions, zoom: true });
  leftMap.g.classed('mh-left', true);
  // 左边那组放到最上层：右边根节点的下划线不再压住左侧根节点的圆点。
  svg.append(leftMap.g.node());
  function mirrorWidth() {
    return leftMap.state.data?.state?.rect?.width || 0;
  }
  function applyLeft(transform = zoomTransform(svg)) {
    leftMap.g.attr('transform', `${transform} translate(${mirrorWidth()},0) scale(-1,1)`);
  }
  rightMap.zoom.on('zoom.mirror', event => applyLeft(event.transform));
  function both() {
    return layout === 'both';
  }

  const mmIndex = new Map();
  let leftRootItem = null;
  let mapTouched = false;
  ['wheel', 'pointerdown'].forEach(type => svg.addEventListener(type, () => { mapTouched = true; }, { passive: true }));

  // 章节默认收起；章节展开后先只露出一层，再往下的节点折叠着。已有的折叠状态照旧保留。
  function defaultFold(node) {
    if (node === currentRoot) return 0;
    if (node.kind === 'chapter') return 1;
    return node.kind === 'note' && node.depth >= Math.max(4, currentRoot.depth + 2) ? 1 : 0;
  }
  function toMarkmap(node, folds, children = node.children) {
    const fold = folds.has(node.id) ? folds.get(node.id) : defaultFold(node);
    return {
      content: node.content,
      children: children.map(child => toMarkmap(child, folds)),
      payload: { hid: node.id, ...(fold ? { fold } : {}) }
    };
  }
  function colorOf(item) {
    const subject = ancestors(nodes[item.payload?.hid] || root)[1];
    return subject ? PALETTE[root.children.indexOf(subject) % PALETTE.length] : 'var(--mh-accent)';
  }
  // 双向时把根节点的子节点按顺序切成两半，右边先排，篇幅大致相当。
  function splitChildren(node) {
    const list = node.children;
    if (!both() || list.length < 2) return [list, []];
    const weight = n => (n.kind === 'chapter' ? 1 : Math.max(1, n.children.length));
    const total = list.reduce((sum, n) => sum + weight(n), 0);
    let sum = 0;
    let index = 0;
    while (index < list.length && sum + weight(list[index]) / 2 <= total / 2) sum += weight(list[index++]);
    index = Math.min(Math.max(index, 1), list.length - 1);
    return [list.slice(0, index), list.slice(index)];
  }
  function reindex() {
    mmIndex.clear();
    const walk = mm => function visit(item) {
      if (!mmIndex.has(item.payload.hid)) mmIndex.set(item.payload.hid, { item, mm });
      item.children?.forEach(visit);
    };
    if (rightMap.state.data) walk(rightMap)(rightMap.state.data);
    leftRootItem = both() ? leftMap.state.data : null;
    if (leftRootItem) leftRootItem.children?.forEach(walk(leftMap));
  }
  let mmTimer;
  function scheduleMarkmap() {
    window.clearTimeout(mmTimer);
    mmTimer = window.setTimeout(refreshMarkmap, 160);
  }
  // 每次都从总树重建导图数据；Markmap 初始化时会复制子节点，直接往旧对象上挂会丢。
  let mmRefresh = Promise.resolve();
  function refreshMarkmap({ resetFolds = false, fit = false } = {}) {
    mmRefresh = mmRefresh.then(async () => {
      const folds = new Map();
      if (!resetFolds) for (const [id, { item }] of mmIndex) folds.set(id, item.payload?.fold || 0);
      const leftFold = !resetFolds && leftRootItem?.payload?.fold ? 1 : 0;
      const [rightChildren, leftChildren] = splitChildren(currentRoot);
      const work = [rightMap.setData(toMarkmap(currentRoot, folds, rightChildren))];
      leftMap.g.style('display', both() && leftChildren.length ? null : 'none');
      if (both()) {
        const leftData = toMarkmap(currentRoot, folds, leftChildren);
        leftData.payload.fold = leftFold;
        work.push(leftMap.setData(leftData));
      }
      await Promise.all(work);
      reindex();
      applyLeft();
      if (fit || (!mapTouched && loadedCount === chapters.length)) await fitMap();
    });
    return mmRefresh;
  }
  function mapBounds() {
    const rect = { ...rightMap.state.rect };
    if (both() && leftMap.g.style('display') !== 'none' && leftMap.state.rect) {
      const w = mirrorWidth();
      const left = leftMap.state.rect;
      rect.x1 = Math.min(rect.x1, w - left.x2);
      rect.x2 = Math.max(rect.x2, w - left.x1);
      rect.y1 = Math.min(rect.y1, left.y1);
      rect.y2 = Math.max(rect.y2, left.y2);
    }
    return rect;
  }
  function zoomTo(transform) {
    return rightMap.transition(rightMap.svg).call(rightMap.zoom.transform, transform).end().catch(() => {});
  }
  // 顶栏在导图变窄时会换行，留给导图的高度按它的实际高度算。
  function barHeight() {
    return Math.max(40, (hub.querySelector('.mh-bar')?.offsetHeight || 56) - 8);
  }
  function fitMap() {
    const { width, height } = svg.getBoundingClientRect();
    if (!width || !height) return Promise.resolve();
    const BAR_HEIGHT = barHeight();
    const { x1, y1, x2, y2 } = mapBounds();
    const w = Math.max(1, x2 - x1);
    const h = Math.max(1, y2 - y1);
    const usable = height - BAR_HEIGHT;
    const k = Math.min(width / w * 0.92, usable / h * 0.92, 1.4);
    return zoomTo(zoomIdentity.translate((width - w * k) / 2 - x1 * k, BAR_HEIGHT + (usable - h * k) / 2 - y1 * k).scale(k));
  }
  // 按节点在画布上的真实位置（左半边要镜像）居中，字太小时放大到能读。
  function centerMap(entry) {
    const rect = entry.item.state.rect;
    const x = entry.mm === leftMap ? mirrorWidth() - rect.x - rect.width : rect.x;
    const { width, height } = svg.getBoundingClientRect();
    const BAR_HEIGHT = barHeight();
    const current = zoomTransform(svg).k;
    const k = current < 0.9 ? 1 : current;
    const cx = x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    return zoomTo(zoomIdentity.translate(width / 2 - cx * k, BAR_HEIGHT / 2 + height / 2 - cy * k).scale(k));
  }
  async function highlight(entry) {
    await Promise.all([
      rightMap.setHighlight(entry?.mm === rightMap ? entry.item : null),
      both() ? leftMap.setHighlight(entry?.mm === leftMap ? entry.item : null) : null
    ]);
  }
  async function revealInMap(node) {
    mapTouched = true;
    if (!isInside(node)) await setRoot(root, { quiet: true });
    await loadAround(node);
    updateStatus();
    window.clearTimeout(mmTimer);
    await refreshMarkmap();
    for (const step of ancestors(node).slice(0, -1)) {
      const entry = mmIndex.get(step.id);
      if (entry?.item.payload?.fold) entry.item.payload = { ...entry.item.payload, fold: 0 };
    }
    const target = mmIndex.get(node.id);
    if (!target) return;
    await highlight(target);
    await centerMap(target);
  }
  function renderMaps() {
    return Promise.all([rightMap.renderData(), both() ? leftMap.renderData() : null]).then(() => applyLeft());
  }
  // 全部展开 / 全部收缩：把这个节点和它下面所有节点的折叠状态一起改掉。
  async function foldAllInMap(node, fold) {
    window.clearTimeout(mmTimer);
    await refreshMarkmap();
    const tops = [mmIndex.get(node.id)?.item];
    if (node === currentRoot && leftRootItem) tops.push(leftRootItem);
    for (const top of tops.filter(Boolean)) {
      (function walk(item) {
        if (item.children?.length) item.payload = { ...item.payload, fold };
        item.children?.forEach(walk);
      })(top);
    }
    await renderMaps();
    const entry = mmIndex.get(node.id);
    if (node === currentRoot) await fitMap();
    else if (entry) await centerMap(entry);
  }

  // ---- 大纲：一行一个节点，不显示图片，按层级缩进；子节点展开时才生成 ----
  const open = new Set();
  const rows = new Map();
  let activeRow;
  function rowFor(node) {
    const row = document.createElement('div');
    row.className = 'mh-row mh-' + (node === currentRoot ? 'root' : node.kind);
    row.setAttribute('role', 'treeitem');
    row.style.setProperty('--d', node.depth - currentRoot.depth);
    row.dataset.id = node.id;
    const hasChildren = node.children.length > 0 || (node.kind === 'chapter' && !node.loaded);
    const caret = document.createElement('button');
    caret.type = 'button';
    caret.className = 'mh-caret';
    caret.dataset.mhToggle = '';
    caret.tabIndex = -1;
    if (!hasChildren) caret.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.className = 'mh-text';
    label.innerHTML = withoutImages(node.content);
    label.title = label.textContent.trim();
    const line = document.createElement('div');
    line.className = 'mh-line' + (hasChildren ? ' has-children' : '');
    line.append(caret, label);
    if (node.url) {
      const link = document.createElement('a');
      link.className = 'mh-open';
      link.href = node.url;
      link.title = '打开《' + node.title + '》';
      link.textContent = '↗';
      line.append(link);
    }
    row.append(line);
    if (hasChildren) row.setAttribute('aria-expanded', String(open.has(node.id)));
    rows.set(node.id, row);
    if (open.has(node.id)) row.append(childrenFor(node));
    return row;
  }
  function childrenFor(node) {
    const group = document.createElement('div');
    group.className = 'mh-children';
    group.setAttribute('role', 'group');
    if (node.kind === 'chapter' && !node.loaded) group.innerHTML = '<div class="mh-row mh-loading" style="--d:' + (node.depth - currentRoot.depth + 1) + '"><div class="mh-line"><span class="mh-caret"></span><span class="mh-text mh-muted">载入中…</span></div></div>';
    else node.children.forEach(child => group.append(rowFor(child)));
    return group;
  }
  function rerenderRow(node) {
    const row = rows.get(node.id);
    if (!row || !row.isConnected) return;
    row.replaceWith(rowFor(node));
  }
  function resetOutline() {
    open.clear();
    open.add(currentRoot.id);
    currentRoot.children.forEach(n => {
      if (n.kind !== 'chapter' || n === currentRoot) open.add(n.id);
    });
    rows.clear();
    outline.replaceChildren(rowFor(currentRoot));
    outline.scrollTop = 0;
  }
  function toggleOutline(node, force) {
    const willOpen = force ?? !open.has(node.id);
    if (willOpen === open.has(node.id)) return;
    if (willOpen) open.add(node.id); else open.delete(node.id);
    if (willOpen && node.kind === 'chapter') loadChapter(node);
    rerenderRow(node);
  }
  function foldAllInOutline(node, expand) {
    for (const n of subtree(node)) {
      if (expand && n.children.length) open.add(n.id);
      if (!expand) open.delete(n.id);
    }
    rerenderRow(node);
  }
  function revealInOutline(node) {
    if (!isInside(node)) return;
    for (const step of ancestors(node).slice(0, -1)) if (isInside(step)) toggleOutline(step, true);
    const row = rows.get(node.id);
    if (!row || !row.isConnected) return;
    activeRow?.classList.remove('is-active');
    activeRow = row;
    row.classList.add('is-active');
    const line = row.firstElementChild;
    const box = outline.getBoundingClientRect();
    const rect = line.getBoundingClientRect();
    if (rect.top < box.top || rect.bottom > box.bottom) outline.scrollTop += rect.top - box.top - box.height / 3;
  }
  outline.addEventListener('click', event => {
    if (event.target.closest('.mh-open')) return;
    const row = event.target.closest('.mh-row[data-id]');
    if (!row) return;
    const node = nodes[Number(row.dataset.id)];
    if (event.target.closest('[data-mh-toggle]')) {
      toggleOutline(node);
      return;
    }
    revealInOutline(node);
    revealInMap(node);
    graph.focus(node);
  });

  // ---- 连接图：只画点和连线，悬停显示节点内容 ----
  const graph = (() => {
    const context = canvas.getContext('2d');
    let links = [];
    let width = 0;
    let height = 0;
    let transform = zoomIdentity;
    let userMoved = false;
    let hovered = null;
    let focused = null;
    let colors = {};
    let frame = 0;

    function readColors() {
      const style = getComputedStyle(hub);
      const value = name => style.getPropertyValue(name).trim();
      colors = { accent: value('--mh-accent'), ink: value('--mh-ink'), mute: value('--mh-dot'), line: value('--mh-edge') };
    }
    function resize() {
      const rect = graphBox.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!userMoved) fit();
      draw();
    }
    function fit() {
      const placed = simulation.nodes();
      if (!placed.length || !width) return;
      let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
      for (const n of placed) {
        if (n.x < x0) x0 = n.x; if (n.x > x1) x1 = n.x;
        if (n.y < y0) y0 = n.y; if (n.y > y1) y1 = n.y;
      }
      const k = Math.min(4, 0.88 * Math.min(width / Math.max(1, x1 - x0), height / Math.max(1, y1 - y0)));
      transform = zoomIdentity.translate(width / 2 - k * (x0 + x1) / 2, height / 2 - k * (y0 + y1) / 2).scale(k);
      select(canvas).property('__zoom', transform);
    }
    function kindOf(node) {
      return node === currentRoot ? 'root' : node.kind;
    }
    function neighbours(node) {
      if (!node || !isInside(node)) return null;
      return new Set([node, node === currentRoot ? null : node.parent, ...node.children].filter(Boolean));
    }
    function draw() {
      frame = 0;
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);
      const center = hovered || focused;
      const near = neighbours(center);
      context.lineWidth = 0.6 / transform.k;
      context.strokeStyle = colors.line;
      context.globalAlpha = near ? 0.35 : 1;
      context.beginPath();
      for (const link of links) {
        context.moveTo(link.source.x, link.source.y);
        context.lineTo(link.target.x, link.target.y);
      }
      context.stroke();
      if (near) {
        context.globalAlpha = 1;
        context.strokeStyle = colors.accent;
        context.lineWidth = 1.2 / transform.k;
        context.beginPath();
        for (const n of near) {
          if (n === center) continue;
          context.moveTo(center.x, center.y);
          context.lineTo(n.x, n.y);
        }
        context.stroke();
      }
      const minRadius = 0.9 / transform.k;
      for (const kind of ['note', 'chapter', 'subject', 'root']) {
        context.fillStyle = kind === 'note' || kind === 'chapter' ? colors.mute : (kind === 'root' ? colors.accent : colors.ink);
        context.globalAlpha = (near ? 0.35 : 1) * (kind === 'note' ? 0.5 : 1);
        context.beginPath();
        for (const n of simulation.nodes()) {
          if (kindOf(n) !== kind) continue;
          const r = Math.max(minRadius, KIND_RADIUS[kind]);
          context.moveTo(n.x + r, n.y);
          context.arc(n.x, n.y, r, 0, Math.PI * 2);
        }
        context.fill();
      }
      if (near) {
        context.globalAlpha = 1;
        context.fillStyle = colors.accent;
        context.beginPath();
        for (const n of near) {
          const r = Math.max(minRadius * 1.6, KIND_RADIUS[kindOf(n)] * (n === center ? 1.6 : 1.2));
          context.moveTo(n.x + r, n.y);
          context.arc(n.x, n.y, r, 0, Math.PI * 2);
        }
        context.fill();
      }
      context.restore();
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(draw);
    }

    const linkForce = forceLink([])
      .distance(link => ({ subject: 90, chapter: 46 }[link.target.kind] || (link.source.kind === 'chapter' ? 14 : 6)))
      .strength(link => (link.target.kind === 'note' ? 1 : 0.7));
    const simulation = forceSimulation([])
      .force('link', linkForce)
      // 骨架节点之间远距离互斥，把各章推开；笔记之间只在近处互斥，于是每章聚成一团。
      .force('spread', forceManyBody().strength(n => ({ root: -600, subject: -420, chapter: -160 }[n.kind] || 0)).distanceMax(600))
      .force('local', forceManyBody().strength(n => (n.kind === 'note' ? -2.2 : 0)).distanceMax(28).theta(1.2))
      .force('x', forceX(0).strength(n => (n.kind === 'note' && n !== currentRoot ? 0 : 0.03)))
      .force('y', forceY(0).strength(n => (n.kind === 'note' && n !== currentRoot ? 0 : 0.03)))
      .alphaDecay(0.035)
      .velocityDecay(0.45)
      .on('tick', () => {
        if (!userMoved) fit();
        schedule();
      });

    // 只把当前根节点下面的点放进模拟；已经排好的点保留原位置，新点放在父节点旁边。
    function sync() {
      const list = subtree(currentRoot);
      for (const node of list) {
        if (node.x !== undefined) continue;
        const parent = node.parent;
        const angle = Math.random() * Math.PI * 2;
        const distance = node.kind === 'note' ? 4 : 30;
        node.x = (parent?.x || 0) + (parent ? Math.cos(angle) * distance : 0);
        node.y = (parent?.y || 0) + (parent ? Math.sin(angle) * distance : 0);
      }
      links = list.slice(1).map(node => ({ source: node.parent, target: node }));
      simulation.nodes(list);
      linkForce.links(links);
      simulation.alpha(Math.max(simulation.alpha(), 0.6)).restart();
    }
    let syncTimer;
    function grow() {
      window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(sync, 180);
    }

    function nodeAt(event) {
      const rect = canvas.getBoundingClientRect();
      const [x, y] = transform.invert([event.clientX - rect.left, event.clientY - rect.top]);
      return simulation.find(x, y, 10 / transform.k) || null;
    }
    function showTip(node, event) {
      if (!node) {
        tip.hidden = true;
        return;
      }
      const trail = ancestors(node).slice(1, -1).map(n => n.kind === 'chapter' ? escapeHTML(n.title) : (n.kind === 'subject' ? n.content : null)).filter(Boolean);
      tip.innerHTML = (trail.length ? '<div class="mh-tip-path">' + trail.slice(-2).join(' › ') + '</div>' : '') +
        '<div class="mh-tip-body">' + (node.content || '') + '</div>';
      tip.hidden = false;
      const box = graphBox.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      const tipRect = tip.getBoundingClientRect();
      tip.style.left = Math.min(Math.max(8, x + 12), box.width - tipRect.width - 8) + 'px';
      tip.style.top = (y - tipRect.height - 12 > 4 ? y - tipRect.height - 12 : y + 14) + 'px';
    }

    const zoomBehaviour = d3zoom()
      .scaleExtent([0.05, 40])
      .on('zoom', event => {
        transform = event.transform;
        if (event.sourceEvent) userMoved = true;
        tip.hidden = true;
        schedule();
      });
    select(canvas).call(zoomBehaviour).on('dblclick.zoom', null);
    canvas.addEventListener('mousemove', event => {
      const node = nodeAt(event);
      if (node !== hovered) {
        hovered = node;
        canvas.style.cursor = node ? 'pointer' : '';
        schedule();
      }
      showTip(node, event);
    });
    canvas.addEventListener('mouseleave', () => {
      hovered = null;
      tip.hidden = true;
      schedule();
    });
    canvas.addEventListener('click', event => {
      const node = nodeAt(event);
      if (!node) return;
      focused = node;
      revealInOutline(node);
      revealInMap(node);
      schedule();
    });
    canvas.addEventListener('dblclick', () => {
      userMoved = false;
      fit();
      schedule();
    });

    readColors();
    new MutationObserver(() => {
      readColors();
      schedule();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(graphBox);
    else window.addEventListener('resize', resize);

    return {
      grow,
      nodeAt,
      start() {
        sync();
        resize();
      },
      reroot() {
        userMoved = false;
        hovered = null;
        focused = null;
        tip.hidden = true;
        sync();
        fit();
        schedule();
      },
      focus(node) {
        focused = node;
        schedule();
      }
    };
  })();

  // ---- 设为根节点 ----
  async function setRoot(node, { quiet = false } = {}) {
    if (!node) return;
    if (node.kind === 'chapter' || ancestors(node).some(n => n.kind === 'chapter')) await loadAround(node);
    currentRoot = node;
    renderCrumbs();
    updateStatus();
    resetOutline();
    graph.reroot();
    if (quiet) {
      await refreshMarkmap({ resetFolds: true });
      return;
    }
    mapTouched = true;
    await refreshMarkmap({ resetFolds: true, fit: true });
  }

  // ---- 右键菜单：设为根节点 / 全部展开 / 全部收缩 ----
  let menuNode = null;
  function openMenu(node, event) {
    event.preventDefault();
    menuNode = node;
    menu.querySelector('[data-mh-menu-item="root"]').disabled = node === currentRoot;
    menu.querySelector('[data-mh-menu-name]').textContent = node.kind === 'chapter' ? node.title.replace(/^.+?_/, '') : plainText(node) || '〔图片〕';
    menu.hidden = false;
    const rect = menu.getBoundingClientRect();
    menu.style.left = Math.min(event.clientX, window.innerWidth - rect.width - 8) + 'px';
    menu.style.top = Math.min(event.clientY, window.innerHeight - rect.height - 8) + 'px';
    menu.querySelector('button:not(:disabled)')?.focus({ preventScroll: true });
  }
  function closeMenu() {
    menu.hidden = true;
    menuNode = null;
  }
  async function runMenu(action) {
    const node = menuNode;
    closeMenu();
    if (!node) return;
    if (action === 'root') {
      await setRoot(node);
      return;
    }
    const expand = action === 'expand';
    if (expand) {
      status.hidden = false;
      status.textContent = 'Loading…';
      await loadAround(node);
      updateStatus();
    }
    foldAllInOutline(node, expand);
    revealInOutline(node);
    await foldAllInMap(node, expand ? 0 : 1);
  }
  menu.addEventListener('click', event => {
    const button = event.target.closest('[data-mh-menu-item]');
    if (button && !button.disabled) runMenu(button.dataset.mhMenuItem);
  });
  document.addEventListener('pointerdown', event => {
    if (!menu.hidden && !menu.contains(event.target)) closeMenu();
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || menu.hidden) return;
    closeMenu();
    // 这一下 Esc 只用来关菜单，不顺带退出连接图全屏。
    event.stopImmediatePropagation();
  });
  window.addEventListener('blur', closeMenu);
  window.addEventListener('resize', closeMenu);
  outline.addEventListener('scroll', closeMenu, { passive: true });

  svg.addEventListener('contextmenu', event => {
    const element = event.target.closest('g.markmap-node');
    const node = element && nodes[select(element).datum()?.payload?.hid];
    if (node) openMenu(node, event);
  });
  outline.addEventListener('contextmenu', event => {
    const row = event.target.closest('.mh-row[data-id]');
    if (row) openMenu(nodes[Number(row.dataset.id)], event);
  });
  canvas.addEventListener('contextmenu', event => {
    const node = graph.nodeAt(event);
    if (node) openMenu(node, event);
  });

  function onChapterLoaded(chapter) {
    if (isInside(chapter) || isInside(currentRoot, chapter)) {
      scheduleMarkmap();
      rerenderRow(chapter);
      graph.grow();
    }
    updateStatus();
  }

  // ---- 按钮 ----
  function setLayout(value) {
    layout = value;
    try {
      localStorage.setItem(LAYOUT_KEY, value);
    } catch {
      // 浏览器不让存时，只在本次访问里生效。
    }
    hub.querySelectorAll('[data-mh-layout]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.mhLayout === value));
    });
    refreshMarkmap({ fit: true });
  }
  // 连接图放大：右栏变宽把大纲挤掉，导图缩到四分之一宽；动画由 CSS 完成，画布和导图跟着尺寸变化重绘。
  function setGraphMax(on) {
    hub.classList.toggle('is-graph-max', on);
    const button = hub.querySelector('[data-mh-action="graph-max"]');
    button.setAttribute('aria-pressed', String(on));
    button.title = on ? 'Restore layout' : 'Expand graph';
    button.setAttribute('aria-label', button.title);
    closeMenu();
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.hidden && hub.classList.contains('is-graph-max')) setGraphMax(false);
  });

  hub.addEventListener('click', event => {
    const rootButton = event.target.closest('[data-mh-root]');
    if (rootButton) {
      setRoot(nodes[Number(rootButton.dataset.mhRoot)]);
      return;
    }
    const layoutButton = event.target.closest('[data-mh-layout]');
    if (layoutButton) {
      if (layoutButton.dataset.mhLayout !== layout) setLayout(layoutButton.dataset.mhLayout);
      return;
    }
    const button = event.target.closest('[data-mh-action]');
    if (!button) return;
    const action = button.dataset.mhAction;
    if (action === 'fit') fitMap();
    if (action === 'zoom-in') rightMap.rescale(1.25);
    if (action === 'zoom-out') rightMap.rescale(0.8);
    if (action === 'collapse-outline') resetOutline();
    if (action === 'graph-max') setGraphMax(!hub.classList.contains('is-graph-max'));
  });

  // 点导图里的节点文字时，大纲和连接图跟着定位。
  svg.addEventListener('click', event => {
    const element = event.target.closest('g.markmap-node');
    if (!element || event.target.closest('circle')) return;
    const item = select(element).datum();
    const node = nodes[item?.payload?.hid];
    if (!node) return;
    revealInOutline(node);
    graph.focus(node);
    const entry = mmIndex.get(node.id);
    if (entry) highlight(entry.item === item ? entry : { item, mm: leftMap });
  });

  // 点开还没载入的章节时先让它插队。
  svg.addEventListener('click', event => {
    if (!event.target.closest('circle')) return;
    const element = event.target.closest('g.markmap-node');
    const node = element && nodes[select(element).datum()?.payload?.hid];
    if (node?.kind === 'chapter' && !node.loaded) loadChapter(node);
  }, true);

  hub.querySelectorAll('[data-mh-layout]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.mhLayout === layout));
  });
  renderCrumbs();
  resetOutline();
  refreshMarkmap({ fit: true }).then(() => {
    rightMap.setOptions({ duration: 300 });
    leftMap.options = { ...leftMap.options, duration: 300 };
    hub.classList.add('is-ready');
  });
  updateStatus();
  graph.start();
  pump();

  let resizeTimer;
  new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(fitMap, 200);
  }).observe(svg);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
