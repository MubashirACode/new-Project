import React from 'react'

export const WorldItem = React.forwardRef(({ item }, ref) => {
  if (item.type === 'text') {
    return (
      <div className="item" ref={ref}>
        <div className="big-text">{item.text}</div>
      </div>
    )
  }

  if (item.type === 'star') {
    return <div className="item star" ref={ref} />
  }

  // card
  return (
    <div className="item" ref={ref}>
      <div className="card">
        <div className="card-header">
          <span className="card-id">ID-{item.randId}</span>
          <div style={{ width: 10, height: 10, background: 'var(--accent)' }} />
        </div>
        <h2>{item.text}</h2>
        <div className="card-footer">
          <span>GRID: {item.grid}</span>
          <span>DATA_SIZE: {item.size}MB</span>
        </div>
        <div className="card-index">0{item.idx}</div>
      </div>
    </div>
  )
})

WorldItem.displayName = 'WorldItem'
