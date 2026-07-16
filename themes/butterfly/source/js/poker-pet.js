(() => {
  'use strict'

  const CELL_WIDTH = 192
  const CELL_HEIGHT = 208
  const LOOK_STEP = 22.5
  const GAZE_TIMEOUT = 5000
  const DRAG_THRESHOLD = 6
  const STORAGE_ENABLED = 'poker-pet-enabled'
  const STORAGE_POSITION = 'poker-pet-position-v1'

  const states = Object.freeze({
    idle: { row: 0, frames: 6, frameDuration: 260 },
    'running-right': { row: 1, frames: 8, frameDuration: 105 },
    'running-left': { row: 2, frames: 8, frameDuration: 105 },
    waving: { row: 3, frames: 4, frameDuration: 190 },
    jumping: { row: 4, frames: 5, frameDuration: 135 },
    failed: { row: 5, frames: 8, frameDuration: 170 },
    waiting: { row: 6, frames: 6, frameDuration: 230 },
    running: { row: 7, frames: 6, frameDuration: 145 },
    review: { row: 8, frames: 6, frameDuration: 190 }
  })

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

  const storage = {
    get (key) {
      try {
        return window.localStorage.getItem(key)
      } catch (error) {
        return null
      }
    },
    set (key, value) {
      try {
        window.localStorage.setItem(key, value)
      } catch (error) {
        // Storage can be unavailable in strict privacy modes; the pet still works.
      }
    }
  }

  class PokerPet {
    constructor (root, toggleButton) {
      this.root = root
      this.canvas = root.querySelector('#poker-pet-canvas')
      this.context = this.canvas.getContext('2d', { alpha: true })
      this.toggleButton = toggleButton
      this.spriteUrl = root.dataset.spritesheet
      this.defaultEnabled = root.dataset.defaultEnabled !== 'false'
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      this.image = null
      this.imageReady = false
      this.imageLoading = false
      this.enabled = false
      this.rafId = 0
      this.lastFrameAt = 0
      this.frameElapsed = 0
      this.frameIndex = 0
      this.completedLoops = 0
      this.loopsToPlay = Infinity
      this.stateName = 'idle'
      this.randomTimer = 0
      this.resizeTimer = 0
      this.reactionAnimation = null
      this.gazeIndex = null
      this.lastPointerAt = 0

      this.pointerDown = false
      this.dragging = false
      this.activePointerId = null
      this.dragStartX = 0
      this.dragStartY = 0
      this.dragStartLeft = 0
      this.dragStartTop = 0
      this.lastDragX = 0

      this.animate = this.animate.bind(this)
      this.onDocumentPointerMove = this.onDocumentPointerMove.bind(this)
      this.onPetPointerDown = this.onPetPointerDown.bind(this)
      this.onPetPointerMove = this.onPetPointerMove.bind(this)
      this.onPetPointerEnd = this.onPetPointerEnd.bind(this)
      this.onPetClick = this.onPetClick.bind(this)
      this.onKeyDown = this.onKeyDown.bind(this)
      this.onResize = this.onResize.bind(this)
      this.onVisibilityChange = this.onVisibilityChange.bind(this)
    }

    init () {
      if (!this.context || !this.spriteUrl) return

      this.context.imageSmoothingEnabled = true
      this.root.addEventListener('pointerdown', this.onPetPointerDown)
      this.root.addEventListener('pointermove', this.onPetPointerMove)
      this.root.addEventListener('pointerup', this.onPetPointerEnd)
      this.root.addEventListener('pointercancel', this.onPetPointerEnd)
      this.root.addEventListener('click', this.onPetClick)
      this.root.addEventListener('keydown', this.onKeyDown)
      this.toggleButton.addEventListener('click', () => this.setEnabled(!this.enabled, true))
      document.addEventListener('pointermove', this.onDocumentPointerMove, { passive: true })
      document.addEventListener('visibilitychange', this.onVisibilityChange)
      window.addEventListener('resize', this.onResize, { passive: true })
      this.readModeObserver = new MutationObserver(() => this.syncReadMode())
      this.readModeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })

      const storedEnabled = storage.get(STORAGE_ENABLED)
      const enabled = storedEnabled === null
        ? this.defaultEnabled
        : storedEnabled !== 'false' && storedEnabled !== '0'

      this.setEnabled(enabled, false)
    }

    setEnabled (enabled, persist) {
      this.enabled = Boolean(enabled)
      this.root.hidden = !this.enabled

      const title = this.enabled
        ? this.toggleButton.dataset.titleOff
        : this.toggleButton.dataset.titleOn

      this.toggleButton.title = title
      this.toggleButton.setAttribute('aria-label', title)
      this.toggleButton.setAttribute('aria-pressed', String(this.enabled))
      this.toggleButton.classList.toggle('is-off', !this.enabled)

      const icon = this.toggleButton.querySelector('i')
      if (icon) {
        icon.classList.toggle('fa-paw', this.enabled)
        icon.classList.toggle('fa-eye-slash', !this.enabled)
      }

      if (persist) storage.set(STORAGE_ENABLED, String(this.enabled))

      if (this.enabled) {
        this.loadSprite()
        window.requestAnimationFrame(() => this.restorePosition())
        if (this.imageReady) this.start()
      } else {
        this.pointerDown = false
        this.dragging = false
        this.root.classList.remove('is-grabbing')
        this.cancelReactionAnimation()
        this.stop()
      }
    }

    loadSprite () {
      if (this.imageReady || this.imageLoading) return

      this.imageLoading = true
      const image = new Image()
      image.decoding = 'async'

      image.addEventListener('load', () => {
        this.image = image
        this.imageReady = true
        this.imageLoading = false
        this.root.classList.remove('is-error')
        this.root.classList.add('is-ready')
        this.setState('idle')
        this.drawState()
        if (this.enabled) this.start()
      }, { once: true })

      image.addEventListener('error', () => {
        this.imageLoading = false
        this.root.classList.remove('is-ready')
        this.root.classList.add('is-error')
        console.warn('pokerFace desktop pet spritesheet could not be loaded.')
      }, { once: true })

      image.src = this.spriteUrl
    }

    start () {
      if (
        !this.enabled ||
        !this.imageReady ||
        this.rafId ||
        document.body.classList.contains('read-mode')
      ) return
      this.lastFrameAt = performance.now()
      this.rafId = window.requestAnimationFrame(this.animate)
      this.scheduleRandomAction()
    }

    stop () {
      if (this.rafId) window.cancelAnimationFrame(this.rafId)
      this.rafId = 0
      window.clearTimeout(this.randomTimer)
      this.randomTimer = 0
    }

    animate (now) {
      this.rafId = 0
      if (!this.enabled || !this.imageReady || document.hidden) return

      const elapsed = Math.min(now - this.lastFrameAt, 250)
      this.lastFrameAt = now

      if (
        !this.dragging &&
        this.stateName === 'idle' &&
        this.gazeIndex !== null &&
        now - this.lastPointerAt <= GAZE_TIMEOUT
      ) {
        this.drawLook(this.gazeIndex)
      } else {
        if (now - this.lastPointerAt > GAZE_TIMEOUT) this.gazeIndex = null
        this.advanceState(elapsed)
        this.drawState()
      }

      this.rafId = window.requestAnimationFrame(this.animate)
    }

    advanceState (elapsed) {
      const state = states[this.stateName]
      this.frameElapsed += elapsed

      while (this.frameElapsed >= state.frameDuration) {
        this.frameElapsed -= state.frameDuration
        this.frameIndex += 1

        if (this.frameIndex >= state.frames) {
          this.frameIndex = 0
          this.completedLoops += 1

          if (this.completedLoops >= this.loopsToPlay) {
            this.setState('idle')
            this.scheduleRandomAction()
            break
          }
        }
      }
    }

    setState (name, loops = Infinity, force = false) {
      if (!states[name]) return
      if (!force && this.stateName === name && this.loopsToPlay === loops) return

      this.stateName = name
      this.loopsToPlay = loops
      this.completedLoops = 0
      this.frameIndex = 0
      this.frameElapsed = 0
    }

    playAction (name, loops = 1) {
      if (!this.enabled || !this.imageReady || this.dragging) return
      window.clearTimeout(this.randomTimer)
      this.randomTimer = 0
      this.gazeIndex = null
      this.setState(name, loops, true)
    }

    clickFeedback () {
      const action = Math.random() < 0.72 ? 'waving' : 'jumping'
      this.playAction(action, action === 'waving' ? 2 : 1)

      if (!this.prefersReducedMotion && typeof this.root.animate === 'function') {
        this.cancelReactionAnimation()
        this.reactionAnimation = this.root.animate([
          { transform: 'translateY(0)' },
          { transform: 'translateY(-7px)' },
          { transform: 'translateY(0)' }
        ], { duration: 320, easing: 'ease-out' })
        this.reactionAnimation.addEventListener('finish', () => {
          this.reactionAnimation = null
        }, { once: true })
      }
    }

    cancelReactionAnimation () {
      if (!this.reactionAnimation) return
      this.reactionAnimation.cancel()
      this.reactionAnimation = null
    }

    scheduleRandomAction () {
      window.clearTimeout(this.randomTimer)
      if (!this.enabled || this.prefersReducedMotion) return

      const delay = 8500 + Math.random() * 7500
      this.randomTimer = window.setTimeout(() => {
        if (this.dragging || this.pointerDown || this.stateName !== 'idle' || document.hidden) {
          this.scheduleRandomAction()
          return
        }

        const actions = [
          ['waving', 1],
          ['jumping', 1],
          ['waiting', 1],
          ['running', 2],
          ['review', 1]
        ]
        const [name, loops] = actions[Math.floor(Math.random() * actions.length)]
        this.playAction(name, loops)
      }, delay)
    }

    drawState () {
      const state = states[this.stateName]
      this.drawCell(state.row, this.frameIndex)
    }

    drawLook (index) {
      const row = index < 8 ? 9 : 10
      const column = index < 8 ? index : index - 8
      this.drawCell(row, column)
    }

    drawCell (row, column) {
      if (!this.imageReady) return
      this.context.clearRect(0, 0, CELL_WIDTH, CELL_HEIGHT)
      this.context.drawImage(
        this.image,
        column * CELL_WIDTH,
        row * CELL_HEIGHT,
        CELL_WIDTH,
        CELL_HEIGHT,
        0,
        0,
        CELL_WIDTH,
        CELL_HEIGHT
      )
    }

    onDocumentPointerMove (event) {
      if (
        !this.enabled ||
        !this.imageReady ||
        this.pointerDown ||
        this.dragging ||
        this.stateName !== 'idle' ||
        (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen')
      ) return

      const rect = this.root.getBoundingClientRect()
      const deltaX = event.clientX - (rect.left + rect.width / 2)
      const deltaY = event.clientY - (rect.top + rect.height / 2)
      const distance = Math.hypot(deltaX, deltaY)

      if (distance < 34) {
        this.gazeIndex = null
        return
      }

      const degrees = (Math.atan2(deltaX, -deltaY) * 180 / Math.PI + 360) % 360
      this.gazeIndex = Math.round(degrees / LOOK_STEP) % 16
      this.lastPointerAt = performance.now()
    }

    onPetPointerDown (event) {
      if (!this.enabled || event.button !== 0) return

      const rect = this.root.getBoundingClientRect()
      this.pointerDown = true
      this.dragging = false
      this.activePointerId = event.pointerId
      this.dragStartX = event.clientX
      this.dragStartY = event.clientY
      this.dragStartLeft = rect.left
      this.dragStartTop = rect.top
      this.lastDragX = event.clientX
      this.gazeIndex = null
      this.cancelReactionAnimation()
      this.root.classList.add('is-grabbing')
      if (typeof this.root.setPointerCapture === 'function') {
        this.root.setPointerCapture(event.pointerId)
      }
      event.preventDefault()
      event.stopPropagation()
    }

    onPetPointerMove (event) {
      if (!this.pointerDown || event.pointerId !== this.activePointerId) return

      const deltaX = event.clientX - this.dragStartX
      const deltaY = event.clientY - this.dragStartY

      if (!this.dragging && Math.hypot(deltaX, deltaY) >= DRAG_THRESHOLD) {
        this.dragging = true
        this.root.style.right = 'auto'
        this.root.style.bottom = 'auto'
      }

      if (!this.dragging) return

      const position = this.clampPosition(
        this.dragStartLeft + deltaX,
        this.dragStartTop + deltaY
      )
      this.root.style.left = `${position.left}px`
      this.root.style.top = `${position.top}px`

      const horizontalMovement = event.clientX - this.lastDragX
      if (Math.abs(horizontalMovement) > 1) {
        const nextState = horizontalMovement < 0 ? 'running-left' : 'running-right'
        if (nextState !== this.stateName) this.setState(nextState)
      }
      this.lastDragX = event.clientX
      event.preventDefault()
    }

    onPetPointerEnd (event) {
      if (!this.pointerDown || event.pointerId !== this.activePointerId) return

      const wasDragging = this.dragging
      this.pointerDown = false
      this.dragging = false
      this.activePointerId = null
      this.root.classList.remove('is-grabbing')

      if (
        typeof this.root.hasPointerCapture === 'function' &&
        typeof this.root.releasePointerCapture === 'function' &&
        this.root.hasPointerCapture(event.pointerId)
      ) {
        this.root.releasePointerCapture(event.pointerId)
      }

      if (wasDragging) {
        this.savePosition()
        this.setState('idle')
        this.scheduleRandomAction()
      } else if (event.type !== 'pointercancel') {
        this.clickFeedback()
      }

      event.stopPropagation()
    }

    onPetClick (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    onKeyDown (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      this.clickFeedback()
    }

    clampPosition (left, top) {
      const rect = this.root.getBoundingClientRect()
      const edge = 4
      const rightControlsGutter = window.innerWidth <= 768 ? 34 : 38
      const maxLeft = Math.max(edge, window.innerWidth - rect.width - rightControlsGutter)
      const maxTop = Math.max(edge, window.innerHeight - rect.height - edge)

      return {
        left: clamp(left, edge, maxLeft),
        top: clamp(top, edge, maxTop)
      }
    }

    savePosition () {
      const rect = this.root.getBoundingClientRect()
      const min = 4
      const rightControlsGutter = window.innerWidth <= 768 ? 34 : 38
      const maxLeft = Math.max(min, window.innerWidth - rect.width - rightControlsGutter)
      const maxTop = Math.max(min, window.innerHeight - rect.height - min)
      const xRange = Math.max(1, maxLeft - min)
      const yRange = Math.max(1, maxTop - min)

      storage.set(STORAGE_POSITION, JSON.stringify({
        x: clamp((rect.left - min) / xRange, 0, 1),
        y: clamp((rect.top - min) / yRange, 0, 1)
      }))
    }

    restorePosition () {
      if (!this.enabled || this.root.hidden) return
      const storedPosition = storage.get(STORAGE_POSITION)
      if (!storedPosition) return

      try {
        const position = JSON.parse(storedPosition)
        if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) return

        const rect = this.root.getBoundingClientRect()
        const min = 4
        const rightControlsGutter = window.innerWidth <= 768 ? 34 : 38
        const maxLeft = Math.max(min, window.innerWidth - rect.width - rightControlsGutter)
        const maxTop = Math.max(min, window.innerHeight - rect.height - min)

        this.root.style.right = 'auto'
        this.root.style.bottom = 'auto'
        this.root.style.left = `${min + clamp(position.x, 0, 1) * (maxLeft - min)}px`
        this.root.style.top = `${min + clamp(position.y, 0, 1) * (maxTop - min)}px`
      } catch (error) {
        // Ignore malformed state left by older versions.
      }
    }

    onResize () {
      window.clearTimeout(this.resizeTimer)
      this.resizeTimer = window.setTimeout(() => this.restorePosition(), 120)
    }

    onVisibilityChange () {
      if (document.hidden) {
        this.stop()
      } else if (this.enabled) {
        this.start()
      }
    }

    syncReadMode () {
      if (document.body.classList.contains('read-mode')) {
        this.stop()
      } else if (this.enabled) {
        this.start()
      }
    }
  }

  const initPokerPet = () => {
    const root = document.getElementById('poker-pet')
    const toggleButton = document.getElementById('poker-pet-toggle')
    if (!root || !toggleButton || root.dataset.initialized === 'true') return

    root.dataset.initialized = 'true'
    const pet = new PokerPet(root, toggleButton)
    pet.init()

    window.pokerPet = {
      toggle: () => pet.setEnabled(!pet.enabled, true),
      enable: () => pet.setEnabled(true, true),
      disable: () => pet.setEnabled(false, true)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPokerPet, { once: true })
  } else {
    initPokerPet()
  }
})()
