import React, { useState, useEffect, useRef } from 'react';

export default function DecryptionTerminal() {
  const [percentage, setPercentage] = useState(0);
  const [logs, setLogs] = useState([]);
  const [bootCompleted, setBootCompleted] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [showMatrixRain, setShowMatrixRain] = useState(false);
  
  const matrixFeedRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  const codeLogs = [
    "Analyzing security handshakes...",
    "Validating SIES CSI digital signature...",
    "Deploying sandbox environment v1.2...",
    "Allocating ₹25,000 cash pool credits...",
    "Activating HealthTech data channels...",
    "Configuring FinTech ledger interfaces...",
    "Mounting team repository pipelines...",
    "Loading mentorship registry indexes...",
    "Running checksum on Enigma cipher...",
    "Security validation successful.",
    "Awaiting target key inputs..."
  ];

  // Bootup decrypter simulation on load
  useEffect(() => {
    let currentPercent = 0;
    let logIndex = 0;
    
    setLogs([]);
    setPercentage(0);

    const runInterval = setInterval(() => {
      currentPercent += 1;
      setPercentage(currentPercent);

      if (currentPercent % 9 === 0 && logIndex < codeLogs.length) {
        const nextLog = codeLogs[logIndex];
        if (nextLog) {
          setLogs((prevLogs) => [...prevLogs, nextLog]);
        }
        logIndex++;
      }

      if (currentPercent >= 100) {
        clearInterval(runInterval);
        setLogs((prevLogs) => [
          ...prevLogs, 
          "SYSTEM ENIGMA DECRYPTED [OK]",
          "SYS_OUT >> CORE SYSTEM ONLINE. AWAITING OPERATOR INPUT PROTOCOL...",
          "SYS_OUT >> TYPE 'help' FOR COMMAND NODES DIRECTORY."
        ]);
        setBootCompleted(true);
      }
    }, 40);

    return () => clearInterval(runInterval);
  }, []);

  // Auto-scroll log viewport
  useEffect(() => {
    if (matrixFeedRef.current) {
      matrixFeedRef.current.scrollTop = matrixFeedRef.current.scrollHeight;
    }
  }, [logs]);

  // Command handlers
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim().toLowerCase();
    const newLogs = [...logs, `C:\\CSI\\ENIGMA_5.0> ${commandInput}`];
    
    setCommandInput('');

    switch(cmd) {
      case 'help':
        setLogs([
          ...newLogs,
          "SUPPORTED CRYPTOGRAPHIC PROTOCOLS:",
          "  about    - Fetch Enigma 5.0 blueprint data details",
          "  tracks   - Scan FinTech & HealthTech category parameters",
          "  prizes   - Scan the ₹25,000 cash pool incentives directory",
          "  timeline - Dump timeline schedule checkpoint vectors",
          "  matrix   - Initialize falling digital cipher overlay stream",
          "  clear    - Clear terminal logs history stream"
        ]);
        break;
      case 'about':
        setLogs([
          ...newLogs,
          "SYS_OUT >> EVENT: ENIGMA 5.0 HACKATHON",
          "SYS_OUT >> FORMAT: 36-Hour continuous offline hackathon",
          "SYS_OUT >> CHAPTER: SIES GST Computer Society of India",
          "SYS_OUT >> ELIGIBILITY: All Undergraduate students (Teams of 3 to 4)"
        ]);
        break;
      case 'tracks':
        setLogs([
          ...newLogs,
          "SYS_OUT >> SCANNING SECURE SPECIALIZATION DOMAINS...",
          "SYS_OUT >> TRACK 01: FinTech Platforms (DeFi, neo-banking, smart ledgers)",
          "SYS_OUT >> TRACK 02: HealthTech Nodes (EHR networks, biofeedback, analytics)"
        ]);
        break;
      case 'prizes':
        setLogs([
          ...newLogs,
          "SYS_OUT >> RETRIEVING INCENTIVES DIRECTORY...",
          "SYS_OUT >> NODE 01 (1ST Rank)  : ₹15,000 INR Cash Pot",
          "SYS_OUT >> NODE 02 (2ND Rank)  : ₹10,000 INR Cash Pot",
          "SYS_OUT >> NODE 03 (SWAGS/Perks): Sponsor guidance, API keys, certs"
        ]);
        break;
      case 'timeline':
        setLogs([
          ...newLogs,
          "SYS_OUT >> EXTRACTING TIMELINE SCHEDULER CHECKPOINTS...",
          "SYS_OUT >> STEP 01: Online idea submission PPT on Unstop",
          "SYS_OUT >> STEP 02: Candidate team reviews & selections",
          "SYS_OUT >> STEP 03: 36-hour offline code sprint at SIES campus Nerul",
          "SYS_OUT >> STEP 04: Mentorship vetting & jury allocations"
        ]);
        break;
      case 'matrix':
        setLogs([...newLogs, "SYS_OUT >> INITIALIZING MATRIX STREAM OVERLAY... PRESS ESC OR CLICK OVERLAY TO RETREAT."]);
        setShowMatrixRain(true);
        break;
      case 'clear':
        setLogs(["SYS_OUT >> Terminal cleared. Awaiting commands..."]);
        break;
      default:
        setLogs([...newLogs, `SYS_ERR >> PROTOCOL COMMAND "${cmd.toUpperCase()}" NOT FOUND. TYPE 'help' TO VIEW DIRECTORY.`]);
    }
  };

  // Matrix Rain canvas engine
  useEffect(() => {
    if (!showMatrixRain || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Fit canvas dynamically inside parent block
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%@#*&+-=";
    const charArr = chars.split("");
    const fontSize = 13;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    let animationId;
    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 10, 0.09)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00f2fe"; // Cyan text color matching Enigma branding
      ctx.font = `${fontSize}px Courier New`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    // Close on Escape keyboard tap
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowMatrixRain(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    animationId = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMatrixRain]);

  // Focusing terminal input cursor automatically
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="interactive-decryption-card glass-card spotlight-card" onClick={focusInput}>
      <div className="card-glow-element"></div>
      <div className="decryption-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="terminal-title">enigma_core_metrics.sh</span>
      </div>
      <div className="decryption-body" style={{ position: 'relative' }}>
        
        {/* Falling Matrix Rain Canvas Overlay */}
        {showMatrixRain && (
          <canvas 
            ref={canvasRef} 
            className="matrix-rain-canvas"
            onClick={(e) => {
              e.stopPropagation();
              setShowMatrixRain(false);
            }}
          />
        )}

        <div className="code-line">
          <span className="code-comment"># Enigma 5.0 Configuration parameters</span>
        </div>
        <div className="code-line">
          <span className="code-keyword">export</span> EVENT_NAME=<span className="code-string">"Enigma 5.0"</span>
        </div>
        <div className="code-line">
          <span className="code-keyword">export</span> ORGANIZER=<span className="code-string">"SIES Graduate School of Technology - CSI"</span>
        </div>
        <div className="code-line">
          <span className="code-keyword">export</span> FORMAT=<span className="code-string">"Undergrad Hackathon (Teams of 3-4)"</span>
        </div>
        <div className="code-line">
          <span className="code-keyword">export</span> REQ_TRACKS=<span className="code-array">["FinTech", "HealthTech"]</span>
        </div>
        <div className="code-line">
          <span className="code-keyword">export</span> CASH_PRIZE=<span className="code-number">25000</span>
        </div>
        <div className="code-line">
          <span className="code-comment"># Initializing cipher decryptor...</span>
        </div>
        
        <div className="decryption-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="progress-percentage">
            <span>{percentage}</span>% DECRYPTED
          </div>
        </div>

        <div className="matrix-code-feed" id="matrix-code-feed" ref={matrixFeedRef}>
          {logs.map((log, idx) => {
            if (!log) return null;
            const isOk = log.includes('DECRYPTED [OK]') || log.includes('ONLINE') || log.includes('help');
            return (
              <div key={idx} className={isOk ? 'text-glow-emerald' : ''}>
                <span className="code-comment">&gt;</span> {log}
              </div>
            );
          })}
        </div>

        {/* CLI Prompt form visible once bootloader completes */}
        {bootCompleted && (
          <form onSubmit={handleCommandSubmit} className="terminal-input-row">
            <span className="terminal-prompt">C:\CSI\ENIGMA_5.0&gt;</span>
            <input 
              ref={inputRef}
              type="text" 
              value={commandInput} 
              onChange={(e) => setCommandInput(e.target.value)} 
              placeholder="Type command (e.g. 'help')..." 
              className="terminal-text-input"
            />
          </form>
        )}
      </div>
    </div>
  );
}
