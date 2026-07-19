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
import PreviousEvents from './components/PreviousEvents';
import VenueBeacon from './components/VenueBeacon';
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
  const [showCrawl, setShowCrawl] = useState(
    () => !sessionStorage.getItem('enigma_crawl_seen')
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const hyperspaceRef = useRef(null);

  const handleCrawlComplete = () => {
    sessionStorage.setItem('enigma_crawl_seen', '1');
    setShowCrawl(false);
  };

  // Scroll progress bar + floating CTA
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowFloatingCta(scrollTop > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Button click ripple
  useEffect(() => {
    const handleRipple = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top  = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    };
    const btns = document.querySelectorAll('.btn');
    btns.forEach(b => b.addEventListener('click', handleRipple));
    return () => btns.forEach(b => b.removeEventListener('click', handleRipple));
  }, []);

  /* ── Apple-style GSAP animations ──────────────────────────────────── */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const ctx = gsap.context(() => {

      /* Hero entrance — fires immediately, no ScrollTrigger */
      const heroTl = gsap.timeline({ delay: 0.15 });
      heroTl
        .from('.hero-tagline-container', { y: 30, opacity: 0, filter: 'blur(6px)', duration: 0.75, ease: 'expo.out' })
        .from('.hero-title',             { y: 50, opacity: 0, filter: 'blur(8px)', duration: 0.9,  ease: 'expo.out' }, '-=0.5')
        .from('.hero-description',       { y: 25, opacity: 0, filter: 'blur(4px)', duration: 0.75, ease: 'expo.out' }, '-=0.55')
        .from('.hero-pills .pill',       { y: 20, opacity: 0, stagger: 0.1,  duration: 0.55, ease: 'expo.out' }, '-=0.45')
        .from('.countdown-wrapper',      { y: 20, opacity: 0, duration: 0.55, ease: 'expo.out' }, '-=0.45')
        .from('.hero-actions .btn',      { y: 20, opacity: 0, stagger: 0.12, duration: 0.55, ease: 'expo.out' }, '-=0.4')
        .from('.scroll-indicator',       { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' });

      /* Word-by-word text illumination — intentional scrub */
      document.querySelectorAll('.apple-scroll-text').forEach(block => {
        const words = block.querySelectorAll('.apple-word');
        if (words.length > 0) {
          gsap.to(words, {
            scrollTrigger: { trigger: block, start: 'top 80%', end: 'bottom 50%', scrub: true },
            color: '#ffffff', stagger: 0.06, ease: 'none',
          });
        }
      });

      /* Section headers — handled by CSS reveal-blur + IntersectionObserver, no GSAP needed */

      /* About — opposing slide-in */
      gsap.from('.about-text-content', {
        scrollTrigger: { trigger: '.about-section', start: 'top 88%', toggleActions: 'play none none none' },
        x: -60, y: 20, opacity: 0, filter: 'blur(5px)', duration: 0.85, ease: 'expo.out',
      });
      gsap.from('.about-visual-column', {
        scrollTrigger: { trigger: '.about-section', start: 'top 88%', toggleActions: 'play none none none' },
        x: 60, y: 20, opacity: 0, filter: 'blur(5px)', duration: 0.85, ease: 'expo.out', delay: 0.1,
      });

      /* Organizers — opposing slide-in */
      gsap.from('.organizers-info-content', {
        scrollTrigger: { trigger: '.organizers-section', start: 'top 88%', toggleActions: 'play none none none' },
        x: -60, y: 20, opacity: 0, filter: 'blur(5px)', duration: 0.85, ease: 'expo.out',
      });
      gsap.from('.organizers-cards-container', {
        scrollTrigger: { trigger: '.organizers-section', start: 'top 88%', toggleActions: 'play none none none' },
        x: 60, y: 20, opacity: 0, filter: 'blur(5px)', duration: 0.85, ease: 'expo.out', delay: 0.12,
      });

      /* Tracks — opposing slide */
      gsap.from('#track-fintech', {
        scrollTrigger: { trigger: '.tracks-section', start: 'top 88%', toggleActions: 'play none none none' },
        x: -60, y: 30, opacity: 0, filter: 'blur(5px)', scale: 0.96, duration: 0.85, ease: 'expo.out',
      });
      gsap.from('#track-healthtech', {
        scrollTrigger: { trigger: '.tracks-section', start: 'top 88%', toggleActions: 'play none none none' },
        x: 60, y: 30, opacity: 0, filter: 'blur(5px)', scale: 0.96, duration: 0.85, ease: 'expo.out', delay: 0.1,
      });

      /* Prizes — handled entirely by CSS reveal + IntersectionObserver (reveal-d1/d2/d3 stagger) */

      /* Timeline progress bar — intentional scrub */
      gsap.fromTo('#timeline-progress-bar',
        { height: '0%' },
        {
          height: '100%', ease: 'none',
          scrollTrigger: { trigger: '.timeline-container', start: 'top 70%', end: 'bottom 65%', scrub: 0.5 },
        }
      );



      /* Timeline items — CSS reveal-left/reveal-right handles slide animation.
         GSAP only manages the dot pop-in and the active class for highlighting. */
      document.querySelectorAll('.timeline-item').forEach((item, idx) => {
        const dot = item.querySelector('.timeline-dot-outer');
        if (dot) {
          gsap.from(dot, {
            scrollTrigger: {
              trigger: item, start: 'top 90%',
              toggleActions: 'play none none none', invalidateOnRefresh: true,
            },
            scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(1.7)', delay: idx * 0.04 + 0.1,
          });
        }
        ScrollTrigger.create({
          trigger: item, start: 'top 75%',
          onEnter:     () => item.classList.add('active'),
          onLeaveBack: () => item.classList.remove('active'),
          invalidateOnRefresh: true,
        });
      });

      /* FAQ terminal — handled by CSS reveal + IntersectionObserver */

      /* Contact — details and form handled by CSS reveal-left/right.
         Only cascade the individual contact items with GSAP for micro-stagger. */
      gsap.from('.contact-item', {
        scrollTrigger: {
          trigger: '.contact-info-list', start: 'top 92%',
          toggleActions: 'play none none none', invalidateOnRefresh: true,
        },
        y: 18, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out',
      });
      // .social-links a is NOT in GSAP — CSS keyframe handles it so icons are always visible

      /* Section title scramble-decrypt — read text BEFORE GSAP/CSS hides elements */
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%@#$*&+-=';
      const scramble = (el, original, dur = 900) => {
        if (!original || original.trim() === '') return;
        // Temporarily override gradient clip so scramble chars are visible
        el.style.webkitTextFillColor = '#a8c8ff';
        el.style.backgroundClip = 'unset';
        el.style.webkitBackgroundClip = 'unset';
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / dur, 1);
          el.textContent = original.split('').map((ch, i) =>
            ch === ' ' ? ' ' : i < p * original.length ? ch : chars[Math.floor(Math.random() * chars.length)]
          ).join('');
          if (p < 1) {
            requestAnimationFrame(tick);
          } else {
            // Restore gradient styling after scramble completes
            el.style.webkitTextFillColor = '';
            el.style.backgroundClip = '';
            el.style.webkitBackgroundClip = '';
          }
        };
        requestAnimationFrame(tick);
      };
      // Capture text BEFORE animations hide elements, store in data attribute
      document.querySelectorAll('.section-title').forEach(h => {
        const orig = h.textContent.trim();
        h.dataset.origTitle = orig; // store for safe retrieval later
        ScrollTrigger.create({
          trigger: h, start: 'top 95%',
          onEnter: () => scramble(h, h.dataset.origTitle || orig),
          once: true,
          invalidateOnRefresh: true,
        });
      });
    });

    /* Spotlight card mouse-tracking */
    const cleanupSpotlights = [];
    document.querySelectorAll('.spotlight-card').forEach(card => {
      const fn = (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
      };
      card.addEventListener('mousemove', fn);
      cleanupSpotlights.push(() => card.removeEventListener('mousemove', fn));
    });

    ScrollTrigger.refresh();
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      clearTimeout(t);
      ctx.revert();
      cleanupSpotlights.forEach(cb => cb());
    };
  }, []);

  /* ── Global CSS reveal system (IntersectionObserver) ─────────────── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    // Observe ALL reveal-class elements including new ones added to later sections
    document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-blur, .section-description-centered'
    ).forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── Re-run IntersectionObserver after CipherStrip mounts (pinned section alters layout) ── */
  useEffect(() => {
    const t = setTimeout(() => {
      const io2 = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              io2.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      // Only pick up elements that haven't animated yet
      document.querySelectorAll(
        '.reveal:not(.in-view), .reveal-left:not(.in-view), .reveal-right:not(.in-view), .reveal-blur:not(.in-view)'
      ).forEach(el => io2.observe(el));
    }, 1200); // Wait for CipherStrip pin to settle
    return () => clearTimeout(t);
  }, []);

  /* ── Fire hyperspace warp then open modal ────────────────────────── */
  const triggerRegisterModal = () => {
    if (hyperspaceRef.current) {
      hyperspaceRef.current.trigger(() => setIsRegisterOpen(true));
    } else {
      setIsRegisterOpen(true);
    }
  };

  return (
    <>
      {/* Star Wars Opening Crawl — once per session */}
      {showCrawl && <StarWarsCrawl onComplete={handleCrawlComplete} />}

      {/* Hyperspace flash — fires before register modal */}
      <HyperspaceFlash ref={hyperspaceRef} />

      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Floating Register CTA — appears after hero scrolls away */}
      <button
        id="floating-register-cta"
        className={`floating-cta${showFloatingCta ? ' floating-cta--visible' : ''}`}
        onClick={triggerRegisterModal}
        aria-label="Register for Enigma 5.0"
      >
        <i className="fa-solid fa-key"></i>
        <span>Register Now</span>
      </button>

      {/* Ocean Wave WebGL Background */}
      <OceanWaveBackground />

      {/* Aurora gradient depth layer — zero animation cost */}
      <div className="aurora-layer" aria-hidden="true" />

      {/* Cyber-Grid Backdrop */}
      <div className="cyber-grid"></div>

      {/* Drifting Ambient Nebula Orbs */}
      <div className="ambient-nebula-container">
        <div className="ambient-orb orb-cyan"></div>
        <div className="ambient-orb orb-purple"></div>
        <div className="ambient-orb orb-emerald"></div>
      </div>

      {/* Navigation */}
      <Navbar onRegisterClick={triggerRegisterModal} />

      {/* Main Content */}
      <main>
        <Hero onRegisterClick={triggerRegisterModal} />
        <About />
        <Organizers />
        <Tracks />
        <CipherStrip />
        <Prizes />
        <Timeline />
        <Faq />
        <PreviousEvents />
        <VenueBeacon />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onRegisterClick={triggerRegisterModal} />

      {/* Registration Modal */}
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </>
  );
}
