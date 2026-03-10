import React, { useRef, useState, useMemo, useEffect } from 'react'
import HUD from './HUD.jsx'
import { WorldItem } from './WorldItem.jsx'
import { useHyperScroll, generateItemData } from './useHyperScroll.js'

// Generate item data once (stable across renders)
// We need window dimensions so we init lazily inside the component
export default function App() {
  const worldRef = useRef(null)
  const viewportRef = useRef(null)

  const [hud, setHud] = useState({ fps: 60, vel: '0.00', coord: '0' })

  // Generate item data once on mount (needs window size)
  const itemsData = useMemo(() => generateItemData(), [])

  // Get item DOM element refs from the hook
  const { itemElsRef } = useHyperScroll({
    worldRef,
    viewportRef,
    setHud,
    itemsData,
  })

  // Callback ref setter per item index
  const setItemRef = (idx) => (el) => {
    itemElsRef.current[idx] = el
  }

  return (
    <>
      {/* Post-processing overlays */}
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />

      {/* HUD */}
      <HUD fps={hud.fps} vel={hud.vel} coord={hud.coord} />

      {/* 3D World */}
      <div className="viewport" id="viewport" ref={viewportRef}>
        <div className="world" id="world" ref={worldRef}>
          {itemsData.map((item, idx) => (
            <WorldItem
              key={idx}
              item={item}
              ref={setItemRef(idx)}
            />
          ))}
        </div>
      </div>

      {/* Scroll proxy gives scrollable height */}
      <div className="scroll-proxy" />
    </>
  )
}
