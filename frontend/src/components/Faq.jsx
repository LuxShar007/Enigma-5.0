import React, { useState, useEffect } from 'react';

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  const faqData = [
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

  const handleToggle = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  // Auto-open first matching log when user filters queries
  useEffect(() => {
    if (filterQuery.trim() !== '') {
      const match = faqData.find(item => 
        item.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.filename.toLowerCase().includes(filterQuery.toLowerCase())
      );
      if (match) {
        setActiveFaq(match.id);
      }
    }
  }, [filterQuery]);

  const filteredFaq = faqData.filter(item => 
    item.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.filename.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">FAQ DIRECTORY</span>
          <h2 className="section-title">Query Protocol Console</h2>
          <div className="section-underline"></div>
        </div>

        <p className="section-description-centered">
          Query technical specifications, logistics configurations, and participation rules below by exploring active system logs.
        </p>

        <div className="faq-terminal glass-card spotlight-card">
          <div className="faq-terminal-header">
            <div className="terminal-dots-group">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="terminal-path">C:\CSI_SIESGST\ENIGMA_5.0\FAQ_DIRECTORY&gt;_</div>
            </div>
            
            <div className="faq-terminal-search">
              <i className="fa-solid fa-magnifying-glass text-cyan"></i>
              <span className="search-prompt">grep -i -F</span>
              <input
                type="text"
                placeholder="filter directory by query..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="faq-search-input"
              />
            </div>
          </div>
          
          <div className="faq-terminal-body">
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item) => {
                const isOpen = activeFaq === item.id;
                return (
                  <div key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <div className="faq-item-header" onClick={() => handleToggle(item.id)}>
                      <div className="faq-file-info">
                        <i className={`fa-solid ${isOpen ? 'fa-folder-open text-purple' : 'fa-folder text-cyan'}`}></i>
                        <span className="faq-filename">{item.filename}</span>
                      </div>
                      <span className="faq-question">{item.question}</span>
                      <i className={`fa-solid fa-chevron-down faq-arrow ${isOpen ? 'rotate' : ''}`}></i>
                    </div>
                    
                    <div className="faq-item-content">
                      <div className="faq-content-inner">
                        <div className="faq-content-line">
                          <span className="faq-prompt">SYS_OUT &gt;&gt;</span>
                          <p className="faq-answer">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="terminal-no-results font-mono">
                <span className="text-glow-red">SYS_ERR &gt;&gt; NO LOGS MATCHING QUERY VECTOR "{filterQuery.toUpperCase()}" FOUND.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
