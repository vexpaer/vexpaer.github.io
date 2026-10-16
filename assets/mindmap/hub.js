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

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function withoutImages(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('img').forEach(img => img.remove());
  return template.innerHTML.trim() || '<span class="mh-muted">〔图片〕</span>';
}

function init() {
  const hub = document.querySelector('[data-mindmap-hub]');
  const dataElement = hub?.querySelector('[data-mh-data]');
  if (!hub || !dataElement) return;

  const svg = hub.querySelector('[data-mh-svg]');
  const status = hub.querySelector('[data-mh-status]');
  const outline = hub.querySelector('[data-mh-outline]');
  const countLabel = hub.querySelector('[data-mh-count]');
  const graphBox = hub.querySelector('[data-mh-graph]');
  const canvas = hub.querySelector('[data-mh-canvas]');
  const tip = hub.querySelector('[data-mh-tip]');

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
  function chapterOf(node) {
    return ancestors(node).find(n => n.kind === 'chapter');
  }

  function updateStatus() {
    status.textContent = loadedCount < chapters.length
      ? `正在载入 ${loadedCount}/${chapters.length} 章…`
      : `${root.children.length} 个学科 · ${chapters.length} 章 · ${nodes.length} 个节点`;
    countLabel.textContent = nodes.length + ' 点';
  }

  // ---- 导图 ----
  const markmap = Markmap.create(svg, {
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
    color: colorOf,
    zoom: true
  });
  const mmIndex = new Map();
  let mapTouched = false;
  ['wheel', 'pointerdown'].forEach(type => svg.addEventListener(type, () => { mapTouched = true; }, { passive: true }));
  // 章节默认收起；章节展开后先只露出一层，再往下的节点折叠着。已有的折叠状态照旧保留。
  function toMarkmap(node, folds) {
    const fold = folds.has(node.id) ? folds.get(node.id) : (node.kind === 'chapter' || node.depth >= 4 ? 1 : 0);
    return {
      content: node.content,
      children: node.children.map(child => toMarkmap(child, folds)),
      payload: { hid: node.id, ...(fold ? { fold } : {}) }
    };
  }
  function colorOf(item) {
    const subject = ancestors(nodes[item.payload?.hid] || root)[1];
    return subject ? PALETTE[root.children.indexOf(subject) % PALETTE.length] : 'var(--mh-accent)';
  }
  function reindexFrom(data) {
    mmIndex.clear();
    (function walk(item) {
      mmIndex.set(item.payload.hid, item);
      item.children?.forEach(walk);
    })(data);
  }
  function reindex() {
    reindexFrom(markmap.state.data);
  }
  let mmTimer;
  function scheduleMarkmap() {
    window.clearTimeout(mmTimer);
    mmTimer = window.setTimeout(refreshMarkmap, 160);
  }
  // 每次都从总树重建导图数据；Markmap 初始化时会复制子节点，直接往旧对象上挂会丢。
  let mmRefresh = Promise.resolve();
  function refreshMarkmap() {
    mmRefresh = mmRefresh.then(async () => {
      const folds = new Map();
      for (const [id, item] of mmIndex) folds.set(id, item.payload?.fold || 0);
      const data = toMarkmap(root, folds);
      reindexFrom(data);
      await markmap.setData(data);
      reindex();
      if (!mapTouched && loadedCount === chapters.length) await markmap.fit();
    });
    return mmRefresh;
  }
  async function revealInMap(node) {
    mapTouched = true;
    const chapter = chapterOf(node);
    if (chapter && !chapter.loaded) {
      status.textContent = '正在载入 ' + chapter.title + '…';
      await loadChapter(chapter);
      updateStatus();
    }
    window.clearTimeout(mmTimer);
    await refreshMarkmap();
    for (const step of ancestors(node).slice(0, -1)) {
      const item = mmIndex.get(step.id);
      if (item?.payload?.fold) item.payload = { ...item.payload, fold: 0 };
    }
    const target = mmIndex.get(node.id);
    if (!target) return;
    await markmap.setHighlight(target);
    await markmap.centerNode(target);
    // 总览时字太小，定位后放大到能读的比例。
    const scale = zoomTransform(svg).k;
    if (scale < 0.9) await markmap.rescale(1 / scale);
  }

  // ---- 大纲：一行一个节点，不显示图片，按层级缩进；子节点展开时才生成 ----
  const open = new Set([root.id, ...root.children.map(n => n.id)]);
  const rows = new Map();
  let activeRow;
  function rowFor(node) {
    const row = document.createElement('div');
    row.className = 'mh-row mh-' + node.kind;
    row.setAttribute('role', 'treeitem');
    row.style.setProperty('--d', node.depth);
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
    if (node.kind === 'chapter' && !node.loaded) group.innerHTML = '<div class="mh-row mh-loading" style="--d:' + (node.depth + 1) + '"><div class="mh-line"><span class="mh-caret"></span><span class="mh-text mh-muted">载入中…</span></div></div>';
    else node.children.forEach(child => group.append(rowFor(child)));
    return group;
  }
  function rerenderRow(node) {
    const row = rows.get(node.id);
    if (!row || !row.isConnected) return;
    row.replaceWith(rowFor(node));
  }
  function toggleOutline(node, force) {
    const willOpen = force ?? !open.has(node.id);
    if (willOpen === open.has(node.id)) return;
    if (willOpen) open.add(node.id); else open.delete(node.id);
    if (willOpen && node.kind === 'chapter') loadChapter(node);
    rerenderRow(node);
  }
  function revealInOutline(node) {
    for (const step of ancestors(node).slice(0, -1)) toggleOutline(step, true);
    const row = rows.get(node.id);
    if (!row) return;
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
  outline.append(rowFor(root));

  // ---- 连接图：只画点和连线，悬停显示节点内容 ----
  const graph = (() => {
    const context = canvas.getContext('2d');
    const links = [];
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
    function neighbours(node) {
      return node ? new Set([node, node.parent, ...node.children].filter(Boolean)) : null;
    }
    function draw() {
      frame = 0;
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);
      const near = neighbours(hovered || focused);
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
        const center = hovered || focused;
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
          if (n.kind !== kind) continue;
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
          const r = Math.max(minRadius * 1.6, KIND_RADIUS[n.kind] * (n === (hovered || focused) ? 1.6 : 1.2));
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

    const linkForce = forceLink(links)
      .distance(link => ({ subject: 90, chapter: 46 }[link.target.kind] || (link.source.kind === 'chapter' ? 14 : 6)))
      .strength(link => (link.target.kind === 'note' ? 1 : 0.7));
    const simulation = forceSimulation([])
      .force('link', linkForce)
      // 骨架节点之间远距离互斥，把各章推开；笔记之间只在近处互斥，于是每章聚成一团。
      .force('spread', forceManyBody().strength(n => ({ root: -600, subject: -420, chapter: -160 }[n.kind] || 0)).distanceMax(600))
      .force('local', forceManyBody().strength(n => (n.kind === 'note' ? -2.2 : 0)).distanceMax(28).theta(1.2))
      .force('x', forceX(0).strength(n => (n.kind === 'note' ? 0 : 0.03)))
      .force('y', forceY(0).strength(n => (n.kind === 'note' ? 0 : 0.03)))
      .alphaDecay(0.035)
      .velocityDecay(0.45)
      .on('tick', () => {
        if (!userMoved) fit();
        schedule();
      });

    function sync() {
      const placed = new Set(simulation.nodes());
      for (const node of nodes) {
        if (placed.has(node)) continue;
        if (node.parent) {
          const angle = Math.random() * Math.PI * 2;
          const distance = node.kind === 'note' ? 4 : 30;
          node.x = (node.parent.x || 0) + Math.cos(angle) * distance;
          node.y = (node.parent.y || 0) + Math.sin(angle) * distance;
          links.push({ source: node.parent, target: node });
        } else {
          node.x = 0;
          node.y = 0;
        }
      }
      simulation.nodes(nodes.slice());
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
      start() {
        sync();
        resize();
      },
      focus(node) {
        focused = node;
        schedule();
      }
    };
  })();

  function onChapterLoaded(chapter) {
    scheduleMarkmap();
    rerenderRow(chapter);
    graph.grow();
    updateStatus();
  }

  hub.addEventListener('click', event => {
    const button = event.target.closest('[data-mh-action]');
    if (!button) return;
    const action = button.dataset.mhAction;
    if (action === 'fit') markmap.fit();
    if (action === 'zoom-in') markmap.rescale(1.25);
    if (action === 'zoom-out') markmap.rescale(0.8);
    if (action === 'collapse-outline') {
      open.clear();
      open.add(root.id);
      root.children.forEach(n => open.add(n.id));
      rows.clear();
      outline.replaceChildren(rowFor(root));
      outline.scrollTop = 0;
    }
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
    markmap.setHighlight(item);
  });

  // 点开还没载入的章节时先让它插队。
  svg.addEventListener('click', event => {
    if (!event.target.closest('circle')) return;
    const element = event.target.closest('g.markmap-node');
    const node = element && nodes[select(element).datum()?.payload?.hid];
    if (node?.kind === 'chapter' && !node.loaded) loadChapter(node);
  }, true);

  mmRefresh = markmap.setData(toMarkmap(root, new Map())).then(async () => {
    reindex();
    await markmap.fit();
    markmap.setOptions({ duration: 300 });
    hub.classList.add('is-ready');
  });
  updateStatus();
  graph.start();
  pump();

  let resizeTimer;
  new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => markmap.fit(), 200);
  }).observe(svg);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
