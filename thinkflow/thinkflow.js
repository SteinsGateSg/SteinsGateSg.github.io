(() => {
  'use strict'

  const initThinkFlow = () => {
    document.querySelectorAll('[data-thinkflow]:not([data-tf-mounted])').forEach(board => {
      board.setAttribute('data-tf-mounted', 'true')

      const tracks = [...board.querySelectorAll('.tf-track')]
      tracks.forEach((track, index) => {
        track.style.setProperty('--tf-delay', `${index * 85}ms`)
      })

      const clearActive = () => {
        board.classList.remove('has-active')
        tracks.forEach(item => item.classList.remove('is-active'))
      }

      const setActive = track => {
        board.classList.add('has-active')
        tracks.forEach(item => item.classList.toggle('is-active', item === track))
      }

      tracks.forEach(track => {
        track.addEventListener('mouseenter', () => setActive(track))
        track.addEventListener('mouseleave', clearActive)
        track.addEventListener('focusin', () => setActive(track))
        track.addEventListener('focusout', event => {
          if (!track.contains(event.relatedTarget)) clearActive()
        })
        track.addEventListener('click', event => {
          if (event.target.closest('summary, details, a, button')) return
          const alreadyActive = track.classList.contains('is-active')
          alreadyActive ? clearActive() : setActive(track)
        })
      })

      // Add the entrance class only when the board is near the viewport.
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting) return
          board.classList.add('tf-ready')
          observer.disconnect()
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
        observer.observe(board)
      } else {
        board.classList.add('tf-ready')
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThinkFlow, { once: true })
  } else {
    initThinkFlow()
  }

  // Butterfly 5.3.x PJAX and hexo-blog-encrypt compatibility.
  document.addEventListener('pjax:complete', initThinkFlow)
  window.addEventListener('hexo-blog-decrypt', initThinkFlow)
})()
