import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

/* 
  HyperspaceFlash — a full-screen canvas hyperspace warp that plays for ~600ms.
  Call ref.current.trigger() to launch it, then it auto-hides.
*/
const HyperspaceFlash = forwardRef(function HyperspaceFlash(_, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const running = useRef(false);

  useImperativeHandle(ref, () => ({
    trigger(callback) {
      if (running.current) return;
      running.current = true;
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) { callback?.(); return; }

      container.style.opacity = '1';
      container.style.pointerEvents = 'all';

      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      const cx = W / 2;
      const cy = H / 2;

      // Create streaks
      const NUM = 260;
      const streaks = Array.from({ length: NUM }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 80 + 20;
        return {
          angle,
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          len: Math.random() * 8 + 4,
          speed: Math.random() * 18 + 6,
          alpha: Math.random() * 0.6 + 0.4,
          color: ['#ffffff', '#c8f0ff', '#a0d8ff', '#e0f4ff'][Math.floor(Math.random() * 4)],
        };
      });

      let frame = 0;
      const TOTAL_FRAMES = 38; // ~600ms at 60fps
      let rafId;

      const draw = () => {
        // Fade trail
        ctx.fillStyle = 'rgba(0, 0, 12, 0.18)';
        ctx.fillRect(0, 0, W, H);

        const progress = frame / TOTAL_FRAMES;
        const speedMult = 1 + progress * 12; // accelerate outward

        streaks.forEach((s) => {
          const vx = Math.cos(s.angle) * s.speed * speedMult;
          const vy = Math.sin(s.angle) * s.speed * speedMult;
          const stretchLen = s.len * (1 + progress * 8);

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + Math.cos(s.angle) * stretchLen, s.y + Math.sin(s.angle) * stretchLen);
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = s.alpha * (1 - progress * 0.4);
          ctx.lineWidth = Math.max(0.5, 1.5 * (1 - progress * 0.5));
          ctx.stroke();
          ctx.globalAlpha = 1;

          s.x += vx;
          s.y += vy;
        });

        // White flash at peak
        if (progress > 0.75) {
          ctx.fillStyle = `rgba(255,255,255,${(progress - 0.75) * 3.5})`;
          ctx.fillRect(0, 0, W, H);
        }

        frame++;
        if (frame < TOTAL_FRAMES) {
          rafId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(rafId);
          container.style.opacity = '0';
          container.style.pointerEvents = 'none';
          running.current = false;
          setTimeout(() => callback?.(), 80);
        }
      };

      rafId = requestAnimationFrame(draw);
    },
  }));

  return (
    <div
      ref={containerRef}
      className="hyperspace-container"
      style={{ opacity: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="hyperspace-canvas" />
    </div>
  );
});

export default HyperspaceFlash;
