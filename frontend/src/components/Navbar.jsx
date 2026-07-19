import React, { useState, useEffect } from 'react';

export default function Navbar({ onRegisterClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !isStandalone) {
      setShowInstallBtn(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async (e) => {
    e.preventDefault();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install prompt outcome: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    } else {
      alert("To install Enigma 5.0 as an application:\n\n• On iOS (Safari): Tap the Share button (square with an up arrow) and select 'Add to Home Screen'.\n• On Android (Firefox/Opera): Tap the three-dot menu and select 'Install' or 'Add to Home screen'.\n• On Desktop (Firefox/Edge): Click the install icon in the URL bar.");
    }
  };

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
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="btn btn-secondary install-btn"
                title="Download Enigma App"
                style={{ padding: '8px 12px', minWidth: 'unset', marginRight: '6px' }}
              >
                <i className="fa-solid fa-download" style={{ marginRight: '4px' }}></i>
                <span className="nav-btn-hide">Download App</span>
              </button>
            )}
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
