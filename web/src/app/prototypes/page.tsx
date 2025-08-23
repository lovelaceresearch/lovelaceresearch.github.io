"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../(components)/Sidebar";
import Footer from "../(components)/Footer";

interface Prototype {
  number: string;
  title: string;
  status?: string;
  description?: string;
  collaborator?: string;
  date?: string;
  image?: string;
  tags?: string[];
  links?: { url: string; label: string }[];
}

export default function PrototypesPage() {
  const [hoveredPrototype, setHoveredPrototype] = useState<Prototype | null>(null);
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [pastPrototypes, setPastPrototypes] = useState<Prototype[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/data/prototypes.json");
        const data = await response.json();
        setPrototypes(data.prototypes || []);
        setPastPrototypes(data.pastPrototypes || []);
      } catch {
        setPrototypes([]);
        setPastPrototypes([]);
      }
    }
    loadData();
  }, []);

  // Handle scroll to prevent hover glitching
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      setHoveredPrototype(null); // Clear hover state during scroll
      setIsAnimatingOut(false); // Reset animation state
      
      // Clear all timeouts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Handle delayed hover clearing to allow moving between elements
  const handleHoverLeave = () => {
    if (!isScrolling) {
      hoverTimeoutRef.current = setTimeout(() => {
        startFadeOut();
      }, 100); // Small delay to allow moving to hover area
    }
  };

  const handleHoverEnter = (prototype?: Prototype) => {
    if (!isScrolling) {
      // Clear any pending timeouts
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Reset animation state
      setIsAnimatingOut(false);
      
      if (prototype) {
        setHoveredPrototype(prototype);
      }
    }
  };

  const startFadeOut = () => {
    if (hoveredPrototype) {
      setIsAnimatingOut(true);
      // After fade-out animation completes, remove the prototype
      animationTimeoutRef.current = setTimeout(() => {
        setHoveredPrototype(null);
        setIsAnimatingOut(false);
      }, 200); // Match the CSS animation duration
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <section id="projects">
          <div className="container">
            <div className="title-block"><h2>Prototypes</h2></div>
            <div className="subtitle-block">
              <h2>Building 20 prototypes until the end of 2026.</h2>
            </div>
            <div className="prototypes-grid">
              {prototypes.map((prototype: Prototype, i: number) => (
                                 <div 
                   key={i} 
                   className="prototype-item"
                   onMouseEnter={() => handleHoverEnter(prototype)}
                   onMouseLeave={handleHoverLeave}
                 >
                   <div className="prototype-header">
                     <div className="prototype-number">{prototype.number}</div>
                   </div>
                   <div className="prototype-content">
                     <div className="prototype-left">
                       <div className="prototype-title">{prototype.title}</div>
                     </div>
                     <div className="prototype-right">
                       <div className="prototype-description">{prototype.description}</div>
                       {prototype.collaborator && (
                         <a href="#" className="prototype-collaborator-link">{prototype.collaborator}</a>
                       )}
                     </div>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        </section>
        
        {pastPrototypes.length > 0 && (
          <section id="past-prototypes">
            <div className="container">
              <div className="title-block"><h2>Past Prototypes</h2></div>
              <div className="subtitle-block">
                <h2>Previous explorations and completed research prototypes.</h2>
              </div>
              <div className="past-prototypes-grid">
                {pastPrototypes.map((prototype: Prototype, i: number) => (
                  <div 
                    key={i} 
                    className="prototype-item"
                    onMouseEnter={() => handleHoverEnter(prototype)}
                    onMouseLeave={handleHoverLeave}
                  >
                    <div className="prototype-header">
                      <div className="prototype-number">{prototype.number}</div>
                    </div>
                    <div className="prototype-content">
                      <div className="prototype-left">
                        <div className="prototype-title">{prototype.title}</div>
                      </div>
                      <div className="prototype-right">
                        <div className="prototype-description">{prototype.description}</div>
                        {prototype.collaborator && (
                          <a href="#" className="prototype-collaborator-link">{prototype.collaborator}</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <Footer />
      </main>
      <aside 
        className="hover-info-area"
        onMouseEnter={() => handleHoverEnter()}
        onMouseLeave={handleHoverLeave}
      >
        {hoveredPrototype && (
          <div className={`hover-info-card ${isAnimatingOut ? 'fade-out' : ''}`}>
            <div className="hover-info-image">
              <img 
                src={hoveredPrototype.image || "/placeholder-image.jpg"} 
                alt={hoveredPrototype.title}
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f0f0f0'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='14' fill='%23666'%3EPrototype Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="hover-info-content">
              <div className="hover-info-header">
                <div className="hover-info-number">{hoveredPrototype.number}</div>
                <div className={`hover-info-status ${hoveredPrototype.status}`}>
                  {hoveredPrototype.status}
                </div>
              </div>
              
              <h3 className="hover-info-title">{hoveredPrototype.title}</h3>
              
              {hoveredPrototype.collaborator && (
                <div className="hover-info-collaborator">{hoveredPrototype.collaborator}</div>
              )}
              
              <div className="hover-info-meta">
                {hoveredPrototype.date && (
                  <div className="hover-info-date">{hoveredPrototype.date}</div>
                )}
              </div>
              
              <p className="hover-info-description">{hoveredPrototype.description}</p>
              
              <div className="hover-info-links">
                {hoveredPrototype.links?.map((link, j) => (
                  <a key={j} href={link.url} target="_blank" className="hover-info-link">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

