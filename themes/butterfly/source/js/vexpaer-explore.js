(function () {
  'use strict'

  var root = document.querySelector('[data-explore-root]')
  if (!root) return

  var gsap = window.gsap
  if (!gsap) {
    root.dataset.motion = 'fallback'
    return
  }

  var motionMedia = gsap.matchMedia()

  motionMedia.add({
    desktop: '(min-width: 821px)',
    mobile: '(max-width: 820px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, function (context) {
    var conditions = context.conditions
    var revealTargets = root.querySelectorAll('[data-explore-reveal]:not([data-project-card])')
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-project-card]'))
    var visualStages = root.querySelectorAll('.vexpaer-project-card__visual-stage')
    var cleanups = []

    if (conditions.reduceMotion) {
      root.dataset.motion = 'reduced'
      return
    }

    root.dataset.motion = 'gsap'

    if (revealTargets.length) {
      gsap.from(revealTargets, {
        autoAlpha: 0,
        y: conditions.desktop ? 30 : 18,
        duration: conditions.desktop ? 0.82 : 0.68,
        stagger: conditions.desktop ? 0.075 : 0.055,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility'
      })
    }

    if (cards.length) {
      gsap.from(cards, {
        autoAlpha: 0,
        y: conditions.desktop ? 54 : 30,
        scale: 0.975,
        duration: 0.9,
        stagger: cards.length > 1 ? 0.12 : 0,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility'
      })
    }

    if (visualStages.length) {
      gsap.from(visualStages, {
        autoAlpha: 0,
        scale: 0.82,
        rotation: function (index) { return index % 2 ? 5 : -5 },
        duration: 1.05,
        stagger: visualStages.length > 1 ? 0.1 : 0,
        ease: 'back.out(1.25)',
        clearProps: 'transform,opacity,visibility'
      })
    }

    cards.forEach(function (card, index) {
      var stage = card.querySelector('.vexpaer-project-card__visual-stage')
      var arrow = card.querySelector('.vexpaer-project-card__cta-arrow')
      var rotation = index % 2 ? 1.5 : -1.5

      if (!stage) return

      function enter () {
        gsap.to(stage, {
          y: -8,
          scale: 1.025,
          rotation: rotation,
          duration: 0.48,
          ease: 'power3.out',
          overwrite: 'auto'
        })
        if (arrow) {
          gsap.to(arrow, {
            x: 3,
            y: -3,
            duration: 0.34,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        }
      }

      function leave () {
        gsap.to(stage, {
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.52,
          ease: 'power3.out',
          overwrite: 'auto'
        })
        if (arrow) {
          gsap.to(arrow, {
            x: 0,
            y: 0,
            duration: 0.38,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        }
      }

      function focusOut (event) {
        if (!card.contains(event.relatedTarget)) leave()
      }

      card.addEventListener('pointerenter', enter)
      card.addEventListener('pointerleave', leave)
      card.addEventListener('focusin', enter)
      card.addEventListener('focusout', focusOut)

      cleanups.push(function () {
        card.removeEventListener('pointerenter', enter)
        card.removeEventListener('pointerleave', leave)
        card.removeEventListener('focusin', enter)
        card.removeEventListener('focusout', focusOut)
        gsap.killTweensOf(stage)
        if (arrow) gsap.killTweensOf(arrow)
      })
    })

    return function () {
      cleanups.forEach(function (cleanup) { cleanup() })
      root.dataset.motion = 'idle'
    }
  })

  window.addEventListener('pagehide', function () {
    motionMedia.revert()
  }, { once: true })
})()
