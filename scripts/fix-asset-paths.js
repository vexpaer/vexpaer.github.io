'use strict';

hexo.extend.filter.register('after_post_render', data => {
  const pathname = new URL(data.permalink, hexo.config.url).pathname.replace(/\/?$/, '/');

  for (const key of ['excerpt', 'more', 'content']) {
    if (typeof data[key] === 'string' && data[key].includes('/.io//')) {
      data[key] = data[key].replaceAll('/.io//', pathname);
    }
  }

  return data;
}, 20);
