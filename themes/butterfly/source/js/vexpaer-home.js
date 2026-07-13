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
        radius: 0.45 + random() * 1.5,
        alpha: 0.25 + random() * 0.7,
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
    fillBackground('#211433', '#0f0f44')

    var sunX = width * 0.3
    var sunY = height * 0.18
    var sunRadius = Math.max(38, Math.min(width, height) * 0.058)
    var glow = context.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3.2)
    glow.addColorStop(0, 'rgba(245, 164, 101, .42)')
    glow.addColorStop(1, 'rgba(245, 164, 101, 0)')
    context.fillStyle = glow
    context.fillRect(sunX - sunRadius * 3.2, sunY - sunRadius * 3.2, sunRadius * 6.4, sunRadius * 6.4)
    context.beginPath()
    context.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
    context.fillStyle = '#d18a59'
    context.fill()

    drawMountains(height * 0.58, '#31344c', [
      [0.1, 0.5], [0.18, 0.29], [0.26, 0.51], [0.36, 0.24],
      [0.45, 0.52], [0.58, 0.21], [0.68, 0.53], [0.79, 0.28], [0.9, 0.5]
    ])
    drawMountains(height * 0.69, '#202b3b', [
      [0.08, 0.57], [0.2, 0.44], [0.32, 0.63], [0.47, 0.42],
      [0.61, 0.61], [0.75, 0.45], [0.88, 0.58]
    ])

    var seconds = time * 0.001
    context.lineCap = 'round'
    for (var blade = 0; blade < grass.length; blade++) {
      var item = grass[blade]
      var x = item.x * width
      var base = height * (0.62 + item.depth * 0.42)
      var length = (18 + item.depth * 90) * item.height
      var sway = Math.sin(seconds * 0.7 + item.phase) * (1.5 + item.depth * 4)
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
      context.strokeStyle = item.shade > 0.55 ? 'rgba(108, 137, 75, .72)' : 'rgba(59, 83, 57, .76)'
      context.lineWidth = 0.55 + item.depth * 1.25
      context.stroke()
    }

    for (var light = 0; light < fireflies.length; light++) {
      var firefly = fireflies[light]
      var pulse = 0.3 + Math.sin(seconds * firefly.drift + firefly.phase) * 0.28
      var fireflyX = firefly.x * width + Math.sin(seconds * 0.18 + firefly.phase) * 8
      var fireflyY = firefly.y * height + Math.cos(seconds * 0.15 + firefly.phase) * 5
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
      context.beginPath()
      context.arc(fireflyX, fireflyY, firefly.radius, 0, Math.PI * 2)
      context.fillStyle = 'rgba(239, 222, 130, ' + Math.max(0.08, pulse) + ')'
      context.fill()
    }
  }

  function drawSpace (time) {
    fillBackground('#000002', '#030207')
    var seconds = time * 0.001
    var nebula = context.createRadialGradient(width * 0.48, height * 0.44, 0, width * 0.48, height * 0.44, Math.max(width, height) * 0.62)
    nebula.addColorStop(0, 'rgba(72, 55, 91, .11)')
    nebula.addColorStop(0.38, 'rgba(38, 37, 61, .055)')
    nebula.addColorStop(1, 'rgba(3, 2, 7, 0)')
    context.fillStyle = nebula
    context.fillRect(0, 0, width, height)

    var distantCloud = context.createRadialGradient(width * 0.78, height * 0.22, 0, width * 0.78, height * 0.22, Math.max(width, height) * 0.42)
    distantCloud.addColorStop(0, 'rgba(51, 58, 83, .06)')
    distantCloud.addColorStop(1, 'rgba(0, 0, 2, 0)')
    context.fillStyle = distantCloud
    context.fillRect(0, 0, width, height)

    for (var index = 0; index < stars.length; index++) {
      var star = stars[index]
      var alpha = star.alpha * (0.38 + Math.sin(seconds * star.speed + star.phase) * 0.18)
      var starX = star.x * width
      var starY = star.y * height
      var starRadius = Math.max(0.35, star.radius * 0.72)
      if (pointerActive) {
        var starDx = starX - pointerX
        var starDy = starY - pointerY
        var starDistance = Math.sqrt(starDx * starDx + starDy * starDy)
        if (starDistance < 170) {
          var starLight = 1 - starDistance / 170
          alpha = Math.min(0.92, alpha + starLight * 0.24)
          starRadius *= 1 + starLight * 0.42
        }
      }
      context.beginPath()
      context.arc(starX, starY, starRadius, 0, Math.PI * 2)
      context.fillStyle = 'rgba(218, 217, 226, ' + Math.max(0.025, alpha) + ')'
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
    fillBackground('#08082d', '#0f0f44')
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
    context.shadowColor = 'rgba(74, 229, 196, .45)'
    context.fillStyle = 'rgba(91, 231, 200, ' + pulse + ')'
    for (var index = 0; index < life.length; index++) {
      if (!life[index]) continue
      var x = (index % lifeColumns) * lifeCell
      var y = Math.floor(index / lifeColumns) * lifeCell
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
      '  float twinkle = 0.78 + 0.22 * sin(uTime * 0.72 + aPhase * 41.0);',
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
      'uniform float uSoftEdge;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'varying float vPointerLight;',
      'void main() {',
      '  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));',
      '  float glow = 1.0 - smoothstep(0.04, uSoftEdge, distanceToCenter);',
      '  float alpha = glow * vAlpha * uOpacity * (1.0 + vPointerLight * 0.28);',
      '  if (alpha < 0.002) discard;',
      '  vec3 litColor = mix(vColor, vec3(1.0, 0.97, 0.92), vPointerLight * 0.16);',
      '  gl_FragColor = vec4(litColor, alpha);',
      '}'
    ].join('\n')

    function createGalaxyMaterial (opacity, pointScale, maxPointSize, softEdge, blending, pointerResponse) {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: pixelRatio },
          uOpacity: { value: opacity },
          uPointScale: { value: pointScale },
          uMaxPointSize: { value: maxPointSize },
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

    var galaxyStarMaterial = createGalaxyMaterial(1, 1.16, 5.8, 0.5, THREE.AdditiveBlending, 1)
    var galaxyHazeMaterial = createGalaxyMaterial(0.82, 1.72, 32, 0.5, THREE.AdditiveBlending, 0.65)
    var galaxyDustMaterial = createGalaxyMaterial(0.2, 0.75, 8, 0.5, THREE.NormalBlending, 0)
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

    function createGalaxyConfig () {
      galaxySeed = (galaxySeed + 0x9e3779b9) >>> 0
      var random = randomFactory(galaxySeed)
      var armTotal = 3 + Math.floor(random() * 5)
      var armProfiles = []
      for (var index = 0; index < armTotal; index++) {
        armProfiles.push({
          phase: (random() - 0.5) * 0.64,
          twist: 0.75 + random() * 0.6,
          width: 0.65 + random() * 0.9,
          length: 0.78 + random() * 0.38,
          density: 0.72 + random() * 0.4,
          drift: 0.18 + random() * 0.34,
          branch: 0.6 + random() * 0.8
        })
      }
      return {
        seed: galaxySeed,
        arms: armTotal,
        armProfiles: armProfiles,
        radius: 5.45 + random() * 1.05,
        twist: 0.34 + random() * 0.54,
        xScale: 0.88 + random() * 0.25,
        zScale: 0.82 + random() * 0.3,
        coreScale: 0.86 + random() * 0.36,
        branchChance: 0.1 + random() * 0.24,
        armNoise: 0.11 + random() * 0.17,
        rotation: random() * Math.PI * 2,
        spin: 0.004 + random() * 0.01,
        tiltX: (random() - 0.5) * 0.14,
        tiltZ: (random() - 0.5) * 0.44,
        warp: random() * Math.PI * 2,
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
        var armLimit = Math.max(3.8, config.radius * profile.length)
        var radial = 0.48 + Math.pow(random(), 0.68) * (armLimit - 0.48)
        var armAngle = arm / config.arms * twoPi + profile.phase + radial * config.twist * profile.twist
        armAngle += Math.sin(radial * profile.drift + config.warp + arm) * (0.08 + radial * 0.015)
        if (random() < config.branchChance * profile.branch) armAngle += (random() > 0.5 ? 1 : -1) * (0.1 + radial * (0.018 + random() * 0.02))
        var interArm = random() < 0.16
        if (interArm) armAngle += centeredNoise(random) * 0.68
        armAngle += centeredNoise(random) * (config.armNoise + radial * 0.042) * profile.width
        var armWidth = centeredNoise(random) * (0.1 + radial * 0.06) * profile.width
        var armX = (Math.cos(armAngle) * radial + Math.cos(armAngle + Math.PI / 2) * armWidth) * config.xScale
        var armZ = (Math.sin(armAngle) * radial + Math.sin(armAngle + Math.PI / 2) * armWidth) * config.zScale
        var armY = centeredNoise(random) * (0.07 + radial * 0.035) * profile.width + Math.sin(armAngle * 2 + config.warp) * radial * 0.018
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
          var hazeLimit = Math.max(4, config.radius * hazeProfile.length)
          var hazeRadial = 0.65 + Math.pow(random(), 0.68) * (hazeLimit - 0.65)
          var hazeArmAngle = hazeArm / config.arms * twoPi + hazeProfile.phase + hazeRadial * config.twist * hazeProfile.twist
          hazeArmAngle += Math.sin(hazeRadial * hazeProfile.drift + config.warp + hazeArm) * (0.09 + hazeRadial * 0.018)
          if (random() < config.branchChance * hazeProfile.branch) hazeArmAngle += (random() > 0.5 ? 1 : -1) * (0.12 + hazeRadial * 0.025)
          hazeArmAngle += centeredNoise(random) * (config.armNoise * 1.45 + hazeRadial * 0.06) * hazeProfile.width
          var hazeWidth = centeredNoise(random) * (0.2 + hazeRadial * 0.1) * hazeProfile.width
          writeParticle(haze, hazeIndex, (Math.cos(hazeArmAngle) * hazeRadial + Math.cos(hazeArmAngle + Math.PI / 2) * hazeWidth) * config.xScale, centeredNoise(random) * (0.1 + hazeRadial * 0.06) * hazeProfile.width, (Math.sin(hazeArmAngle) * hazeRadial + Math.sin(hazeArmAngle + Math.PI / 2) * hazeWidth) * config.zScale, 2.8 + random() * 4.7, random(), (0.035 + random() * 0.065) * hazeProfile.density, hazeCool, mutedViolet, random())
        } else {
          var outerHazeRadius = 4.5 + Math.pow(random(), 0.42) * 7.4
          var outerHazeAngle = random() * twoPi
          writeParticle(haze, hazeIndex, Math.cos(outerHazeAngle) * outerHazeRadius * config.xScale, centeredNoise(random) * (1 + outerHazeRadius * 0.2), Math.sin(outerHazeAngle) * outerHazeRadius * config.zScale, 1.8 + random() * 3.8, random(), 0.012 + random() * 0.032, hazeCool, haloViolet, random())
        }
      }

      for (var dustIndex = 0; dustIndex < dustCount; dustIndex++) {
        var dustArm = Math.floor(random() * config.arms)
        var dustProfile = config.armProfiles[dustArm]
        var dustLimit = Math.max(3.7, config.radius * dustProfile.length)
        var dustRadius = 0.7 + Math.pow(random(), 0.72) * (dustLimit - 0.7)
        var dustAngle = dustArm / config.arms * twoPi + dustProfile.phase + dustRadius * config.twist * dustProfile.twist - 0.1
        dustAngle += Math.sin(dustRadius * dustProfile.drift + config.warp + dustArm) * (0.06 + dustRadius * 0.012)
        dustAngle += centeredNoise(random) * (0.09 + dustRadius * 0.028) * dustProfile.width
        var dustWidth = centeredNoise(random) * (0.08 + dustRadius * 0.045) * dustProfile.width
        writeParticle(dust, dustIndex, (Math.cos(dustAngle) * dustRadius + Math.cos(dustAngle + Math.PI / 2) * dustWidth) * config.xScale, centeredNoise(random) * (0.035 + dustRadius * 0.017) * dustProfile.width, (Math.sin(dustAngle) * dustRadius + Math.sin(dustAngle + Math.PI / 2) * dustWidth) * config.zScale, 1.2 + random() * 2.4, random(), 0.03 + random() * 0.07, darkDust, liftedDust, random())
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
      root.dataset.galaxyRotation = galaxyGroup.rotation.y.toFixed(3)
    }

    var lifeCapacity = Math.max(20000, life.length)
    var lifeGeometry = new THREE.BoxGeometry(1, 1, 1)
    var lifeMaterial = new THREE.MeshStandardMaterial({
      color: '#45ffd1',
      emissive: '#0e765f',
      emissiveIntensity: 1.8,
      roughness: 0.48,
      metalness: 0.18,
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

    var lifeAmbient = new THREE.AmbientLight('#4fffe0', 0.72)
    var lifeKeyLight = new THREE.DirectionalLight('#c4fff5', 2.35)
    lifeKeyLight.position.set(-1.4, 2.2, 3.5)
    var lifeRimLight = new THREE.PointLight('#6278ff', 4.6, 6)
    lifeRimLight.position.set(-2.3, -1.1, 2.8)
    lifeAmbient.visible = false
    lifeKeyLight.visible = false
    lifeRimLight.visible = false
    scene.add(lifeAmbient)
    scene.add(lifeKeyLight)
    scene.add(lifeRimLight)

    var lifeDummy = new THREE.Object3D()
    var lifeCubeColor = new THREE.Color()
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
        var ageMix = alive ? Math.min(18, life[index] + 1) / 18 : 0
        lifeCubeColor.setHSL(0.47 + ageMix * 0.12 + (column % 2) * 0.008, 0.78, alive ? 0.57 + ageMix * 0.1 : 0.08)
        lifeMesh.setColorAt(index, lifeCubeColor)
      }
      lifeMesh.instanceMatrix.needsUpdate = true
      if (lifeMesh.instanceColor) lifeMesh.instanceColor.needsUpdate = true
    }

    rebuildLifeLayout()
    root.dataset.lifeRenderer = 'cubes'

    var pointerTarget = new THREE.Vector2(50, 50)
    var themeSettings = {
      dusk: { index: 0, colorA: '#ffe7a3', colorB: '#a8d878', size: 3.1, opacity: 0.95 },
      space: { index: 1, colorA: '#ffffff', colorB: '#70cfff', size: 2.65, opacity: 0.94 },
      life: { index: 2, colorA: '#45ffd1', colorB: '#6575ff', size: 2.4, opacity: 0.24 }
    }

    threeLayer = {
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
        points.visible = theme !== 'space'
        if (theme === 'space') {
          configureSpaceCamera()
          rebuildGalaxy(previousTheme !== 'space' || !galaxyConfig)
          galaxyGroup.visible = true
          meteorGroup.visible = true
          root.dataset.spaceCamera = 'perspective'
        } else {
          galaxyGroup.visible = false
          meteorGroup.visible = false
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
        if (activeTheme === 'space') {
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
    import('./vendor/three.module.min.js').then(initThreeLayer).catch(function () {
      root.dataset.renderer = 'canvas'
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
  }

  reducedMotion.addEventListener && reducedMotion.addEventListener('change', function () {
    draw(performance.now())
  })

  updateButton()
  resize()
  loadThreeLayer()
  window.requestAnimationFrame(frame)
})()
