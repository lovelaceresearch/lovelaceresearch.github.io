"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import kartsLogo from './images/karts.svg';

/**
 * DATA MOCK
 */
const INTERVIEWS = [
  {
    id: 1,
    title: 'Conceptual Gems',
    interviewee: "Stephanie D'heygere",
    studio: "D'heygere",
    location: "Paris",
    date: 'Jan. 12 2021',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Zeitgeist Design',
    interviewee: 'Willo Perron',
    studio: 'Perron-Roettinger',
    location: 'Los Angeles',
    date: 'Mar. 11 2021',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Dealing with Dealing',
    interviewee: 'Jean-Baptiste Levée',
    studio: 'Production Type',
    location: 'Paris',
    date: 'Dec. 11 2020',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Leaving Room For Mistakes',
    interviewee: 'Scheltens & Abbenes',
    studio: 'S&A Photography',
    location: 'Amsterdam',
    date: 'Mar. 31 2021',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'The Art of Cooking',
    interviewee: 'Liza Enebeis',
    studio: 'Studio Dumbar',
    location: 'Rotterdam',
    date: 'Jan. 19 2021',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'War & Peace',
    interviewee: 'Mirko Borsche',
    studio: 'Bureau Borsche',
    location: 'Munich',
    date: 'Jan. 26 2021',
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 7,
    title: 'Successional Dynamics',
    interviewee: 'Dinamo',
    studio: 'Dinamo Typefaces',
    location: 'Basel & Berlin',
    date: 'Nov. 09 2021',
    image: 'https://images.unsplash.com/photo-1502014822147-1aed80671e0a?q=80&w=1000&auto=format&fit=crop'
  },
];

/**
 * CSS STYLES
 * Injected directly into the component for portability
 */
const cssStyles = `
  :root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --dim-opacity: 0.2;
    --transition-speed: 0.5s;
  }

  body {
    margin: 0;
    font-family: 'Favorit Hangul', sans-serif;
    background: var(--bg-color);
    color: var(--text-color);
    -webkit-font-smoothing: antialiased;
  }

  /* Utility & Layout */
  .app-container {
    min-height: 100vh;
    position: relative;
    /* padding-top removed since header is now relative/in-flow */
    padding-bottom: 5rem;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Header / Hero */
  .site-header {
    position: relative; /* Changed from fixed to relative */
    width: 100%;
    padding: 8rem 2rem 4rem 2rem; /* Bigger padding */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    mix-blend-mode: difference;
    color: white;
    pointer-events: none;
    box-sizing: border-box;
  }

  .logo {
    position: absolute; /* Absolute position for logo */
    top: 2rem;
    left: 2rem;
    display: flex;
    align-items: center;
    pointer-events: auto;
    cursor: pointer;
  }
  
  .logo img {
    height: 36px; /* 36px as requested */
    width: auto;
    filter: brightness(0) invert(1);
  }

  .header-center {
    display: flex;
    flex-direction: column; /* Vertical stack */
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    max-width: 600px;
    pointer-events: auto;
  }

  .header-text {
    font-size: 0.85rem;
    font-weight: 400;
    text-transform: uppercase; /* Default uppercase */
    letter-spacing: 0.05em;
    line-height: 1.5;
  }
  
  .header-bio {
    text-transform: none; /* Bio is normal case */
    margin-bottom: 0.5rem;
  }

  .header-text a {
    text-decoration: none;
    color: white;
    transition: opacity 0.3s;
    display: inline-block;
    border-bottom: 1px solid transparent; /* Optional hover effect */
  }
  
  .header-text a:hover { opacity: 0.5; border-bottom-color: white; }

  /* Nav links removed */
  .nav-links {
    display: none; 
  }

  /* List Item Styles */
  .list-wrapper {
    min-height: 60vh;
  }

  .list-item {
    position: relative;
    width: 100%;
    border-bottom: 1px solid rgba(0,0,0,1); /* Opacity 100% */
    padding: 160px 0; /* Increased padding */
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-align: center;
  }

  .item-content {
    display: flex;
    flex-direction: column;
    gap: 0.2rem; /* Reduced gap from 0.5rem */
    padding: 0 1rem;
    transition: opacity 0.5s ease-out, filter 0.5s ease-out;
  }

  .item-content.dimmed {
    opacity: var(--dim-opacity);
    filter: blur(1px);
  }

  .item-title {
    font-size: 3.5rem; /* Mobile default */
    font-weight: 400; /* No Bold */
    line-height: 1; /* Reduced to 1 */
    letter-spacing: -0.04em;
    text-transform: uppercase;
    transition: transform 0.5s ease-out;
  }

  .list-item:hover .item-title {
    transform: scale(1.02);
  }

  .item-meta {
    font-family: inherit; /* Use same font as body */
    font-size: 1.1rem; /* Increased size */
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.05em; /* Slightly reduced tracking for non-mono font */
  }

  .item-name {
    font-size: 1.6rem; /* Increased size */
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }

  /* Detail View */
  .detail-view {
    min-height: 100vh;
    width: 100%;
    background: white;
    padding-top: 8rem;
    padding-bottom: 5rem;
  }

  .back-btn {
    position: fixed;
    top: 7rem;
    left: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: transparent;
    border: 1px solid rgba(0,0,0,0.1);
    padding: 0.5rem 1rem;
    border-radius: 99px;
    cursor: pointer;
    z-index: 50;
    transition: all 0.2s;
  }
  .back-btn:hover { background: black; color: white; }

  .detail-header {
    text-align: center;
    margin-bottom: 5rem;
  }

  .detail-title {
    font-size: 4rem;
    line-height: 1.0;
    font-weight: 400;
    letter-spacing: -0.05em;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }

  .detail-info {
    border-top: 1px solid black;
    padding-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .detail-image-container {
    width: 100%;
    height: 60vh;
    background: #eee;
    margin-bottom: 5rem;
    position: relative;
    overflow: hidden;
  }

  .detail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 1s;
  }
  .detail-image:hover { filter: grayscale(0%); }

  .detail-content {
    max-width: 680px;
    margin: 0 auto;
    font-size: 1.25rem;
    line-height: 1.5;
    color: #333;
  }
  
  .lead-text {
    font-size: 1.8rem;
    line-height: 1.2;
    margin-bottom: 2rem;
    color: black;
  }

  .content-text {
    margin-bottom: 1.5rem;
  }

  /* Footer */
  .site-footer {
    background: black;
    color: white;
    padding: 5rem 2rem;
    margin-top: auto;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  .footer-col h3 {
    font-family: monospace;
    font-size: 0.75rem;
    color: #888;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }
  .footer-col p, .footer-col ul {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #ccc;
  }
  .newsletter-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid #444;
    color: white;
    width: 100%;
    padding: 0.5rem 0;
    outline: none;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  /* Custom Cursor / Floating Preview */
  .floating-preview {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    pointer-events: none;
    mix-blend-mode: difference;
  }
  .preview-box {
    position: absolute;
    top: -10rem;
    left: -10rem;
    width: 20rem;
    height: 25rem;
    overflow: hidden;
    background: #ccc;
  }
  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.2);
  }

  /* Desktop Queries */
  @media (min-width: 768px) {
    .item-title { font-size: 7vw; } /* Responsive text */
    .detail-title { font-size: 8vw; }
    .list-item { padding: 160px 0; } /* Increased padding */
    .footer-grid { grid-template-columns: repeat(3, 1fr); }
    .nav-links { display: flex; }
    .site-header { display: grid; }
  }
  
  @media (max-width: 768px) {
     .nav-links { display: none; }
     .floating-preview { display: none; }
  }
`;

/**
 * HOOK: MOUSE POSITION
 */
const useMousePosition = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
};

/**
 * COMPONENT: FLOATING PREVIEW
 */
interface FloatingPreviewProps {
  activeImage: string | null;
  mouseX: any;
  mouseY: any;
}

const FloatingPreview = ({ activeImage, mouseX, mouseY }: FloatingPreviewProps) => {
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  return (
    <motion.div style={{ x, y }} className="floating-preview">
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="preview-box"
          >
            <img src={activeImage} alt="Preview" className="preview-img" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * COMPONENT: HEADER
 */
const Header = () => (
  <header className="site-header">
    <div className="logo">
      <img src={(kartsLogo as any).src || kartsLogo} alt="KARTS Logo" />
    </div>
    <div className="header-center">
      <div className="header-text">CONVERGENCE DESIGN III<br />KARTS design<br />Spring Term 2026</div>
      <div className="header-text header-bio">
        Experimental web interfaces exploring the intersection of interaction and visual design for the next generation of web.
      </div>
      <div className="header-text">
        <Link href="/convergence-design/info">INFO</Link>
      </div>
    </div>
  </header>
);

/**
 * COMPONENT: LIST ITEM
 */
interface ListItemProps {
  item: any;
  onHover: (image: string) => void;
  onLeave: () => void;
  onClick: (item: any) => void;
  isDimmed: boolean;
}

const ListItem = ({ item, onHover, onLeave, onClick, isDimmed }: ListItemProps) => {
  return (
    <motion.div
      layoutId={`row-${item.id}`}
      onMouseEnter={() => onHover(item.image)}
      onMouseLeave={onLeave}
      onClick={() => onClick(item)}
      className="list-item"
    >
      <div className={`item-content ${isDimmed ? 'dimmed' : ''}`}>
        <div className="item-title">{item.title}</div>
        <div className="item-meta">{item.studio} — {item.location}</div>
        <div className="item-name">{item.interviewee}</div>
      </div>
    </motion.div>
  );
};

/**
 * COMPONENT: DETAIL VIEW
 */
interface DetailViewProps {
  item: any;
  onBack: () => void;
}

const DetailView = ({ item, onBack }: DetailViewProps) => {
  if (!item) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }}
      className="detail-view"
    >
      <button onClick={onBack} className="back-btn">
        <ArrowLeft size={14} /> Back to Index
      </button>

      <div className="container">
        <div className="detail-header">
          <motion.h1
            className="detail-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {item.title}
          </motion.h1>

          <motion.div
            className="detail-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="item-name">{item.interviewee}</p>
            <div className="header-text">
              <Link href="/convergence-design/info">INFO</Link>
            </div>
            <p className="item-meta" style={{ marginTop: '0.25rem' }}>{item.studio}, {item.location}</p>
            <p className="item-meta" style={{ color: '#aaa', marginTop: '0.25rem' }}>{item.date}</p>
          </motion.div>
        </div>

        <motion.div
          className="detail-image-container"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
        >
          <img src={item.image} alt={item.title} className="detail-image" />
        </motion.div>

        <div className="header-text">
          <Link href="/convergence-design/info">INFO</Link>
        </div>
        <div className="detail-content">
          <p className="lead-text">
            "We believe in integrating strategy, design, and technology to create impactful solutions. That said, there is one area we don't handle: marketing."
          </p>
          <p className="content-text">
            This is a replica of the editorial layout found on Developments.media. The design system relies heavily on Swiss typography principles: rigid grids, high contrast, and grotesque sans-serif typefaces.
          </p>
          <p className="content-text">
            When hovering over the list items on the homepage, note how the non-active items fade away. This focus-assist pattern is common in brutalist digital design.
          </p>
        </div>
      </div>
    </motion.article>
  );
};

/**
 * COMPONENT: FOOTER
 */
const Footer = () => (
  <footer className="site-footer">
    <div className="footer-grid">
      <div className="footer-col">
        <h3>About</h3>
        <p>Developments is an online publication exploring the process of creation across design, architecture, and technology.</p>
        <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.7 }}>(This is a microwebsite for ConvDes course at KARTS)</p>
      </div>
      <div className="footer-col">
        <h3>Social</h3>
        <ul style={{ padding: 0, listStyle: 'none' }}>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">LinkedIn</a></li>
        </ul>
      </div>
    </div>
  </footer>
);

/**
 * MAIN APP COMPONENT
 */
export default function App() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const { mouseX, mouseY } = useMousePosition();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedInterview]);

  const handleHover = (image: string) => setActiveImage(image);
  const handleLeave = () => setActiveImage(null);

  return (
    <>
      <style>{cssStyles}</style>

      <div className="app-container">
        <Header />

        <FloatingPreview activeImage={activeImage} mouseX={mouseX} mouseY={mouseY} />

        <AnimatePresence mode="wait">
          {!selectedInterview ? (
            <motion.main
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="list-wrapper"
            >
              <div className="container">
                {INTERVIEWS.map((item) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    onHover={handleHover}
                    onLeave={handleLeave}
                    onClick={setSelectedInterview}
                    isDimmed={activeImage !== null && activeImage !== item.image}
                  />
                ))}
              </div>
              <Footer />
            </motion.main>
          ) : (
            <DetailView
              key="detail"
              item={selectedInterview}
              onBack={() => setSelectedInterview(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
