import React from 'react'

export default function HUD({ fps, vel, coord }) {
  return (
    <div className="hud">
      <div className="hud-top">
        <span>SYS.READY</span>
        <div className="hud-line" />
        <span>
          FPS: <strong>{fps}</strong>
        </span>
      </div>

      <div className="center-nav">
        SCROLL VELOCITY // <strong>{vel}</strong>
      </div>

      <div className="hud-bottom">
        <span>
          COORD: <strong>{coord}</strong>
        </span>
        <div className="hud-line" />
        <span>VER 2.0.4 [BETA]</span>
      </div>
    </div>
  )
}
