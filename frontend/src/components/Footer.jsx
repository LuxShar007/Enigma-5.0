import React from 'react';

export default function Footer({ onRegisterClick }) {
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <span className="logo">
            <div className="logo-svg-wrapper">
              <svg viewBox="0 0 100 100" className="logo-icon">
                <defs>
                  <filter id="footer-logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="footer-logo-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="100%" stopColor="#4facfe" />
                  </linearGradient>
                  <linearGradient id="footer-logo-grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9d4edd" />
                    <stop offset="100%" stopColor="#7209b7" />
                  </linearGradient>
                </defs>
                {/* Outer Hexagon */}
                <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" 
                         fill="none" 
                         stroke="url(#footer-logo-grad-cyan)" 
                         strokeWidth="5" 
                         filter="url(#footer-logo-glow)"
                />
                {/* Inner Hexagon */}
                <polygon points="50,30 67,40 67,60 50,70 33,60 33,40" 
                         fill="none" 
                         stroke="url(#footer-logo-grad-purple)" 
                         strokeWidth="4"
                />
                {/* Center Cryptographic Core */}
                <circle cx="50" cy="50" r="8" fill="#ffffff" filter="url(#footer-logo-glow)" />
                <line x1="50" y1="15" x2="50" y2="30" stroke="#00f2fe" strokeWidth="4" />
                <line x1="20" y1="67.5" x2="33" y2="60" stroke="#9d4edd" strokeWidth="4" />
                <line x1="80" y1="67.5" x2="67" y2="60" stroke="#00f2fe" strokeWidth="4" />
              </svg>
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-title">ENIGMA</span>
              <span className="logo-badge">5.0</span>
            </div>
          </span>
          <p className="footer-desc">
            SIES Computer Society of India Student Chapter flagship hackathon. Inspiring tech, crafting solutions, and training leaders of tomorrow.
          </p>
        </div>
        
        <div className="footer-links-group">
          <h4>Quick Access</h4>
          <ul>
            <li>
              <a href="#hero" onClick={(e) => handleScrollToSection(e, 'hero')}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleScrollToSection(e, 'about')}>
                About
              </a>
            </li>
            <li>
              <a href="#tracks" onClick={(e) => handleScrollToSection(e, 'tracks')}>
                Tracks
              </a>
            </li>
            <li>
              <a href="#timeline" onClick={(e) => handleScrollToSection(e, 'timeline')}>
                Timeline
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Guidelines</h4>
          <ul>
            <li>
              <a
                href="#register"
                onClick={(e) => { e.preventDefault(); onRegisterClick(); }}
              >
                Registration Link
              </a>
            </li>
            <li>
              <a href="#tracks" onClick={(e) => handleScrollToSection(e, 'tracks')}>
                Track Details
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')}>
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Contact Protocol: <a href="mailto:csi@siesgst.ac.in" className="text-cyan">csi@siesgst.ac.in</a></p>
        <p>&copy; 2026 SIES GST CSI. All Rights Reserved. Created for Enigma 5.0.</p>
      </div>
    </footer>
  );
}
