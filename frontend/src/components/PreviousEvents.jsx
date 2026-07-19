import React from 'react';

const EVENTS_DATA = [
  {
    node: "NODE_INNOVATIONS",
    title: "Innovations 2026",
    subtitle: "National-Level Project Presentation",
    desc: "A national-level project presentation competition providing undergraduate students with a platform to showcase their innovative engineering projects and research-backed technical solutions to an industry panel.",
    link: "https://unstop.com/competitions/innovations-2026-a-national-level-project-presentation-competition-sies-graduate-school-of-technology-navi--1649825",
    icon: "fa-lightbulb",
    glowClass: "glow-cyan",
    badge: "PROJECT SHOWCASE"
  },
  {
    node: "NODE_ENIGMA_4",
    title: "Enigma 4.0",
    subtitle: "24-Hour Web Dev Hackathon",
    desc: "The fourth iteration of our premier 24-hour web development hackathon, challenging student developers across the nation to build innovative, secure, and production-ready applications.",
    link: "https://unstop.com/hackathons/enigma-40-a-web-development-hackathon-sies-graduate-school-of-technology-navi-mumbai-maharashtra-1545848",
    icon: "fa-code",
    glowClass: "glow-purple",
    badge: "HACKATHON"
  },
  {
    node: "NODE_SYNAPSE",
    title: "Synapse AI",
    subtitle: "Case Simulation Challenge",
    desc: "An intensive artificial intelligence and machine learning case simulation challenge that tested teams on solving complex data modeling and strategic industry problems using advanced AI concepts.",
    link: "https://unstop.com/competitions/synapse-ai-case-simulation-challenge-sies-graduate-school-of-technology-navi-mumbai-maharashtra-1613771",
    icon: "fa-brain",
    glowClass: "glow-emerald",
    badge: "AI CASE STUDY"
  }
];

export default function PreviousEvents() {
  const delayClasses = ['reveal-d1', 'reveal-d2', 'reveal-d3'];

  return (
    <section id="previous-events" className="previous-events-section">
      <div className="container">
        <div className="section-header reveal-blur">
          <span className="section-subtitle">HISTORICAL RECORD</span>
          <h2 className="section-title">Previous CSI Events</h2>
          <div className="section-underline"></div>
        </div>

        <p className="section-description-centered reveal">
          Review the legacy of national competitions, intensive hackathons, and technology simulations hosted by SIES GST CSI.
        </p>

        <div className="previous-events-grid">
          {EVENTS_DATA.map((event, idx) => (
            <div
              key={event.node}
              className={`previous-event-card glass-card spotlight-card reveal ${delayClasses[idx] || ''}`}
            >
              {/* Shimmer Sweep Animation */}
              <div className="shimmer-container">
                <div className="shimmer-sweep"></div>
              </div>

              {/* Hologram Glow Effect */}
              <div className={`previous-event-glow-bg ${event.glowClass}`}></div>

              {/* Card Header */}
              <div className="previous-event-card-header">
                <span className="previous-event-node">{event.node}</span>
                <span className="previous-event-badge">{event.badge}</span>
              </div>

              {/* Card Body */}
              <div className="previous-event-card-body">
                <div className="previous-event-icon-circle">
                  <i className={`fa-solid ${event.icon}`}></i>
                </div>
                <h3 className="previous-event-title">{event.title}</h3>
                <span className="previous-event-subtitle">{event.subtitle}</span>
                <p className="previous-event-desc">{event.desc}</p>

                {/* Redirect Button */}
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="previous-event-btn"
                >
                  <span>View on Unstop</span>
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
