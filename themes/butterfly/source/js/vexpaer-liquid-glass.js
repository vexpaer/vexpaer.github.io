(function () {
  'use strict'

  // 液态玻璃阅读镜。
  // 只在文章阅读页生效;渲染器(WebGL2)与设置面板按需懒加载,
  // 不开启时页面零开销。开关状态与全部光学参数存入 localStorage。
  var article = document.getElementById('article-container')
  if (!article) return

  var ENABLED_KEY = 'liquid-glass-enabled'
  var SETTINGS_KEY = 'liquid-glass-settings'
  var VENDOR = '/js/vendor/liquid-glass/'

  var glass = null
  var panel = null
  var loading = false
  var cssInjected = false
  var saveTimer = 0

  // ---------------------------------------------------------- 阅读页设置菜单控件
  // 使用 Butterfly 原有的 #rightside-config-hide (齿轮展开菜单)，
  // 不再另外创建占用阅读区域的固定浮动按钮簇。
  var settingsMenu = document.getElementById('rightside-config-hide')
  if (!settingsMenu) return

  var style = document.createElement('style')
  style.textContent = [
    '#rightside #vexpaer-glass-toggle.is-on {',
    '  background-color: rgba(52, 84, 160, 0.85);',
    '}',
    '#rightside #vexpaer-glass-gear { display: none; }',
    '#rightside #vexpaer-glass-gear.is-visible { display: block; }',
    '#rightside #vexpaer-glass-toggle svg,',
    '#rightside #vexpaer-glass-gear svg {',
    '  width: 18px; height: 18px; fill: none;',
    '  stroke: currentColor; stroke-width: 1.7; stroke-linecap: round;',
    '}'
  ].join('')
  document.head.appendChild(style)

  var gearButton = document.createElement('button')
  gearButton.id = 'vexpaer-glass-gear'
  gearButton.type = 'button'
  gearButton.title = '液态玻璃参数设置'
  gearButton.setAttribute('aria-label', '打开液态玻璃参数设置面板')
  gearButton.setAttribute('data-liquid-glass-exclude', '')
  gearButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<circle cx="12" cy="12" r="3.2"/>'
    + '<path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6'
    + 'M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/>'
    + '</svg>'

  var toggleButton = document.createElement('button')
  toggleButton.id = 'vexpaer-glass-toggle'
  toggleButton.type = 'button'
  toggleButton.setAttribute('data-liquid-glass-exclude', '')
  toggleButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<circle cx="12" cy="12" r="8.2"/>'
    + '<path d="M7.6 9.4a5.4 5.4 0 0 1 3.2-2.5"/>'
    + '</svg>'

  settingsMenu.appendChild(toggleButton)
  settingsMenu.appendChild(gearButton)

  function syncButtons () {
    var on = Boolean(glass)
    toggleButton.classList.toggle('is-on', on)
    toggleButton.title = on ? '关闭液态玻璃' : '开启液态玻璃'
    toggleButton.setAttribute('aria-label', toggleButton.title)
    toggleButton.setAttribute('aria-pressed', on ? 'true' : 'false')
    gearButton.classList.toggle('is-visible', on)
  }

  // ---------------------------------------------------------- 持久化

  function readSavedSettings () {
    try {
      var raw = window.localStorage.getItem(SETTINGS_KEY)
      if (!raw) return null
      var parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? parsed : null
    } catch (error) {
      return null
    }
  }

  function scheduleSave (settings) {
    window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(function () {
      try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
      } catch (error) {}
    }, 200)
  }

  function remember (enabled) {
    try {
      window.localStorage.setItem(ENABLED_KEY, enabled ? '1' : '0')
    } catch (error) {}
  }

  // ---------------------------------------------------------- 开与关

  function enable () {
    if (glass || loading) return
    loading = true

    if (!cssInjected) {
      var link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = VENDOR + 'liquid-glass.css'
      document.head.appendChild(link)
      cssInjected = true
    }

    Promise.all([
      import(VENDOR + 'liquid-glass.js'),
      import(VENDOR + 'liquid-glass-panel.js')
    ]).then(function (modules) {
      loading = false
      var LiquidGlass = modules[0].LiquidGlass
      var LiquidGlassPanel = modules[1].LiquidGlassPanel
      glass = new LiquidGlass({
        settings: readSavedSettings() || {},
        position: {
          centerX: window.innerWidth * 0.5,
          centerY: window.innerHeight * 0.34
        }
      })
      glass.onSettingsChange = scheduleSave
      panel = new LiquidGlassPanel(glass)
      remember(true)
      syncButtons()
    }).catch(function (error) {
      loading = false
      remember(false)
      syncButtons()
      if (window.console && console.warn) {
        console.warn('液态玻璃加载失败(需要支持 WebGL2 的浏览器):', error)
      }
    })
  }

  function disable () {
    if (panel) {
      panel.destroy()
      panel = null
    }
    if (glass) {
      glass.destroy()
      glass = null
    }
    remember(false)
    syncButtons()
  }

  toggleButton.addEventListener('click', function () {
    if (glass) disable()
    else enable()
  })

  gearButton.addEventListener('click', function () {
    if (!panel) return
    if (panel.visible) {
      panel.close()
      return
    }
    // 传入视口右下角,openAt 会自动收拢进可视范围。
    panel.openAt(window.innerWidth, window.innerHeight)
  })

  syncButtons()

  // 上次开着就自动恢复;延迟一拍,别和文章首屏渲染抢时间。
  var wasEnabled = false
  try {
    wasEnabled = window.localStorage.getItem(ENABLED_KEY) === '1'
  } catch (error) {}
  if (wasEnabled) {
    window.setTimeout(enable, 650)
  }
})()
