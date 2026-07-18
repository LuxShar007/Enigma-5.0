import React, { useState, useEffect } from 'react';

export default function RegisterModal({ isOpen, onClose }) {
  const [step, setStep] = useState('select'); // 'select' or 'form'
  
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    track: 'FinTech',
    college: ''
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    regCode: ''
  });

  // Reset form status and step when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setStatus({ submitting: false, success: false, regCode: '' });
      setFormData({
        teamName: '',
        leaderName: '',
        leaderEmail: '',
        leaderPhone: '',
        track: 'FinTech',
        college: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, regCode: '' });

    // Simulate encryption & networking latency
    setTimeout(() => {
      // Generate a nice random hex hash for registration confirmation
      const randomHash = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
      const confirmationCode = `ENG5-TR-${randomHash}`;

      setStatus({
        submitting: false,
        success: true,
        regCode: confirmationCode
      });
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {!status.success ? (
          <>
            {step === 'select' ? (
              <div className="gateway-select-view">
                <div className="modal-header-desc">
                  <span className="logo-accent">&lt;</span>REGISTRATION GATEWAY<span className="logo-accent">&gt;</span>
                  <h2>Select Submission Protocol</h2>
                  <p>Choose your preferred portal node to secure your team slot.</p>
                </div>
                
                <div className="gateway-options">
                  {/* Option 1: Direct Website */}
                  <button className="gateway-btn glass-card" onClick={() => setStep('form')}>
                    <div className="gateway-icon-wrapper cyan-bg">
                      <i className="fa-solid fa-server"></i>
                    </div>
                    <div className="gateway-details">
                      <span className="gateway-title">Direct Terminal Node</span>
                      <span className="gateway-desc">Complete registration form instantly on this website.</span>
                    </div>
                    <i className="fa-solid fa-chevron-right gateway-chevron"></i>
                  </button>

                  {/* Option 2: Unstop */}
                  <a 
                    href="https://unstop.com/hackathons/enigma-5-siesgst" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="gateway-btn glass-card"
                  >
                    <div className="gateway-icon-wrapper purple-bg">
                      <i className="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div className="gateway-details">
                      <span className="gateway-title">Unstop Uplink</span>
                      <span className="gateway-desc">Redirect to register on the SIES GST CSI Unstop platform.</span>
                    </div>
                    <i className="fa-solid fa-up-right-from-square gateway-chevron"></i>
                  </a>

                  {/* Option 3: Devfolio */}
                  <a 
                    href="https://enigma5.devfolio.co/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="gateway-btn glass-card"
                  >
                    <div className="gateway-icon-wrapper emerald-bg">
                      <i className="fa-solid fa-cubes"></i>
                    </div>
                    <div className="gateway-details">
                      <span className="gateway-title">DevFolio Uplink</span>
                      <span className="gateway-desc">Redirect to register on the Devfolio hackathon registry.</span>
                    </div>
                    <i className="fa-solid fa-up-right-from-square gateway-chevron"></i>
                  </a>
                </div>
              </div>
            ) : (
              <div className="gateway-form-view">
                <div className="modal-header-desc">
                  <div className="back-link-wrapper">
                    <button className="modal-back-btn" onClick={() => setStep('select')}>
                      <i className="fa-solid fa-arrow-left"></i> Back to Gateway Protocols
                    </button>
                  </div>
                  <h2>Register for Enigma 5.0</h2>
                  <p>Allocate a terminal for your team. Target audience: Undergrads in Teams of 4.</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-group">
                    <label htmlFor="modal-teamName">Team Name</label>
                    <input
                      type="text"
                      id="modal-teamName"
                      name="teamName"
                      required
                      placeholder="Enter team identification"
                      value={formData.teamName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="modal-leaderName">Team Leader Name</label>
                      <input
                        type="text"
                        id="modal-leaderName"
                        name="leaderName"
                        required
                        placeholder="Full name"
                        value={formData.leaderName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="modal-leaderPhone">Contact Number</label>
                      <input
                        type="tel"
                        id="modal-leaderPhone"
                        name="leaderPhone"
                        required
                        placeholder="10-digit number"
                        pattern="[0-9]{10}"
                        value={formData.leaderPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="modal-leaderEmail">Leader Email Address</label>
                    <input
                      type="email"
                      id="modal-leaderEmail"
                      name="leaderEmail"
                      required
                      placeholder="leader@college.edu"
                      value={formData.leaderEmail}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="modal-college">College / Institute</label>
                      <input
                        type="text"
                        id="modal-college"
                        name="college"
                        required
                        placeholder="Enter Institute Name"
                        value={formData.college}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="modal-track">Hackathon Track</label>
                      <select
                        id="modal-track"
                        name="track"
                        value={formData.track}
                        onChange={handleChange}
                      >
                        <option value="FinTech">FinTech (Track 01)</option>
                        <option value="HealthTech">HealthTech (Track 02)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full glow-effect"
                    disabled={status.submitting}
                    style={{ marginTop: '10px' }}
                  >
                    {status.submitting ? (
                      <>
                        <i className="fa-solid fa-shield-halved fa-spin"></i> Initializing Security Handshake...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-fingerprint"></i> Complete Registration
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="modal-success-screen">
            <div className="success-icon-wrapper">
              <i className="fa-solid fa-circle-check text-glow-emerald"></i>
            </div>
            <h2>Cipher Transmission Verified</h2>
            <p className="success-lead">
              Congratulations <strong>{formData.teamName}</strong>! Your hacking allocation is locked.
            </p>
            
            <div className="crypto-receipt glass-card">
              <div className="receipt-row">
                <span className="receipt-label">EVENT</span>
                <span className="receipt-val">ENIGMA 5.0</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">SELECTED TRACK</span>
                <span className="receipt-val text-cyan">{formData.track.toUpperCase()}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">TEAM LEADER</span>
                <span className="receipt-val">{formData.leaderName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">SECURITY SIGNAL</span>
                <span className="receipt-val text-glow-emerald font-mono">{status.regCode}</span>
              </div>
            </div>

            <p className="success-footer-note">
              Directives and verification credentials have been transmitted to <strong>{formData.leaderEmail}</strong>. Secure your terminal details before July 19.
            </p>

            <button className="btn btn-secondary btn-full" onClick={onClose}>
              Return to Terminal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
