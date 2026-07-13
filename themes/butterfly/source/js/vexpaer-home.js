(function () {
  'use strict'

  var root = document.getElementById('vexpaer-home')
  var canvas = document.getElementById('vexpaer-home-canvas')
  var webglCanvas = document.getElementById('vexpaer-home-webgl')
  var button = document.getElementById('vexpaer-scene-toggle')
  if (!root || !canvas || !button) return

  var context = canvas.getContext('2d', { alpha: false })
  if (!context) return

  var themes = ['dusk', 'space', 'life']
  var themeMeta = {
    dusk: { label: '暮野', icon: '◒' },
    space: { label: '深空', icon: '✦' },
    life: { label: '生命游戏', icon: '▦' }
  }
  var storageKey = 'immersive-scene-theme'
  var width = 1
  var height = 1
  var pixelRatio = 1
  var visible = true
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  var stars = []
  var grass = []
  var fireflies = []
  var life = []
  var lifeColumns = 0
  var lifeRows = 0
  var lifeCell = 14
  var lastLifeStep = 0
  var lastFrame = 0
  var switching = false
  var pointerX = -10000
  var pointerY = -10000
  var pointerActive = false
  var lifePainting = false
  var lifePaintValue = 1
  var lastLifeCell = null
  var threeLayer = null

  function randomFactory (seed) {
    return function () {
      seed |= 0
      seed = seed + 0x6D2B79F5 | 0
      var value = Math.imul(seed ^ seed >>> 15, 1 | seed)
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value
      return ((value ^ value >>> 14) >>> 0) / 4294967296
    }
  }

  function readTheme () {
    try {
      var stored = window.localStorage.getItem(storageKey)
      if (themes.indexOf(stored) !== -1) return stored
    } catch (error) {}
    return 'dusk'
  }

  var activeTheme = readTheme()

  function resetSpaceTitleLayout () {
    root.style.removeProperty('--vexpaer-title-x')
    root.style.removeProperty('--vexpaer-title-y')
    delete root.dataset.galaxyLayout
    delete root.dataset.galaxyCenter
    delete root.dataset.duskTitleLayout
  }

  function applyDuskTitleLayout () {
    var layouts = width < 720
      ? [[50, 27], [50, 38]]
      : [[24, 28], [72, 29], [22, 54]]
    var layout = layouts[Math.floor(Math.random() * layouts.length)]
    var jitter = width < 720 ? 3 : 4
    root.style.setProperty('--vexpaer-title-x', (layout[0] + (Math.random() - 0.5) * jitter).toFixed(2) + '%')
    root.style.setProperty('--vexpaer-title-y', (layout[1] + (Math.random() - 0.5) * jitter).toFixed(2) + '%')
    root.dataset.duskTitleLayout = layout[0] + '-' + layout[1]
  }

  function nextTheme () {
    return themes[(themes.indexOf(activeTheme) + 1) % themes.length]
  }

  function updateButton () {
    var current = themeMeta[activeTheme]
    var next = themeMeta[nextTheme()]
    var icon = button.querySelector('.vexpaer-scene-toggle__icon')
    if (icon) icon.textContent = current.icon
    button.setAttribute('aria-label', '当前背景：' + current.label + '。点击切换到' + next.label)
    root.setAttribute('data-scene', activeTheme)
  }

  function commitTheme (theme) {
    if (themes.indexOf(theme) === -1) return
    var previousTheme = activeTheme
    activeTheme = theme
    if (theme !== 'space') resetSpaceTitleLayout()
    if (theme === 'dusk') applyDuskTitleLayout()
    if (theme === 'life' && !life.length) seedLife()
    stopLifePainting()
    try {
      window.localStorage.setItem(storageKey, theme)
    } catch (error) {}
    updateButton()
    if (threeLayer) threeLayer.setTheme(theme, previousTheme)
    draw(performance.now())
  }

  function setTheme (theme) {
    if (themes.indexOf(theme) === -1 || switching || theme === activeTheme) return
    if (reducedMotion.matches) {
      commitTheme(theme)
      return
    }

    switching = true
    button.disabled = true
    root.classList.add('is-switching')
    window.setTimeout(function () {
      commitTheme(theme)
      window.requestAnimationFrame(function () {
        root.classList.remove('is-switching')
        button.disabled = false
        switching = false
      })
    }, 210)
  }

  function rebuildParticles () {
    var random = randomFactory(42)
    var starCount = Math.min(620, Math.max(220, Math.round(width * height / 3200)))
    var grassCount = Math.min(420, Math.max(180, Math.round(width / 3.4)))
    var fireflyCount = Math.min(90, Math.max(36, Math.round(width / 17)))

    stars = []
    for (var index = 0; index < starCount; index++) {
      stars.push({
        x: random(),
        y: random(),
        radius: random() > 0.94 ? 1.8 + random() * 1.8 : 0.35 + random() * 1.25,
        alpha: 0.08 + Math.pow(random(), 2.25) * 1.08,
        phase: random() * Math.PI * 2,
        speed: 0.25 + random() * 0.8
      })
    }

    grass = []
    for (var blade = 0; blade < grassCount; blade++) {
      grass.push({
        x: random(),
        depth: random(),
        height: 0.4 + random() * 0.8,
        phase: random() * Math.PI * 2,
        shade: random()
      })
    }

    fireflies = []
    for (var light = 0; light < fireflyCount; light++) {
      fireflies.push({
        x: random(),
        y: 0.05 + random() * 0.68,
        radius: 0.7 + random() * 1.8,
        phase: random() * Math.PI * 2,
        drift: 0.3 + random() * 0.9
      })
    }
  }

  function seedLife () {
    lifeCell = Math.max(14, Math.min(26, Math.round(width / 82 * 1.5)))
    lifeColumns = Math.max(1, Math.ceil(width / lifeCell))
    lifeRows = Math.max(1, Math.ceil(height / lifeCell))
    var random = randomFactory(703)
    life = new Uint8Array(lifeColumns * lifeRows)
    for (var index = 0; index < life.length; index++) {
      life[index] = random() > 0.72 ? 1 : 0
    }
    lastLifeStep = 0
  }

  function resize () {
    var bounds = root.getBoundingClientRect()
    width = Math.max(1, Math.round(bounds.width))
    height = Math.max(1, Math.round(bounds.height))
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.65)
    canvas.width = Math.round(width * pixelRatio)
    canvas.height = Math.round(height * pixelRatio)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    rebuildParticles()
    seedLife()
    if (threeLayer) threeLayer.resize(width, height, pixelRatio)
    draw(performance.now())
  }

  function fillBackground (top, bottom) {
    var gradient = context.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, top)
    gradient.addColorStop(1, bottom)
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)
  }

  function drawMountains (base, color, peaks) {
    context.beginPath()
    context.moveTo(0, height)
    context.lineTo(0, base)
    for (var index = 0; index < peaks.length; index++) {
      context.lineTo(peaks[index][0] * width, peaks[index][1] * height)
    }
    context.lineTo(width, base)
    context.lineTo(width, height)
    context.closePath()
    context.fillStyle = color
    context.fill()
  }

  function drawDusk (time) {
    if (threeLayer && threeLayer.hasDuskScene) {
      fillBackground('#37165d', '#ff7c61')
      return
    }
    // Multi-stop sky gradient: deep indigo top → warm purple mid → amber-pink horizon
    var skyGradient = context.createLinearGradient(0, 0, 0, height)
    skyGradient.addColorStop(0, '#0a0a2e')
    skyGradient.addColorStop(0.18, '#1a1145')
    skyGradient.addColorStop(0.38, '#2d1b4e')
    skyGradient.addColorStop(0.55, '#4a2248')
    skyGradient.addColorStop(0.7, '#7a3b3f')
    skyGradient.addColorStop(0.82, '#c46a42')
    skyGradient.addColorStop(0.92, '#e8a04e')
    skyGradient.addColorStop(1, '#d4783a')
    context.fillStyle = skyGradient
    context.fillRect(0, 0, width, height)

    // Sun with multi-layer godray glow
    var sunX = width * 0.3
    var sunY = height * 0.22
    var sunRadius = Math.max(42, Math.min(width, height) * 0.065)
    var seconds = time * 0.001
    var sunPulse = 1 + Math.sin(seconds * 0.4) * 0.04

    // Outermost haze
    var glow4 = context.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 7 * sunPulse)
    glow4.addColorStop(0, 'rgba(255, 190, 100, .08)')
    glow4.addColorStop(0.4, 'rgba(255, 140, 60, .03)')
    glow4.addColorStop(1, 'rgba(255, 100, 50, 0)')
    context.fillStyle = glow4
    context.fillRect(0, 0, width, height)

    // Warm godray layer
    var glow3 = context.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 4.8 * sunPulse)
    glow3.addColorStop(0, 'rgba(255, 200, 120, .18)')
    glow3.addColorStop(0.3, 'rgba(250, 160, 90, .08)')
    glow3.addColorStop(1, 'rgba(245, 130, 70, 0)')
    context.fillStyle = glow3
    context.fillRect(sunX - sunRadius * 5, sunY - sunRadius * 5, sunRadius * 10, sunRadius * 10)

    // Inner corona
    var glow2 = context.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.8 * sunPulse)
    glow2.addColorStop(0, 'rgba(255, 220, 160, .48)')
    glow2.addColorStop(0.5, 'rgba(245, 180, 110, .14)')
    glow2.addColorStop(1, 'rgba(245, 164, 101, 0)')
    context.fillStyle = glow2
    context.fillRect(sunX - sunRadius * 3, sunY - sunRadius * 3, sunRadius * 6, sunRadius * 6)

    // Sun body with warm gradient
    var sunBody = context.createRadialGradient(sunX - sunRadius * 0.15, sunY - sunRadius * 0.15, 0, sunX, sunY, sunRadius)
    sunBody.addColorStop(0, '#f5c882')
    sunBody.addColorStop(0.6, '#e09a55')
    sunBody.addColorStop(1, '#c87a3a')
    context.beginPath()
    context.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
    context.fillStyle = sunBody
    context.fill()

    // Scattered stars in the upper dark sky
    for (var si = 0; si < stars.length; si++) {
      var duskStar = stars[si]
      if (duskStar.y > 0.4) continue
      var duskStarAlpha = duskStar.alpha * 0.35 * (0.5 + Math.sin(seconds * duskStar.speed + duskStar.phase) * 0.5) * (1 - duskStar.y / 0.4)
      if (duskStarAlpha < 0.02) continue
      context.beginPath()
      context.arc(duskStar.x * width, duskStar.y * height, Math.max(0.3, duskStar.radius * 0.5), 0, Math.PI * 2)
      context.fillStyle = 'rgba(220, 215, 240, ' + duskStarAlpha + ')'
      context.fill()
    }

    // Three mountain layers with richer colors
    drawMountains(height * 0.52, 'rgba(58, 48, 82, 0.85)', [
      [0.05, 0.46], [0.12, 0.26], [0.22, 0.44], [0.3, 0.2], [0.38, 0.46],
      [0.48, 0.18], [0.56, 0.42], [0.65, 0.16], [0.74, 0.44], [0.82, 0.22], [0.92, 0.48]
    ])
    drawMountains(height * 0.62, '#312e4a', [
      [0.08, 0.48], [0.16, 0.32], [0.24, 0.52], [0.34, 0.28],
      [0.43, 0.54], [0.55, 0.26], [0.64, 0.52], [0.76, 0.3], [0.88, 0.5]
    ])
    drawMountains(height * 0.72, '#1e2436', [
      [0.06, 0.6], [0.18, 0.48], [0.3, 0.65], [0.44, 0.46],
      [0.58, 0.64], [0.72, 0.48], [0.86, 0.6]
    ])

    // Mist layer between mountains and grass
    var mistGradient = context.createLinearGradient(0, height * 0.55, 0, height * 0.78)
    mistGradient.addColorStop(0, 'rgba(180, 140, 120, 0)')
    var mistOpacity = 0.06 + Math.sin(seconds * 0.2) * 0.02
    mistGradient.addColorStop(0.4, 'rgba(180, 150, 135, ' + mistOpacity + ')')
    mistGradient.addColorStop(0.7, 'rgba(150, 130, 145, ' + (mistOpacity * 0.7) + ')')
    mistGradient.addColorStop(1, 'rgba(120, 110, 140, 0)')
    context.fillStyle = mistGradient
    context.fillRect(0, height * 0.55, width, height * 0.25)

    // Grass with 4 color palettes
    var grassPalettes = [
      'rgba(108, 142, 72, .75)',  // emerald green
      'rgba(62, 88, 52, .78)',    // dark forest
      'rgba(145, 158, 68, .7)',   // golden green
      'rgba(38, 62, 42, .8)'      // deep moss
    ]
    var grassHighlights = [
      'rgba(158, 192, 88, .6)',   // bright highlight
      'rgba(120, 155, 62, .65)'   // soft highlight
    ]
    context.lineCap = 'round'
    for (var blade = 0; blade < grass.length; blade++) {
      var item = grass[blade]
      var x = item.x * width
      var base = height * (0.62 + item.depth * 0.42)
      var length = (20 + item.depth * 95) * item.height
      var sway = Math.sin(seconds * 0.7 + item.phase) * (1.5 + item.depth * 4.5)
      sway += Math.sin(seconds * 1.4 + item.phase * 2.3) * (0.5 + item.depth * 1.2)
      var tipX = x + sway
      var tipY = base - length
      if (pointerActive) {
        var grassDx = tipX - pointerX
        var grassDy = tipY - pointerY
        var grassDistance = Math.sqrt(grassDx * grassDx + grassDy * grassDy) || 1
        if (grassDistance < 170) {
          var grassInfluence = 1 - grassDistance / 170
          tipX += grassDx / grassDistance * grassInfluence * 32
          tipY += grassDy / grassDistance * grassInfluence * 10
        }
      }
      context.beginPath()
      context.moveTo(x, base)
      context.quadraticCurveTo(x + sway * 0.35, base - length * 0.5, tipX, tipY)
      var paletteIndex = Math.floor(item.shade * grassPalettes.length) % grassPalettes.length
      context.strokeStyle = item.shade > 0.88 ? grassHighlights[blade % 2] : grassPalettes[paletteIndex]
      context.lineWidth = 0.55 + item.depth * 1.35
      context.stroke()
    }

    // Fireflies with warm halo glow
    for (var light = 0; light < fireflies.length; light++) {
      var firefly = fireflies[light]
      var pulse = 0.35 + Math.sin(seconds * firefly.drift + firefly.phase) * 0.32
      var fireflyX = firefly.x * width + Math.sin(seconds * 0.18 + firefly.phase) * 12
      var fireflyY = firefly.y * height + Math.cos(seconds * 0.15 + firefly.phase) * 8
      if (pointerActive) {
        var fireflyDx = fireflyX - pointerX
        var fireflyDy = fireflyY - pointerY
        var fireflyDistance = Math.sqrt(fireflyDx * fireflyDx + fireflyDy * fireflyDy) || 1
        if (fireflyDistance < 190) {
          var fireflyInfluence = 1 - fireflyDistance / 190
          fireflyX += fireflyDx / fireflyDistance * fireflyInfluence * 42
          fireflyY += fireflyDy / fireflyDistance * fireflyInfluence * 42
          pulse += fireflyInfluence * 0.55
        }
      }
      // Outer halo
      var haloRadius = firefly.radius * 4.5
      var haloAlpha = Math.max(0.01, pulse * 0.12)
      var haloGrad = context.createRadialGradient(fireflyX, fireflyY, 0, fireflyX, fireflyY, haloRadius)
      haloGrad.addColorStop(0, 'rgba(255, 240, 140, ' + haloAlpha + ')')
      haloGrad.addColorStop(0.5, 'rgba(255, 220, 100, ' + (haloAlpha * 0.4) + ')')
      haloGrad.addColorStop(1, 'rgba(255, 200, 80, 0)')
      context.fillStyle = haloGrad
      context.fillRect(fireflyX - haloRadius, fireflyY - haloRadius, haloRadius * 2, haloRadius * 2)
      // Core
      context.beginPath()
      context.arc(fireflyX, fireflyY, firefly.radius, 0, Math.PI * 2)
      var warmShift = Math.sin(seconds * 0.5 + firefly.phase * 3) * 0.5 + 0.5
      var coreR = Math.round(239 + warmShift * 16)
      var coreG = Math.round(222 - warmShift * 30)
      var coreB = Math.round(130 - warmShift * 40)
      context.fillStyle = 'rgba(' + coreR + ', ' + coreG + ', ' + coreB + ', ' + Math.max(0.1, pulse) + ')'
      context.fill()
    }
  }

  function drawSpace (time) {
    fillBackground('#000002', '#020108')
    var seconds = time * 0.001

    // Primary nebula – warm violet-purple
    var nebula = context.createRadialGradient(width * 0.45, height * 0.42, 0, width * 0.45, height * 0.42, Math.max(width, height) * 0.68)
    nebula.addColorStop(0, 'rgba(82, 55, 105, .13)')
    nebula.addColorStop(0.25, 'rgba(62, 42, 85, .08)')
    nebula.addColorStop(0.55, 'rgba(38, 32, 65, .04)')
    nebula.addColorStop(1, 'rgba(3, 2, 7, 0)')
    context.fillStyle = nebula
    context.fillRect(0, 0, width, height)

    // Secondary nebula – cool blue-teal, offset
    var nebula2 = context.createRadialGradient(width * 0.72, height * 0.28, 0, width * 0.72, height * 0.28, Math.max(width, height) * 0.52)
    nebula2.addColorStop(0, 'rgba(45, 65, 100, .08)')
    nebula2.addColorStop(0.4, 'rgba(30, 50, 78, .04)')
    nebula2.addColorStop(1, 'rgba(5, 5, 15, 0)')
    context.fillStyle = nebula2
    context.fillRect(0, 0, width, height)

    // Tertiary nebula – warm amber-rose
    var nebula3 = context.createRadialGradient(width * 0.22, height * 0.68, 0, width * 0.22, height * 0.68, Math.max(width, height) * 0.45)
    nebula3.addColorStop(0, 'rgba(90, 50, 55, .06)')
    nebula3.addColorStop(0.5, 'rgba(60, 35, 50, .03)')
    nebula3.addColorStop(1, 'rgba(10, 5, 8, 0)')
    context.fillStyle = nebula3
    context.fillRect(0, 0, width, height)

    // Distant blue cloud
    var distantCloud = context.createRadialGradient(width * 0.82, height * 0.18, 0, width * 0.82, height * 0.18, Math.max(width, height) * 0.48)
    distantCloud.addColorStop(0, 'rgba(55, 62, 95, .07)')
    distantCloud.addColorStop(0.5, 'rgba(35, 40, 68, .03)')
    distantCloud.addColorStop(1, 'rgba(0, 0, 2, 0)')
    context.fillStyle = distantCloud
    context.fillRect(0, 0, width, height)

    // Background star field
    for (var index = 0; index < stars.length; index++) {
      var star = stars[index]
      var starTwinkle = 0.5 + Math.sin(seconds * star.speed + star.phase) * 0.5
      var alpha = Math.min(1, star.alpha * (0.12 + Math.pow(starTwinkle, 2.3) * 0.98))
      var starX = star.x * width
      var starY = star.y * height
      var starRadius = Math.max(0.35, star.radius * 0.72)
      if (pointerActive) {
        var starDx = starX - pointerX
        var starDy = starY - pointerY
        var starDistance = Math.sqrt(starDx * starDx + starDy * starDy)
        if (starDistance < 170) {
          var starLight = 1 - starDistance / 170
          alpha = Math.min(1, alpha + starLight * 0.34)
          starRadius *= 1 + starLight * 0.42
        }
      }
      // Vary star color temperature
      var starColorPhase = (star.phase * 2.7) % 1
      var starR, starG, starB
      if (starColorPhase < 0.3) { starR = 218; starG = 225; starB = 245; } // cool blue-white
      else if (starColorPhase < 0.6) { starR = 240; starG = 232; starB = 215; } // warm white
      else if (starColorPhase < 0.85) { starR = 210; starG = 215; starB = 230; } // neutral
      else { starR = 255; starG = 210; starB = 180; } // warm amber
      context.beginPath()
      context.arc(starX, starY, starRadius, 0, Math.PI * 2)
      context.fillStyle = 'rgba(' + starR + ', ' + starG + ', ' + starB + ', ' + Math.max(0.025, alpha) + ')'
      context.fill()
    }
  }

  function stepLife () {
    var next = new Uint8Array(life.length)
    for (var row = 0; row < lifeRows; row++) {
      for (var column = 0; column < lifeColumns; column++) {
        var neighbours = 0
        for (var y = -1; y <= 1; y++) {
          for (var x = -1; x <= 1; x++) {
            if (x === 0 && y === 0) continue
            var nearColumn = (column + x + lifeColumns) % lifeColumns
            var nearRow = (row + y + lifeRows) % lifeRows
            neighbours += life[nearRow * lifeColumns + nearColumn]
          }
        }
        var alive = life[row * lifeColumns + column]
        next[row * lifeColumns + column] = neighbours === 3 || (alive && neighbours === 2) ? 1 : 0
      }
    }
    life = next
  }

  function getLifeCell (event) {
    if (!life.length) return null
    var bounds = root.getBoundingClientRect()
    var localX = event.clientX - bounds.left
    var localY = event.clientY - bounds.top
    if (localX < 0 || localY < 0 || localX >= bounds.width || localY >= bounds.height) return null
    var column = Math.min(lifeColumns - 1, Math.floor(localX / bounds.width * lifeColumns))
    var row = Math.min(lifeRows - 1, Math.floor(localY / bounds.height * lifeRows))
    return { column: column, row: row, index: row * lifeColumns + column }
  }

  function paintLifeLine (from, to, value) {
    if (!to) return
    var x0 = from ? from.column : to.column
    var y0 = from ? from.row : to.row
    var x1 = to.column
    var y1 = to.row
    var dx = Math.abs(x1 - x0)
    var sx = x0 < x1 ? 1 : -1
    var dy = -Math.abs(y1 - y0)
    var sy = y0 < y1 ? 1 : -1
    var error = dx + dy

    while (true) {
      life[y0 * lifeColumns + x0] = value
      if (x0 === x1 && y0 === y1) break
      var twiceError = error * 2
      if (twiceError >= dy) {
        error += dy
        x0 += sx
      }
      if (twiceError <= dx) {
        error += dx
        y0 += sy
      }
    }

    lastLifeCell = to
    draw(performance.now())
  }

  function stopLifePainting (event) {
    if (!lifePainting) return
    lifePainting = false
    lastLifeCell = null
    root.classList.remove('is-painting')
    delete root.dataset.lifeBrush
    if (event && root.hasPointerCapture && root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId)
    }
  }

  function drawLife (time) {
    fillBackground('#000000', '#000000')
    var lifeStepInterval = lifePainting ? 360 : 180
    if (!reducedMotion.matches && time - lastLifeStep > lifeStepInterval) {
      stepLife()
      lastLifeStep = time
    }
    if (threeLayer && threeLayer.hasLifeMesh) return
    context.strokeStyle = 'rgba(184, 185, 255, .035)'
    context.lineWidth = 1
    for (var column = 0; column <= lifeColumns; column++) {
      context.beginPath()
      context.moveTo(column * lifeCell, 0)
      context.lineTo(column * lifeCell, height)
      context.stroke()
    }
    for (var row = 0; row <= lifeRows; row++) {
      context.beginPath()
      context.moveTo(0, row * lifeCell)
      context.lineTo(width, row * lifeCell)
      context.stroke()
    }
    var pulse = 0.74 + Math.sin(time * 0.0014) * 0.16
    context.shadowBlur = 10
    context.shadowColor = 'rgba(74, 26, 164, .5)'
    for (var index = 0; index < life.length; index++) {
      if (!life[index]) continue
      var x = (index % lifeColumns) * lifeCell
      var y = Math.floor(index / lifeColumns) * lifeCell
      var progress = ((index % lifeColumns) / Math.max(1, lifeColumns - 1) + Math.floor(index / lifeColumns) / Math.max(1, lifeRows - 1)) * 0.5
      var red = Math.round(82 + (12 - 82) * progress)
      var green = Math.round(20 + (70 - 20) * progress)
      var blue = Math.round(156 + (165 - 156) * progress)
      context.fillStyle = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + pulse + ')'
      context.fillRect(x + 2, y + 2, Math.max(2, lifeCell - 4), Math.max(2, lifeCell - 4))
    }
    context.shadowBlur = 0
  }

  function initThreeLayer (THREE) {
    if (!webglCanvas || !root.isConnected) return

    var renderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: webglCanvas,
        alpha: true,
        antialias: width > 720,
        powerPreference: 'high-performance'
      })
    } catch (error) {
      root.dataset.renderer = 'canvas'
      return
    }

    renderer.setClearColor(0x000000, 0)
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace

    var scene = new THREE.Scene()
    var aspect = width / Math.max(1, height)
    var camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10)
    camera.position.z = 3
    var spaceScene = new THREE.Scene()
    var spaceCamera = new THREE.PerspectiveCamera(43, aspect, 0.1, 80)
    var spaceCameraBase = new THREE.Vector3()
    var spaceCameraLookAt = new THREE.Vector3()
    var spacePointerNdc = new THREE.Vector2()

    // Endless sunset highway. Road chunks are recycled ahead of the moving car,
    // so the route keeps changing without allowing the scene graph to grow forever.
    var duskScene = new THREE.Scene()
    duskScene.fog = new THREE.FogExp2('#66516a', 0.01)
    var duskCamera = new THREE.PerspectiveCamera(48, aspect, 0.1, 320)
    var duskRandom = randomFactory((Date.now() ^ 0x6475736b) >>> 0)
    var duskTravel = 0
    var duskLastTime = 0
    var duskElapsed = 0
    var duskCameraTarget = new THREE.Vector3()
    var duskCameraDesired = new THREE.Vector3()
    var duskLookDesired = new THREE.Vector3()

    var duskSky = new THREE.Mesh(new THREE.SphereGeometry(170, 32, 18), new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uZenith: { value: new THREE.Color('#37165d') },
        uUpper: { value: new THREE.Color('#8e4085') },
        uHorizon: { value: new THREE.Color('#ff7c61') },
        uGlow: { value: new THREE.Color('#ffb06f') }
      },
      vertexShader: ['varying vec3 vLocal;', 'void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'].join('\n'),
      fragmentShader: [
        'uniform vec3 uZenith;uniform vec3 uUpper;uniform vec3 uHorizon;uniform vec3 uGlow;varying vec3 vLocal;',
        'void main(){float h=normalize(vLocal).y;vec3 low=mix(uGlow,uHorizon,smoothstep(-.18,.06,h));',
        'vec3 color=mix(low,uUpper,smoothstep(-.04,.2,h));color=mix(color,uZenith,smoothstep(.14,.52,h));',
        'float band=sin(h*49.0+normalize(vLocal).x*4.0)*.5+.5;color+=vec3(.12,.025,.08)*band*smoothstep(.05,.5,h)*.12;',
        'gl_FragColor=vec4(color,1.0);}'
      ].join('\n')
    }))
    duskScene.add(duskSky)

    var duskSun = new THREE.Mesh(new THREE.SphereGeometry(6.5, 24, 16), new THREE.MeshBasicMaterial({ color: '#ffd29b', fog: false }))
    duskScene.add(duskSun)

    var duskGroundGeometry = new THREE.PlaneGeometry(240, 340, 42, 56)
    var duskGroundPosition = duskGroundGeometry.getAttribute('position')
    var duskGroundColors = new Float32Array(duskGroundPosition.count * 3)
    var duskSandLow = new THREE.Color('#715747')
    var duskSandHigh = new THREE.Color('#c18b5f')
    var duskSandColor = new THREE.Color()
    for (var groundIndex = 0; groundIndex < duskGroundPosition.count; groundIndex++) {
      var groundX = duskGroundPosition.getX(groundIndex)
      var groundZ = duskGroundPosition.getY(groundIndex)
      var groundHeight = (Math.sin(groundX * 0.055) * 0.65 + Math.cos(groundZ * 0.042) * 0.5 + Math.sin((groundX + groundZ) * 0.025) * 0.75) * 0.3 - 0.55
      duskGroundPosition.setZ(groundIndex, groundHeight)
      duskSandColor.copy(duskSandLow).lerp(duskSandHigh, Math.max(0, Math.min(1, (groundHeight + 1.5) / 3)))
      duskGroundColors[groundIndex * 3] = duskSandColor.r
      duskGroundColors[groundIndex * 3 + 1] = duskSandColor.g
      duskGroundColors[groundIndex * 3 + 2] = duskSandColor.b
    }
    duskGroundGeometry.setAttribute('color', new THREE.BufferAttribute(duskGroundColors, 3))
    duskGroundGeometry.computeVertexNormals()
    var duskGround = new THREE.Mesh(duskGroundGeometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }))
    duskGround.rotation.x = -Math.PI / 2
    duskGround.receiveShadow = true
    duskScene.add(duskGround)
    duskScene.add(new THREE.HemisphereLight('#9188b5', '#66503b', 1.28))
    var duskSunLight = new THREE.DirectionalLight('#ffd8b5', 1.9)
    duskSunLight.position.set(-22, 28, 18)
    duskScene.add(duskSunLight)

    var duskMountainGroup = new THREE.Group()
    var duskMountainMaterials = [
      new THREE.MeshStandardMaterial({ color: '#4b3e57', roughness: 1, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: '#654958', roughness: 1, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: '#76554e', roughness: 1, flatShading: true })
    ]
    for (var mountainIndex = 0; mountainIndex < 14; mountainIndex++) {
      var mountain = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 5 + Math.floor(duskRandom() * 3)), duskMountainMaterials[mountainIndex % duskMountainMaterials.length])
      mountain.position.set(-88 + mountainIndex * 13.5 + (duskRandom() - 0.5) * 8, 4 + duskRandom() * 3, (duskRandom() - 0.5) * 30)
      mountain.scale.set(8 + duskRandom() * 9, 11 + duskRandom() * 13, 6 + duskRandom() * 8)
      mountain.rotation.y = duskRandom() * Math.PI
      duskMountainGroup.add(mountain)
    }
    duskScene.add(duskMountainGroup)

    function duskRoadCenter (z) {
      return Math.sin(z * 0.025) * 6.2 + Math.sin(z * 0.009 + 1.4) * 4.3 + Math.sin(z * 0.061) * 1.1
    }

    function duskRoadHeading (z) {
      return Math.atan2(-(duskRoadCenter(z - 1.5) - duskRoadCenter(z + 1.5)), 3)
    }

    var roadLength = 10
    var roadCount = width < 720 ? 24 : 31
    var asphaltGeometry = new THREE.BoxGeometry(7.6, 0.12, roadLength * 1.12)
    var roadLineGeometry = new THREE.BoxGeometry(0.13, 0.025, roadLength * 1.08)
    var roadDashGeometry = new THREE.BoxGeometry(0.14, 0.035, 2.2)
    var asphaltMaterial = new THREE.MeshStandardMaterial({ color: '#24222a', roughness: 0.94 })
    var roadEdgeMaterial = new THREE.MeshBasicMaterial({ color: '#f4d9b2' })
    var roadDashMaterial = new THREE.MeshBasicMaterial({ color: '#e9a94c' })
    var roadSegments = []
    var rockGeometries = [
      new THREE.DodecahedronGeometry(0.8, 0),
      new THREE.IcosahedronGeometry(0.8, 0),
      new THREE.ConeGeometry(0.75, 1.4, 5)
    ]
    var rockMaterials = [
      new THREE.MeshStandardMaterial({ color: '#763a34', roughness: 1, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: '#a45240', roughness: 1, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: '#593036', roughness: 1, flatShading: true })
    ]
    var gravelGeometry = new THREE.DodecahedronGeometry(0.12, 0)
    var cactusMaterial = new THREE.MeshStandardMaterial({ color: '#315e48', roughness: 0.88, flatShading: true })
    var cactusTrunkGeometry = new THREE.CylinderGeometry(0.2, 0.28, 2.8, 7)
    var cactusArmGeometry = new THREE.CylinderGeometry(0.13, 0.17, 1.25, 7)
    var cactusTipGeometry = new THREE.CylinderGeometry(0.12, 0.14, 0.65, 7)
    var signPostGeometry = new THREE.CylinderGeometry(0.07, 0.09, 2.5, 7)
    var signBoardGeometry = new THREE.BoxGeometry(2.2, 1.05, 0.12)
    var campLogGeometry = new THREE.CylinderGeometry(0.1, 0.12, 1.2, 7)
    var campOuterFlameGeometry = new THREE.ConeGeometry(0.48, 1.25, 6)
    var campInnerFlameGeometry = new THREE.ConeGeometry(0.25, 0.78, 6)
    var postMaterial = new THREE.MeshStandardMaterial({ color: '#3b3030', roughness: 0.8 })
    var pumpRedMaterial = new THREE.MeshStandardMaterial({ color: '#c8493e', roughness: 0.65 })
    var warmMaterial = new THREE.MeshBasicMaterial({ color: '#ffad46' })
    var fireMaterial = new THREE.MeshBasicMaterial({ color: '#ff572d' })

    function createRock (random, scale) {
      var type = Math.floor(random() * rockGeometries.length)
      var rock = new THREE.Mesh(rockGeometries[type], rockMaterials[type])
      rock.scale.set(scale * (0.65 + random() * 0.7), scale * (0.55 + random() * 0.9), scale * (0.7 + random() * 0.6))
      rock.rotation.set(random() * 0.35, random() * Math.PI, random() * 0.22)
      return rock
    }

    function createCactus (random) {
      var cactus = new THREE.Group()
      var trunk = new THREE.Mesh(cactusTrunkGeometry, cactusMaterial)
      trunk.position.y = 1.4
      cactus.add(trunk)
      for (var side = -1; side <= 1; side += 2) {
        if (random() < 0.72) {
          var arm = new THREE.Mesh(cactusArmGeometry, cactusMaterial)
          arm.position.set(side * 0.42, 1.35 + random() * 0.65, 0)
          arm.rotation.z = side * (0.72 + random() * 0.18)
          cactus.add(arm)
          var tip = new THREE.Mesh(cactusTipGeometry, cactusMaterial)
          tip.position.set(side * 0.8, arm.position.y + 0.34, 0)
          cactus.add(tip)
        }
      }
      cactus.rotation.y = random() * Math.PI
      return cactus
    }

    function createSignMaterial (textValue, background, foreground) {
      var signCanvas = document.createElement('canvas')
      signCanvas.width = 256
      signCanvas.height = 128
      var signContext = signCanvas.getContext('2d')
      signContext.fillStyle = background
      signContext.fillRect(0, 0, 256, 128)
      signContext.strokeStyle = foreground
      signContext.lineWidth = 7
      signContext.strokeRect(8, 8, 240, 112)
      signContext.fillStyle = foreground
      signContext.font = '700 42px Consolas, monospace'
      signContext.textAlign = 'center'
      signContext.textBaseline = 'middle'
      signContext.fillText(textValue, 128, 67)
      return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) })
    }

    var signMaterials = [
      createSignMaterial('GAS', '#e66b42', '#fff1c7'),
      createSignMaterial('MOTEL', '#5e285b', '#ffd49e'),
      createSignMaterial('WEST', '#ead09e', '#452c35')
    ]

    function createRoadSign (random) {
      var sign = new THREE.Group()
      var post = new THREE.Mesh(signPostGeometry, postMaterial)
      post.position.y = 1.25
      sign.add(post)
      var board = new THREE.Mesh(signBoardGeometry, signMaterials[Math.floor(random() * signMaterials.length)])
      board.position.y = 2.55
      sign.add(board)
      return sign
    }

    function createCampfire () {
      var campfire = new THREE.Group()
      for (var logIndex = 0; logIndex < 3; logIndex++) {
        var log = new THREE.Mesh(campLogGeometry, postMaterial)
        log.rotation.z = Math.PI / 2
        log.rotation.y = logIndex * Math.PI / 3
        log.position.y = 0.16
        campfire.add(log)
      }
      var flame = new THREE.Mesh(campOuterFlameGeometry, fireMaterial)
      flame.position.y = 0.72
      flame.userData.flame = true
      campfire.add(flame)
      var inner = new THREE.Mesh(campInnerFlameGeometry, warmMaterial)
      inner.position.y = 0.62
      inner.userData.flame = true
      campfire.add(inner)
      var fireLight = new THREE.PointLight('#ff743b', 3.5, 12)
      fireLight.position.y = 1.3
      fireLight.userData.fireLight = true
      campfire.add(fireLight)
      campfire.userData.campfire = true
      return campfire
    }

    function createGasStation (random) {
      var station = new THREE.Group()
      var wallMaterial = new THREE.MeshStandardMaterial({ color: '#dca47d', roughness: 0.9 })
      var roofMaterial = new THREE.MeshStandardMaterial({ color: '#a63e36', roughness: 0.72 })
      var glassMaterial = new THREE.MeshStandardMaterial({ color: '#25334a', roughness: 0.22, metalness: 0.3 })
      var building = new THREE.Mesh(new THREE.BoxGeometry(7.5, 3.3, 4.2), wallMaterial)
      building.position.set(0, 1.65, -2.5)
      station.add(building)
      var windowMesh = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.5, 0.08), glassMaterial)
      windowMesh.position.set(0, 1.75, -0.36)
      station.add(windowMesh)
      var canopy = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.35, 4.6), roofMaterial)
      canopy.position.set(0, 4.1, 2.4)
      station.add(canopy)
      for (var columnIndex = -1; columnIndex <= 1; columnIndex += 2) {
        var canopyPost = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 4, 8), postMaterial)
        canopyPost.position.set(columnIndex * 3.5, 2, 2.4)
        station.add(canopyPost)
        var pump = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.55, 0.7), columnIndex < 0 ? pumpRedMaterial : roadDashMaterial)
        pump.position.set(columnIndex * 1.7, 0.78, 2.25)
        station.add(pump)
      }
      var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 6.2, 8), postMaterial)
      pole.position.set(5.6, 3.1, 0)
      station.add(pole)
      var gasSign = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.18), signMaterials[0])
      gasSign.position.set(5.6, 6.3, 0)
      station.add(gasSign)
      station.rotation.y = random() > 0.5 ? 0.08 : -0.08
      return station
    }

    function populateRoadside (segment, worldZ) {
      var propRoot = segment.userData.props
      while (propRoot.children.length) propRoot.remove(propRoot.children[propRoot.children.length - 1])
      var segmentNumber = Math.round(-worldZ / roadLength)
      var random = randomFactory((segmentNumber * 2654435761) >>> 0)
      if (Math.abs(segmentNumber) % 37 === 11) {
        var stationSide = random() > 0.5 ? 1 : -1
        var station = createGasStation(random)
        station.position.set(stationSide * 11.8, 0.05, 0)
        station.rotation.y += stationSide < 0 ? Math.PI : 0
        propRoot.add(station)
      } else {
        var propCount = Math.floor(random() * 3)
        for (var propIndex = 0; propIndex < propCount; propIndex++) {
          var side = random() > 0.5 ? 1 : -1
          var roll = random()
          var prop
          if (roll < 0.52) prop = createRock(random, 0.55 + random() * 2.6)
          else if (roll < 0.91) {
            prop = createCactus(random)
            prop.scale.setScalar(0.7 + random() * 1.15)
          } else if (roll < 0.98) prop = createRoadSign(random)
          else prop = createCampfire()
          prop.position.set(side * (5.4 + random() * 19), 0.12, (random() - 0.5) * 7.5)
          propRoot.add(prop)
        }
      }
      if (Math.abs(segmentNumber) % 4 === 0) {
        var distantSide = random() > 0.5 ? 1 : -1
        var distantRock = createRock(random, 5 + random() * 6)
        distantRock.position.set(distantSide * (31 + random() * 24), 1.2, (random() - 0.5) * 8)
        distantRock.scale.x *= 1.5 + random()
        propRoot.add(distantRock)
      }
      var gravelCount = 1 + Math.floor(random() * 4)
      for (var gravelIndex = 0; gravelIndex < gravelCount; gravelIndex++) {
        var gravelSide = random() > 0.5 ? 1 : -1
        var gravel = new THREE.Mesh(gravelGeometry, rockMaterials[Math.floor(random() * rockMaterials.length)])
        var gravelScale = 0.45 + random() * 1.2
        gravel.scale.set(gravelScale, gravelScale * 0.65, gravelScale)
        gravel.position.set(gravelSide * (4.4 + random() * 7.5), 0.08, (random() - 0.5) * 8.5)
        gravel.rotation.y = random() * Math.PI
        propRoot.add(gravel)
      }
    }

    function positionRoadSegment (segment, worldZ) {
      segment.userData.worldZ = worldZ
      segment.position.set(duskRoadCenter(worldZ), 0.12, worldZ)
      segment.rotation.y = duskRoadHeading(worldZ)
      populateRoadside(segment, worldZ)
    }

    for (var roadIndex = 0; roadIndex < roadCount; roadIndex++) {
      var roadGroup = new THREE.Group()
      roadGroup.add(new THREE.Mesh(asphaltGeometry, asphaltMaterial))
      for (var edgeSide = -1; edgeSide <= 1; edgeSide += 2) {
        var edgeLine = new THREE.Mesh(roadLineGeometry, roadEdgeMaterial)
        edgeLine.position.set(edgeSide * 3.42, 0.08, 0)
        roadGroup.add(edgeLine)
      }
      for (var dashIndex = -1; dashIndex <= 1; dashIndex += 2) {
        var dash = new THREE.Mesh(roadDashGeometry, roadDashMaterial)
        dash.position.set(0, 0.09, dashIndex * 2.7)
        roadGroup.add(dash)
      }
      var props = new THREE.Group()
      roadGroup.userData.props = props
      roadGroup.add(props)
      positionRoadSegment(roadGroup, 40 - roadIndex * roadLength)
      roadSegments.push(roadGroup)
      duskScene.add(roadGroup)
    }
    root.dataset.duskRoadSegments = String(roadCount)

    var car = new THREE.Group()
    var carRedMaterial = new THREE.MeshStandardMaterial({ color: '#c82f34', roughness: 0.4, metalness: 0.4 })
    var carDarkRedMaterial = new THREE.MeshStandardMaterial({ color: '#771d28', roughness: 0.5, metalness: 0.3 })
    var carGlassMaterial = new THREE.MeshStandardMaterial({ color: '#171b2b', roughness: 0.14, metalness: 0.55 })
    var tireMaterial = new THREE.MeshStandardMaterial({ color: '#101014', roughness: 0.9 })
    var chromeMaterial = new THREE.MeshStandardMaterial({ color: '#c8bdad', roughness: 0.3, metalness: 0.72 })
    var hubMaterial = new THREE.MeshStandardMaterial({ color: '#e2c8a7', roughness: 0.38, metalness: 0.62 })
    var carBody = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.58, 4.1), carRedMaterial)
    carBody.position.y = 0.78
    car.add(carBody)
    var carHood = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.28, 1.45), carDarkRedMaterial)
    carHood.position.set(0, 1.1, -1.25)
    car.add(carHood)
    var carCabin = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.72, 1.75), carGlassMaterial)
    carCabin.position.set(0, 1.35, 0.18)
    car.add(carCabin)
    var carRoof = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.16, 1.45), carRedMaterial)
    carRoof.position.set(0, 1.76, 0.2)
    car.add(carRoof)
    var wheelGeometry = new THREE.CylinderGeometry(0.43, 0.43, 0.34, 12)
    var hubGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.37, 10)
    for (var wheelX = -1; wheelX <= 1; wheelX += 2) {
      for (var wheelZ = -1; wheelZ <= 1; wheelZ += 2) {
        var wheel = new THREE.Mesh(wheelGeometry, tireMaterial)
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(wheelX * 1.08, 0.5, wheelZ * 1.35)
        wheel.userData.wheel = true
        car.add(wheel)
        var hub = new THREE.Mesh(hubGeometry, hubMaterial)
        hub.rotation.z = Math.PI / 2
        hub.position.copy(wheel.position)
        car.add(hub)
      }
    }
    var tailLightMaterial = new THREE.MeshBasicMaterial({ color: '#ff3d35' })
    for (var tailSide = -1; tailSide <= 1; tailSide += 2) {
      var tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.08), tailLightMaterial)
      tailLight.position.set(tailSide * 0.68, 0.86, 2.08)
      car.add(tailLight)
      var headLight = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.08), new THREE.MeshBasicMaterial({ color: '#fff0b8' }))
      headLight.position.set(tailSide * 0.68, 0.86, -2.08)
      car.add(headLight)
      var mirror = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.36), carRedMaterial)
      mirror.position.set(tailSide * 1.08, 1.34, -0.05)
      car.add(mirror)
    }
    var rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.16, 0.16), chromeMaterial)
    rearBumper.position.set(0, 0.54, 2.14)
    car.add(rearBumper)
    var frontBumper = rearBumper.clone()
    frontBumper.position.z = -2.14
    car.add(frontBumper)
    var licensePlate = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.25, 0.05), new THREE.MeshBasicMaterial({ color: '#f7df9b' }))
    licensePlate.position.set(0, 0.72, 2.24)
    car.add(licensePlate)
    var exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 8), chromeMaterial)
    exhaustPipe.rotation.x = Math.PI / 2
    exhaustPipe.position.set(0.52, 0.46, 2.25)
    car.add(exhaustPipe)
    car.scale.setScalar(0.78)
    duskScene.add(car)

    var nextDuskBump = 3 + duskRandom() * 5
    var duskBumpAge = 99
    var duskBumpStrength = 0

    var exhaustGeometry = new THREE.SphereGeometry(0.42, 6, 5)
    var exhaustMaterial = new THREE.MeshBasicMaterial({ color: '#f4f1e8' })
    var exhaustPuffs = []
    var nextExhaust = 1.5 + duskRandom() * 2.2

    function spawnExhaust () {
      car.updateMatrixWorld()
      var puff = new THREE.Mesh(exhaustGeometry, exhaustMaterial)
      puff.position.copy(car.localToWorld(new THREE.Vector3(0.45, 0.58, 2.3)))
      puff.scale.setScalar(0.32)
      puff.userData.age = 0
      puff.userData.drift = (duskRandom() - 0.5) * 0.18
      duskScene.add(puff)
      exhaustPuffs.push(puff)
    }

    var tumbleweedGeometry = new THREE.IcosahedronGeometry(0.75, 1)
    var tumbleweedMaterial = new THREE.MeshBasicMaterial({ color: '#6f432c', wireframe: true })
    var tumbleweeds = []
    var nextTumbleweed = 7 + duskRandom() * 13

    function spawnTumbleweed (carZ) {
      var side = duskRandom() > 0.5 ? 1 : -1
      var tumbleweed = new THREE.Mesh(tumbleweedGeometry, tumbleweedMaterial)
      tumbleweed.position.set(duskRoadCenter(carZ - 35) + side * 23, 0.82, carZ - 28 - duskRandom() * 38)
      tumbleweed.userData.speed = -side * (4.5 + duskRandom() * 3.5)
      tumbleweed.userData.baseY = 0.72 + duskRandom() * 0.25
      tumbleweeds.push(tumbleweed)
      duskScene.add(tumbleweed)
    }

    var cloudGeometry = new THREE.IcosahedronGeometry(1.25, 1)
    var cloudMaterial = new THREE.MeshStandardMaterial({ color: '#f3c4c6', roughness: 1, flatShading: true })
    var duskClouds = []
    for (var cloudIndex = 0; cloudIndex < 11; cloudIndex++) {
      var cloud = new THREE.Group()
      var lobeCount = 3 + Math.floor(duskRandom() * 4)
      for (var lobeIndex = 0; lobeIndex < lobeCount; lobeIndex++) {
        var lobe = new THREE.Mesh(cloudGeometry, cloudMaterial)
        lobe.position.set((lobeIndex - lobeCount / 2) * 1.45, duskRandom() * 0.65, (duskRandom() - 0.5) * 0.8)
        lobe.scale.set(1.2 + duskRandom() * 1.25, 0.65 + duskRandom() * 0.55, 0.85 + duskRandom() * 0.75)
        cloud.add(lobe)
      }
      cloud.position.set((duskRandom() - 0.5) * 110, 13 + duskRandom() * 14, -20 - duskRandom() * 220)
      cloud.userData.speed = 0.08 + duskRandom() * 0.16
      duskClouds.push(cloud)
      duskScene.add(cloud)
    }

    function configureDuskCamera () {
      duskCamera.aspect = aspect
      duskCamera.fov = width < 720 ? 58 : 48
      duskCamera.updateProjectionMatrix()
      if (!duskLastTime) {
        duskCamera.position.set(duskRoadCenter(0), 10.3, 15)
        duskCameraTarget.set(duskRoadCenter(-11), 0.8, -11)
        duskCamera.lookAt(duskCameraTarget)
      }
    }

    function updateDusk (time) {
      var delta = duskLastTime ? Math.min(0.05, (time - duskLastTime) / 1000) : 0.016
      duskLastTime = time
      duskElapsed += delta
      duskTravel += delta * (width < 720 ? 5.2 : 6.6)
      root.dataset.duskDistance = Math.floor(duskTravel).toString()
      var carZ = -duskTravel
      var carX = duskRoadCenter(carZ)
      var heading = duskRoadHeading(carZ)
      if (duskElapsed >= nextDuskBump) {
        duskBumpAge = 0
        duskBumpStrength = 0.2 + duskRandom() * 0.25
        nextDuskBump = duskElapsed + 3.5 + duskRandom() * 6.5
      }
      duskBumpAge += delta
      var regularBounce = Math.sin(duskTravel * 2.8) * 0.035 + Math.sin(duskTravel * 5.1) * 0.012
      var largeBounce = duskBumpStrength * Math.exp(-duskBumpAge * 2.8) * Math.abs(Math.sin(duskBumpAge * 11.5))
      car.position.set(carX, 0.18 + regularBounce + largeBounce, carZ)
      car.rotation.set(-largeBounce * 0.13 + Math.sin(duskTravel * 2.8) * 0.008, heading, Math.sin(duskTravel * 1.9) * 0.012)
      for (var childIndex = 0; childIndex < car.children.length; childIndex++) {
        if (car.children[childIndex].userData.wheel) car.children[childIndex].rotation.x -= delta * 9
      }

      var minimumRoadZ = Infinity
      for (var roadIndex = 0; roadIndex < roadSegments.length; roadIndex++) minimumRoadZ = Math.min(minimumRoadZ, roadSegments[roadIndex].userData.worldZ)
      for (var recycleIndex = 0; recycleIndex < roadSegments.length; recycleIndex++) {
        var roadSegment = roadSegments[recycleIndex]
        if (roadSegment.userData.worldZ > carZ + 45) {
          minimumRoadZ -= roadLength
          positionRoadSegment(roadSegment, minimumRoadZ)
        }
        var propChildren = roadSegment.userData.props.children
        for (var propIndex = 0; propIndex < propChildren.length; propIndex++) {
          var prop = propChildren[propIndex]
          if (prop.userData.campfire) {
            for (var fireIndex = 0; fireIndex < prop.children.length; fireIndex++) {
              var fireChild = prop.children[fireIndex]
              if (fireChild.userData.flame) fireChild.scale.y = 0.84 + Math.sin(time * 0.009 + fireIndex) * 0.2
              if (fireChild.userData.fireLight) fireChild.intensity = 3.1 + Math.sin(time * 0.012) * 0.7
            }
          }
        }
      }

      if (duskElapsed >= nextExhaust) {
        spawnExhaust()
        nextExhaust = duskElapsed + 2.2 + duskRandom() * 2.7
      }
      for (var puffIndex = exhaustPuffs.length - 1; puffIndex >= 0; puffIndex--) {
        var puff = exhaustPuffs[puffIndex]
        puff.userData.age += delta
        puff.position.y += delta * 0.24
        puff.position.x += puff.userData.drift * delta
        puff.scale.setScalar(0.32 + puff.userData.age * 0.18)
        if (puff.userData.age > 4.2 || puff.position.z > carZ + 18) {
          duskScene.remove(puff)
          exhaustPuffs.splice(puffIndex, 1)
        }
      }
      root.dataset.duskExhaustCount = String(exhaustPuffs.length)

      if (duskElapsed >= nextTumbleweed) {
        if (duskRandom() < 0.28) spawnTumbleweed(carZ)
        nextTumbleweed = duskElapsed + 8 + duskRandom() * 16
      }
      for (var tumbleIndex = tumbleweeds.length - 1; tumbleIndex >= 0; tumbleIndex--) {
        var tumbleweed = tumbleweeds[tumbleIndex]
        tumbleweed.position.x += tumbleweed.userData.speed * delta
        tumbleweed.position.y = tumbleweed.userData.baseY + Math.abs(Math.sin(time * 0.004 + tumbleIndex)) * 0.42
        tumbleweed.rotation.x += delta * 4.2
        tumbleweed.rotation.z += delta * 2.7
        if (Math.abs(tumbleweed.position.x - duskRoadCenter(tumbleweed.position.z)) > 30 || tumbleweed.position.z > carZ + 24) {
          duskScene.remove(tumbleweed)
          tumbleweeds.splice(tumbleIndex, 1)
        }
      }
      root.dataset.duskTumbleweedCount = String(tumbleweeds.length)

      for (var cloudIndex = 0; cloudIndex < duskClouds.length; cloudIndex++) {
        var cloud = duskClouds[cloudIndex]
        cloud.position.x += cloud.userData.speed * delta
        if (cloud.position.z > carZ + 30) {
          cloud.position.z -= 230
          cloud.position.x = (duskRandom() - 0.5) * 110
        }
      }

      duskGround.position.z = carZ - 125
      duskSky.position.set(carX, 0, carZ)
      duskSun.position.set(carX - 42, 21, carZ - 145)
      duskMountainGroup.position.set(carX, 0, carZ - 175)
      var pointerShiftX = pointerActive ? (pointerX / Math.max(1, width) - 0.5) * 1.1 : 0
      var pointerShiftY = pointerActive ? (pointerY / Math.max(1, height) - 0.5) * 0.45 : 0
      var cameraX = carX + Math.sin(heading) * 14 + pointerShiftX
      var cameraZ = carZ + Math.cos(heading) * 15
      var cameraDamping = 1 - Math.exp(-7.5 * delta)
      duskCameraDesired.set(cameraX, 10.3 - pointerShiftY, cameraZ)
      duskLookDesired.set(carX - Math.sin(heading) * 10, 0.8, carZ - Math.cos(heading) * 11)
      duskCamera.position.lerp(duskCameraDesired, cameraDamping)
      duskCameraTarget.lerp(duskLookDesired, cameraDamping)
      duskCamera.lookAt(duskCameraTarget)
    }

    var particleCount = width < 720 ? 360 : ((navigator.hardwareConcurrency || 8) <= 4 ? 480 : 760)
    var random = randomFactory(1989)
    var positions = new Float32Array(particleCount * 3)
    var phases = new Float32Array(particleCount)
    var sizes = new Float32Array(particleCount)

    for (var index = 0; index < particleCount; index++) {
      var offset = index * 3
      positions[offset] = random() * 2 - 1
      positions[offset + 1] = random() * 2 - 1
      positions[offset + 2] = random() * 0.4
      phases[index] = random()
      sizes[index] = 0.55 + random() * 1.15
    }

    var geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    var material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: aspect },
        uPointer: { value: new THREE.Vector2(50, 50) },
        uPointerStrength: { value: 0 },
        uScene: { value: 0 },
        uPointScale: { value: 3.1 },
        uPixelRatio: { value: pixelRatio },
        uOpacity: { value: 0.95 },
        uColorA: { value: new THREE.Color('#ffe7a3') },
        uColorB: { value: new THREE.Color('#a8d878') }
      },
      vertexShader: [
        'uniform float uTime;',
        'uniform float uAspect;',
        'uniform vec2 uPointer;',
        'uniform float uPointerStrength;',
        'uniform float uScene;',
        'uniform float uPointScale;',
        'uniform float uPixelRatio;',
        'attribute float aPhase;',
        'attribute float aSize;',
        'varying float vPhase;',
        'varying float vInfluence;',
        'void main() {',
        '  vec3 p = position;',
        '  p.x *= uAspect;',
        '  if (uScene < 0.5) p.y = p.y * 0.66 - 0.12;',
        '  p.x += sin(uTime * 0.38 + aPhase * 19.0) * 0.018;',
        '  p.y += cos(uTime * 0.31 + aPhase * 23.0) * 0.024;',
        '  vec2 delta = p.xy - uPointer;',
        '  float distanceToPointer = max(length(delta), 0.001);',
        '  float influence = (1.0 - smoothstep(0.0, 0.55, distanceToPointer)) * uPointerStrength;',
        '  vec2 direction = delta / distanceToPointer;',
        '  if (uScene < 0.5) {',
        '    p.xy += direction * influence * 0.18;',
        '    p.y += influence * 0.045;',
        '  }',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);',
        '  gl_PointSize = aSize * uPointScale * uPixelRatio * (1.0 + influence * 0.9);',
        '  vPhase = aPhase;',
        '  vInfluence = influence;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColorA;',
        'uniform vec3 uColorB;',
        'uniform float uOpacity;',
        'varying float vPhase;',
        'varying float vInfluence;',
        'void main() {',
        '  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));',
        '  float glow = 1.0 - smoothstep(0.08, 0.5, distanceToCenter);',
        '  float twinkle = 0.45 + 0.55 * sin(vPhase * 31.0) * sin(vPhase * 31.0);',
        '  vec3 color = mix(uColorA, uColorB, fract(vPhase * 4.7));',
        '  color = mix(color, vec3(1.0), vInfluence * 0.65);',
        '  gl_FragColor = vec4(color, glow * (twinkle + vInfluence * 0.45) * uOpacity);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    })

    var points = new THREE.Points(geometry, material)
    points.frustumCulled = false
    scene.add(points)

    var galaxyGroup = new THREE.Group()
    var galaxyStars = null
    var galaxyHaze = null
    var galaxyDust = null
    var galaxyConfig = null
    var galaxyTierName = ''
    var galaxySeed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
    galaxyGroup.visible = false
    spaceScene.add(galaxyGroup)

    var galaxyVertexShader = [
      'uniform float uTime;',
      'uniform float uPixelRatio;',
      'uniform float uPointScale;',
      'uniform float uMaxPointSize;',
      'uniform vec2 uPointer;',
      'uniform float uPointerStrength;',
      'uniform float uPointerResponse;',
      'uniform float uViewportAspect;',
      'attribute float aPhase;',
      'attribute float aSize;',
      'attribute float aAlpha;',
      'attribute vec3 aColor;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'varying float vPointerLight;',
      'void main() {',
      '  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);',
      '  float viewDepth = max(0.8, -viewPosition.z);',
      '  float perspectiveScale = 28.0 / viewDepth;',
      '  float depthFade = 1.0 - smoothstep(19.0, 34.0, viewDepth);',
      '  float twinkleWave = 0.5 + 0.5 * sin(uTime * (0.45 + fract(aPhase * 9.0) * 1.9) + aPhase * 67.0);',
      '  float twinkle = mix(0.28, 1.18, pow(twinkleWave, 1.7));',
      '  vec4 clipPosition = projectionMatrix * viewPosition;',
      '  gl_Position = clipPosition;',
      '  gl_PointSize = clamp(aSize * uPointScale * perspectiveScale * uPixelRatio, 0.55 * uPixelRatio, uMaxPointSize * uPixelRatio);',
      '  vec2 screenPosition = clipPosition.xy / max(0.001, clipPosition.w);',
      '  vec2 pointerDelta = vec2((screenPosition.x - uPointer.x) * uViewportAspect, screenPosition.y - uPointer.y);',
      '  vPointerLight = (1.0 - smoothstep(0.035, 0.32, length(pointerDelta))) * uPointerStrength * uPointerResponse;',
      '  vColor = aColor;',
      '  vAlpha = aAlpha * twinkle * depthFade;',
      '}'
    ].join('\n')

    var galaxyFragmentShader = [
      'uniform float uOpacity;',
      'uniform float uBrightness;',
      'uniform float uInnerEdge;',
      'uniform float uSoftEdge;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'varying float vPointerLight;',
      'void main() {',
      '  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));',
      '  float glow = 1.0 - smoothstep(uInnerEdge, uSoftEdge, distanceToCenter);',
      '  float alpha = glow * vAlpha * uOpacity * (1.0 + vPointerLight * 0.28);',
      '  if (alpha < 0.002) discard;',
      '  vec3 litColor = mix(vColor, vec3(1.0, 0.97, 0.92), vPointerLight * 0.16);',
      '  gl_FragColor = vec4(litColor * uBrightness, alpha);',
      '}'
    ].join('\n')

    function createGalaxyMaterial (opacity, brightness, pointScale, maxPointSize, innerEdge, softEdge, blending, pointerResponse) {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: pixelRatio },
          uOpacity: { value: opacity },
          uBrightness: { value: brightness },
          uPointScale: { value: pointScale },
          uMaxPointSize: { value: maxPointSize },
          uInnerEdge: { value: innerEdge },
          uSoftEdge: { value: softEdge },
          uPointer: { value: new THREE.Vector2(50, 50) },
          uPointerStrength: { value: 0 },
          uPointerResponse: { value: pointerResponse },
          uViewportAspect: { value: aspect }
        },
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: blending,
        toneMapped: false
      })
    }

    var galaxyStarMaterial = createGalaxyMaterial(1.35, 1.72, 1.32, 9.5, 0.31, 0.39, THREE.AdditiveBlending, 1)
    var galaxyHazeMaterial = createGalaxyMaterial(0.72, 0.86, 1.72, 32, 0.04, 0.5, THREE.AdditiveBlending, 0.65)
    var galaxyDustMaterial = createGalaxyMaterial(0.2, 0.48, 0.75, 8, 0.18, 0.5, THREE.NormalBlending, 0)

    // A separate screen-space Milky Way: a random curved stellar band behind the
    // spiral galaxy. Screen space keeps its composition stable on every viewport.
    var milkyWayRandom = randomFactory(galaxySeed ^ 0x4d696c6b)
    var milkyWayCount = width < 720 ? 3200 : 6800
    var milkyWayPositions = new Float32Array(milkyWayCount * 3)
    var milkyWayColors = new Float32Array(milkyWayCount * 3)
    var milkyWaySizes = new Float32Array(milkyWayCount)
    var milkyWayAlphas = new Float32Array(milkyWayCount)
    var milkyWaySoftness = new Float32Array(milkyWayCount)
    var bandSlope = (milkyWayRandom() - 0.5) * 0.7
    var bandBend = (milkyWayRandom() - 0.5) * 0.34
    var bandOffset = (milkyWayRandom() - 0.5) * 0.32
    var bandWave = 0.07 + milkyWayRandom() * 0.12
    var bandFrequency = 1.3 + milkyWayRandom() * 1.8
    var bandPhase = milkyWayRandom() * Math.PI * 2
    var bandCool = new THREE.Color('#9faed0')
    var bandWarm = new THREE.Color('#d8b8aa')
    var bandColor = new THREE.Color()
    for (var bandIndex = 0; bandIndex < milkyWayCount; bandIndex++) {
      var bandX = milkyWayRandom() * 2.8 - 1.4
      var normalizedBandX = bandX / 1.4
      var bandCenter = bandOffset + bandSlope * normalizedBandX + bandBend * (normalizedBandX * normalizedBandX - 0.45) + Math.sin(normalizedBandX * bandFrequency + bandPhase) * bandWave
      var bandNoise = (milkyWayRandom() + milkyWayRandom() + milkyWayRandom() + milkyWayRandom() - 2) * (0.065 + 0.12 * (1 - Math.abs(normalizedBandX) * 0.3))
      var bandOffsetIndex = bandIndex * 3
      milkyWayPositions[bandOffsetIndex] = bandX
      milkyWayPositions[bandOffsetIndex + 1] = bandCenter + bandNoise
      milkyWayPositions[bandOffsetIndex + 2] = 0
      var bandHighlight = milkyWayRandom()
      milkyWaySizes[bandIndex] = bandHighlight > 0.975 ? 1.8 + milkyWayRandom() * 2.8 : 0.45 + milkyWayRandom() * 1.35
      milkyWayAlphas[bandIndex] = (0.08 + Math.pow(milkyWayRandom(), 1.8) * 0.72) * (1 - Math.min(0.75, Math.abs(bandNoise) * 2.4))
      milkyWaySoftness[bandIndex] = bandHighlight > 0.975 ? 0.9 : milkyWayRandom()
      bandColor.copy(bandCool).lerp(bandWarm, milkyWayRandom())
      milkyWayColors[bandOffsetIndex] = bandColor.r
      milkyWayColors[bandOffsetIndex + 1] = bandColor.g
      milkyWayColors[bandOffsetIndex + 2] = bandColor.b
    }
    var milkyWayGeometry = new THREE.BufferGeometry()
    milkyWayGeometry.setAttribute('position', new THREE.BufferAttribute(milkyWayPositions, 3))
    milkyWayGeometry.setAttribute('aColor', new THREE.BufferAttribute(milkyWayColors, 3))
    milkyWayGeometry.setAttribute('aSize', new THREE.BufferAttribute(milkyWaySizes, 1))
    milkyWayGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(milkyWayAlphas, 1))
    milkyWayGeometry.setAttribute('aSoftness', new THREE.BufferAttribute(milkyWaySoftness, 1))
    var milkyWayMaterial = new THREE.ShaderMaterial({
      uniforms: { uPixelRatio: { value: pixelRatio }, uTime: { value: 0 } },
      vertexShader: [
        'uniform float uPixelRatio;', 'uniform float uTime;', 'attribute vec3 aColor;', 'attribute float aSize;', 'attribute float aAlpha;', 'attribute float aSoftness;',
        'varying vec3 vColor;', 'varying float vAlpha;', 'varying float vSoftness;',
        'void main(){ gl_Position=vec4(position.xy,0.92,1.0); gl_PointSize=aSize*uPixelRatio; vColor=aColor; vAlpha=aAlpha*(.72+.28*sin(uTime*.55+position.x*37.0)); vSoftness=aSoftness; }'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vColor;', 'varying float vAlpha;', 'varying float vSoftness;',
        'void main(){ float d=distance(gl_PointCoord,vec2(.5)); float inner=mix(.22,.05,vSoftness); float edge=mix(.38,.48,vSoftness); float a=(1.0-smoothstep(inner,edge,d))*vAlpha; if(a<.004)discard; gl_FragColor=vec4(vColor*mix(1.25,.72,vSoftness),a); }'
      ].join('\n'),
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    })
    var milkyWayBand = new THREE.Points(milkyWayGeometry, milkyWayMaterial)
    milkyWayBand.frustumCulled = false
    milkyWayBand.renderOrder = -2
    milkyWayBand.visible = false
    spaceScene.add(milkyWayBand)
    var warmWhite = new THREE.Color('#fff8e8')
    var warmGold = new THREE.Color('#e0c0a5')
    var steelBlue = new THREE.Color('#95a2b3')
    var mutedViolet = new THREE.Color('#a08ba9')
    var coolSpark = new THREE.Color('#c5d0da')
    var warmSpark = new THREE.Color('#e6b9a9')
    var haloBlue = new THREE.Color('#7d899b')
    var haloViolet = new THREE.Color('#927e99')
    var hazeWarm = new THREE.Color('#c5a390')
    var hazeCool = new THREE.Color('#81798d')
    var darkDust = new THREE.Color('#010105')
    var liftedDust = new THREE.Color('#0a0710')

    function createParticleBuffer (count) {
      return {
        positions: new Float32Array(count * 3),
        colors: new Float32Array(count * 3),
        phases: new Float32Array(count),
        sizes: new Float32Array(count),
        alphas: new Float32Array(count)
      }
    }

    function writeParticle (buffer, index, x, y, z, size, phase, alpha, colorA, colorB, colorMix) {
      var offset = index * 3
      buffer.positions[offset] = x
      buffer.positions[offset + 1] = y
      buffer.positions[offset + 2] = z
      buffer.colors[offset] = colorA.r + (colorB.r - colorA.r) * colorMix
      buffer.colors[offset + 1] = colorA.g + (colorB.g - colorA.g) * colorMix
      buffer.colors[offset + 2] = colorA.b + (colorB.b - colorA.b) * colorMix
      buffer.phases[index] = phase
      buffer.sizes[index] = size
      buffer.alphas[index] = alpha
    }

    function finishParticleBuffer (buffer) {
      var nextGeometry = new THREE.BufferGeometry()
      nextGeometry.setAttribute('position', new THREE.BufferAttribute(buffer.positions, 3))
      nextGeometry.setAttribute('aColor', new THREE.BufferAttribute(buffer.colors, 3))
      nextGeometry.setAttribute('aPhase', new THREE.BufferAttribute(buffer.phases, 1))
      nextGeometry.setAttribute('aSize', new THREE.BufferAttribute(buffer.sizes, 1))
      nextGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(buffer.alphas, 1))
      return nextGeometry
    }

    function centeredNoise (random) {
      return random() + random() + random() - 1.5
    }

    function galaxyTier () {
      if (width < 720) return { name: 'mobile', count: 8000 }
      if ((navigator.hardwareConcurrency || 8) <= 4) return { name: 'desktop-low', count: 14000 }
      return { name: 'desktop-high', count: 24000 }
    }

    var desktopLayouts = [
      { id: 'desktop-tl', coreX: 38, coreY: 42, titleX: 64, titleY: 58 },
      { id: 'desktop-tr', coreX: 62, coreY: 42, titleX: 36, titleY: 58 },
      { id: 'desktop-bl', coreX: 40, coreY: 60, titleX: 64, titleY: 38 },
      { id: 'desktop-br', coreX: 60, coreY: 60, titleX: 36, titleY: 38 }
    ]
    var mobileLayouts = [
      { id: 'mobile-top', coreX: 50, coreY: 36, titleX: 50, titleY: 64 },
      { id: 'mobile-bottom', coreX: 50, coreY: 64, titleX: 50, titleY: 36 }
    ]

    function createSpaceLayout (random) {
      var layouts = width < 720 ? mobileLayouts : desktopLayouts
      var base = layouts[Math.floor(random() * layouts.length)]
      var coreJitter = width < 720 ? 2 : 3
      var titleJitter = 2
      return {
        id: base.id,
        mode: width < 720 ? 'mobile' : 'desktop',
        baseCoreX: base.coreX,
        baseCoreY: base.coreY,
        baseTitleX: base.titleX,
        baseTitleY: base.titleY,
        coreX: base.coreX + (random() - 0.5) * coreJitter * 2,
        coreY: base.coreY + (random() - 0.5) * coreJitter * 2,
        titleX: base.titleX + (random() - 0.5) * titleJitter * 2,
        titleY: base.titleY + (random() - 0.5) * titleJitter * 2
      }
    }

    function rectanglesOverlap (first, second) {
      return first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top
    }

    function layoutIsSafe (layout) {
      var title = document.getElementById('vexpaer-home-title')
      if (!title) return true
      var rootRect = root.getBoundingClientRect()
      var currentTitleRect = title.getBoundingClientRect()
      var titleCenterX = rootRect.left + rootRect.width * layout.titleX / 100
      var titleCenterY = rootRect.top + rootRect.height * layout.titleY / 100
      var titleRect = {
        left: titleCenterX - currentTitleRect.width / 2,
        right: titleCenterX + currentTitleRect.width / 2,
        top: titleCenterY - currentTitleRect.height / 2,
        bottom: titleCenterY + currentTitleRect.height / 2
      }
      var mobile = width < 720
      var sideMargin = mobile ? 16 : 36
      var topMargin = mobile ? 72 : 80
      var bottomMargin = mobile ? 72 : 48
      if (titleRect.left < rootRect.left + sideMargin || titleRect.right > rootRect.right - sideMargin || titleRect.top < rootRect.top + topMargin || titleRect.bottom > rootRect.bottom - bottomMargin) return false
      var nav = document.getElementById('nav')
      if (nav && rectanglesOverlap(titleRect, nav.getBoundingClientRect())) return false
      if (button && rectanglesOverlap(titleRect, button.getBoundingClientRect())) return false
      var coreX = rootRect.left + rootRect.width * layout.coreX / 100
      var coreY = rootRect.top + rootRect.height * layout.coreY / 100
      var distanceX = Math.max(titleRect.left - coreX, 0, coreX - titleRect.right)
      var distanceY = Math.max(titleRect.top - coreY, 0, coreY - titleRect.bottom)
      var minimumDistance = Math.max(48, Math.min(104, Math.min(rootRect.width, rootRect.height) * 0.11))
      return Math.sqrt(distanceX * distanceX + distanceY * distanceY) >= minimumDistance
    }

    var spaceProjectionPlane = new THREE.Plane()
    var spaceProjectionNormal = new THREE.Vector3()
    var spaceProjectionPoint = new THREE.Vector3()
    var spaceProjectionDirection = new THREE.Vector3()
    var spaceProjectionRay = new THREE.Ray()

    function screenPointToSpace (screenX, screenY, target) {
      spaceCamera.updateMatrixWorld()
      spaceProjectionPoint.set(screenX * 2 - 1, 1 - screenY * 2, 0.2).unproject(spaceCamera)
      spaceProjectionDirection.copy(spaceProjectionPoint).sub(spaceCamera.position).normalize()
      spaceCamera.getWorldDirection(spaceProjectionNormal)
      spaceProjectionPlane.setFromNormalAndCoplanarPoint(spaceProjectionNormal, spaceCameraLookAt)
      spaceProjectionRay.set(spaceCamera.position, spaceProjectionDirection)
      return spaceProjectionRay.intersectPlane(spaceProjectionPlane, target) || target.copy(spaceCameraLookAt)
    }

    function configureSpaceCamera () {
      var mobile = width < 720
      spaceCamera.aspect = aspect
      spaceCamera.fov = mobile ? 52 : 46
      spaceCamera.updateProjectionMatrix()
      spaceCameraBase.set(0, mobile ? 8.5 : 6.8, mobile ? 16.2 : 10.4)
      spaceCameraLookAt.set(0, 0, 0)
      spaceCamera.position.copy(spaceCameraBase)
      spaceCamera.lookAt(spaceCameraLookAt)
      spaceCamera.updateMatrixWorld()
    }

    function positionGalaxyForLayout (layout) {
      spaceCamera.position.copy(spaceCameraBase)
      spaceCamera.lookAt(spaceCameraLookAt)
      screenPointToSpace(layout.coreX / 100, layout.coreY / 100, galaxyGroup.position)
    }

    function applySpaceLayout (layout) {
      if (!layoutIsSafe(layout)) {
        layout.coreX = layout.baseCoreX
        layout.coreY = layout.baseCoreY
        layout.titleX = layout.baseTitleX
        layout.titleY = layout.baseTitleY
      }
      root.style.setProperty('--vexpaer-title-x', layout.titleX.toFixed(2) + '%')
      root.style.setProperty('--vexpaer-title-y', layout.titleY.toFixed(2) + '%')
      root.dataset.galaxyLayout = layout.id
      root.dataset.galaxyCenter = layout.coreX.toFixed(2) + ',' + layout.coreY.toFixed(2)
      positionGalaxyForLayout(layout)
    }

    // Simple FBM-like noise for irregular arm perturbation
    function armNoiseFBM (random, radial, seed) {
      var v = 0
      var amp = 1
      var freq = 1
      for (var octave = 0; octave < 4; octave++) {
        v += Math.sin(radial * freq * 2.8 + seed * 7.13 + octave * 3.71) * amp
        v += Math.cos(radial * freq * 1.9 + seed * 11.37 + octave * 5.93) * amp * 0.6
        amp *= 0.48
        freq *= 2.15
      }
      return v
    }

    function createGalaxyConfig () {
      galaxySeed = (galaxySeed + 0x9e3779b9) >>> 0
      var random = randomFactory(galaxySeed)
      var armTotal = 2 + Math.floor(random() * 4)
      var armProfiles = []
      for (var index = 0; index < armTotal; index++) {
        armProfiles.push({
          phase: (random() - 0.5) * 0.9,
          twist: 0.4 + random() * 0.8,
          width: 0.7 + random() * 1.1,
          length: 0.82 + random() * 0.35,
          density: 0.7 + random() * 0.42,
          drift: 0.22 + random() * 0.48,
          branch: 0.5 + random() * 1.0,
          // New: per-arm irregularity parameters
          curveSeed: random() * 100,
          curveAmplitude: 0.15 + random() * 0.35,
          kinkCount: 1 + Math.floor(random() * 3),
          kinkStrength: 0.08 + random() * 0.22,
          twistVariation: (random() - 0.5) * 0.4,
          widthVariation: 0.6 + random() * 0.8
        })
      }
      return {
        seed: galaxySeed,
        arms: armTotal,
        armProfiles: armProfiles,
        radius: 8.5 + random() * 2.5,
        twist: 0.25 + random() * 0.45,
        xScale: 0.82 + random() * 0.35,
        zScale: 0.78 + random() * 0.38,
        coreScale: 0.9 + random() * 0.4,
        branchChance: 0.14 + random() * 0.28,
        armNoise: 0.18 + random() * 0.28,
        rotation: random() * Math.PI * 2,
        spin: 0.003 + random() * 0.008,
        tiltX: (random() - 0.5) * 0.18,
        tiltZ: (random() - 0.5) * 0.52,
        warp: random() * Math.PI * 2,
        asymmetry: 0.85 + random() * 0.3,
        layout: createSpaceLayout(random)
      }
    }

    function buildGalaxyGeometries (config, tier) {
      var luminousCount = Math.floor(tier.count * 0.68)
      var hazeCount = Math.floor(tier.count * 0.24)
      var dustCount = tier.count - luminousCount - hazeCount
      var luminous = createParticleBuffer(luminousCount)
      var haze = createParticleBuffer(hazeCount)
      var dust = createParticleBuffer(dustCount)
      var random = randomFactory(config.seed ^ 0x51f15e)
      var twoPi = Math.PI * 2
      var coreCount = Math.floor(luminousCount * 0.14)
      var armCount = Math.floor(luminousCount * 0.62)

      for (var coreIndex = 0; coreIndex < coreCount; coreIndex++) {
        var coreRadius = Math.pow(random(), 2.2) * 1.95 * config.coreScale
        var coreAngle = random() * twoPi
        var coreHeight = centeredNoise(random) * (0.38 * (1 - coreRadius / (2.3 * config.coreScale)) + 0.06)
        writeParticle(luminous, coreIndex, Math.cos(coreAngle) * coreRadius * config.xScale, coreHeight, Math.sin(coreAngle) * coreRadius * 0.9 * config.zScale, 0.65 + random() * 1.75, random(), 0.62 + random() * 0.34, warmWhite, warmGold, Math.min(1, coreRadius / (1.95 * config.coreScale)))
      }

      for (var armIndex = 0; armIndex < armCount; armIndex++) {
        var arm = Math.floor(random() * config.arms)
        var profile = config.armProfiles[arm]
        var armLimit = Math.max(4.2, config.radius * profile.length)
        var radial = 0.48 + Math.pow(random(), 0.62) * (armLimit - 0.48)
        // Variable twist rate: twist changes along the arm for non-uniform curvature
        var localTwist = config.twist * profile.twist + profile.twistVariation * Math.sin(radial * 1.8 + profile.curveSeed)
        var armAngle = arm / config.arms * twoPi + profile.phase + radial * localTwist
        // FBM noise perturbation for irregular Milky-Way-like curves
        armAngle += armNoiseFBM(random, radial, profile.curveSeed) * profile.curveAmplitude
        // Kinks: sudden angle shifts at specific radii
        for (var kink = 0; kink < profile.kinkCount; kink++) {
          var kinkRadius = (kink + 1) / (profile.kinkCount + 1) * armLimit
          var kinkDist = Math.abs(radial - kinkRadius)
          if (kinkDist < 0.8) {
            armAngle += Math.sin(profile.curveSeed * (kink + 1) * 7.3) * profile.kinkStrength * (1 - kinkDist / 0.8)
          }
        }
        // Per-arm asymmetry
        var armAsym = arm % 2 === 0 ? config.asymmetry : (2 - config.asymmetry)
        armAngle += Math.sin(radial * profile.drift + config.warp + arm) * (0.1 + radial * 0.025) * armAsym
        if (random() < config.branchChance * profile.branch) armAngle += (random() > 0.5 ? 1 : -1) * (0.12 + radial * (0.022 + random() * 0.03))
        var interArm = random() < 0.18
        if (interArm) armAngle += centeredNoise(random) * 0.75
        armAngle += centeredNoise(random) * (config.armNoise + radial * 0.055) * profile.width
        // Variable width along arm
        var localWidth = profile.width * (0.7 + 0.3 * Math.sin(radial * profile.widthVariation + profile.curveSeed * 3.1))
        var armWidth = centeredNoise(random) * (0.12 + radial * 0.07) * localWidth
        var armX = (Math.cos(armAngle) * radial + Math.cos(armAngle + Math.PI / 2) * armWidth) * config.xScale
        var armZ = (Math.sin(armAngle) * radial + Math.sin(armAngle + Math.PI / 2) * armWidth) * config.zScale
        var armY = centeredNoise(random) * (0.08 + radial * 0.04) * localWidth + Math.sin(armAngle * 2 + config.warp) * radial * 0.022
        var highlight = random()
        var armSize = highlight > 0.985 ? 1.45 + random() * 1.35 : (0.5 + random() * 1.25) * (0.88 + profile.width * 0.12)
        var armAlpha = Math.min(1, (highlight > 0.985 ? 0.94 : 0.4 + random() * 0.56) * profile.density * (interArm ? 0.48 : 1))
        writeParticle(luminous, coreCount + armIndex, armX, armY, armZ, armSize, random(), armAlpha, highlight > 0.985 ? warmSpark : steelBlue, highlight > 0.985 ? coolSpark : mutedViolet, random())
      }

      var haloStart = coreCount + armCount
      var haloCount = luminousCount - haloStart
      for (var haloIndex = haloStart; haloIndex < luminousCount; haloIndex++) {
        var haloProgress = (haloIndex - haloStart) / Math.max(1, haloCount)
        var haloAngle = random() * twoPi
        if (haloProgress < 0.46) {
          var haloRadius = 2.4 + Math.pow(random(), 0.48) * (config.radius + 1.8)
          writeParticle(luminous, haloIndex, Math.cos(haloAngle) * haloRadius * config.xScale, centeredNoise(random) * (0.4 + haloRadius * 0.16), Math.sin(haloAngle) * haloRadius * config.zScale, 0.24 + random() * 1.25, random(), 0.1 + random() * 0.42, haloBlue, haloViolet, random())
        } else {
          var fieldRadius = 6 + Math.pow(random(), 0.34) * 6.5
          writeParticle(luminous, haloIndex, Math.cos(haloAngle) * fieldRadius * config.xScale, centeredNoise(random) * (1.3 + fieldRadius * 0.22), Math.sin(haloAngle) * fieldRadius * config.zScale, 0.18 + random() * 0.92, random(), 0.06 + random() * 0.28, haloBlue, coolSpark, random() * 0.58)
        }
      }

      var hazeCoreCount = Math.floor(hazeCount * 0.3)
      var hazeArmEnd = hazeCoreCount + Math.floor(hazeCount * 0.52)
      for (var hazeIndex = 0; hazeIndex < hazeCount; hazeIndex++) {
        if (hazeIndex < hazeCoreCount) {
          var hazeRadius = Math.pow(random(), 1.72) * 2.55 * config.coreScale
          var hazeAngle = random() * twoPi
          writeParticle(haze, hazeIndex, Math.cos(hazeAngle) * hazeRadius * config.xScale, centeredNoise(random) * Math.max(0.08, 0.42 - hazeRadius * 0.09), Math.sin(hazeAngle) * hazeRadius * 0.9 * config.zScale, 3.8 + random() * 6.2, random(), 0.06 + random() * 0.075, hazeWarm, warmGold, random())
        } else if (hazeIndex < hazeArmEnd) {
          var hazeArm = Math.floor(random() * config.arms)
          var hazeProfile = config.armProfiles[hazeArm]
          var hazeLimit = Math.max(4.5, config.radius * hazeProfile.length)
          var hazeRadial = 0.65 + Math.pow(random(), 0.62) * (hazeLimit - 0.65)
          var hazeLocalTwist = config.twist * hazeProfile.twist + hazeProfile.twistVariation * Math.sin(hazeRadial * 1.8 + hazeProfile.curveSeed)
          var hazeArmAngle = hazeArm / config.arms * twoPi + hazeProfile.phase + hazeRadial * hazeLocalTwist
          hazeArmAngle += armNoiseFBM(random, hazeRadial, hazeProfile.curveSeed) * hazeProfile.curveAmplitude * 1.2
          for (var hazeKink = 0; hazeKink < hazeProfile.kinkCount; hazeKink++) {
            var hazeKinkR = (hazeKink + 1) / (hazeProfile.kinkCount + 1) * hazeLimit
            var hazeKinkDist = Math.abs(hazeRadial - hazeKinkR)
            if (hazeKinkDist < 1.0) hazeArmAngle += Math.sin(hazeProfile.curveSeed * (hazeKink + 1) * 7.3) * hazeProfile.kinkStrength * (1 - hazeKinkDist / 1.0)
          }
          hazeArmAngle += Math.sin(hazeRadial * hazeProfile.drift + config.warp + hazeArm) * (0.09 + hazeRadial * 0.022)
          if (random() < config.branchChance * hazeProfile.branch) hazeArmAngle += (random() > 0.5 ? 1 : -1) * (0.12 + hazeRadial * 0.025)
          hazeArmAngle += centeredNoise(random) * (config.armNoise * 1.45 + hazeRadial * 0.07) * hazeProfile.width
          var hazeLocalWidth = hazeProfile.width * (0.7 + 0.3 * Math.sin(hazeRadial * hazeProfile.widthVariation + hazeProfile.curveSeed * 3.1))
          var hazeWidth = centeredNoise(random) * (0.22 + hazeRadial * 0.12) * hazeLocalWidth
          writeParticle(haze, hazeIndex, (Math.cos(hazeArmAngle) * hazeRadial + Math.cos(hazeArmAngle + Math.PI / 2) * hazeWidth) * config.xScale, centeredNoise(random) * (0.12 + hazeRadial * 0.07) * hazeLocalWidth, (Math.sin(hazeArmAngle) * hazeRadial + Math.sin(hazeArmAngle + Math.PI / 2) * hazeWidth) * config.zScale, 2.8 + random() * 4.7, random(), (0.035 + random() * 0.065) * hazeProfile.density, hazeCool, mutedViolet, random())
        } else {
          var outerHazeRadius = 4.5 + Math.pow(random(), 0.42) * 7.4
          var outerHazeAngle = random() * twoPi
          writeParticle(haze, hazeIndex, Math.cos(outerHazeAngle) * outerHazeRadius * config.xScale, centeredNoise(random) * (1 + outerHazeRadius * 0.2), Math.sin(outerHazeAngle) * outerHazeRadius * config.zScale, 1.8 + random() * 3.8, random(), 0.012 + random() * 0.032, hazeCool, haloViolet, random())
        }
      }

      for (var dustIndex = 0; dustIndex < dustCount; dustIndex++) {
        var dustArm = Math.floor(random() * config.arms)
        var dustProfile = config.armProfiles[dustArm]
        var dustLimit = Math.max(4.2, config.radius * dustProfile.length)
        var dustRadius = 0.7 + Math.pow(random(), 0.68) * (dustLimit - 0.7)
        var dustLocalTwist = config.twist * dustProfile.twist + dustProfile.twistVariation * Math.sin(dustRadius * 1.8 + dustProfile.curveSeed)
        var dustAngle = dustArm / config.arms * twoPi + dustProfile.phase + dustRadius * dustLocalTwist - 0.1
        dustAngle += armNoiseFBM(random, dustRadius, dustProfile.curveSeed) * dustProfile.curveAmplitude * 0.8
        for (var dustKink = 0; dustKink < dustProfile.kinkCount; dustKink++) {
          var dustKinkR = (dustKink + 1) / (dustProfile.kinkCount + 1) * dustLimit
          var dustKinkDist = Math.abs(dustRadius - dustKinkR)
          if (dustKinkDist < 0.9) dustAngle += Math.sin(dustProfile.curveSeed * (dustKink + 1) * 7.3) * dustProfile.kinkStrength * 0.7 * (1 - dustKinkDist / 0.9)
        }
        dustAngle += Math.sin(dustRadius * dustProfile.drift + config.warp + dustArm) * (0.07 + dustRadius * 0.015)
        dustAngle += centeredNoise(random) * (0.1 + dustRadius * 0.035) * dustProfile.width
        var dustLocalWidth = dustProfile.width * (0.7 + 0.3 * Math.sin(dustRadius * dustProfile.widthVariation + dustProfile.curveSeed * 3.1))
        var dustWidth = centeredNoise(random) * (0.09 + dustRadius * 0.05) * dustLocalWidth
        writeParticle(dust, dustIndex, (Math.cos(dustAngle) * dustRadius + Math.cos(dustAngle + Math.PI / 2) * dustWidth) * config.xScale, centeredNoise(random) * (0.04 + dustRadius * 0.02) * dustLocalWidth, (Math.sin(dustAngle) * dustRadius + Math.sin(dustAngle + Math.PI / 2) * dustWidth) * config.zScale, 1.2 + random() * 2.4, random(), 0.03 + random() * 0.07, darkDust, liftedDust, random())
      }

      return { stars: finishParticleBuffer(luminous), haze: finishParticleBuffer(haze), dust: finishParticleBuffer(dust) }
    }

    function replaceGalaxyGeometry (geometries) {
      if (!galaxyStars) {
        galaxyHaze = new THREE.Points(geometries.haze, galaxyHazeMaterial)
        galaxyStars = new THREE.Points(geometries.stars, galaxyStarMaterial)
        galaxyDust = new THREE.Points(geometries.dust, galaxyDustMaterial)
        galaxyHaze.frustumCulled = false
        galaxyStars.frustumCulled = false
        galaxyDust.frustumCulled = false
        galaxyHaze.renderOrder = 0
        galaxyStars.renderOrder = 1
        galaxyDust.renderOrder = 2
        galaxyGroup.add(galaxyHaze)
        galaxyGroup.add(galaxyStars)
        galaxyGroup.add(galaxyDust)
        return
      }
      galaxyHaze.geometry.dispose()
      galaxyStars.geometry.dispose()
      galaxyDust.geometry.dispose()
      galaxyHaze.geometry = geometries.haze
      galaxyStars.geometry = geometries.stars
      galaxyDust.geometry = geometries.dust
    }

    function rebuildGalaxy (randomize) {
      var tier = galaxyTier()
      var mode = width < 720 ? 'mobile' : 'desktop'
      if (randomize || !galaxyConfig) galaxyConfig = createGalaxyConfig()
      else if (galaxyConfig.layout.mode !== mode) galaxyConfig.layout = createSpaceLayout(randomFactory(galaxyConfig.seed ^ 0x7196a7))
      if (!galaxyStars || randomize || galaxyTierName !== tier.name) {
        replaceGalaxyGeometry(buildGalaxyGeometries(galaxyConfig, tier))
        galaxyTierName = tier.name
        root.dataset.galaxyParticles = String(tier.count)
      }
      root.dataset.galaxyArms = String(galaxyConfig.arms)
      root.dataset.galaxyShape = galaxyConfig.twist.toFixed(3) + ',' + galaxyConfig.xScale.toFixed(3) + ',' + galaxyConfig.zScale.toFixed(3)
      applySpaceLayout(galaxyConfig.layout)
      galaxyGroup.visible = activeTheme === 'space'
    }

    var meteorGroup = new THREE.Group()
    var meteors = []
    var meteorDragging = false
    var meteorLastX = 0
    var meteorLastY = 0
    var meteorLastSpawn = 0
    var meteorForward = new THREE.Vector3()
    var meteorRight = new THREE.Vector3()
    var meteorUp = new THREE.Vector3()
    var meteorStart = new THREE.Vector3()
    meteorGroup.visible = false
    meteorGroup.renderOrder = 3
    spaceScene.add(meteorGroup)

    function removeMeteor (meteor) {
      meteorGroup.remove(meteor.line)
      meteorGroup.remove(meteor.head)
      meteor.line.geometry.dispose()
      meteor.line.material.dispose()
      meteor.head.geometry.dispose()
      meteor.head.material.dispose()
    }

    function clearMeteors () {
      for (var index = meteors.length - 1; index >= 0; index--) removeMeteor(meteors[index])
      meteors.length = 0
      root.dataset.spaceMeteorCount = '0'
    }

    function spawnMeteorBurst (dragX, dragY) {
      if (meteors.length >= 12) return
      var screenLength = Math.sqrt(dragX * dragX + dragY * dragY)
      if (screenLength < 1) return
      var directionX = dragX / screenLength
      var directionY = -dragY / screenLength
      spaceCamera.getWorldDirection(meteorForward)
      meteorRight.crossVectors(meteorForward, spaceCamera.up).normalize()
      meteorUp.crossVectors(meteorRight, meteorForward).normalize()
      screenPointToSpace((spacePointerNdc.x + 1) * 0.5, (1 - spacePointerNdc.y) * 0.5, meteorStart)
      var count = Math.min(3, 1 + Math.floor(Math.random() * 3))

      for (var index = 0; index < count && meteors.length < 12; index++) {
        var spread = (Math.random() - 0.5) * 0.28
        var c = Math.cos(spread)
        var s = Math.sin(spread)
        var spreadX = directionX * c - directionY * s
        var spreadY = directionX * s + directionY * c
        var velocity = new THREE.Vector3().addScaledVector(meteorRight, spreadX).addScaledVector(meteorUp, spreadY).addScaledVector(meteorForward, (Math.random() - 0.5) * 0.08).normalize()
        velocity.multiplyScalar(2.4 + Math.random() * 2.2)
        var start = meteorStart.clone().addScaledVector(meteorForward, (Math.random() - 0.5) * 0.35)
        var direction = velocity.clone().normalize()
        var tailLength = 0.38 + Math.random() * 0.42
        var tail = start.clone().addScaledVector(direction, -tailLength)
        var linePositions = new Float32Array([start.x, start.y, start.z, tail.x, tail.y, tail.z])
        var lineGeometry = new THREE.BufferGeometry()
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
        var lineMaterial = new THREE.LineBasicMaterial({
          color: Math.random() > 0.45 ? '#e2e7ee' : '#b9a7c5',
          transparent: true,
          opacity: 0.94,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          toneMapped: false
        })
        var line = new THREE.Line(lineGeometry, lineMaterial)
        var headMaterial = new THREE.MeshBasicMaterial({
          color: '#fff8ec',
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          toneMapped: false
        })
        var head = new THREE.Mesh(new THREE.SphereGeometry(0.028 + Math.random() * 0.022, 8, 8), headMaterial)
        head.position.copy(start)
        meteorGroup.add(line)
        meteorGroup.add(head)
        meteors.push({ line: line, head: head, velocity: velocity, direction: direction, tail: tail, tailLength: tailLength, age: 0, lifetime: 0.8 + Math.random() })
        root.dataset.spaceMeteorCount = String(meteors.length)
      }
    }

    function updateMeteors (time) {
      var frameSeconds = Math.min(0.05, Math.max(0.001, (time - (updateMeteors.lastTime || time)) / 1000))
      updateMeteors.lastTime = time
      if (!meteorGroup.visible) return

      for (var index = meteors.length - 1; index >= 0; index--) {
        var meteor = meteors[index]
        meteor.age += frameSeconds
        meteor.head.position.addScaledVector(meteor.velocity, frameSeconds)
        var fade = Math.max(0, 1 - meteor.age / meteor.lifetime)
        meteor.tail.copy(meteor.head.position).addScaledVector(meteor.direction, -meteor.tailLength * (0.45 + fade * 0.55))
        var positionAttribute = meteor.line.geometry.getAttribute('position')
        positionAttribute.setXYZ(0, meteor.head.position.x, meteor.head.position.y, meteor.head.position.z)
        positionAttribute.setXYZ(1, meteor.tail.x, meteor.tail.y, meteor.tail.z)
        positionAttribute.needsUpdate = true
        meteor.line.material.opacity = fade * 0.94
        meteor.head.material.opacity = fade
        meteor.head.scale.setScalar(0.82 + fade * 0.72)
        if (meteor.age >= meteor.lifetime || meteor.head.position.distanceToSquared(spaceCamera.position) > 900) {
          removeMeteor(meteor)
          meteors.splice(index, 1)
          root.dataset.spaceMeteorCount = String(meteors.length)
        }
      }
    }

    function updateGalaxy (time) {
      if (!galaxyConfig || activeTheme !== 'space') return
      var seconds = time * 0.001
      spaceCamera.position.copy(spaceCameraBase)
      spaceCameraLookAt.set(0, 0, 0)
      spaceCamera.lookAt(spaceCameraLookAt)
      var pointerLightTarget = pointerActive ? 1 : 0
      galaxyStarMaterial.uniforms.uPointer.value.lerp(spacePointerNdc, 0.16)
      galaxyHazeMaterial.uniforms.uPointer.value.lerp(spacePointerNdc, 0.16)
      galaxyDustMaterial.uniforms.uPointer.value.lerp(spacePointerNdc, 0.16)
      galaxyStarMaterial.uniforms.uPointerStrength.value += (pointerLightTarget - galaxyStarMaterial.uniforms.uPointerStrength.value) * 0.14
      galaxyHazeMaterial.uniforms.uPointerStrength.value += (pointerLightTarget - galaxyHazeMaterial.uniforms.uPointerStrength.value) * 0.14
      galaxyDustMaterial.uniforms.uPointerStrength.value += (pointerLightTarget - galaxyDustMaterial.uniforms.uPointerStrength.value) * 0.14
      galaxyGroup.rotation.x = galaxyConfig.tiltX + Math.sin(seconds * 0.09 + galaxyConfig.warp) * 0.012
      galaxyGroup.rotation.y = galaxyConfig.rotation + seconds * galaxyConfig.spin
      galaxyGroup.rotation.z = galaxyConfig.tiltZ + Math.cos(seconds * 0.07 + galaxyConfig.warp) * 0.01
      galaxyStarMaterial.uniforms.uTime.value = seconds
      galaxyHazeMaterial.uniforms.uTime.value = seconds
      galaxyDustMaterial.uniforms.uTime.value = seconds
      milkyWayMaterial.uniforms.uTime.value = seconds
      root.dataset.galaxyRotation = galaxyGroup.rotation.y.toFixed(3)
    }

    var lifeCapacity = Math.max(20000, life.length)
    var lifeGeometry = new THREE.BoxGeometry(1, 1, 1)

    // Add per-face vertex colors for 3D depth: top bright, sides medium, bottom dark
    // BoxGeometry has 6 faces × 2 triangles × 3 vertices = 36 vertices
    // Face order: +x, -x, +y (top), -y (bottom), +z, -z
    var lifeFaceColors = new Float32Array(36 * 3)
    var lifeFaceBrightness = [
      0.72, 0.72,  // +x side (right)  – 2 triangles
      0.62, 0.62,  // -x side (left)   – 2 triangles
      1.0, 1.0,    // +y top           – 2 triangles (brightest)
      0.38, 0.38,  // -y bottom        – 2 triangles (darkest)
      0.78, 0.78,  // +z front         – 2 triangles
      0.55, 0.55   // -z back          – 2 triangles
    ]
    for (var faceIdx = 0; faceIdx < 12; faceIdx++) {
      var brightness = lifeFaceBrightness[faceIdx]
      for (var vertIdx = 0; vertIdx < 3; vertIdx++) {
        var colorOffset = (faceIdx * 3 + vertIdx) * 3
        lifeFaceColors[colorOffset] = brightness
        lifeFaceColors[colorOffset + 1] = brightness
        lifeFaceColors[colorOffset + 2] = brightness
      }
    }
    lifeGeometry.setAttribute('color', new THREE.BufferAttribute(lifeFaceColors, 3))

    var lifeMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#13062d',
      emissiveIntensity: 1.05,
      roughness: 0.35,
      metalness: 0.22,
      flatShading: true,
      vertexColors: true
    })
    var lifeMesh = new THREE.InstancedMesh(lifeGeometry, lifeMaterial, lifeCapacity)
    lifeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    lifeMesh.frustumCulled = false
    lifeMesh.renderOrder = 2
    lifeMesh.visible = false
    var lifeGroup = new THREE.Group()
    lifeGroup.rotation.set(-0.14, 0.08, 0)
    lifeGroup.add(lifeMesh)
    scene.add(lifeGroup)

    // Enhanced lighting for better 3D depth
    var lifeAmbient = new THREE.AmbientLight('#392071', 0.95)
    var lifeKeyLight = new THREE.DirectionalLight('#9b86e2', 2.15)
    lifeKeyLight.position.set(-1.2, 2.8, 3.2)
    var lifeRimLight = new THREE.PointLight('#1946c2', 4.6, 7)
    lifeRimLight.position.set(-2.5, -1.4, 2.5)
    var lifeFillLight = new THREE.DirectionalLight('#54238f', 1.05)
    lifeFillLight.position.set(2.0, -0.5, 1.8)
    lifeAmbient.visible = false
    lifeKeyLight.visible = false
    lifeRimLight.visible = false
    lifeFillLight.visible = false
    scene.add(lifeAmbient)
    scene.add(lifeKeyLight)
    scene.add(lifeRimLight)
    scene.add(lifeFillLight)

    var lifeDummy = new THREE.Object3D()
    var lifeCubeColor = new THREE.Color()
    var lifePurple = new THREE.Color('#52139a')
    var lifeBlue = new THREE.Color('#0c46a5')
    var lifeOffsetsX = new Float32Array(0)
    var lifeOffsetsY = new Float32Array(0)
    var lifeCellWidth = 0
    var lifeCellHeight = 0
    var lifeCubeSize = 0

    function rebuildLifeLayout () {
      lifeCellWidth = 2 * aspect / Math.max(1, lifeColumns)
      lifeCellHeight = 2 / Math.max(1, lifeRows)
      var unit = Math.min(lifeCellWidth, lifeCellHeight)
      lifeCubeSize = unit * 0.68
      lifeOffsetsX = new Float32Array(life.length)
      lifeOffsetsY = new Float32Array(life.length)
      for (var index = 0; index < life.length; index++) {
        var row = Math.floor(index / Math.max(1, lifeColumns))
        var phase = index * 1.371 + row * 0.47
        lifeOffsetsX[index] = (Math.sin(phase) * 0.035 + (row % 2 ? 0.018 : -0.018)) * unit
        lifeOffsetsY[index] = Math.cos(phase * 0.73) * 0.028 * unit
      }
    }

    function updateLifeCubes (time) {
      var active = activeTheme === 'life'
      lifeMesh.visible = active
      lifeGroup.visible = active
      lifeAmbient.visible = active
      lifeKeyLight.visible = active
      lifeRimLight.visible = active
      lifeFillLight.visible = active
      // Pulsing emissive for living feel
      if (active) lifeMaterial.emissiveIntensity = 0.98 + Math.sin(time * 0.0018) * 0.16
      if (!active) return

      var count = Math.min(life.length, lifeCapacity)
      lifeMesh.count = count
      var waveTime = time * 0.00032
      var scrollProgress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, root.offsetHeight)))
      lifeGroup.rotation.x = -0.14 + Math.sin(waveTime * 0.55) * 0.014
      lifeGroup.rotation.y = 0.08 + Math.cos(waveTime * 0.4) * 0.035
      lifeGroup.rotation.z = (scrollProgress - 0.5) * 0.1 + Math.sin(waveTime * 0.72) * 0.025
      for (var index = 0; index < count; index++) {
        var column = index % Math.max(1, lifeColumns)
        var row = Math.floor(index / Math.max(1, lifeColumns))
        var x = -aspect + (column + 0.5) * lifeCellWidth + lifeOffsetsX[index]
        var y = 1 - (row + 0.5) * lifeCellHeight + lifeOffsetsY[index]
        var wave = Math.sin(waveTime + x * 2.8 + y * 4.4) * 0.035 + Math.cos(waveTime * 0.72 + x * 3.7 - y * 2.1) * 0.018
        var alive = life[index] === 1
        var scale = alive ? lifeCubeSize : 0.001
        lifeDummy.position.set(x, y, wave)
        lifeDummy.rotation.set(wave * 3.4, Math.cos(waveTime + x * 2.1) * 0.14, Math.sin(waveTime + y * 2.7) * 0.06)
        lifeDummy.scale.set(scale, scale, scale)
        lifeDummy.updateMatrix()
        lifeMesh.setMatrixAt(index, lifeDummy.matrix)
        var gradientProgress = (column / Math.max(1, lifeColumns - 1) + row / Math.max(1, lifeRows - 1)) * 0.5
        lifeCubeColor.copy(lifePurple).lerp(lifeBlue, gradientProgress)
        lifeMesh.setColorAt(index, lifeCubeColor)
      }
      lifeMesh.instanceMatrix.needsUpdate = true
      if (lifeMesh.instanceColor) lifeMesh.instanceColor.needsUpdate = true
    }

    rebuildLifeLayout()
    root.dataset.lifeRenderer = 'cubes'

    var pointerTarget = new THREE.Vector2(50, 50)
    var themeSettings = {
      dusk: { index: 0, colorA: '#ffe7a3', colorB: '#a8d878', size: 3.1, opacity: 0 },
      space: { index: 1, colorA: '#ffffff', colorB: '#70cfff', size: 2.65, opacity: 0.94 },
      life: { index: 2, colorA: '#858585', colorB: '#3d3d3d', size: 2.15, opacity: 0.3 }
    }

    threeLayer = {
      hasDuskScene: true,
      hasLifeMesh: true,
      resize: function (nextWidth, nextHeight, nextPixelRatio) {
        aspect = nextWidth / Math.max(1, nextHeight)
        camera.left = -aspect
        camera.right = aspect
        camera.top = 1
        camera.bottom = -1
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(nextPixelRatio || 1, 1.65))
        renderer.setSize(nextWidth, nextHeight, false)
        material.uniforms.uAspect.value = aspect
        material.uniforms.uPixelRatio.value = Math.min(nextPixelRatio || 1, 1.65)
        galaxyStarMaterial.uniforms.uPixelRatio.value = Math.min(nextPixelRatio || 1, 1.65)
        galaxyHazeMaterial.uniforms.uPixelRatio.value = Math.min(nextPixelRatio || 1, 1.65)
        galaxyDustMaterial.uniforms.uPixelRatio.value = Math.min(nextPixelRatio || 1, 1.65)
        galaxyStarMaterial.uniforms.uViewportAspect.value = aspect
        galaxyHazeMaterial.uniforms.uViewportAspect.value = aspect
        galaxyDustMaterial.uniforms.uViewportAspect.value = aspect
        milkyWayMaterial.uniforms.uPixelRatio.value = Math.min(nextPixelRatio || 1, 1.65)
        configureDuskCamera()
        configureSpaceCamera()
        if (galaxyConfig) rebuildGalaxy(false)
        rebuildLifeLayout()
      },
      setPointer: function (normalizedX, normalizedY) {
        pointerTarget.set(normalizedX * aspect, normalizedY)
        spacePointerNdc.set(normalizedX, normalizedY)
      },
      setTheme: function (theme, previousTheme) {
        var settings = themeSettings[theme]
        material.uniforms.uScene.value = settings.index
        material.uniforms.uPointScale.value = settings.size
        material.uniforms.uOpacity.value = settings.opacity
        material.uniforms.uColorA.value.set(settings.colorA)
        material.uniforms.uColorB.value.set(settings.colorB)
        points.visible = theme === 'life'
        if (theme === 'space') {
          configureSpaceCamera()
          rebuildGalaxy(previousTheme !== 'space' || !galaxyConfig)
          galaxyGroup.visible = true
          meteorGroup.visible = true
          milkyWayBand.visible = true
          root.dataset.spaceCamera = 'perspective'
        } else {
          galaxyGroup.visible = false
          meteorGroup.visible = false
          milkyWayBand.visible = false
          clearMeteors()
          delete root.dataset.spaceCamera
        }
      },
      beginDrag: function (x, y) {
        meteorDragging = true
        meteorLastX = x
        meteorLastY = y
        meteorLastSpawn = performance.now()
      },
      drag: function (x, y) {
        if (!meteorDragging) return
        var deltaX = x - meteorLastX
        var deltaY = y - meteorLastY
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        var now = performance.now()
        if (distance > 8) {
          if (now - meteorLastSpawn >= 350) {
            meteorLastSpawn = now
            if (Math.random() < 0.08) spawnMeteorBurst(deltaX, deltaY)
          }
        }
        meteorLastX = x
        meteorLastY = y
      },
      endDrag: function () {
        meteorDragging = false
      },
      render: function (time) {
        material.uniforms.uTime.value = time * 0.001
        material.uniforms.uPointer.value.lerp(pointerTarget, 0.13)
        var targetStrength = pointerActive && activeTheme === 'dusk' ? 1 : 0
        material.uniforms.uPointerStrength.value += (targetStrength - material.uniforms.uPointerStrength.value) * 0.12
        updateLifeCubes(time)
        if (activeTheme === 'dusk') {
          updateDusk(time)
          renderer.render(duskScene, duskCamera)
        } else if (activeTheme === 'space') {
          updateGalaxy(time)
          updateMeteors(time)
          renderer.render(spaceScene, spaceCamera)
        } else {
          renderer.render(scene, camera)
        }
      }
    }

    webglCanvas.addEventListener('webglcontextlost', function (event) {
      event.preventDefault()
      root.dataset.renderer = 'canvas'
      webglCanvas.style.display = 'none'
      resetSpaceTitleLayout()
      delete root.dataset.spaceCamera
      threeLayer = null
    }, false)

    threeLayer.resize(width, height, pixelRatio)
    threeLayer.setTheme(activeTheme)
    root.dataset.renderer = 'three'
  }

  function loadThreeLayer () {
    if (!webglCanvas) return
    import('./vendor/three.module.min.js').then(initThreeLayer).catch(function (error) {
      root.dataset.renderer = 'canvas'
      root.dataset.rendererError = error && error.message ? error.message : 'three-init-failed'
      webglCanvas.style.display = 'none'
      if (activeTheme === 'space') resetSpaceTitleLayout()
    })
  }

  function draw (time) {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    if (activeTheme === 'space') drawSpace(time)
    else if (activeTheme === 'life') drawLife(time)
    else drawDusk(time)
    if (threeLayer) threeLayer.render(time)
  }

  function syncPointer (event) {
    var bounds = root.getBoundingClientRect()
    pointerX = event.clientX - bounds.left
    pointerY = event.clientY - bounds.top
    pointerActive = pointerX >= 0 && pointerY >= 0 && pointerX <= bounds.width && pointerY <= bounds.height
    root.dataset.pointer = pointerActive ? 'active' : 'idle'
    if (threeLayer && pointerActive) {
      threeLayer.setPointer(pointerX / bounds.width * 2 - 1, 1 - pointerY / bounds.height * 2)
    }
  }

  function isToggleEvent (event) {
    return event.target instanceof Element && Boolean(event.target.closest('#vexpaer-scene-toggle'))
  }

  root.addEventListener('pointerdown', function (event) {
    if (isToggleEvent(event)) return
    syncPointer(event)
    if (activeTheme === 'space' && threeLayer) {
      threeLayer.beginDrag(pointerX, pointerY)
      if (root.setPointerCapture) root.setPointerCapture(event.pointerId)
      return
    }
    if (activeTheme !== 'life') return

    var cell = getLifeCell(event)
    if (!cell) return
    lifePaintValue = life[cell.index] ? 0 : 1
    lifePainting = true
    lastLifeStep = performance.now()
    root.classList.add('is-painting')
    root.dataset.lifeBrush = lifePaintValue ? 'birth' : 'kill'
    if (root.setPointerCapture) root.setPointerCapture(event.pointerId)
    paintLifeLine(null, cell, lifePaintValue)
  })

  root.addEventListener('pointermove', function (event) {
    if (isToggleEvent(event)) return
    syncPointer(event)
    if (activeTheme === 'space' && threeLayer) threeLayer.drag(pointerX, pointerY)
    if (activeTheme === 'life' && lifePainting) {
      paintLifeLine(lastLifeCell, getLifeCell(event), lifePaintValue)
    }
  }, { passive: true })

  root.addEventListener('pointerleave', function () {
    if (lifePainting) return
    pointerActive = false
    root.dataset.pointer = 'idle'
  }, { passive: true })

  root.addEventListener('pointerup', function (event) {
    if (threeLayer) threeLayer.endDrag()
    stopLifePainting(event)
  })
  root.addEventListener('pointercancel', function (event) {
    if (threeLayer) threeLayer.endDrag()
    stopLifePainting(event)
  })

  function frame (time) {
    if (!root.isConnected) return
    if (visible && !document.hidden && (!reducedMotion.matches || time - lastFrame > 800)) {
      draw(time)
      lastFrame = time
    }
    window.requestAnimationFrame(frame)
  }

  button.addEventListener('click', function (event) {
    event.stopPropagation()
    setTheme(nextTheme())
  })

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(root)
  } else {
    window.addEventListener('resize', resize, { passive: true })
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = Boolean(entries[0] && entries[0].isIntersecting)
      document.body.classList.toggle('vexpaer-home-hero-visible', visible)
    }, { threshold: 0.01 }).observe(root)

    var quickAccess = document.getElementById('vexpaer-quick-access')
    if (quickAccess) {
      new IntersectionObserver(function (entries) {
        document.body.classList.toggle('vexpaer-quick-access-visible', Boolean(entries[0] && entries[0].isIntersecting))
      }, { threshold: 0.05 }).observe(quickAccess)
    }
  }

  reducedMotion.addEventListener && reducedMotion.addEventListener('change', function () {
    draw(performance.now())
  })

  updateButton()
  resize()
  if (activeTheme === 'dusk') applyDuskTitleLayout()
  loadThreeLayer()
  window.requestAnimationFrame(frame)
})()
