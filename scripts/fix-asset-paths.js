'use strict';

hexo.extend.filter.register('after_post_render', data => {
  const pathname = new URL(data.permalink, hexo.config.url).pathname.replace(/\/?$/, '/');
  const postUrl = new URL(pathname, hexo.config.url);

  for (const key of ['excerpt', 'more', 'content']) {
    if (typeof data[key] !== 'string') continue;

    data[key] = data[key].replace(/(<img\b[^>]*?\bsrc=["'])([^"']+)(["'])/gi, (match, before, src, quote) => {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(src)) return match;

      // Post assets are conventionally referenced as "post-folder/file".
      // The public asset folder is already represented by the post permalink,
      // so remove that first path component before resolving the final URL.
      const parts = src.replace(/\\/g, '/').split('/').filter(part => part && part !== '.');
      if (parts.length > 1) parts.shift();

      return `${before}${new URL(parts.join('/'), postUrl).href}${quote}`;
    });

    // Keep this fallback for content transformed by older asset plugins.
    data[key] = data[key].replaceAll('/.io//', pathname);
  }

  return data;
// Run after Markdown rendering but before hexo-asset-image and
// hexo-blog-encrypt (both use the default priority of 10).
}, 9);
