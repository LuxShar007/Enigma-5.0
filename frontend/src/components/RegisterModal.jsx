import React, { useState, useEffect, useRef } from 'react';

/* Tiny canvas code-rain strip rendered inside the modal header */
function HeaderMatrix({ active }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const cols = Math.floor(W / 14);
    const drops = Array(cols).fill(1);
    const chars = '01アイウエオカキクケコ∑∆∇≠≈§';
    let rafId;
    const draw = () => {
      ctx.fillStyle = 'rgba(2,4,10,0.18)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = '10px monospace';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(0,242,254,${Math.random() * 0.45 + 0.05})`;
        ctx.fillText(ch, i * 14, y * 14);
        if (y * 14 > H && Math.random() > 0.96) drops[i] = 0;
        drops[i]++;
      });
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [active]);
  return <canvas ref={canvasRef} className="modal-matrix-canvas" />;
}

const PORTALS = [
  {
    key: 'form',
    icon: 'fa-terminal',
    label: 'Direct Terminal',
    tag: 'FASTEST',
    tagColor: 'cyan',
    desc: 'Fill the secure registration form directly on this portal.',
    accent: 'cyan',
    href: null,
  },
  {
    key: 'unstop',
    icon: 'fa-graduation-cap',
    label: 'Unstop Uplink',
    tag: 'POPULAR',
    tagColor: 'purple',
    desc: 'Register via the SIES GST CSI Unstop platform.',
    accent: 'purple',
    href: 'https://unstop.com/hackathons/enigma-5-siesgst',
  },
  {
    key: 'devfolio',
    icon: 'fa-cubes',
    label: 'Devfolio Uplink',
    tag: 'OPEN',
    tagColor: 'emerald',
    desc: 'Register via the Devfolio hackathon registry.',
    accent: 'emerald',
    href: 'https://enigma5.devfolio.co/',
  },
];

const ACCENT = {
  cyan:    { color: '#00f2fe', rgb: '0,242,254',    bg: 'rgba(0,242,254,0.08)',   border: 'rgba(0,242,254,0.25)' },
  purple:  { color: '#9d4edd', rgb: '157,78,221',   bg: 'rgba(157,78,221,0.08)', border: 'rgba(157,78,221,0.25)' },
  emerald: { color: '#00f5d4', rgb: '0,245,212',    bg: 'rgba(0,245,212,0.08)',  border: 'rgba(0,245,212,0.25)' },
};

export default function RegisterModal({ isOpen, onClose }) {
  const [step, setStep]         = useState('select');
  const [hovered, setHovered]   = useState(null);
  const [formData, setFormData] = useState({
    teamName: '', leaderName: '', leaderEmail: '',
    leaderPhone: '', track: 'FinTech', college: '',
  });
  const [status, setStatus] = useState({ submitting: false, success: false, regCode: '' });

  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setHovered(null);
      setStatus({ submitting: false, success: false, regCode: '' });
      setFormData({ teamName:'', leaderName:'', leaderEmail:'', leaderPhone:'', track:'FinTech', college:'' });
    }
  }, [isOpen]);

  // Body scroll-lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, regCode: '' });
    setTimeout(() => {
      const hash = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6,'0');
      setStatus({ submitting: false, success: true, regCode: `ENG5-${formData.track.slice(0,3).toUpperCase()}-${hash}` });
    }, 1600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>

        {/* Scanline decorative overlay */}
        <div className="modal-scanlines" aria-hidden="true" />

        {/* Corner accents */}
        <div className="modal-corner modal-corner--tl" />
        <div className="modal-corner modal-corner--tr" />
        <div className="modal-corner modal-corner--bl" />
        <div className="modal-corner modal-corner--br" />

        {/* Close */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        {/* ── SUCCESS ── */}
        {status.success ? (
          <div className="modal-success-screen">
            <div className="success-pulse-ring">
              <div className="success-pulse-inner">
                <i className="fa-solid fa-shield-check" />
              </div>
            </div>
            <div className="success-badge">ACCESS GRANTED</div>
            <h2 className="success-title">Cipher Verified</h2>
            <p className="success-lead">
              <strong>{formData.teamName}</strong> — your terminal slot is secured.
            </p>

            <div className="crypto-receipt">
              <div className="receipt-header">
                <i className="fa-solid fa-scroll" /> REGISTRATION RECEIPT
              </div>
              {[
                { label: 'EVENT',    val: 'ENIGMA 5.0',                        accent: false },
                { label: 'TRACK',    val: formData.track.toUpperCase(),         accent: 'cyan' },
                { label: 'LEADER',   val: formData.leaderName,                  accent: false },
                { label: 'TOKEN',    val: status.regCode,                       accent: 'emerald', mono: true },
              ].map(r => (
                <div key={r.label} className="receipt-row">
                  <span className="receipt-label">{r.label}</span>
                  <span className={`receipt-val${r.accent ? ` text-${r.accent}` : ''}${r.mono ? ' font-mono' : ''}`}>{r.val}</span>
                </div>
              ))}
            </div>

            <p className="success-footer-note">
              Credentials dispatched to <strong>{formData.leaderEmail}</strong>. Secure your token before July 19.
            </p>
            <button className="btn btn-primary btn-full" onClick={onClose}>
              <i className="fa-solid fa-arrow-right-from-bracket" /> Return to Terminal
            </button>
          </div>

        ) : step === 'select' ? (

          /* ── SELECT PORTAL ── */
          <div className="gateway-select-view">
            <div className="modal-matrix-wrap">
              <HeaderMatrix active={isOpen && step === 'select'} />
              <div className="modal-matrix-overlay" />
            </div>

            <div className="modal-header-block">
              <div className="modal-badge">
                <i className="fa-solid fa-lock" />
                <span>REGISTRATION GATEWAY</span>
              </div>
              <h2 className="modal-title">Select Submission Protocol</h2>
              <p className="modal-subtitle">Choose your portal node to secure your team slot.</p>
            </div>

            <div className="gateway-options">
              {PORTALS.map(p => {
                const a = ACCENT[p.accent];
                const isHov = hovered === p.key;
                const isExternal = !!p.href;
                const Wrapper = isExternal ? 'a' : 'button';
                const wrapperProps = isExternal
                  ? { href: p.href, target: '_blank', rel: 'noopener noreferrer' }
                  : { type: 'button', onClick: () => setStep('form') };

                return (
                  <Wrapper
                    key={p.key}
                    {...wrapperProps}
                    className={`gateway-btn${isHov ? ' gateway-btn--hov' : ''}`}
                    style={{
                      '--ga': a.color, '--ga-rgb': a.rgb,
                      '--ga-bg': a.bg, '--ga-border': a.border,
                    }}
                    onMouseEnter={() => setHovered(p.key)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="gateway-icon-ring">
                      <i className={`fa-solid ${p.icon}`} />
                    </div>
                    <div className="gateway-details">
                      <div className="gateway-title-row">
                        <span className="gateway-title">{p.label}</span>
                        <span className={`gateway-tag gateway-tag--${p.tagColor}`}>{p.tag}</span>
                      </div>
                      <span className="gateway-desc">{p.desc}</span>
                    </div>
                    <div className="gateway-arrow">
                      <i className={`fa-solid ${isExternal ? 'fa-up-right-from-square' : 'fa-chevron-right'}`} />
                    </div>
                    {/* Scan line on hover */}
                    {isHov && <div className="gateway-scan-line" />}
                  </Wrapper>
                );
              })}
            </div>

            <p className="gateway-footnote">
              <i className="fa-solid fa-circle-info" /> All portals connect to the same Enigma 5.0 event.
            </p>
          </div>

        ) : (

          /* ── FORM VIEW ── */
          <div className="gateway-form-view">
            <button className="modal-back-btn" onClick={() => setStep('select')}>
              <i className="fa-solid fa-arrow-left" /> Back to Protocols
            </button>

            <div className="form-header-block">
              <div className="modal-badge modal-badge--purple">
                <i className="fa-solid fa-terminal" />
                <span>DIRECT TERMINAL</span>
              </div>
              <h2 className="modal-title">Register for Enigma 5.0</h2>
              <p className="modal-subtitle">Teams of 4 undergrads. Fill all fields to allocate your slot.</p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-teamName">
                  <i className="fa-solid fa-shield-halved" /> Team Name
                </label>
                <input type="text" id="modal-teamName" name="teamName" required
                  placeholder="e.g. NullPointerException" value={formData.teamName} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-leaderName">
                    <i className="fa-solid fa-user-astronaut" /> Team Leader
                  </label>
                  <input type="text" id="modal-leaderName" name="leaderName" required
                    placeholder="Full name" value={formData.leaderName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-leaderPhone">
                    <i className="fa-solid fa-mobile-screen" /> Contact
                  </label>
                  <input type="tel" id="modal-leaderPhone" name="leaderPhone" required
                    placeholder="10-digit number" pattern="[0-9]{10}" value={formData.leaderPhone} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modal-leaderEmail">
                  <i className="fa-solid fa-envelope-open-text" /> Leader Email
                </label>
                <input type="email" id="modal-leaderEmail" name="leaderEmail" required
                  placeholder="leader@college.edu" value={formData.leaderEmail} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-college">
                    <i className="fa-solid fa-building-columns" /> Institute
                  </label>
                  <input type="text" id="modal-college" name="college" required
                    placeholder="College / University" value={formData.college} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-track">
                    <i className="fa-solid fa-code-branch" /> Track
                  </label>
                  <select id="modal-track" name="track" value={formData.track} onChange={handleChange}>
                    <option value="FinTech">💰 FinTech — Track 01</option>
                    <option value="HealthTech">🏥 HealthTech — Track 02</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full glow-effect modal-submit-btn"
                disabled={status.submitting}>
                {status.submitting ? (
                  <><i className="fa-solid fa-shield-halved fa-spin" /> Encrypting Credentials…</>
                ) : (
                  <><i className="fa-solid fa-fingerprint" /> Complete Registration</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
