"use client";

import { useState } from 'react';

export default function AboutClient() {
  const [showFull, setShowFull] = useState(false);

  const shortDescription = (
    <div className="about-content">
      <div className="about-row">
        <div className="about-title">
          <div className="about-mini-subtitle">one-liner</div>
        </div>
        <div className="about-text">
          <p>Independent research-led innovation lab for personal & humane AI</p>
        </div>
      </div>
      <div className="about-row">
        <div className="about-title">
          <div className="about-mini-subtitle">statement</div>
        </div>
        <div className="about-text">
          <p>
            Lovelace Research aims to be a new PARC, infused with design thinking.
            We believe in fundamental paradigm redesign that ultimately translates into
            transformative products.
          </p>
        </div>
      </div>
    </div>
  );

  const fullDescription = (
    <div className="about-content">
      <div className="about-row">
        <div className="about-title">
          <div className="about-mini-subtitle">one-liner</div>
        </div>
        <div className="about-text">
          <p>Independent research-led innovation lab for personal & humane AI</p>
        </div>
      </div>
      <div className="about-row">
        <div className="about-title">
          <div className="about-mini-subtitle">statement</div>
        </div>
        <div className="about-text">
          <p>
            Lovelace Research aims to be a new PARC, infused with design thinking.
            We believe in fundamental paradigm redesign that ultimately translates into
            transformative products.
          </p>
        </div>
      </div>
      <div className="about-row">
        <div className="about-title">
          <div className="about-mini-subtitle">why we do it</div>
        </div>
        <div className="about-text">
          <p>
            We believe that meaningful progress in AI requires a fundamental rethinking of current paradigms.
            Our methodology combines rigorous research with practical application, bringing together expertise 
            from AI research, design, and human-computer interaction.
          </p>
        </div>
      </div>
      <div className="about-row">
        <div className="about-title">
          <div className="about-mini-subtitle">what do we do</div>
        </div>
        <div className="about-text">
          <p>
            We explore fundamental questions about AI systems, focusing on mental models, frameworks,
            and architectures that prioritize human values and personal alignment. Our work aims to
            create meaningful change in how we think about and build AI technologies.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="about">
      <div className="container">
        <div className="title-block">
          <h2>About</h2>
          <div className="toggle-button-container">
            <button className={`toggle-button ${!showFull ? 'active' : ''}`} onClick={() => setShowFull(false)}>
              In short
            </button>
            <button className={`toggle-button ${showFull ? 'active' : ''}`} onClick={() => setShowFull(true)}>
              Full
            </button>
          </div>
        </div>
        {showFull ? fullDescription : shortDescription}
      </div>
    </section>
  );
}
