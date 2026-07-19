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
          {/* Cyber Dossier Panel Column */}
          <div className="about-text-content">
            <div className="cyber-dossier-panel glass-card">
              <div className="dossier-header">
                <div className="dossier-dots">
                  <span className="dot dot-r"></span>
                  <span className="dot dot-y"></span>
                  <span className="dot dot-g"></span>
                </div>
                <div className="dossier-title">// CIPHER_MANIFEST_V5.0.log</div>
                <div className="dossier-status-pill">SYS_SECURE</div>
              </div>
              
              <div className="dossier-body">
                <div className="dossier-section">
                  <div className="dossier-section-title">
                    <i className="fa-solid fa-microchip text-cyan"></i> MISSION DIRECTIVE
                  </div>
                  <p className="dossier-p apple-scroll-text">
                    {splitText("Enigma is back, bolder and more challenging than ever. SIES CSI's flagship hackathon returns for its fifth iteration, pushing undergraduate minds to create impactful solutions under high-pressure conditions.")}
                  </p>
                </div>

                <div className="dossier-section">
                  <div className="dossier-section-title">
                    <i className="fa-solid fa-network-wired text-purple"></i> OPERATION SCHEMATIC
                  </div>
                  <p className="dossier-p apple-scroll-text">
                    {splitText("For 36 consecutive hours, teams of 4 will collaborate, design, develop, and present technical prototypes. Enigma offers a launchpad to bring your FinTech and HealthTech concepts to life with the guidance of industry-expert mentors.")}
                  </p>
                </div>

                {/* Inline System Metadata Grid */}
                <div className="dossier-meta-grid">
                  <div className="meta-item">
                    <span className="meta-key">PROTOCOL:</span>
                    <span className="meta-val text-cyan">AES-256 CRYPT</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">HACK_TIME:</span>
                    <span className="meta-val text-purple">36H CONTINUOUS</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">NODE_SIZE:</span>
                    <span className="meta-val text-emerald">4 DEV NODES</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-key">DOMAINS:</span>
                    <span className="meta-val">FINTECH / HEALTH</span>
                  </div>
                </div>
              </div>
            </div>
            
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
