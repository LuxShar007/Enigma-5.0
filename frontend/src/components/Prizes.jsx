import React from 'react';

export default function Prizes() {
  const prizesData = [
    {
      rank: "01",
      title: "Grand Champion Matrix",
      value: "₹15,000 INR",
      badge: "FIRST PLACE",
      icon: "fa-trophy",
      glowClass: "glow-cyan",
      details: [
        "Cash Prize Allocation: ₹15,000",
        "Winner Cryptographic Credentials",
        "Direct Entry to SIES CSI Incubation Hub",
        "Free Hosting Credits & Sponsor Perks"
      ]
    },
    {
      rank: "02",
      title: "Runner-up Matrix",
      value: "₹10,000 INR",
      badge: "SECOND PLACE",
      icon: "fa-award",
      glowClass: "glow-purple",
      details: [
        "Cash Prize Allocation: ₹10,000",
        "Finalist Cryptographic Credentials",
        "SIES CSI Mentor Panel Guidance",
        "Sponsor Swag Boxes & API Subscriptions"
      ]
    },
    {
      rank: "03",
      title: "Category Nodes & Swag",
      value: "Goodies & Swag",
      badge: "TRACK EXCELLENCE",
      icon: "fa-gift",
      glowClass: "glow-emerald",
      details: [
        "Top FinTech & HealthTech Domain Awards",
        "Digital Badges & CSI Member Access",
        "Resume Endorsement by CSI Jury Team",
        "SIES GST CSI Hackathon Participation Certificates"
      ]
    }
  ];

  return (
    <section id="prizes" className="prizes-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">THE INCENTIVES</span>
          <h2 className="section-title">Rewards & Matrix Nodes</h2>
          <div className="section-underline"></div>
        </div>

        <p className="section-description-centered">
          Compete across specialized development tracks to secure technical accolades, winner cash pots, and exclusive developer tool subscriptions.
        </p>

        <div className="prizes-grid">
          {prizesData.map((item) => (
            <div key={item.rank} className="prize-card glass-card spotlight-card">
              <div className="shimmer-container">
                <div className="shimmer-sweep"></div>
              </div>
              <div className={`prize-glow-bg ${item.glowClass}`}></div>
              <div className="prize-card-header">
                <span className="prize-rank">NODE {item.rank}</span>
                <span className="prize-badge">{item.badge}</span>
              </div>
              <div className="prize-card-body">
                <div className="prize-icon-circle">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 className="prize-title">{item.title}</h3>
                <span className="prize-value">{item.value}</span>
                <ul className="prize-perks-list">
                  {item.details.map((perk, index) => (
                    <li key={index}>
                      <i className="fa-solid fa-square-check"></i>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
