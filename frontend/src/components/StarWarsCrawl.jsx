import React, { useEffect, useRef, useState, useCallback } from 'react';

const CRAWL_TEXT = [
  { text: "ENIGMA 5.0",          type: "title" },
  { text: "",                     type: "spacer" },
  { text: "The SIES CSI chapter has awakened.", type: "body" },
  { text: "",                     type: "spacer" },
  { text: "In a galaxy of deadlines and debug sessions,", type: "body" },
  { text: "a new generation of rebel coders must rise", type: "body" },
  { text: "to conquer the ultimate 36-hour challenge.", type: "body" },
  { text: "",                     type: "spacer" },
  { text: "FinTech and HealthTech domains call for",     type: "body" },
  { text: "the brightest undergraduate minds —",        type: "body" },
  { text: "brave enough to build, ship, and present",   type: "body" },
  { text: "solutions under extreme galactic pressure.", type: "body" },
  { text: "",                     type: "spacer" },
  { text: "May the Code be with you...",               type: "body" },
];

export default function StarWarsCrawl({ onComplete }) {
  // ── phase: 'logo' → 'crawl' → 'exit'
  // NOTE: we skip the 'intro' phase to save time — jump straight to logo
  const [phase, setPhase]       = useState('logo');
  const [lasers, setLasers]     = useState([]);
  const hasCompleted             = useRef(false);
  const phaseRef                 = useRef('logo');
  const onCompleteRef            = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const finish = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    setPhase('exit');
    phaseRef.current = 'exit';
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setTimeout(() => onCompleteRef.current?.(), 700);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Phase timeline — total 3 seconds max
  // logo: 0 → 1.2s
  // crawl: 1.2s → 3.0s
  // auto-exit: 3.0s
  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('crawl'); phaseRef.current = 'crawl'; }, 1200);
    const t2 = setTimeout(finish, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [finish]);

  // Skip on keydown / click
  useEffect(() => {
    window.addEventListener('keydown', finish);
    return () => window.removeEventListener('keydown', finish);
  }, [finish]);

  // Spawn random laser bolts every ~350ms
  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      const laser = {
        id: id++,
        x: Math.random() * 100,    // vw
        y: Math.random() * 70 + 5, // vh
        angle: Math.random() * 30 - 15,
        color: Math.random() < 0.5 ? '#ff3b3b' : '#2ee8ff',
        length: Math.random() * 120 + 60,
        duration: Math.random() * 0.2 + 0.12,
      };
      setLasers(prev => [...prev.slice(-6), laser]);
      setTimeout(() => setLasers(prev => prev.filter(l => l.id !== laser.id)), 300);
    }, 340);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`sw-crawl-overlay ${phase === 'exit' ? 'sw-crawl-exit' : ''}`}
      onClick={finish}
      aria-hidden="true"
    >
      {/* Cinematic star field */}
      <StarField />

      {/* Laser bolts */}
      {lasers.map(l => (
        <div
          key={l.id}
          className="sw-laser"
          style={{
            left: `${l.x}vw`,
            top:  `${l.y}vh`,
            width: `${l.length}px`,
            '--laser-color': l.color,
            '--laser-dur':   `${l.duration}s`,
            transform: `rotate(${l.angle}deg)`,
          }}
        />
      ))}

      {/* Vignettes */}
      <div className="sw-vignette-top"  />
      <div className="sw-vignette-bottom" />

      {/* ENIGMA logo flash */}
      {(phase === 'logo' || phase === 'crawl') && (
        <div className={`sw-logo-flash ${phase === 'crawl' ? 'sw-logo-shrink' : 'sw-logo-appear'}`}>
          {/* Orbital ring */}
          <div className="sw-logo-ring" />
          <div className="sw-logo-text">ENIGMA</div>
          <div className="sw-logo-version">5 . 0</div>
          <div className="sw-logo-tagline">THE CIPHER AWAKENS</div>
        </div>
      )}

      {/* TIE fighter flyby */}
      {phase === 'logo' && <TieFighter />}

      {/* Warp tunnel flash at transition */}
      {phase === 'crawl' && <div className="sw-warp-flash" />}

      {/* Perspective text crawl */}
      {phase === 'crawl' && (
        <div className="sw-perspective-container">
          <div className="sw-crawl-track">
            {CRAWL_TEXT.map((line, i) => (
              <p
                key={i}
                className={[
                  'sw-crawl-line',
                  line.type === 'title'  && 'sw-crawl-title',
                  line.type === 'spacer' && 'sw-crawl-spacer',
                ].filter(Boolean).join(' ')}
              >
                {line.text || '\u00A0'}
              </p>
            ))}
            <div style={{ height: '60vh' }} />
          </div>
        </div>
      )}

      {/* Skip hint */}
      <div className="sw-skip-hint">CLICK OR PRESS ANY KEY TO SKIP</div>
    </div>
  );
}

/* ── SVG TIE Fighter that flies across the screen ── */
function TieFighter() {
  return (
    <div className="sw-tie-wrapper" aria-hidden="true">
      <svg className="sw-tie-svg" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left wing panel */}
        <polygon points="0,5 28,20 28,40 0,55" fill="#555" stroke="#888" strokeWidth="1" />
        <line x1="0" y1="30" x2="28" y2="30" stroke="#aaa" strokeWidth="0.8" />
        <line x1="14" y1="5" x2="14" y2="55" stroke="#888" strokeWidth="0.6" />
        {/* Right wing panel */}
        <polygon points="90,5 62,20 62,40 90,55" fill="#555" stroke="#888" strokeWidth="1" />
        <line x1="90" y1="30" x2="62" y2="30" stroke="#aaa" strokeWidth="0.8" />
        <line x1="76" y1="5" x2="76" y2="55" stroke="#888" strokeWidth="0.6" />
        {/* Cockpit struts */}
        <rect x="26" y="27" width="38" height="6" rx="1" fill="#444" stroke="#666" strokeWidth="0.8" />
        {/* Cockpit ball */}
        <circle cx="45" cy="30" r="10" fill="#333" stroke="#777" strokeWidth="1.2" />
        <circle cx="45" cy="30" r="6"  fill="#222" stroke="#555" strokeWidth="0.8" />
        <circle cx="42" cy="28" r="2.5" fill="#1a1a1a" />
        <circle cx="48" cy="28" r="2.5" fill="#1a1a1a" />
        {/* Engine glow */}
        <circle cx="45" cy="30" r="3" fill="rgba(255,100,0,0.6)" />
      </svg>
      {/* Engine trail */}
      <div className="sw-tie-trail" />
    </div>
  );
}

/* ── Cinematic Star Field ── */
function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const makeStar = (layer) => {
      const cfg = [
        { r: [0.2, 0.8], a: [0.2, 0.45], vy: 0.04,  twinkle: 0.008 },
        { r: [0.5, 1.2], a: [0.35, 0.65], vy: 0.1,   twinkle: 0.015 },
        { r: [1.0, 2.2], a: [0.5, 0.9],  vy: 0.22,  twinkle: 0.025 },
      ][layer];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: cfg.r[0] + Math.random() * (cfg.r[1] - cfg.r[0]),
        alpha: cfg.a[0] + Math.random() * (cfg.a[1] - cfg.a[0]),
        vy: -(cfg.vy * (0.5 + Math.random() * 0.5)),
        twinkleSpeed: cfg.twinkle + Math.random() * 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.12 ? 'rgba(180,210,255,' : Math.random() < 0.07 ? 'rgba(255,220,180,' : 'rgba(255,255,255,',
      };
    };

    const stars = [
      ...Array.from({ length: 300 }, () => makeStar(0)),
      ...Array.from({ length: 120 }, () => makeStar(1)),
      ...Array.from({ length: 40  }, () => makeStar(2)),
    ];

    let frame = 0;
    let rafId;

    const draw = () => {
      const g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.8);
      g.addColorStop(0, '#04040f');
      g.addColorStop(1, '#000004');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        const twinkle = 0.7 + Math.sin(frame * s.twinkleSpeed + s.twinkleOffset) * 0.3;
        if (s.r > 1.2) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          glow.addColorStop(0, `${s.hue}${(s.alpha * twinkle * 0.4).toFixed(3)})`);
          glow.addColorStop(1, `${s.hue}0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.hue}${(s.alpha * twinkle).toFixed(3)})`;
        ctx.fill();
        s.y += s.vy;
        if (s.y < -s.r * 2) { s.y = canvas.height + s.r; s.x = Math.random() * canvas.width; }
      });

      frame++;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="sw-starfield-canvas" />;
}
