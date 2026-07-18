import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    id: 'hours',
    number: '36',
    unit: 'HOURS',
    label: 'Of Continuous Hacking',
    sub: 'Non-stop building from first commit to final pitch',
    color: 'cyan',
    icon: 'fa-hourglass-half',
  },
  {
    id: 'prize',
    number: '₹25K',
    unit: 'PRIZE POOL',
    label: 'Total Cash Incentives',
    sub: 'Distributed across Champion & Runner-up Matrix Nodes',
    color: 'purple',
    icon: 'fa-trophy',
  },
  {
    id: 'participants',
    number: '1,095',
    unit: 'OUT OF 2,000',
    label: 'Registrations Confirmed',
    sub: 'Undergraduate engineers competing across all of India',
    color: 'emerald',
    icon: 'fa-users',
  },
  {
    id: 'tracks',
    number: '2',
    unit: 'TRACKS',
    label: 'Specialization Domains',
    sub: 'FinTech Platforms & HealthTech Nodes — pick your cipher',
    color: 'cyan',
    icon: 'fa-code-branch',
  },
];

// Color maps per panel theme
const colorMap = {
  cyan:   { bg: 'rgba(0,242,254,0.04)',   border: 'rgba(0,242,254,0.15)',   glow: 'rgba(0,242,254,0.10)'   },
  purple: { bg: 'rgba(157,78,221,0.04)',  border: 'rgba(157,78,221,0.15)',  glow: 'rgba(157,78,221,0.10)'  },
  emerald:{ bg: 'rgba(5,217,131,0.04)',   border: 'rgba(5,217,131,0.15)',   glow: 'rgba(5,217,131,0.10)'   },
};

export default function CipherStrip() {
  const sectionRef = useRef(null);
  const trackRef  = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return undefined;

    // Let the DOM settle before measuring
    const init = () => {
      // Each panel is exactly 100vw, so total travel = (N-1) * vw
      const totalTravel = (panels.length - 1) * window.innerWidth;

      const ctx = gsap.context(() => {

        // Main horizontal pin + scrub
        const tween = gsap.to(track, {
          x: -totalTravel,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalTravel}`,
            pin: true,
            scrub: 0.8,           // feels buttery at 144hz
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Per-panel content: fade + scale in as each panel slides into view
        const panelEls = track.querySelectorAll('.cipher-panel-inner');
        panelEls.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.82, y: 40 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              ease: 'power3.out',
              scrollTrigger: {
                containerAnimation: tween,
                trigger: el.closest('.cipher-panel'),
                start: 'left 75%',
                end: 'left 25%',
                scrub: 0.6,
              },
            }
          );
        });

        // Progress dots indicator
        const dots = section.querySelectorAll('.cipher-dot');
        dots.forEach((dot, i) => {
          ScrollTrigger.create({
            animation: gsap.to(dot, { scale: 1.6, background: 'var(--dot-color)', ease: 'none', duration: 0.01 }),
            trigger: section,
            start: () => `top top+=${i * totalTravel / panels.length}`,
            end:   () => `top top+=${(i + 1) * totalTravel / panels.length}`,
            toggleActions: 'play reverse play reverse',
          });
        });

      }, section);

      return () => ctx.revert();
    };

    // Small rAF delay lets React finish painting all panels
    const id = requestAnimationFrame(() => {
      const cleanup = init();
      return cleanup;
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="cipher-strip-section" ref={sectionRef}>

      {/* Badge */}
      <div className="cipher-strip-label">
        <span className="cipher-strip-badge">
          <i className="fa-solid fa-bolt-lightning"></i> THE CIPHER UNRAVELS
        </span>
      </div>

      {/* Progress dots */}
      <div className="cipher-dot-row">
        {panels.map((p) => (
          <span
            key={p.id}
            className="cipher-dot"
            style={{ '--dot-color': p.color === 'cyan' ? '#00f2fe' : p.color === 'purple' ? '#9d4edd' : '#05d983' }}
          />
        ))}
      </div>

      {/* Scrolling track — overflow-x visible so GSAP can translate */}
      <div className="cipher-strip-track" ref={trackRef}>
        {panels.map((panel) => {
          const c = colorMap[panel.color];
          return (
            <div
              key={panel.id}
              className={`cipher-panel cipher-panel--${panel.color}`}
              style={{ background: c.bg, borderColor: c.border }}
            >
              {/* Ambient glow blob */}
              <div className="cipher-panel-glow" style={{ background: c.glow }} />

              <div className="cipher-panel-inner">
                {/* Icon */}
                <div className={`cipher-panel-icon cipher-icon--${panel.color}`}>
                  <i className={`fa-solid ${panel.icon}`}></i>
                </div>

                {/* Number */}
                <div className={`cipher-number cipher-number--${panel.color}`}>
                  {panel.number}
                </div>
                <div className={`cipher-unit cipher-unit--${panel.color}`}>
                  {panel.unit}
                </div>

                {/* Text */}
                <div className="cipher-label">{panel.label}</div>
                <p className="cipher-sub">{panel.sub}</p>

                {/* Accent bar */}
                <div className={`cipher-bottom-bar cipher-bar--${panel.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
