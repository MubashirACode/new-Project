# ⚡ HYPER SCROLL — React + Vite

Brutal 3D scroll experience converted from vanilla JS to React + Vite.

## 📁 Project Structure

```
hyper-scroll/
├── index.html              # Vite entry HTML
├── vite.config.js          # Vite config with React plugin
├── package.json            # Dependencies
└── src/
    ├── main.jsx            # ReactDOM.createRoot entry
    ├── App.jsx             # Root component — assembles everything
    ├── HUD.jsx             # HUD overlay (FPS, velocity, coord)
    ├── WorldItem.jsx       # Renders card / big-text / star items
    ├── useHyperScroll.js   # Custom hook: Lenis + RAF loop + 3D render
    └── index.css           # All global styles (original design preserved)
```

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## 🧠 Architecture

| File | Role |
|------|------|
| `useHyperScroll.js` | All animation logic: Lenis smooth scroll, RAF loop, 3D transforms, perspective warp, star stretch, RGB split |
| `generateItemData()` | Generates stable random data for 20 items + 150 stars on mount |
| `WorldItem.jsx` | Pure presentational component — renders based on `item.type` |
| `HUD.jsx` | Displays live FPS, scroll velocity, camera coord |
| `App.jsx` | Wires refs, state and components together |

## 📦 Dependencies

- `react` + `react-dom` ^18
- `@studio-freight/lenis` ^1.0.33 — smooth scroll
- `vite` ^5 + `@vitejs/plugin-react` ^4 — build tool
