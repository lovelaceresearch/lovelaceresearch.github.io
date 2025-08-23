"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../(components)/Sidebar";
import AboutClient from "./AboutClient";
import ContributorsList from "../(components)/ContributorsList";
import LogoWall from "../(components)/LogoWall";
import Footer from "../(components)/Footer";

interface Contributor {
  name: string;
  city: string;
  role?: string;
  affiliation?: string;
  bio?: string;
  image?: string;
  links?: { url: string; label: string }[];
}

export default function AboutPage() {
  const [hoveredContributor, setHoveredContributor] = useState<Contributor | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/data/contributors.json");
        const data = await response.json();
        // Data is loaded in ContributorsList component
      } catch {
        // Handle error silently
      }
    }
    loadData();
  }, []);

  // Handle scroll to prevent hover glitching
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      setHoveredContributor(null); // Clear hover state during scroll
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

  const handleHoverEnter = (contributor?: Contributor) => {
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
      
      if (contributor) {
        setHoveredContributor(contributor);
      }
    }
  };

  const startFadeOut = () => {
    if (hoveredContributor) {
      setIsAnimatingOut(true);
      // After fade-out animation completes, remove the contributor
      animationTimeoutRef.current = setTimeout(() => {
        setHoveredContributor(null);
        setIsAnimatingOut(false);
      }, 200); // Match the CSS animation duration
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content" style={{ gap: '12px' }}>
        <AboutClient />

        <section id="story">
          <div className="container">
            <div className="title-block">
              <h2>Story</h2>
            </div>
            <img 
              src="/images/general/imperial.jpg" 
              alt="Imperial College London" 
              className="story-image"
              style={{
                width: '100%',
                height: 'auto',
                marginTop: '4px',
                marginBottom: '12px',
                borderRadius: '4px'
              }}
            />
            <div className="story-content" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
              <p>
                We believe that meaningful progress in AI requires a fundamental rethinking of current paradigms.
                Our methodology combines rigorous research with practical application, bringing together expertise 
                from AI research, design, and human-computer interaction.
              </p>
              <p>
                Our approach emphasizes research-led innovation that prioritizes long-term impact over short-term gains,
                applying design thinking principles to technical AI research with a focus on personal and humane AI 
                that augments human capabilities.
              </p>
            </div>
          </div>
        </section>

        <section id="contributors">
          <div className="container">
            <div className="title-block">
              <h2>Contributors</h2>
            </div>
              <ContributorsList onHover={handleHoverEnter} onHoverLeave={handleHoverLeave} />
            <div className="subtitle-block">
              <h2>Our team worked with world leaders in AI research and design</h2>
            </div>
            <LogoWall />
          </div>
        </section>
        <Footer />
      </main>
      <aside 
        className="hover-info-area"
        onMouseEnter={() => handleHoverEnter()}
        onMouseLeave={handleHoverLeave}
      >
        {hoveredContributor && (
          <div className={`hover-info-card ${isAnimatingOut ? 'fade-out' : ''}`}>
            <div className="hover-info-image">
              <img 
                src={hoveredContributor.image || "/placeholder-image.jpg"} 
                alt={hoveredContributor.name}
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f0f0f0'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='14' fill='%23666'%3EContributor Photo%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="hover-info-content">
              <div className="hover-info-header">
                <div className="hover-info-city">{hoveredContributor.city}</div>
                {hoveredContributor.role && (
                  <div className="hover-info-role">{hoveredContributor.role}</div>
                )}
              </div>
              
              <h3 className="hover-info-title">{hoveredContributor.name}</h3>
              
              {hoveredContributor.affiliation && (
                <div className="hover-info-affiliation">{hoveredContributor.affiliation}</div>
              )}
              
              {hoveredContributor.bio && (
                <p className="hover-info-description">{hoveredContributor.bio}</p>
              )}
              
              <div className="hover-info-links">
                {hoveredContributor.links?.map((link, j) => (
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

