import { Markmap } from 'markmap-view';

let activeReader;

function waitForImage(image) {
  if (image.complete) return Promise.resolve();
  return new Promise(resolve => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', resolve, { once: true });
  });
}

function waitForLayout(svg) {
  const imagesReady = Promise.all(Array.from(svg.querySelectorAll('img'), waitForImage));
  const fontsReady = document.fonts?.ready || Promise.resolve();
  const timeout = new Promise(resolve => window.setTimeout(resolve, 2500));
  return Promise.race([Promise.all([imagesReady, fontsReady]), timeout]);
}

function destroyActiveReader() {
  if (!activeReader) return;
  activeReader.abortController.abort();
  activeReader.resizeObserver?.disconnect();
  activeReader.markmap.destroy();
  activeReader = undefined;
}

function debounce(callback, delay) {
  let timeout;
  return () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(callback, delay);
  };
}

async function initializeMindmap() {
  const reader = document.querySelector('[data-mindmap-reader]');
  const svg = reader?.querySelector('[data-mindmap-svg]');
  const dataElement = document.querySelector('[data-mindmap-data]');

  if (!reader || !svg || !dataElement) {
    destroyActiveReader();
    return;
  }

  if (activeReader?.element === reader) return;
  destroyActiveReader();

  const fallback = reader.querySelector('[data-mindmap-status]');

  try {
    const data = JSON.parse(dataElement.textContent);
    const abortController = new AbortController();
    const signal = abortController.signal;
    const markmap = Markmap.create(svg, {
      autoFit: false,
      duration: 0,
      fitRatio: 0.9,
      initialExpandLevel: 3,
      maxInitialScale: 1.5,
      maxWidth: window.matchMedia('(max-width: 768px)').matches ? 260 : 320,
      // D3 zoom still provides mouse/touch dragging; disabling Markmap's
      // wheel-only pan handler keeps an ordinary wheel gesture zoom-only.
      pan: false,
      scrollForPan: false,
      spacingHorizontal: 90,
      spacingVertical: 10,
      zoom: true
    });

    activeReader = { element: reader, markmap, abortController };
    await markmap.setData(data);
    markmap.setOptions({ duration: 300 });
    await waitForLayout(svg);
    fallback?.setAttribute('hidden', '');
    reader.classList.add('is-ready');
    await markmap.fit();

    const runAction = async action => {
      if (action === 'fit') await markmap.fit();
      if (action === 'zoom-in') await markmap.rescale(1.2);
      if (action === 'zoom-out') await markmap.rescale(0.8);
      if (action === 'fullscreen') {
        if (document.fullscreenElement === reader) await document.exitFullscreen();
        else if (reader.requestFullscreen) await reader.requestFullscreen();
      }
    };

    reader.addEventListener('click', event => {
      const button = event.target.closest('[data-mindmap-action]');
      if (!button) return;
      runAction(button.dataset.mindmapAction).catch(error => console.error('Mindmap action failed:', error));
    }, { signal });

    const fullscreenButton = reader.querySelector('[data-mindmap-action="fullscreen"]');
    if (!document.fullscreenEnabled && fullscreenButton) fullscreenButton.hidden = true;

    document.addEventListener('fullscreenchange', () => {
      const isFullscreen = document.fullscreenElement === reader;
      reader.classList.toggle('is-fullscreen', isFullscreen);
      fullscreenButton?.setAttribute('aria-pressed', String(isFullscreen));
      window.requestAnimationFrame(() => markmap.fit());
    }, { signal });

    const fitAfterResize = debounce(() => markmap.fit(), 180);
    if ('ResizeObserver' in window) {
      activeReader.resizeObserver = new ResizeObserver(fitAfterResize);
      activeReader.resizeObserver.observe(reader);
    } else {
      window.addEventListener('resize', fitAfterResize, { signal });
    }
  } catch (error) {
    reader.classList.add('is-error');
    if (fallback) fallback.textContent = '思维导图加载失败，请返回大纲模式阅读。';
    console.error('Mindmap initialization failed:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMindmap, { once: true });
} else {
  initializeMindmap();
}

document.addEventListener('pjax:complete', initializeMindmap);
