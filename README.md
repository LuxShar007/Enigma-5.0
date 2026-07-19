# 🔐 Enigma 5.0 — SIES CSI Hackathon Landing Page

A cinematic, premium landing page for **Enigma 5.0** — SIES Graduate School of Technology's flagship national web development hackathon, organized by the SIES GST Computer Society of India (CSI) Student Chapter. Built with React, WebGL (Three.js), and GSAP for a high-fidelity, buttery-smooth (144Hz+) developer experience.

---

## ✨ Features

### 🌌 Real-Time 3D WebGL Background
- **Oscillating Wave Matrix** — A grid of 2,700+ particle vertices continuously breathing on a complex mathematical sine/cosine interference wave equation.
- **Interactive Gravitational Warp** — Calculates cursor viewport matrices to warp the grid down on mouse hover, creating a fluid reactive wave depression.
- **Floating Glass Crystals** — Faceted 3D octahedrons and icosahedrons running sharp transmission glass physics (`THREE.MeshPhysicalMaterial`) that rotate, bob, and spin faster when hovered.
- **Organic Motion Easing** — Performance-optimized using offscreen sprite caching, delta-time normalized physics, velocity-friction deceleration, and throttled raycasting.

### 🎬 Cinematic Intro
- **Star Wars Opening Crawl** — A 3-phase atmospheric intro (logo orbital ring flash → TIE Fighter flyby → perspective scroll track) accompanied by random red/blue canvas laser bolts. Includes a quick skip action on keypress or click.

### 🎨 OS-Style Premium Design System
- **Floating Capsule Dock** — A macOS-style navigation dock with hover-slide reveal and active section convergence highlight.
- **Holographic 3D Parallax Cards** — Cards inside the `Tracks` section capture mouse telemetry relative to their midpoint, tilting in 3D (`transform-style: preserve-3d`) with distinct `translateZ` offsets on internal titles, icons, and list items for true volumetric depth.
- **Apple Scroll reveals** — Word-by-word scroll-linked reveals scrub text progressively from low-opacity grey to solid white as they enter the focus frame.

### 📊 Interactive Modules
- **Interactive CLI Terminal** — A fully-functional CLI simulator in the `About` dossier card (type `help`, `about`, `tracks`, `prizes`, `timeline`, or `matrix` for digital rain).
- **Simulated Registry Capacity** — Tracks real-time active registry uplink slots, ticking up dynamically from **1,905** toward a **3,000** team capacity with system notifications.
- **Secure Modal Gateway** — Three-route selection portal (Direct Form, Unstop, DevFolio) simulating network handshake latency and outputting a unique cryptographic receipt hash (`ENG5-TR-XXXXXX`).

---

## 🛠️ Tech Stack & Badges

| Tech | Logo Badge | Purpose |
|---|---|---|
| **React 18** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) | Modular Component Architecture |
| **Vite 8** | ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) | Lightning-fast Build Tooling & Bundler |
| **Three.js** | ![Three.js](https://img.shields.io/badge/threejs-%23000000.svg?style=for-the-badge&logo=three.js&logoColor=white) | Math-driven 3D WebGL Wave & Crystal Simulation |
| **GSAP** | ![GSAP](https://img.shields.io/badge/GreenSock-Green?style=for-the-badge&logo=greensock&logoColor=white) | Damped ScrollTrigger & Hero entrance timelines |
| **CSS3** | ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) | Custom Glassmorphic design tokens & responsive dock |
| **Python** | ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) | Custom assets generation (favicons SVG & multi-res ICO) |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/LuxShar007/Enigma-5.0.git

# Navigate into the frontend workspace
cd "Enigma-5.0/frontend"

# Install dependencies
npm install

# Launch local dev server (144Hz feel)
npm run dev

# Compile optimized production dist
npm run build
```

---

## 🗂️ Project Structure

```
Enigma 5.0/
├── frontend/
│   ├── public/
│   │   ├── favicon.ico                 # Multi-res logo favicon
│   │   └── favicon.svg                 # Custom vector logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── StarWarsCrawl.jsx       # Star Wars cinematic intro
│   │   │   ├── OceanWaveBackground.jsx # WebGL particle grid + crystals
│   │   │   ├── DecryptionTerminal.jsx  # About CLI console simulator
│   │   │   ├── Countdown.jsx           # Live capacity bar + timer
│   │   │   ├── RegisterModal.jsx       # Multi-route modal gateway
│   │   │   └── ...other sections
│   │   ├── App.jsx                     # GSAP wiring + IntersectionObserver
│   │   ├── index.css                   # Core styles & variables (~4700 lines)
│   │   └── main.jsx                    # Root entry
│   └── make_favicons.py                # PIL favicon generator utility
├── README.md
└── DOCUMENTATION.md
```

---

## 🎭 Terminal Commands (About Section CLI)

| Command | Action |
|---|---|
| `help` | Outputs operational manifest |
| `about` | Prints hackathon schedule and rules |
| `tracks` | Reveals FinTech & HealthTech directives |
| `prizes` | Displays cash award distributions |
| `timeline` | Loads the sprint chronological schedule |
| `matrix` | Bootstraps digital cascade rain overlay |
| `clear` | Cleanses current screen logs |

---

## 🏆 Hackathon Details

| Key Node | Spec |
|---|---|
| **Event** | Enigma 5.0 — Web Development Hackathon |
| **Organizer** | SIES GST, Navi Mumbai — CSI Chapter |
| **Format** | 36-hour sprint, teams of 4 |
| **Tracks** | FinTech · HealthTech |
| **Prize Pool** | ₹25,000 INR |
| **Capacity** | 1,905 / 3,000 teams registered |
| **Eligibility** | All undergraduate students |

---

MIT © SIES CSI Enigma 5.0 Team · *May the Code be with you.*
