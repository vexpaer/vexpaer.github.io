'use strict';

const PASSWORD = '1qaz2wsx';

hexo.extend.filter.register('before_post_render', data => {
  if (data.encrypt === true) data.password = PASSWORD;
  return data;
});
