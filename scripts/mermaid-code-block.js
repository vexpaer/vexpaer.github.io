'use strict'

const { escapeHTML } = require('hexo-util')

hexo.extend.filter.register('before_post_render', data => {
  const mermaid = []

  data.content = data.content.replace(
    /```mermaid[^\r\n]*\r?\n([\s\S]*?)```/gi,
    (match, diagram) => {
      const placeholder = `<!-- hexo-mermaid-${mermaid.length} -->`

      mermaid.push([placeholder, `<div class="mermaid">${escapeHTML(diagram.trim())}</div>`])
      return placeholder
    }
  )

  data.__mermaid = mermaid
}, 5)

hexo.extend.filter.register('after_post_render', data => {
  for (const [placeholder, diagram] of data.__mermaid || []) {
    data.content = data.content.replace(placeholder, diagram)
  }

  delete data.__mermaid
})
