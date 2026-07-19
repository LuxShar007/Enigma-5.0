import React from 'react';

export default function Organizers() {
  const splitText = (text) => {
    return text.split(' ').map((word, idx) => (
      <span key={idx} className="apple-word">
        {word}{' '}
      </span>
    ));
  };

  return (
    <section id="organizers" className="organizers-section">
      <div className="container">
        <div className="section-header reveal-blur">
          <span className="section-subtitle">THE HOST CHAPTER</span>
          <h2 className="section-title">SIES GST CSI Student Chapter</h2>
          <div className="section-underline"></div>
        </div>

        <div className="organizers-grid">
          {/* Factual CSI Chapter Info Column */}
          <div className="organizers-info-content">
            <p className="organizers-lead apple-scroll-text">
              {splitText("The SIES GST Computer Society of India (CSI) Campus Chapter is a premier student community dedicated to bridging the gap between academic theory and active engineering practice.")}
            </p>
            <p className="organizers-body apple-scroll-text">
              {splitText("Established as part of CSI's countrywide network (founded in 1965 as India's largest IT professional association), our chapter hosts flagship coding contests, workshops, seminars, and national technical project competitions. We aim to inspire students, propagate scientific knowledge, and nurture the technical leaders of tomorrow.")}
            </p>

            <div className="organizers-stats">
              <div className="org-stat-item reveal reveal-d1">
                <span className="org-stat-num">72+</span>
                <span className="org-stat-desc">National Chapters</span>
              </div>
              <div className="org-stat-item reveal reveal-d2">
                <span className="org-stat-num">500+</span>
                <span className="org-stat-desc">Student Branches</span>
              </div>
              <div className="org-stat-item reveal reveal-d3">
                <span className="org-stat-num">100K+</span>
                <span className="org-stat-desc">IT Professionals</span>
              </div>
            </div>
          </div>

          {/* Interactive Reference Cards */}
          <div className="organizers-cards-container">
            {/* Card 1: Megabyte Magazine */}
            <div className="organizers-card glass-card spotlight-card">
              <div className="shimmer-container">
                <div className="shimmer-sweep"></div>
              </div>
              <div className="org-card-icon-wrapper">
                <i className="fa-solid fa-book-open text-cyan"></i>
              </div>
              <div className="org-card-text">
                <h3 className="org-card-title">MEGABYTE Magazine</h3>
                <p className="org-card-desc">
                  The official technical magazine of SIES GST CSI. Chronicles global developments in open-source systems, Indian IT advancements, sustainable tech, and exclusive alumni spotlights.
                </p>
                <a 
                  href="https://online.fliphtml5.com/vxsxt/ilcm/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary org-card-btn"
                >
                  <i className="fa-solid fa-square-arrow-up-right"></i> Read 2025 Edition
                </a>
              </div>
            </div>

            {/* Card 2: Innovations Project Exhibition */}
            <div className="organizers-card glass-card spotlight-card">
              <div className="shimmer-container">
                <div className="shimmer-sweep"></div>
              </div>
              <div className="org-card-icon-wrapper">
                <i className="fa-solid fa-lightbulb text-purple"></i>
              </div>
              <div className="org-card-text">
                <h3 className="org-card-title">INNOVATIONS Exhibition</h3>
                <p className="org-card-desc">
                  CSI SIES GST's flagship National Level Technical Project Competition. Provides engineering minds a platform to demonstrate working research prototypes to industry experts.
                </p>
                <a 
                  href="https://csi.siesgst.ac.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary org-card-btn"
                >
                  <i className="fa-solid fa-network-wired"></i> View Chapter Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
