import React, { useState, useRef, useEffect } from 'react';
import csiLogo from '../assets/CSI (WHITE) LOGO.png';

export default function Contact() {
  const socialRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    teamSize: '4',
    message: ''
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    text: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Trigger CSS bounce animation on social icons when they enter viewport
  useEffect(() => {
    const el = socialRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('social-animated');
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: false, text: '' });

    // Simulate network submission delay
    setTimeout(() => {
      setStatus({
        submitting: false,
        success: true,
        error: false,
        text: `Cipher transmitted successfully! SIES CSI team has logged your query, ${formData.name}.`
      });

      // Clear input fields
      setFormData({
        name: '',
        email: '',
        college: '',
        teamSize: '4',
        message: ''
      });

      // Hide success notification after 5 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false, text: '' }));
      }, 5000);

    }, 1200);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header reveal-blur">
          <span className="section-subtitle">THE UPLINK</span>
          <h2 className="section-title">Contact Organizing Team</h2>
          <div className="section-underline"></div>
        </div>

        <div className="contact-grid">
          {/* Left Details Panel */}
          <div className="contact-details glass-card reveal-left">
            <h3 className="contact-card-title">Enigma Headquarters</h3>
            <p className="contact-card-desc">
              Got questions regarding registration guidelines, tracks, or developer workspace specifications? Get in touch with our team.
            </p>

            <div className="contact-info-list">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="contact-text">
                  <span className="contact-label">Official Email</span>
                  <a href="mailto:csi@siesgst.ac.in" className="contact-value">
                    csi@siesgst.ac.in
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="contact-text">
                  <span className="contact-label">Location</span>
                  <span className="contact-value">
                    Sri Chandrasekarendra Saraswati Vidyapuram,
                    Sector-V, Nerul, Navi Mumbai,
                    Maharashtra — 400706
                  </span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="contact-text">
                  <span className="contact-label">Inquiries Phone</span>
                  <span className="contact-value">
                    +91 98765 43210 / +91 99887 76655
                  </span>
                </div>
              </div>
            </div>

            <div className="social-header">CONNECT WITH CSI</div>
            <div className="social-links" ref={socialRef}>
              <a href="https://www.instagram.com/csisiesgst/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/csi-siesgst/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://www.facebook.com/csisies/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="https://csi.siesgst.ac.in/" target="_blank" rel="noopener noreferrer" aria-label="CSI SIES GST Website" className="social-link-website">
                <img src={csiLogo} alt="CSI SIES GST" className="social-csi-logo" />
              </a>
            </div>
          </div>

          {/* Right Submit Form */}
          <div className="contact-form-container glass-card reveal-right reveal-d1">
            <h3 className="contact-card-title">Send a Cipher Message</h3>
            
            <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="form-name">Name</label>
                <input
                  type="text"
                  id="form-name"
                  name="name"
                  required
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="form-email">Email Address</label>
                <input
                  type="email"
                  id="form-email"
                  name="email"
                  required
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="form-college">College Name</label>
                  <input
                    type="text"
                    id="form-college"
                    name="college"
                    required
                    placeholder="Your Institute"
                    value={formData.college}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-team">Team size</label>
                  <select
                    id="form-team"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                  >
                    <option value="4">4 Members (Recommended)</option>
                    <option value="3">3 Members</option>
                    <option value="2">2 Members</option>
                    <option value="1">Individual / Looking for Team</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="form-message">Message/Inquiry</label>
                <textarea
                  id="form-message"
                  name="message"
                  rows="4"
                  required
                  placeholder="Describe your question or message..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full glow-effect"
                disabled={status.submitting}
              >
                {status.submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Transmitting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> Transmit Message
                  </>
                )}
              </button>
            </form>
            
            {status.text && (
              <div
                className={`form-feedback ${
                  status.success ? 'success' : status.error ? 'error' : 'hidden'
                }`}
              >
                {status.success && <i className="fa-solid fa-circle-check"></i>}
                {status.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
