import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 12;
const COLORS = [
  'rgba(0, 242, 254, 0.9)',   // cyan
  'rgba(157, 78, 221, 0.8)',  // purple
  'rgba(5, 217, 131, 0.75)',  // emerald
];

export default function ParticleCursor() {
  const containerRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -200, y: -200 });
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particle DOM nodes once
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'cursor-particle';
      container.appendChild(el);
      particles.current.push({
        el,
        x: -200,
        y: -200,
        size: Math.random() * 6 + 4,      // 4–10px
        speed: 0.08 + i * 0.018,           // trailing lag per particle
        color: COLORS[i % COLORS.length],
        alpha: 0,
      });
    }

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Interpolation loop — each particle chases the cursor with increasing lag
    const loop = () => {
      particles.current.forEach((p, i) => {
        const target = i === 0 ? mouse.current : particles.current[i - 1];
        p.x += (target.x - p.x) * p.speed;
        p.y += (target.y - p.y) * p.speed;

        // Fade out further behind in chain
        const trailFade = 1 - i / PARTICLE_COUNT;

        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
        p.el.style.width = `${p.size * trailFade + 2}px`;
        p.el.style.height = `${p.size * trailFade + 2}px`;
        p.el.style.background = p.color;
        p.el.style.opacity = trailFade * 0.85;
        p.el.style.boxShadow = `0 0 ${8 * trailFade}px ${p.color}`;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
      // Remove particle nodes on unmount
      particles.current.forEach((p) => p.el.remove());
      particles.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="cursor-particle-container"
      aria-hidden="true"
    />
  );
}
