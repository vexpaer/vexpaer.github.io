/**
 * 博客索引页的列表渲染。构建时由 scripts/helpers/blog_index.js 调用生成首屏 HTML，
 * 浏览器里由 vexpaer-blog.js 在筛选、搜索后用同一套函数重绘，两边输出完全一致。
 */
(function (root, factory) {
  var api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  else root.VexpaerBlogRender = api
})(typeof self !== 'undefined' ? self : this, function () {
  var SECTIONS = [
    { id: 'all', name: '全部' },
    { id: 'paper', name: '论文阅读' },
    { id: 'ug', name: '本科课程' },
    { id: 'ms', name: '中学笔记' },
    { id: 'gallery', name: '图集' }
  ]
  var SECTION_OF_TAG = { readApaper: 'paper', picture: 'gallery', undergraduate: 'ug', middleSchool: 'ms' }

  function esc (value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  function shortDate (date) {
    return date.slice(5).replace('-', '·')
  }

  function sectionCounts (posts) {
    var counts = { all: posts.length }
    posts.forEach(function (p) { counts[p.section] = (counts[p.section] || 0) + 1 })
    return counts
  }

  function renderTabs (posts, state) {
    var counts = sectionCounts(posts)
    return SECTIONS.map(function (s) {
      return '<button type="button" class="vb-tab' + (state.section === s.id ? ' on' : '') + '" data-section="' + s.id + '">' +
        s.name + '<sup>' + (counts[s.id] || 0) + '</sup></button>'
    }).join('')
  }

  // 学科标签只列当前板块里出现过的，按篇数从多到少。
  function renderChips (posts, state) {
    var subjects = {}
    posts.forEach(function (p) {
      if ((state.section === 'all' || p.section === state.section) && p.subject) subjects[p.subject] = (subjects[p.subject] || 0) + 1
    })
    var keys = Object.keys(subjects).sort(function (a, b) { return subjects[b] - subjects[a] })
    if (keys.length < 2) return ''
    return keys.map(function (k) {
      return '<button type="button" class="vb-chip' + (state.subject === k ? ' on' : '') + '" data-subject="' + esc(k) + '">' + esc(k) + ' ' + subjects[k] + '</button>'
    }).join('')
  }

  function rowHTML (p, index) {
    var inGroup = typeof index === 'number'
    var kicker = p.series === 'readApaper' ? 'readApaper #' + p.num : (p.series && !inGroup ? p.series : '')
    return '<a class="vb-row" href="' + esc(p.url) + '">' +
      (inGroup
        ? '<span class="vb-idx">' + (index < 9 ? '0' : '') + (index + 1) + '</span>'
        : '<time class="vb-date" datetime="' + p.date + '">' + shortDate(p.date) + '</time>') +
      '<div class="vb-body">' +
        (kicker ? '<div class="vb-kicker">' + esc(kicker) + '</div>' : '') +
        '<div class="vb-title">' + esc(p.title) + '</div>' +
        (p.meta ? '<div class="vb-meta">' + esc(p.meta) + '</div>' : '') +
        (p.excerpt ? '<div class="vb-excerpt">' + esc(p.excerpt) + '</div>' : '') +
      '</div>' +
      '<span class="vb-tag">' + esc(p.subject) + '</span>' +
    '</a>'
  }

  function byTitle (a, b) {
    return a.title.localeCompare(b.title, 'zh-CN', { numeric: true, sensitivity: 'base' })
  }

  function filterPosts (posts, state) {
    var q = (state.q || '').trim().toLowerCase()
    return posts.filter(function (p) {
      return (state.section === 'all' || p.section === state.section) &&
        (!state.subject || p.subject === state.subject) &&
        (!q || [p.full, p.excerpt, p.meta].concat(p.tags).join('\n').toLowerCase().indexOf(q) >= 0)
    })
  }

  // 按年分组；同一天、同一系列、连续 3 篇以上的课程笔记折叠成一行，搜索时全部展开。
  function renderList (posts, state) {
    var list = filterPosts(posts, state)
    if (!list.length) return '<div class="vb-empty">没有匹配的文章</div>'
    var searching = !!(state.q || '').trim()
    var blocks = []
    for (var i = 0; i < list.length;) {
      var j = i
      while (j + 1 < list.length && list[i].series && list[j + 1].series === list[i].series && list[j + 1].date === list[i].date) j++
      var run = list.slice(i, j + 1)
      // 同一天发布的课程笔记时间戳相同，组内按标题自然排序（1.Introduction 在 2.Growth 前）。
      if (!searching && run.length >= 3 && run[0].series !== 'readApaper') blocks.push({ group: run.slice().sort(byTitle) })
      else run.forEach(function (p) { blocks.push({ post: p }) })
      i = j + 1
    }
    var yearCounts = {}
    list.forEach(function (p) { var y = p.date.slice(0, 4); yearCounts[y] = (yearCounts[y] || 0) + 1 })
    var html = ''
    var year = ''
    blocks.forEach(function (b) {
      var first = b.post || b.group[0]
      var y = first.date.slice(0, 4)
      if (y !== year) {
        if (year) html += '</section>'
        year = y
        html += '<section class="vb-year-block"><div class="vb-year"><h2>' + y + '</h2><span>' + yearCounts[y] + ' 篇</span></div>'
      }
      if (b.post) {
        html += rowHTML(b.post)
        return
      }
      var g = b.group
      html += '<div class="vb-group">' +
        '<button type="button" class="vb-row vb-group-head" aria-expanded="false">' +
          '<time class="vb-date" datetime="' + first.date + '">' + shortDate(first.date) + '</time>' +
          '<div class="vb-body"><div class="vb-kicker">系列 · ' + g.length + ' 篇</div>' +
          '<div class="vb-title">' + esc(first.series) + '</div>' +
          '<div class="vb-excerpt">' + esc(g.map(function (x) { return x.title }).join(' · ')) + '</div></div>' +
          '<span class="vb-tag">' + esc(first.subject) + '</span>' +
        '</button>' +
        '<div class="vb-group-body">' + g.map(function (x, k) { return rowHTML(x, k) }).join('') + '</div>' +
      '</div>'
    })
    return html + '</section>'
  }

  return {
    SECTIONS: SECTIONS,
    SECTION_OF_TAG: SECTION_OF_TAG,
    esc: esc,
    renderTabs: renderTabs,
    renderChips: renderChips,
    renderList: renderList
  }
})
