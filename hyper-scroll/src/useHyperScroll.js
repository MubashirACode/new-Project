import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

const CONFIG = {
  itemCount: 20,
  starCount: 150,
  zGap: 800,
  camSpeed: 2.5,
}
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap

export const TEXTS = [
  'IMPACT', 'VELOCITY', 'BRUTAL', 'SYSTEM',
  'FUTURE', 'DESIGN', 'PIXEL', 'HYPER', 'NEON', 'VOID',
]

export function useHyperScroll({ worldRef, viewportRef, setHud, itemsData }) {
  const stateRef = useRef({
    scroll: 0,
    velocity: 0,
    targetSpeed: 0,
    mouseX: 0,
    mouseY: 0,
  })
  const rafIdRef = useRef(null)
  const lenisRef = useRef(null)
  const itemElsRef = useRef([]) // DOM refs per item

  useEffect(() => {
    if (!worldRef.current || !viewportRef.current) return

    const state = stateRef.current

    // ── Lenis ──
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ({ scroll, velocity }) => {
      state.scroll = scroll
      state.targetSpeed = velocity
    })

    // ── Mouse ──
    const onMouseMove = (e) => {
      state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── RAF ──
    let lastTime = 0

    const raf = (time) => {
      lenis.raf(time)

      const delta = time - lastTime
      lastTime = time
      const fps = Math.round(1000 / (delta || 16))

      state.velocity += (state.targetSpeed - state.velocity) * 0.1

      setHud({
        fps,
        vel: Math.abs(state.velocity).toFixed(2),
        coord: state.scroll.toFixed(0),
      })

      // Camera tilt
      const tiltX = state.mouseY * 5 - state.velocity * 0.5
      const tiltY = state.mouseX * 5
      if (worldRef.current) {
        worldRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }

      // Dynamic perspective (warp on speed)
      const fov = 1000 - Math.min(Math.abs(state.velocity) * 10, 600)
      if (viewportRef.current) {
        viewportRef.current.style.perspective = `${fov}px`
      }

      // Item render
      const cameraZ = state.scroll * CONFIG.camSpeed
      const modC = CONFIG.loopSize

      itemElsRef.current.forEach((el, idx) => {
        if (!el) return
        const item = itemsData[idx]
        if (!item) return

        let relZ = item.baseZ + cameraZ
        let vizZ = ((relZ % modC) + modC) % modC
        if (vizZ > 500) vizZ -= modC

        let alpha = 1
        if (vizZ < -3000) alpha = 0
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000
        if (vizZ > 100 && item.type !== 'star') alpha = 1 - (vizZ - 100) / 400
        if (alpha < 0) alpha = 0

        el.style.opacity = alpha

        if (alpha > 0) {
          let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`

          if (item.type === 'star') {
            const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.1, 10))
            trans += ` scale3d(1, 1, ${stretch})`
          } else if (item.type === 'text') {
            trans += ` rotateZ(${item.rot}deg)`
            if (Math.abs(state.velocity) > 1) {
              const offset = state.velocity * 2
              el.style.textShadow = `${offset}px 0 red, ${-offset}px 0 cyan`
            } else {
              el.style.textShadow = 'none'
            }
          } else {
            const t = time * 0.001
            const floatY = Math.sin(t + item.x) * 10
            trans += ` rotateZ(${item.rot}deg) rotateY(${floatY}deg)`
          }

          el.style.transform = trans
        }
      })

      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      lenis.destroy()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [worldRef, viewportRef, setHud, itemsData])

  return { itemElsRef }
}

// ── Generate stable item data ──
export function generateItemData() {
  const items = []

  for (let i = 0; i < CONFIG.itemCount; i++) {
    const isHeading = i % 4 === 0

    if (isHeading) {
      items.push({
        type: 'text',
        x: 0, y: 0, rot: 0,
        baseZ: -i * CONFIG.zGap,
        text: TEXTS[i % TEXTS.length],
      })
    } else {
      const angle = (i / CONFIG.itemCount) * Math.PI * 6
      const x = Math.cos(angle) * (window.innerWidth * 0.3)
      const y = Math.sin(angle) * (window.innerHeight * 0.3)
      const rot = (Math.random() - 0.5) * 30
      const randId = Math.floor(Math.random() * 9999)
      const grid = `${Math.floor(Math.random() * 10)}x${Math.floor(Math.random() * 10)}`
      const size = (Math.random() * 100).toFixed(1)

      items.push({
        type: 'card',
        x, y, rot,
        baseZ: -i * CONFIG.zGap,
        text: TEXTS[i % TEXTS.length],
        randId,
        grid,
        size,
        idx: i,
      })
    }
  }

  for (let i = 0; i < CONFIG.starCount; i++) {
    items.push({
      type: 'star',
      x: (Math.random() - 0.5) * 3000,
      y: (Math.random() - 0.5) * 3000,
      baseZ: -Math.random() * CONFIG.loopSize,
    })
  }

  return items
}
