import React, { useEffect, useRef, useState, useCallback } from 'react';

const CRAWL_TEXT = [
  { text: "A long time ago in a lab far, far away....", type: "intro" },
  { text: "", type: "spacer" },
  { text: "ENIGMA 5.0", type: "title" },
  { text: "", type: "spacer" },
  { text: "The SIES CSI chapter has awakened.", type: "body" },
  { text: "", type: "spacer" },
  { text: "In a galaxy of deadlines and debug sessions,", type: "body" },
  { text: "a new generation of rebel coders must rise", type: "body" },
  { text: "to conquer the ultimate 36-hour challenge.", type: "body" },
  { text: "", type: "spacer" },
  { text: "FinTech and HealthTech domains call for", type: "body" },
  { text: "the brightest undergraduate minds — those", type: "body" },
  { text: "brave enough to build, ship, and present", type: "body" },
  { text: "solutions under extreme galactic pressure.", type: "body" },
  { text: "", type: "spacer" },
  { text: "The Force is strong with those who code.", type: "body" },
  { text: "Will you answer the call?", type: "body" },
  { text: "", type: "spacer" },
  { text: "May the Code be with you...", type: "body" },
];

export default function StarWarsCrawl({ onComplete }) {
  const [phase, setPhase] = useState('intro');   // intro | logo | crawl | exit
  const hasCompleted = useRef(false);
  const phaseRef = useRef('intro');
  // Keep onComplete in a ref so useCallback doesn't re-run when parent re-renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const finish = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    setPhase('exit');
    phaseRef.current = 'exit';
    // Unlock scroll, snap to top, then unmount the crawl
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setTimeout(() => onCompleteRef.current?.(), 900);
  }, []);

  // Lock body scroll while crawl is active so nothing beneath can shift
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Phase progression timeline
  useEffect(() => {
    // intro line: 0 → 2.8s
    // logo flash: 2.8s → 5.2s
    // crawl: 5.2s → 13s
    // auto-exit: 14s
    const t1 = setTimeout(() => { setPhase('logo'); phaseRef.current = 'logo'; }, 2800);
    const t2 = setTimeout(() => { setPhase('crawl'); phaseRef.current = 'crawl'; }, 5200);
    const t3 = setTimeout(finish, 14000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [finish]);

  // Keydown / click to skip
  useEffect(() => {
    const onSkip = () => finish();
    window.addEventListener('keydown', onSkip);
    return () => window.removeEventListener('keydown', onSkip);
  }, [finish]);

  return (
    <div
      className={`sw-crawl-overlay ${phase === 'exit' ? 'sw-crawl-exit' : ''}`}
      onClick={finish}
      aria-hidden="true"
    >
      {/* Cinematic star field canvas */}
      <StarField />

      {/* Top + bottom vignettes */}
      <div className="sw-vignette-top" />
      <div className="sw-vignette-bottom" />

      {/* Phase 1 — "A long time ago..." */}
      {(phase === 'intro') && (
        <div className="sw-intro-line sw-fade-in-out">
          A long time ago in a lab far, far away....
        </div>
      )}

      {/* Phase 2 — ENIGMA logo flash (shrinks into horizon) */}
      {(phase === 'logo' || phase === 'crawl') && (
        <div className={`sw-logo-flash ${phase === 'crawl' ? 'sw-logo-shrink' : 'sw-logo-appear'}`}>
          <div className="sw-logo-text">ENIGMA</div>
          <div className="sw-logo-version">5 . 0</div>
        </div>
      )}

      {/* Phase 3 — Perspective text crawl */}
      {phase === 'crawl' && (
        <div className="sw-perspective-container">
          <div className="sw-crawl-track">
            {CRAWL_TEXT.map((line, i) => (
              <p
                key={i}
                className={[
                  'sw-crawl-line',
                  line.type === 'title' && 'sw-crawl-title',
                  line.type === 'spacer' && 'sw-crawl-spacer',
                ].filter(Boolean).join(' ')}
              >
                {line.text || '\u00A0'}
              </p>
            ))}
            <div style={{ height: '80vh' }} />
          </div>
        </div>
      )}

      {/* Skip hint — always visible */}
      <div className="sw-skip-hint">CLICK OR PRESS ANY KEY TO SKIP</div>
    </div>
  );
}

/* ── Cinematic Star Field — depth layers with parallax drift ── */
function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Three depth layers: distant (small/dim), mid, close (large/bright)
    const makeStar = (layer) => {
      const base = [
        { r: [0.2, 0.8], a: [0.2, 0.45], drift: 0.04, twinkle: 0.008 },
        { r: [0.5, 1.2], a: [0.35, 0.65], drift: 0.1,  twinkle: 0.015 },
        { r: [1.0, 2.2], a: [0.5, 0.9],  drift: 0.22, twinkle: 0.025 },
      ][layer];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: base.r[0] + Math.random() * (base.r[1] - base.r[0]),
        alpha: base.a[0] + Math.random() * (base.a[1] - base.a[0]),
        drift: base.drift,
        vy: -(base.drift * (Math.random() * 0.5 + 0.5)), // slow upward drift
        twinkleSpeed: base.twinkle + Math.random() * 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        // Occasional blue/warm tint for realism
        hue: Math.random() < 0.15 ? `rgba(180,210,255,` : Math.random() < 0.08 ? `rgba(255,220,180,` : `rgba(255,255,255,`,
      };
    };

    const stars = [
      ...Array.from({ length: 300 }, () => makeStar(0)),
      ...Array.from({ length: 120 }, () => makeStar(1)),
      ...Array.from({ length: 40 },  () => makeStar(2)),
    ];

    let frame = 0;
    let rafId;

    const draw = () => {
      // Deep space gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.75
      );
      gradient.addColorStop(0, '#04040f');
      gradient.addColorStop(1, '#000004');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        const twinkle = 0.7 + Math.sin(frame * s.twinkleSpeed + s.twinkleOffset) * 0.3;

        // Glow halo for brighter stars
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

        // Slow drift upward (cinematic parallax)
        s.y += s.vy;
        if (s.y < -s.r * 2) {
          s.y = canvas.height + s.r;
          s.x = Math.random() * canvas.width;
        }
      });

      frame++;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="sw-starfield-canvas" />;
}
