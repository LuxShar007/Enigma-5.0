import React, { useState, useEffect } from 'react';

export default function Countdown() {
  // Target date set to 24 hours from initial load
  const [targetDate] = useState(() => Date.now() + 24 * 60 * 60 * 1000);
  
  const [timeLeft, setTimeLeft] = useState({
    days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: false
  });

  // Simulated Live Registration Stats
  const [registeredCount, setRegisteredCount] = useState(() => {
    // Start with a high realistic number near capacity
    const saved = localStorage.getItem('enigma_sim_registered');
    return saved ? parseInt(saved, 10) : 1905;
  });
  
  const [liveAlert, setLiveAlert] = useState(null); // { message: string, id: number }

  // ── Countdown Timer Tick ──
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (isNaN(difference) || difference < 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: true });
        return;
      }

      const days    = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days:    days.toString().padStart(2, '0'),
        hours:   hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        isExpired: false
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // ── Live Registration Simulation ──
  // Increments registration count every 40-75s to show live activity
  useEffect(() => {
    let alertId = 0;
    
    const scheduleNext = () => {
      const delay = Math.random() * (75000 - 40000) + 40000; // 40s to 75s
      return setTimeout(() => {
        setRegisteredCount(prev => {
          if (prev >= 2997) return prev; // cap simulator below 3000 to keep slots open
          
          const increment = Math.random() < 0.35 ? 2 : 1;
          const nextCount = prev + increment;
          localStorage.setItem('enigma_sim_registered', nextCount.toString());

          // Trigger live dashboard notification alert
          const msgs = [
            `NEW REGISTRATION: TEAM SLOT ALLOCATED (+${increment})`,
            `INCOMING UPLINK: PROTOCOL NODE SECURED (+${increment})`,
            `VAULT ACCESS GRANTED: REGISTRY DATABASE UPDATED (+${increment})`
          ];
          setLiveAlert({
            id: alertId++,
            message: msgs[Math.floor(Math.random() * msgs.length)],
            count: nextCount
          });

          return nextCount;
        });
        
        // Schedule the subsequent simulation tick
        timerId = scheduleNext();
      }, delay);
    };

    let timerId = scheduleNext();
    return () => clearTimeout(timerId);
  }, []);

  // Auto-dismiss the live alert after 4.5 seconds
  useEffect(() => {
    if (!liveAlert) return;
    const t = setTimeout(() => setLiveAlert(null), 4500);
    return () => clearTimeout(t);
  }, [liveAlert]);

  return (
    <div className="countdown-wrapper glass-card">
      <h3 className="countdown-title">
        {timeLeft.isExpired ? (
          <span className="text-glow-emerald">
            <i className="fa-solid fa-bolt"></i> HACKING IS CURRENTLY ACTIVE!
          </span>
        ) : (
          'CRACKING PROCESS INITIATING IN'
        )}
      </h3>
      
      <div className="countdown-timer">
        <div className="time-block">
          <span className="time-value">{timeLeft.days}</span>
          <span className="time-label">DAYS</span>
        </div>
        <div className="time-divider">:</div>
        <div className="time-block">
          <span className="time-value">{timeLeft.hours}</span>
          <span className="time-label">HOURS</span>
        </div>
        <div className="time-divider">:</div>
        <div className="time-block">
          <span className="time-value">{timeLeft.minutes}</span>
          <span className="time-label">MINS</span>
        </div>
        <div className="time-divider">:</div>
        <div className="time-block">
          <span className="time-value">{timeLeft.seconds}</span>
          <span className="time-label">SECS</span>
        </div>
      </div>

      {/* Registration Capacity Status Counter */}
      <div className="registry-capacity-status">
        <div className="capacity-meta">
          <span className="capacity-label">
            <i className="fa-solid fa-network-wired text-cyan"></i> REGISTRY STATUS
          </span>
          
          {/* Live Alert Banner */}
          {liveAlert && (
            <span className="capacity-live-indicator">
              <span className="live-dot"></span>
              {liveAlert.message}
            </span>
          )}

          <span className="capacity-count text-glow-emerald">
            {registeredCount.toLocaleString()} / 3,000 REGISTERED
          </span>
        </div>
        
        <div className="capacity-progress-container">
          <div 
            className="capacity-progress-fill" 
            style={{ width: `${(registeredCount / 3000) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
