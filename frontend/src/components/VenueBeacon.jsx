import React, { useEffect, useRef, useState } from 'react';

const COORDS = { lat: '19°2\'11.3"N', lng: '73°1\'14.1"E' };
const COORDS_DECIMAL = { lat: '19.03648°N', lng: '73.02058°E' };
const MAPS_URL = 'https://maps.google.com/?q=SIES+Graduate+School+of+Technology+Nerul+Navi+Mumbai';

const DATA_STREAM = [
  'SIGNAL ACQUIRED................OK',
  'TRIANGULATING POSITION........DONE',
  'GPS LOCK......................STABLE',
  'DECRYPTING COORDINATES........OK',
  'VENUE CONFIRMED...............ENIGMA 5.0',
];

export default function VenueBeacon() {
  const canvasRef = useRef(null);
  const [decodeStep, setDecodeStep] = useState(0);
  const [showAddress, setShowAddress] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const SIZE = 320;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R = SIZE / 2 - 10;

    let angle = 0;
    let rafId;
    const BLIPS = [
      { a: 0.42, r: 0.55, label: 'SIES GST' },
      { a: 1.2,  r: 0.3,  label: null },
      { a: 2.9,  r: 0.7,  label: null },
      { a: 4.1,  r: 0.45, label: null },
    ];
    const blipLife = new Array(BLIPS.length).fill(0);

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      bgGrad.addColorStop(0, 'rgba(0,30,20,0.95)');
      bgGrad.addColorStop(1, 'rgba(0,8,6,0.98)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      [0.25, 0.5, 0.75, 1].forEach(f => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,242,150,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      ctx.strokeStyle = 'rgba(0,242,150,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

      const trailLen = Math.PI * 0.9;
      const steps = 60;
      for (let i = 0; i < steps; i++) {
        const frac = i / steps;
        const a = angle - trailLen * frac;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, a, a + trailLen / steps + 0.01);
        ctx.closePath();
        const alpha = (1 - frac) * 0.18;
        ctx.fillStyle = `rgba(0,242,150,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.strokeStyle = 'rgba(0,242,150,0.85)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f296';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      BLIPS.forEach((b, i) => {
        const bx = cx + Math.cos(b.a) * R * b.r;
        const by = cy + Math.sin(b.a) * R * b.r;
        const diff = ((angle - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.12) blipLife[i] = 1;
        if (blipLife[i] > 0) blipLife[i] -= 0.005;
        const life = Math.max(0, blipLife[i]);
        if (life > 0) {
          ctx.beginPath();
          ctx.arc(bx, by, 12 * (1 - life * 0.5), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,242,150,${(life * 0.4).toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(bx, by, i === 0 ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = i === 0
            ? `rgba(0,242,254,${life.toFixed(2)})`
            : `rgba(0,242,150,${(life * 0.8).toFixed(2)})`;
          ctx.shadowColor = i === 0 ? '#00f2fe' : '#00f296';
          ctx.shadowBlur = i === 0 ? 12 : 6;
          ctx.fill();
          ctx.shadowBlur = 0;
          if (b.label && life > 0.3) {
            ctx.fillStyle = `rgba(0,242,254,${(life * 0.9).toFixed(2)})`;
            ctx.font = '600 10px "Space Grotesk", monospace';
            ctx.fillText(b.label, bx + 9, by - 6);
          }
        }
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,242,150,0.6)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,242,150,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      angle += 0.022;
      if (angle > Math.PI * 2) angle -= Math.PI * 2;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let step = 0;
          const interval = setInterval(() => {
            step++;
            setDecodeStep(step);
            if (step >= DATA_STREAM.length) {
              clearInterval(interval);
              setTimeout(() => setShowAddress(true), 300);
            }
          }, 340);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="venue" className="venue-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal-blur">
          <span className="section-subtitle">MISSION LOCATION</span>
          <h2 className="section-title">Venue Beacon</h2>
          <div className="section-underline"></div>
        </div>

        <div className="venue-grid">
          <div className="venue-radar-col reveal-left">
            <div className="venue-radar-wrapper">
              <canvas ref={canvasRef} className="venue-radar-canvas" />
              <div className="venue-radar-coords">
                <span className="venue-coord-line">
                  <i className="fa-solid fa-location-crosshairs"></i>
                  {COORDS.lat}
                </span>
                <span className="venue-coord-line">
                  <i className="fa-solid fa-location-crosshairs"></i>
                  {COORDS.lng}
                </span>
              </div>
            </div>
          </div>

          <div className="venue-info-col reveal-right reveal-d1">
            <div className="venue-terminal">
              <div className="venue-terminal-bar">
                <span className="t-dot t-dot-red"></span>
                <span className="t-dot t-dot-yellow"></span>
                <span className="t-dot t-dot-green"></span>
                <span className="venue-terminal-title">signal_lock.sh — BEACON TRACE</span>
              </div>
              <div className="venue-terminal-body">
                {DATA_STREAM.map((line, i) => (
                  <div
                    key={i}
                    className={`venue-data-line${decodeStep > i ? ' venue-data-line--visible' : ''}`}
                  >
                    <span className="venue-prompt">{'>'}</span>
                    <span className="venue-data-text">{line}</span>
                    {decodeStep === i + 1 && <span className="venue-cursor">█</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className={`venue-address-card${showAddress ? ' venue-address-card--visible' : ''}`}>
              <div className="venue-classified-badge">
                <i className="fa-solid fa-location-pin"></i>
                COORDINATES VERIFIED
              </div>

              <h3 className="venue-name">SIES Graduate School of Technology</h3>

              <div className="venue-address-lines">
                <div className="venue-address-row">
                  <i className="fa-solid fa-map-pin"></i>
                  <span>Sri Chandrasekarendra Saraswati Vidyapuram</span>
                </div>
                <div className="venue-address-row venue-address-row--indent">
                  <span>Sector-V, Nerul, Navi Mumbai</span>
                </div>
                <div className="venue-address-row venue-address-row--indent">
                  <span>Maharashtra — 400706</span>
                </div>
              </div>

              <div className="venue-meta-row">
                <div className="venue-meta-chip">
                  <i className="fa-solid fa-wifi"></i>
                  High-Speed Workspace
                </div>
                <div className="venue-meta-chip">
                  <i className="fa-solid fa-bolt"></i>
                  Power Banks On-Site
                </div>
                <div className="venue-meta-chip">
                  <i className="fa-solid fa-utensils"></i>
                  Food Provided
                </div>
              </div>

              <div className="venue-decimal-coords">
                <span className="venue-decimal-label">DECIMAL COORDS</span>
                <span className="venue-decimal-value">{COORDS_DECIMAL.lat} / {COORDS_DECIMAL.lng}</span>
              </div>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary venue-directions-btn"
                id="venue-directions-link"
              >
                <i className="fa-solid fa-location-arrow"></i>
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
