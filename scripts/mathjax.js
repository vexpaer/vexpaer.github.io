'use strict'

const mathPattern = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g
const codePattern = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g

hexo.extend.filter.register('before_post_render', data => {
  const math = []

  data.content = data.content
    .split(codePattern)
    .map((part, index) => {
      if (index % 2) return part

      return part.replace(mathPattern, match => {
        const display = match.startsWith('\\[')
        const placeholder = `<!-- hexo-math-${math.length} -->`
        const body = match.slice(2, -2)
        const mode = display ? '; mode=display' : ''

        math.push([placeholder, `<script type="math/tex${mode}">${body}</script>`])
        return placeholder
      })
    })
    .join('')

  data.__mathjax = math
})

hexo.extend.filter.register('after_post_render', data => {
  for (const [placeholder, math] of data.__mathjax || []) {
    data.content = data.content.replace(placeholder, math)
  }

  delete data.__mathjax
})
