import React from 'react';
import DecryptionTerminal from './DecryptionTerminal';

export default function About() {
  const splitText = (text) => {
    return text.split(' ').map((word, idx) => (
      <span key={idx} className="apple-word">
        {word}{' '}
      </span>
    ));
  };

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-header reveal-blur">
          <span className="section-subtitle">THE BLUEPRINT</span>
          <h2 className="section-title">Decrypting Enigma 5.0</h2>
          <div className="section-underline"></div>
        </div>

        <div className="about-grid">
          {/* Text Info Column */}
          <div className="about-text-content">
            <p className="about-lead apple-scroll-text">
              {splitText("Enigma is back, bolder and more challenging than ever. SIES CSI's flagship hackathon returns for its fifth iteration, pushing undergraduate minds to create impactful solutions under high-pressure conditions.")}
            </p>
            <p className="about-body apple-scroll-text">
              {splitText("For 36 consecutive hours, teams of 4 will collaborate, design, develop, and present technical prototypes. Whether you are build-centric or design-focused, Enigma offers a launchpad to bring your FinTech and HealthTech concepts to life with the guidance of industry-expert mentors.")}
            </p>
            
            <div className="stats-grid">
              <div className="stat-card glass-card reveal reveal-d1">
                <div className="stat-icon-wrapper cyan-bg">
                  <i className="fa-solid fa-hourglass-half"></i>
                </div>
                <span className="stat-number">36</span>
                <span className="stat-label">Hours of Hacking</span>
              </div>
              
              <div className="stat-card glass-card reveal reveal-d2">
                <div className="stat-icon-wrapper purple-bg">
                  <i className="fa-solid fa-users"></i>
                </div>
                <span className="stat-number">4</span>
                <span className="stat-label">Developers Per Team</span>
              </div>

              <div className="stat-card glass-card reveal reveal-d3">
                <div className="stat-icon-wrapper emerald-bg">
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                </div>
                <span className="stat-number">25K</span>
                <span className="stat-label">Total Cash Prizes</span>
              </div>
            </div>
          </div>

          {/* Visual Decryption Card Column */}
          <div className="about-visual-column">
            <DecryptionTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}
