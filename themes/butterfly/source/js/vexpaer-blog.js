/**
 * 博客索引页的交互：板块/学科筛选、标题搜索、系列折叠、侧栏标签云联动和侧栏双向吸附。
 */
(function () {
  var root = document.getElementById('vexpaer-blog')
  var dataNode = document.getElementById('vexpaer-blog-data')
  var R = window.VexpaerBlogRender
  if (!root || !dataNode || !R) return

  var posts = []
  try { posts = JSON.parse(dataNode.textContent) } catch (error) { return }

  var tabs = root.querySelector('.vb-tabs')
  var chips = root.querySelector('.vb-chips')
  var list = root.querySelector('.vb-list')
  var search = document.getElementById('vb-q')
  var rail = root.querySelector('.vb-rail')
  var toolbar = root.querySelector('.vb-toolbar')
  var state = { section: 'all', subject: '', q: '' }

  function renderFilters () {
    tabs.innerHTML = R.renderTabs(posts, state)
    chips.innerHTML = R.renderChips(posts, state)
    markCloud()
  }

  function renderList () {
    list.innerHTML = R.renderList(posts, state)
    stickRail(false)
  }

  function markCloud () {
    rail.querySelectorAll('.card-tag-cloud a').forEach(function (a) {
      var tag = a.textContent.trim()
      var section = R.SECTION_OF_TAG[tag]
      a.classList.toggle('on', section ? state.section === section : state.subject === tag)
    })
  }

  function scrollToList () {
    var top = toolbar.getBoundingClientRect().top + window.scrollY - 60
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' })
  }

  root.addEventListener('click', function (event) {
    var tab = event.target.closest('.vb-tab')
    var chip = event.target.closest('.vb-chip')
    var head = event.target.closest('.vb-group-head')
    var cloudTag = event.target.closest('.card-tag-cloud a')
    if (tab) {
      state.section = tab.dataset.section
      state.subject = ''
    } else if (chip) {
      state.subject = state.subject === chip.dataset.subject ? '' : chip.dataset.subject
    } else if (head) {
      var open = head.parentNode.classList.toggle('open')
      head.setAttribute('aria-expanded', String(open))
      stickRail(false)
      return
    } else if (cloudTag) {
      // 侧栏标签云和顶部筛选联动：阶段类标签切板块，学科类标签切学科。
      var tag = cloudTag.textContent.trim()
      var section = R.SECTION_OF_TAG[tag]
      if (section) {
        state.section = state.section === section ? 'all' : section
        state.subject = ''
      } else {
        state.section = 'all'
        state.subject = state.subject === tag ? '' : tag
      }
      event.preventDefault()
      scrollToList()
    } else {
      return
    }
    renderFilters()
    renderList()
  })

  search.addEventListener('input', function () {
    state.q = search.value
    renderList()
  })
  document.addEventListener('keydown', function (event) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable
    if (event.key === '/' && !typing) {
      event.preventDefault()
      search.focus()
    } else if (event.key === 'Escape' && document.activeElement === search) {
      search.value = ''
      state.q = ''
      renderList()
      search.blur()
    }
  })

  // 侧栏双向吸附：比一屏高时，往下滚贴住屏幕底边、往上滚贴回筛选栏下沿，任何时候都在屏幕里。
  var wide = window.matchMedia('(min-width: 981px)')
  var railTop = 0
  var lastY = window.scrollY
  function stickRail (reset) {
    var y = window.scrollY
    if (!wide.matches) {
      rail.style.top = ''
      lastY = y
      return
    }
    var head = 60 + toolbar.offsetHeight - 28
    var low = Math.min(head, window.innerHeight - rail.offsetHeight - 8)
    railTop = reset ? head : Math.max(low, Math.min(head, railTop - (y - lastY)))
    lastY = y
    rail.style.top = railTop + 'px'
  }
  window.addEventListener('scroll', function () { stickRail(false) }, { passive: true })
  window.addEventListener('resize', function () { stickRail(false) })
  // 头像和字体加载后侧栏高度会变，重新算一次。
  window.addEventListener('load', function () { stickRail(false) })

  markCloud()
  stickRail(true)
})()
