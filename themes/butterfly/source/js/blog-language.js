/* Switch the two fully rendered Markdown sections of an opt-in bilingual Hexo post. */
(function () {
  'use strict'

  function initBilingualPost () {
    var nav = document.querySelector('#post .blog-language-switch')
    var article = document.getElementById('article-container')
    if (!nav || !article || nav.dataset.ready === '1') return
    nav.dataset.ready = '1'

    var panels = {
      en: article.querySelector('[data-blog-lang="en"]'),
      zh: article.querySelector('[data-blog-lang="zh"]')
    }
    if (!panels.en || !panels.zh) return

    var title = document.querySelector('#post-info .post-title')
    var titleEn = nav.dataset.titleEn || ''
    var titleZh = nav.dataset.titleZh || titleEn
    var initialDocumentTitle = document.title
    var titleSuffix = titleEn && initialDocumentTitle.indexOf(titleEn) === 0
      ? initialDocumentTitle.slice(titleEn.length) : ''

    function selectLanguage (lang) {
      if (!panels[lang]) return
      var current = !panels.en.hidden ? panels.en : panels.zh
      if (current !== panels[lang]) {
        // Keep roughly the same relative position inside the article.
        var top = article.getBoundingClientRect().top + window.scrollY
        var progress = Math.max(0, Math.min(1, (window.scrollY - top) / Math.max(1, article.offsetHeight)))
        current.hidden = true
        panels[lang].hidden = false
        window.requestAnimationFrame(function () {
          if (window.scrollY >= top) {
            window.scrollTo({ top: top + progress * article.offsetHeight, behavior: 'auto' })
          }
        })
      }
      nav.querySelectorAll('[data-blog-lang]').forEach(function (button) {
        var active = button.dataset.blogLang === lang
        button.classList.toggle('is-active', active)
        button.setAttribute('aria-pressed', String(active))
      })
      var selectedTitle = lang === 'zh' ? titleZh : titleEn
      if (title && selectedTitle) {
        var first = title.firstChild
        if (first && first.nodeType === 3) first.nodeValue = selectedTitle
        else if (!title.querySelector('a')) title.textContent = selectedTitle
      }
      if (selectedTitle && titleSuffix) document.title = selectedTitle + titleSuffix
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    }

    nav.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-blog-lang]')
      if (button && nav.contains(button)) selectLanguage(button.dataset.blogLang)
    })
    selectLanguage('en')
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBilingualPost)
  else initBilingualPost()
  document.addEventListener('pjax:complete', initBilingualPost)
})()
