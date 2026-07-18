import React, { useState, useEffect } from 'react';

export default function Countdown() {
  // Target date initialized to exactly 24 hours from the initial page load
  const [targetDate] = useState(() => Date.now() + 24 * 60 * 60 * 1000);
  
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (isNaN(difference) || difference < 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        isExpired: false
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

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
          <span className="capacity-count text-glow-emerald">
            1,095 / 2,000 REGISTERED
          </span>
        </div>
        <div className="capacity-progress-container">
          <div className="capacity-progress-fill"></div>
        </div>
      </div>
    </div>
  );
}
