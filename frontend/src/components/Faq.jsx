import React, { useState, useEffect } from 'react';

// Module-level constant — stable reference, safe in useEffect deps
const FAQ_DATA = [
  {
    id: "eligibility",
    filename: "ELIGIBILITY.cfg",
    question: "Who is eligible to participate in Enigma 5.0?",
    answer: "The hackathon is open to all undergraduate students currently pursuing their degree across India from any specialization (Engineering, Management, Design, Arts, etc.)."
  },
  {
    id: "team",
    filename: "TEAM_STRUCTURE.reg",
    question: "What is the team size and composition guidelines?",
    answer: "Teams must consist of precisely 3 to 4 members. Inter-college and inter-specialization teams are fully permitted. Each team must nominate a team leader for communications."
  },
  {
    id: "structure",
    filename: "EVENT_FORMAT.log",
    question: "What is the format and rounds of Enigma 5.0?",
    answer: "Round 1 is an online idea submission round where teams submit their pitch deck PPT on Unstop. Round 2 is a continuous, overnight offline hackathon conducted on-campus at the SIES Graduate School of Technology, Sector 5, Nerul, Navi Mumbai."
  },
  {
    id: "registration",
    filename: "PAYMENT_SUBMIT.cfg",
    question: "Why can't I see the 'Submit' button on Unstop?",
    answer: "The 'Submit' button and PPT upload window will only become active on the Unstop portal once the registration fees for the team have been verified and processed by the CSI audit team."
  },
  {
    id: "accommodation",
    filename: "ACCOMMODATION.log",
    question: "Is accommodation provided for the offline Round 2?",
    answer: "No, as Enigma is a continuous, overnight coding hackathon, no separate hostel or hotel accommodation is provided. High-speed workspaces, power banks, network lines, food, and energy drinks will be provided on-campus."
  },
  {
    id: "problem_statement",
    filename: "TRACKS_PS.json",
    question: "Can we change our track or project details in Round 2?",
    answer: "You must continue with the track locked in Round 1 for the duration of the hackathon. The Round 2 offline problem statement will fall under the same track, though it may introduce different specific tasks."
  }
];

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  const handleToggle = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  // Auto-open first matching log when user filters queries
  useEffect(() => {
    if (filterQuery.trim() !== '') {
      const match = FAQ_DATA.find(item =>
        item.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.filename.toLowerCase().includes(filterQuery.toLowerCase())
      );
      if (match) {
        setActiveFaq(match.id);
      }
    }
  }, [filterQuery]);

  const filteredFaq = FAQ_DATA.filter(item =>
    item.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.filename.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">SYSTEM LOGS</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="section-underline"></div>
        </div>

        <div className="faq-terminal">
          {/* Terminal Header */}
          <div className="faq-terminal-header">
            <div className="terminal-dots">
              <span className="t-dot t-dot-red"></span>
              <span className="t-dot t-dot-yellow"></span>
              <span className="t-dot t-dot-green"></span>
            </div>
            <span className="faq-terminal-title">enigma_faq.log — QUERY CONSOLE</span>
            <div className="faq-grep-row">
              <span className="faq-grep-prefix">grep -i -F</span>
              <input
                type="text"
                className="faq-grep-input"
                placeholder="filter query..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
          </div>

          {/* FAQ Items */}
          <div className="faq-list">
            {filteredFaq.length === 0 ? (
              <div className="faq-no-results">
                <span className="faq-no-results-text">
                  SYS_ERR &gt;&gt; NO LOGS MATCHING QUERY: <em>&quot;{filterQuery}&quot;</em>
                </span>
              </div>
            ) : (
              filteredFaq.map((item) => (
                <div
                  key={item.id}
                  className={`faq-item ${activeFaq === item.id ? 'faq-item--open' : ''}`}
                  onClick={() => handleToggle(item.id)}
                >
                  <div className="faq-item-header">
                    <div className="faq-filename-row">
                      <i className="fa-solid fa-file-code faq-file-icon"></i>
                      <span className="faq-filename">{item.filename}</span>
                    </div>
                    <span className="faq-question">{item.question}</span>
                    <i className={`fa-solid fa-chevron-down faq-chevron ${activeFaq === item.id ? 'faq-chevron--open' : ''}`}></i>
                  </div>
                  <div className="faq-item-body">
                    <div className="faq-item-body-inner">
                      <span className="faq-answer-prefix">SYS_OUT &gt;&gt;</span>
                      <p className="faq-answer">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
