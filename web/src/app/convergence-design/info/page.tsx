"use client";

import React from 'react';
import Link from 'next/link';
import kartsLogo from '../images/karts.svg';
import { ArrowLeft } from 'lucide-react';

const cssStyles = `
  :root {
    --bg-color: #ffffff;
    --text-color: #000000;
  }

  body {
    margin: 0;
    font-family: 'Favorit Hangul', sans-serif;
    background: var(--bg-color);
    color: var(--text-color);
    -webkit-font-smoothing: antialiased;
  }

  .app-container {
    min-height: 100vh;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header */
  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6rem;
    padding-top: 2rem;
  }

  .logo img {
    height: 36px;
    width: auto;
    /* Removed invert filter to keep logo black on white background */
    filter: none; 
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    text-decoration: none;
    color: black;
    transition: opacity 0.2s;
    font-weight: 400;
  }
  .back-link:hover { opacity: 0.6; }

  /* Header */
  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem; /* Reduced from 6rem */
    padding-top: 2rem;
  }

  /* Content Grid - 12 Column System */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 1rem;
    margin-bottom: 6rem;
  }

  .info-column-left {
    grid-column: 1 / span 5; /* 5 columns */
  }

  .info-column-right {
    grid-column: 7 / span 6; /* 6 columns, starting at 7 (1 col gap) */
  }

  .info-section {
    margin-bottom: 3rem; /* Reduced from 5rem */
  }

  .section-title {
    font-size: 0.85rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
    color: #000;
    border-top: 0.5px solid black; /* Thinner line */
    padding-top: 0.5rem;
    display: block;
    width: 100%;
  }

  /* Left column "Lead" text */
  .large-text {
    font-size: 2.5rem;
    line-height: 1.1;
    font-weight: 400;
    margin: 0;
    letter-spacing: -0.03em;
  }

  /* Right column Body text */
  .body-text {
    font-size: 1.25rem;
    line-height: 1.2; /* Requested 1.2 */
    color: #000;
    font-weight: 400;
  }

  .list-reset {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .list-item {
    padding: 0.75rem 0; /* Reduced padding */
    border-bottom: 0.5px solid #000; /* Thinner line */
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 1.1rem;
    line-height: 1.2; /* Consistent line height */
  }

  .list-label { 
    color: #666; 
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 900px) {
    .info-grid { display: flex; flex-direction: column; gap: 3rem; }
    .info-column-left, .info-column-right { grid-column: auto; width: 100%; }
    .large-text { font-size: 2rem; }
  }
`;

export default function InfoPage() {
  return (
    <div className="app-container">
      <style>{cssStyles}</style>

      <header className="info-header">
        <Link href="/convergence-design" className="back-link">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="logo">
          <img src={(kartsLogo as any).src || kartsLogo} alt="KARTS Logo" />
        </div>
      </header>

      <main className="info-grid">
        <div className="info-column-left">
          <section className="info-section">
            <span className="section-title">Course Overview</span>
            <p className="large-text">
              Convergence Design III explores the intersection of interaction design and visual communication for the next generation of web interfaces.
            </p>
          </section>
        </div>

        <div className="info-column-right">
          <section className="info-section">
            <span className="section-title">Description</span>
            <p className="body-text">
              This course focuses on advanced web technologies and design principles. Students will learn to create immersive, interactive web experiences that challenge traditional navigation paradigms. We will cover topics such as:
              <br /><br />
              — Advanced CSS & Layout Systems<br />
              — Micro-interactions & Animation (Framer Motion)<br />
              — React & Next.js Architecture<br />
              — Typography for Screen<br />
              — Experimental User Interfaces
            </p>
          </section>

          <section className="info-section">
            <span className="section-title">Logistics</span>
            <ul className="list-reset">
              <li className="list-item">
                <span className="list-label">Term</span>
                <span>Spring 2026</span>
              </li>
              <li className="list-item">
                <span className="list-label">Time</span>
                <span>Thursdays, 14:00 – 17:00</span>
              </li>
              <li className="list-item">
                <span className="list-label">Location</span>
                <span>KARTS Design Lab 304</span>
              </li>
              <li className="list-item">
                <span className="list-label">Instructor</span>
                <span>Chanwoo Lee (Adjuct Professor)</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
