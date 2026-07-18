# 🔐 Enigma 5.0 — SIES CSI Hackathon Landing Page

A cinematic, Star Wars-themed hackathon landing page for **Enigma 5.0** — SIES Graduate School of Technology's flagship web development hackathon, built with React + Vite + GSAP.

---

## ✨ Features

### 🎬 Cinematic Experience
- **Star Wars Opening Crawl** — 3-phase intro (intro text → ENIGMA logo flash → perspective crawl) with a twinkling 3-layer deep-space star field. Click or press any key to skip.
- **Hyperspace Warp Transition** — 260-streak canvas burst fires before the registration modal opens.

### 🎨 Premium Design System
- Dark cyber aesthetic with drifting neon ambient nebula orbs
- Glassmorphism CTA buttons and cards using `backdrop-filter`
- Cursor-tracking spotlight glow on all cards
- Animated cyber-grid backdrop
- Scroll-linked section heading scramble reveals

### 📊 Interactive Sections
| Section | Feature |
|---|---|
| Hero | Glassmorphism CTA buttons |
| About | Interactive CLI terminal (type `help`, `tracks`, `prizes`, `matrix`) |
| The Cipher Unravels | Horizontal GSAP parallax scroll — 4 animated stat panels |
| FAQ | Terminal-style grep search filter |
| Countdown | 24-hour live timer + registration progress bar |
| Contact | Form + CSI website link with white logo |

### ⚡ Performance (240Hz optimised)
- All animations use only `transform` + `opacity` (GPU composited)
- Ambient orb blur reduced to 80px (from 140px)
- `will-change: transform` + `isolation: isolate` on animated elements
- Body scroll locked during Star Wars crawl to prevent layout shifts

---

## 🚀 Getting Started

```bash
git clone https://github.com/LuxShar007/Enigma-5.0.git
cd "Enigma-5.0/frontend"
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
```

---

## 🗂️ Project Structure

```
Enigma 5.0/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StarWarsCrawl.jsx       # Cinematic opening crawl
│   │   │   ├── HyperspaceFlash.jsx     # Canvas hyperspace warp
│   │   │   ├── CipherStrip.jsx         # Horizontal parallax stats
│   │   │   ├── DecryptionTerminal.jsx  # Interactive CLI terminal
│   │   │   ├── Faq.jsx                 # Grep-searchable FAQ
│   │   │   ├── Countdown.jsx           # 24h countdown + reg bar
│   │   │   ├── RegisterModal.jsx       # Multi-step registration gateway
│   │   │   └── ...other sections
│   │   ├── assets/
│   │   │   └── CSI (WHITE) LOGO.png
│   │   ├── App.jsx                     # Root + GSAP wiring
│   │   ├── index.css                   # Full design system (~3400 lines)
│   │   └── main.jsx                    # Entry + scroll restoration
│   └── package.json
├── README.md
└── DOCUMENTATION.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI component framework |
| Vite 8 | Build tool |
| GSAP 3 + ScrollTrigger | Parallax, pinned scroll, timeline animations |
| Font Awesome 6 | Icons |
| Vanilla CSS | Full design system (no Tailwind) |

---

## 🎭 Terminal Commands (About Section)

| Command | Output |
|---|---|
| `help` | Lists all commands |
| `about` | Event details |
| `tracks` | FinTech & HealthTech specs |
| `prizes` | Prize breakdown |
| `timeline` | Event schedule |
| `matrix` | Matrix digital rain overlay |
| `clear` | Clears terminal |

---

## 🏆 Hackathon Details

| | |
|---|---|
| **Event** | Enigma 5.0 — Web Development Hackathon |
| **Organizer** | SIES GST, Navi Mumbai — CSI Chapter |
| **Format** | 36-hour sprint, teams of 3–4 |
| **Tracks** | FinTech · HealthTech |
| **Prize Pool** | ₹25,000 |
| **Registrations** | 1,095 / 2,000 |
| **Eligibility** | All undergraduates |

---

MIT © SIES CSI Enigma 5.0 Team · *May the Code be with you.*
