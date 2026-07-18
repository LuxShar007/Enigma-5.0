import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import OceanWaveBackground from './components/OceanWaveBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Organizers from './components/Organizers';
import Tracks from './components/Tracks';
import Prizes from './components/Prizes';
import Timeline from './components/Timeline';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import CipherStrip from './components/CipherStrip';
import StarWarsCrawl from './components/StarWarsCrawl';
import HyperspaceFlash from './components/HyperspaceFlash';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showCrawl, setShowCrawl] = useState(true);
  const hyperspaceRef = useRef(null);
  
  useEffect(() => {
    // Always start at the top of the page on mount / refresh
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Use GSAP Context for clean React StrictMode mounting and unmounting
    const ctx = gsap.context(() => {
      
      // Hero Content staggered entrance
      const heroTl = gsap.timeline();
      heroTl.from(".hero-tagline-container", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
            .from(".hero-title", { y: 40, opacity: 0, duration: 1.0, ease: "power4.out" }, "-=0.5")
            .from(".hero-description", { y: 25, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
            .from(".hero-pills .pill", { y: 20, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" }, "-=0.4")
            .from(".hero-actions .btn", { y: 20, opacity: 0, stagger: 0.15, duration: 0.6, ease: "power3.out" }, "-=0.4")
            .from(".scroll-indicator", { opacity: 0, duration: 0.6, ease: "power2.out" });

      // Section header trigger reveals (Apple iPhone style smooth scroll-linked fades)
      const sectionHeaders = document.querySelectorAll(".section-header");
      sectionHeaders.forEach(sh => {
        gsap.from(sh, {
          scrollTrigger: {
            trigger: sh,
            start: "top 95%",
            end: "top 65%",
            scrub: 1.2
          },
          y: 40,
          opacity: 0,
          scale: 0.95
        });
      });

      // Apple-style scroll-linked word-by-word highlight reveals
      const textBlocks = document.querySelectorAll(".apple-scroll-text");
      textBlocks.forEach((block) => {
        const words = block.querySelectorAll(".apple-word");
        gsap.to(words, {
          scrollTrigger: {
            trigger: block,
            start: "top 82%",
            end: "bottom 55%",
            scrub: true
          },
          color: "#ffffff",
          stagger: 0.08,
          ease: "none"
        });
      });

      // About section slide reveals (organic convergence with scrub lag)
      gsap.from(".about-text-content", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 95%",
          end: "top 55%",
          scrub: 1.2
        },
        x: -120,
        opacity: 0,
        scale: 0.92
      });

      gsap.from(".about-visual-column", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 95%",
          end: "top 55%",
          scrub: 1.2
        },
        x: 120,
        opacity: 0,
        scale: 0.92
      });

      // Organizers section reveals (organic convergence with scrub lag)
      gsap.from(".organizers-info-content", {
        scrollTrigger: {
          trigger: ".organizers-section",
          start: "top 95%",
          end: "top 55%",
          scrub: 1.2
        },
        x: -120,
        opacity: 0,
        scale: 0.92
      });

      gsap.from(".organizers-cards-container", {
        scrollTrigger: {
          trigger: ".organizers-section",
          start: "top 95%",
          end: "top 55%",
          scrub: 1.2
        },
        x: 120,
        opacity: 0,
        scale: 0.92
      });

      // Tracks cards reveals (cards scale up and slide together)
      gsap.from("#track-fintech", {
        scrollTrigger: {
          trigger: ".tracks-section",
          start: "top 95%",
          end: "top 60%",
          scrub: 1.2
        },
        x: -140,
        opacity: 0,
        scale: 0.88
      });

      gsap.from("#track-healthtech", {
        scrollTrigger: {
          trigger: ".tracks-section",
          start: "top 95%",
          end: "top 60%",
          scrub: 1.2
        },
        x: 140,
        opacity: 0,
        scale: 0.88
      });

      // Prizes section reveals
      const prizeCards = document.querySelectorAll(".prize-card");
      prizeCards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: ".prizes-section",
            start: "top 95%",
            end: "top 60%",
            scrub: 1.2
          },
          y: 70,
          opacity: 0,
          scale: 0.9,
          delay: index * 0.1
        });
      });

      // ── Timeline Section ──────────────────────────────────────────────
      // Progress bar fill (scrub so it feels physical)
      gsap.fromTo("#timeline-progress-bar",
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 70%",
            end: "bottom 65%",
            scrub: 0.8,
          },
        }
      );

      // Countdown widget drops in from above
      gsap.from(".registry-countdown", {
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 88%",
          end: "top 50%",
          scrub: 1,
        },
        y: -60,
        opacity: 0,
        scale: 0.92,
      });

      // Timeline items: each card slides from its side with staggered start
      const timelineItems = document.querySelectorAll(".timeline-item");
      timelineItems.forEach((item, _idx) => {
        const card = item.querySelector(".timeline-card");
        const dot  = item.querySelector(".timeline-dot-outer");
        const isLeft = item.classList.contains("left");

        // Card slides in from left or right
        gsap.from(card, {
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            end: "top 55%",
            scrub: 1,
          },
          x: isLeft ? -120 : 120,
          opacity: 0,
          scale: 0.88,
        });

        // Dot pulses in independently
        if (dot) {
          gsap.from(dot, {
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              end: "top 65%",
              scrub: 1,
            },
            scale: 0,
            opacity: 0,
          });
        }

        // Add active class when item centre crosses 75% viewport
        ScrollTrigger.create({
          trigger: item,
          start: "top 75%",
          onEnter:     () => item.classList.add("active"),
          onLeaveBack: () => item.classList.remove("active"),
        });
      });

      // ── FAQ ───────────────────────────────────────────────────────────
      gsap.from(".faq-terminal", {
        scrollTrigger: {
          trigger: ".faq-section",
          start: "top 88%",
          end: "top 55%",
          scrub: 1,
        },
        y: 90,
        opacity: 0,
        scale: 0.93,
      });

      // ── Contact Section ───────────────────────────────────────────────
      // Left column slides in
      gsap.from(".contact-details", {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 88%",
          end: "top 52%",
          scrub: 1,
        },
        x: -120,
        opacity: 0,
        scale: 0.92,
      });

      // Right form slides in from opposite side
      gsap.from(".contact-form-container", {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 88%",
          end: "top 52%",
          scrub: 1,
        },
        x: 120,
        opacity: 0,
        scale: 0.92,
      });

      // Social links stagger up one by one
      gsap.from(".social-links a", {
        scrollTrigger: {
          trigger: ".social-links",
          start: "top 92%",
          end: "top 70%",
          scrub: 0.8,
        },
        y: 30,
        opacity: 0,
        scale: 0.7,
        stagger: 0.12,
      });

      // Contact info items cascade in
      gsap.from(".contact-item", {
        scrollTrigger: {
          trigger: ".contact-info-list",
          start: "top 90%",
          end: "top 60%",
          scrub: 0.8,
        },
        y: 25,
        opacity: 0,
        stagger: 0.15,
      });
      // Scramble text function
      const scrambleText = (element, originalText, duration = 1000) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%@#$*&+-=";
        const startTime = Date.now();
        
        const update = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          
          let scrambled = "";
          for (let i = 0; i < originalText.length; i++) {
            if (originalText[i] === " ") {
              scrambled += " ";
            } else if (i < progress * originalText.length) {
              scrambled += originalText[i];
            } else {
              scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          
          element.innerText = scrambled;
          
          if (progress < 1) {
            requestAnimationFrame(update);
          }
        };
        
        requestAnimationFrame(update);
      };

      // Section title triggers (decrypt on scroll)
      const sectionTitles = document.querySelectorAll(".section-title");
      sectionTitles.forEach((header) => {
        const originalText = header.innerText;
        ScrollTrigger.create({
          trigger: header,
          start: "top 92%",
          onEnter: () => {
            scrambleText(header, originalText, 1000);
          },
          once: true
        });
      });

    });

    // Spotlight Card cursor coordinates tracking
    const cards = document.querySelectorAll(".spotlight-card");
    const cleanupSpotlights = [];

    cards.forEach((card) => {
      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      };
      card.addEventListener("mousemove", onMouseMove);
      cleanupSpotlights.push(() => card.removeEventListener("mousemove", onMouseMove));
    });

    // Refresh ScrollTrigger to calculate correct layouts
    ScrollTrigger.refresh();

    // Secondary delayed refresh to account for dynamic component updates (canvas, layouts)
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
      console.log("GSAP ScrollTrigger refreshed successfully!");
    }, 800);

    // Revert all animations and clean up timeline instances on unmount
    return () => {
      clearTimeout(refreshTimeout);
      ctx.revert();
      cleanupSpotlights.forEach(cb => cb());
    };
  }, []);

  // Fire hyperspace warp then open modal
  const triggerRegisterModal = () => {
    if (hyperspaceRef.current) {
      hyperspaceRef.current.trigger(() => setIsRegisterOpen(true));
    } else {
      setIsRegisterOpen(true);
    }
  };

  return (
    <>
      {/* Star Wars Opening Crawl — shown once on load */}
      {showCrawl && <StarWarsCrawl onComplete={() => setShowCrawl(false)} />}

      {/* Hyperspace Warp Flash — fires before register modal */}
      <HyperspaceFlash ref={hyperspaceRef} />

      {/* Ocean Wave WebGL Background */}
      <OceanWaveBackground />

      {/* Cyber-Grid Backdrop */}
      <div className="cyber-grid"></div>

      {/* Drifting Ambient Nebula Orbs */}
      <div className="ambient-nebula-container">
        <div className="ambient-orb orb-cyan"></div>
        <div className="ambient-orb orb-purple"></div>
        <div className="ambient-orb orb-emerald"></div>
      </div>

      {/* Navigation Header */}
      <Navbar onRegisterClick={triggerRegisterModal} />

      {/* Main Content Sections */}
      <main>
        <Hero onRegisterClick={triggerRegisterModal} />
        <About />
        <Organizers />
        <Tracks />
        <CipherStrip />
        <Prizes />
        <Timeline />
        <Faq />
        <Contact />
      </main>

      {/* Footer Branding */}
      <Footer onRegisterClick={triggerRegisterModal} />

      {/* Team Registration Modal Gateway */}
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </>
  );
}
