import React, { useState, useEffect } from 'react';

export default function Navbar({ onRegisterClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      // Toggle sticky style
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Highlight active section link
      const sections = ['hero', 'about', 'tracks', 'timeline', 'contact'];
      let current = 'hero';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="header-hover-zone">
      <div className="nav-trigger-pill">
        <i className="fa-solid fa-server text-cyan"></i>
        <span>SYSTEM PANEL</span>
      </div>
      <header className={`header glass-blur ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <a href="#" className="logo" onClick={(e) => handleLinkClick(e, 'hero')}>
            <div className="logo-svg-wrapper">
              <svg viewBox="0 0 100 100" className="logo-icon">
                <defs>
                  <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="logo-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="100%" stopColor="#4facfe" />
                  </linearGradient>
                  <linearGradient id="logo-grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9d4edd" />
                    <stop offset="100%" stopColor="#7209b7" />
                  </linearGradient>
                </defs>
                {/* Outer Hexagon */}
                <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" 
                         fill="none" 
                         stroke="url(#logo-grad-cyan)" 
                         strokeWidth="5" 
                         filter="url(#logo-glow)"
                />
                {/* Inner Hexagon */}
                <polygon points="50,30 67,40 67,60 50,70 33,60 33,40" 
                         fill="none" 
                         stroke="url(#logo-grad-purple)" 
                         strokeWidth="4"
                />
                {/* Center Cryptographic Core */}
                <circle cx="50" cy="50" r="8" fill="#ffffff" filter="url(#logo-glow)" />
                <line x1="50" y1="15" x2="50" y2="30" stroke="#00f2fe" strokeWidth="4" />
                <line x1="20" y1="67.5" x2="33" y2="60" stroke="#9d4edd" strokeWidth="4" />
                <line x1="80" y1="67.5" x2="67" y2="60" stroke="#00f2fe" strokeWidth="4" />
              </svg>
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-title">ENIGMA</span>
              <span className="logo-badge">5.0</span>
            </div>
          </a>
          
          <nav className={`nav-menu ${isMobileOpen ? 'active' : ''}`}>
            {['home', 'about', 'tracks', 'timeline', 'contact'].map((label) => {
              const id = label === 'home' ? 'hero' : label;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`nav-link ${activeSection === id ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, id)}
                >
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </a>
              );
            })}
          </nav>

          <div className="nav-actions">
            <a
              href="#contact"
              className="btn btn-secondary nav-btn-hide"
              onClick={(e) => handleLinkClick(e, 'contact')}
            >
              Contact Protocol
            </a>
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); onRegisterClick(); }}
              className="btn btn-primary glow-effect"
            >
              Access Form Matrix
            </a>
            
            <button
              className={`mobile-toggle ${isMobileOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation"
            >
              <span
                className="bar"
                style={{
                  transform: isMobileOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none',
                  transition: 'all 0.2s ease-out',
                  height: '2px',
                  width: '100%',
                  backgroundColor: '#ffffff'
                }}
              ></span>
              <span
                className="bar"
                style={{
                  opacity: isMobileOpen ? '0' : '1',
                  transition: 'all 0.2s ease-out',
                  height: '2px',
                  width: '100%',
                  backgroundColor: '#ffffff'
                }}
              ></span>
              <span
                className="bar"
                style={{
                  transform: isMobileOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'none',
                  transition: 'all 0.2s ease-out',
                  height: '2px',
                  width: '100%',
                  backgroundColor: '#ffffff'
                }}
              ></span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
