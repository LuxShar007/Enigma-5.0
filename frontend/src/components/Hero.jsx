import React from 'react';
import Countdown from './Countdown';
import csiLogo from '../assets/CSI (WHITE) LOGO.png';

export default function Hero({ onRegisterClick }) {
  const handleScrollToTimeline = (e) => {
    e.preventDefault();
    const element = document.getElementById('timeline');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        <div className="hero-tagline-container">
          <span className="hero-tagline-accent">
            <img src={csiLogo} alt="CSI Logo" className="hero-csi-logo" />
            SIES CSI PRESENTS
          </span>
        </div>
        
        <h1 className="hero-title">
          <span className="title-gradient">ENIGMA 5.0</span>
        </h1>
        
        <p className="hero-description">
          The ultimate 36-hour arena of coding, creativity, and cryptics. Team up, innovate in FinTech & HealthTech, and crack the solution to claim ultimate victory.
        </p>

        {/* Hackathon Quick Info Pills */}
        <div className="hero-pills">
          <div className="pill">
            <i className="fa-solid fa-users text-cyan"></i>
            <span>Teams of 4 Matrix Slots</span>
          </div>
          <div className="pill">
            <i className="fa-solid fa-graduation-cap text-purple"></i>
            <span>Undergraduate Students</span>
          </div>
          <div className="pill">
            <i className="fa-solid fa-trophy text-emerald"></i>
            <span className="text-glow-emerald">₹25,000 INR Prize Pool</span>
          </div>
        </div>

        {/* Live Countdown Component */}
        <Countdown />

        {/* Action Buttons */}
        <div className="hero-actions">
          <a
            href="#register"
            onClick={(e) => { e.preventDefault(); onRegisterClick(); }}
            className="btn btn-primary btn-large glow-effect"
          >
            <i className="fa-solid fa-key"></i> Access Form Matrix
          </a>
          <a
            href="#timeline"
            onClick={handleScrollToTimeline}
            className="btn btn-secondary btn-large"
          >
            <i className="fa-solid fa-calendar-days"></i> Scan Schedule Vectors
          </a>
        </div>

        <div className="scroll-indicator">
          <span>EXPLORE THE VAULT</span>
          <i className="fa-solid fa-chevron-down bounce"></i>
        </div>
      </div>
    </section>
  );
}
