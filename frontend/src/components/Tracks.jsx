import React, { useRef } from 'react';

function ParallaxTiltCard({ children, className, id }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Cursor coordinates normalized relative to the card's midpoint
    const x = e.clientX - rect.left - w / 2;
    const y = e.clientY - rect.top - h / 2;

    // Maximum pitch/yaw tilt bounds (in degrees)
    const maxTilt = 10;

    // Interpolate rotation angles matching mouse vector offsets
    const tiltX = -(y / (h / 2)) * maxTilt;
    const tiltY = (x / (w / 2)) * maxTilt;

    // Proactively apply rotation matrix on hardware accelerated 3D plane
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    // Smoothly restore resting coordinates inside transition easement
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
  };

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;

    // Temporarily clear duration easing for instantaneous response telemetry updates
    card.style.transition = 'transform 0.08s ease-out';
  };

  return (
    <div
      ref={cardRef}
      className={className}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export default function Tracks() {
  const splitText = (text) => {
    return text.split(' ').map((word, idx) => (
      <span key={idx} className="apple-word">
        {word}{' '}
      </span>
    ));
  };

  return (
    <section id="tracks" className="tracks-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">THE CHANNELS</span>
          <h2 className="section-title">Hackathon Tracks</h2>
          <div className="section-underline"></div>
        </div>
        
        <p className="section-description-centered">
          Select a specialization track and build a high-performance solution that solves critical real-world bottlenecks.
        </p>

        <div className="tracks-grid">
          {/* Track 1: FinTech */}
          <ParallaxTiltCard className="track-card glass-card scroll-reveal spotlight-card" id="track-fintech">
            <div className="shimmer-container">
              <div className="shimmer-sweep"></div>
            </div>
            <div className="track-glow-bg glow-cyan"></div>
            <div className="track-header">
              <div className="track-icon-glow border-cyan">
                <i className="fa-solid fa-coins text-cyan"></i>
              </div>
              <span className="track-tag tag-cyan">TRACK 01</span>
            </div>
            <h3 className="track-name">FinTech Platforms</h3>
            <p className="track-desc apple-scroll-text">
              {splitText("Reinvent the way the world handles wealth. Build digital solutions that make financial services more accessible, secure, transparent, and intelligent.")}
            </p>
            <ul className="track-bullets">
              <li><i className="fa-solid fa-shield-halved text-cyan"></i> Secure Decentralized Finance (DeFi) solutions</li>
              <li><i className="fa-solid fa-mobile-screen-button text-cyan"></i> micro-Investment & neo-banking interfaces</li>
              <li><i className="fa-solid fa-robot text-cyan"></i> AI-powered smart budgeting & portfolio optimization</li>
              <li><i className="fa-solid fa-chart-line text-cyan"></i> Blockchain-enabled secure smart contracts</li>
            </ul>
          </ParallaxTiltCard>

          {/* Track 2: HealthTech */}
          <ParallaxTiltCard className="track-card glass-card scroll-reveal spotlight-card" id="track-healthtech">
            <div className="shimmer-container">
              <div className="shimmer-sweep"></div>
            </div>
            <div className="track-glow-bg glow-purple"></div>
            <div className="track-header">
              <div className="track-icon-glow border-purple">
                <i className="fa-solid fa-heart-pulse text-purple"></i>
              </div>
              <span className="track-tag tag-purple">TRACK 02</span>
            </div>
            <h3 className="track-name">HealthTech Nodes</h3>
            <p className="track-desc apple-scroll-text">
              {splitText("Design technological innovations that extend lives and optimize clinical efficiency. Bridge the gap between engineering and human wellness.")}
            </p>
            <ul className="track-bullets">
              <li><i className="fa-solid fa-heart-circle-check text-purple"></i> Smart diagnostics & symptom analytical engines</li>
              <li><i className="fa-solid fa-circle-h text-purple"></i> Decentralized secure electronic health records (EHR)</li>
              <li><i className="fa-solid fa-spa text-purple"></i> Mental health trackers and biofeedback interfaces</li>
              <li><i className="fa-solid fa-pager text-purple"></i> Remote elder care & patient vital warning networks</li>
            </ul>
          </ParallaxTiltCard>
        </div>
      </div>
    </section>
  );
}
