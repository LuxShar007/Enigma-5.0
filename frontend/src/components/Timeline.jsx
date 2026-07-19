import React from 'react';

export default function Timeline() {
  const timelineEvents = [
    {
      side: 'left',
      date: 'July 10, 2026',
      title: 'Registration Commences',
      desc: 'Team registration officially goes live. Form teams of 4 undergraduate members and register via the submission link to reserve your hacking terminal.',
      icon: 'fa-calendar'
    },
    {
      side: 'right',
      date: 'July 18, 2026',
      title: 'Registration Deadline',
      desc: 'Registrations lock. Last chance for groups to register and ensure credentials. Team allocations and final confirmations are distributed.',
      icon: 'fa-calendar'
    },
    {
      side: 'left',
      date: 'July 19, 2026 — 9:00 AM',
      title: 'Hackathon Commencement',
      desc: 'The code gateway opens. Problem briefs, resource packages, and sandbox platforms are released. The 36-hour countdown begins!',
      icon: 'fa-clock',
      isActiveCard: true
    },
    {
      side: 'right',
      date: 'July 19, 2026 — 9:00 PM',
      title: 'Mentoring & Review Session 1',
      desc: 'Industry mentors inspect workspaces. Teams present initial logic architectures, block diagrams, and interface wireframes for critical course-correction.',
      icon: 'fa-clock'
    },
    {
      side: 'left',
      date: 'July 20, 2026 — 9:00 AM',
      title: 'Final Submission Portal Closes',
      desc: 'Hacking phase ends. Repository keys, design assets, and video walk-through presentations must be pushed to evaluation databases.',
      icon: 'fa-clock'
    },
    {
      side: 'right',
      date: 'July 20, 2026 — 2:00 PM',
      title: 'Grand Finale & Pitching Round',
      desc: 'Shortlisted finalists pitch directly to a panel of expert judges. Live Q&A, demo analysis, and prize pool distribution of ₹25,000.',
      icon: 'fa-clock'
    }
  ];

  return (
    <section id="timeline" className="timeline-section">
      <div className="container">
        <div className="section-header reveal-blur">
          <span className="section-subtitle">THE SEQUENCE</span>
          <h2 className="section-title">Event Timeline</h2>
          <div className="section-underline"></div>
        </div>

        <div className="timeline-container">
          <div className="timeline-line">
            <div className="timeline-progress-bar" id="timeline-progress-bar"></div>
          </div>

          {timelineEvents.map((event, index) => (
            <div key={index} className={`timeline-item ${event.side}`}>
              <div className={`timeline-dot-outer reveal reveal-d${Math.min(index + 1, 6)}`}>
                <div className="timeline-dot"></div>
              </div>
              <div
                className={`timeline-card glass-card ${event.isActiveCard ? 'active-card' : ''} ${
                  event.side === 'left' ? 'reveal-left' : 'reveal-right'
                } reveal-d${Math.min(index + 1, 6)}`}
              >
                <span className="timeline-date">
                  <i className={`fa-solid ${event.icon}`}></i> {event.date}
                </span>
                <h3 className="timeline-event-title">{event.title}</h3>
                <p className="timeline-event-desc">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
