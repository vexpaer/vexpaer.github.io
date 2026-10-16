/**
 * Vexpaer
 * 博客索引页的数据：每篇文章的板块、学科、系列和清洗过的一行摘要，以及首屏列表 HTML。
 */

'use strict'

const render = require('../../source/js/vexpaer-blog-render.js')

const STAGE_TAGS = Object.keys(render.SECTION_OF_TAG)
const FILLER = /^(basic|pic\d+|information|abstract|take.home.*)$/i

function clean (text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*|__|`/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function headings (body) {
  return (body.match(/^#{1,3}\s+.+$/gm) || [])
    .map(h => clean(h.replace(/^#+\s+/, '')))
    .filter(h => h && !FILLER.test(h))
    .slice(0, 4)
    .join(' / ')
}

// 摘要优先级：front matter 的 description → 论文的中文摘要 → 思维导图一级要点 → 正文第一段 → 小标题。
function excerptOf (post, isPaper) {
  if (post.description) return { excerpt: clean(post.description), meta: '' }
  const body = (post._content || '').replace(/\{%[\s\S]*?%\}/g, '')
  if (isPaper) {
    const journal = (body.match(/\|\s*Journal\s*\|(.*?)\|/) || [])[1]
    const year = (body.match(/\|\s*Year\s*\|(.*?)\|/) || [])[1]
    const zh = body.split(/\r?\n/).find(l => /[一-龥]{20}/.test(l) && !l.trim().startsWith('|'))
    return { excerpt: zh ? clean(zh) : '', meta: [journal, year].map(s => s && s.trim()).filter(Boolean).join(' · ') }
  }
  let excerpt = ''
  if (post.mindmap === true) {
    excerpt = body.split(/\r?\n/).filter(l => /^- /.test(l)).map(l => clean(l.slice(2))).filter(x => x && !FILLER.test(x)).slice(0, 4).join(' / ')
  } else {
    const paragraph = body
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\$\$[\s\S]*?\$\$/g, '')
      .split(/\r?\n\s*\r?\n/)
      .map(p => clean(p.replace(/^#+.*$/gm, '').replace(/[*_>|#-]/g, ' ')))
      .find(p => p.length > 40 && !/^(pic\d\s*)+/.test(p) && !/Learning Objectives/.test(p))
    excerpt = paragraph || ''
  }
  if (!excerpt || /\.(jpg|png|gif)\)|https?:\/\//i.test(excerpt)) excerpt = headings(body)
  return { excerpt, meta: '' }
}

function entryOf (post, urlFor) {
  const tags = post.tags ? post.tags.map(t => t.name) : []
  const full = post.title || ''
  let title = full
  let series = null
  let num = null
  const paper = full.match(/^readApaper#(\d+)\s*(.*)$/)
  const course = full.match(/^(.+?)_(.+)$/)
  if (paper) {
    series = 'readApaper'
    num = Number(paper[1])
    title = paper[2]
  } else if (course) {
    series = course[1]
    title = course[2]
  }
  const section = tags.includes('readApaper') ? 'paper'
    : tags.includes('picture') ? 'gallery'
      : tags.includes('middleSchool') ? 'ms' : 'ug'
  const { excerpt, meta } = excerptOf(post, section === 'paper')
  return {
    title,
    full,
    url: urlFor(post.path),
    date: post.date.format('YYYY-MM-DD'),
    tags,
    series,
    num,
    meta,
    excerpt: excerpt.slice(0, 120),
    section,
    subject: tags.find(t => !STAGE_TAGS.includes(t)) || ''
  }
}

hexo.extend.helper.register('vexpaer_blog_index', function () {
  const urlFor = this.url_for.bind(this)
  const posts = this.site.posts
    .filter(post => post.published !== false && post.hide !== true)
    .map(post => ({ post, entry: entryOf(post, urlFor) }))
    .sort((a, b) => b.post.date.valueOf() - a.post.date.valueOf() || (b.entry.num || 0) - (a.entry.num || 0))
    .map(item => item.entry)
  const state = { section: 'all', subject: '', q: '' }
  const series = new Set(posts.map(p => p.series).filter(Boolean))
  const subjects = new Set(posts.map(p => p.subject).filter(Boolean))
  return {
    count: posts.length,
    seriesCount: series.size,
    subjectCount: subjects.size,
    latest: posts.length ? posts[0].date.replace(/-/g, '.') : '',
    tabs: render.renderTabs(posts, state),
    chips: render.renderChips(posts, state),
    list: render.renderList(posts, state),
    // 内嵌到 <script type="application/json">，把 < 转义掉以免提前闭合标签。
    json: JSON.stringify(posts).replace(/</g, '\\u003c')
  }
})
