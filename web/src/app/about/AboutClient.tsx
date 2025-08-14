"use client";

import { useState } from 'react';

export default function AboutClient() {
  const [showFull, setShowFull] = useState(false);

  const shortDescription = (
    <>
      <div className="about-mini-subtitle">name</div>
      <p>Lovelace Research</p>
      
      <div className="about-mini-subtitle">one-liner</div>
      <p>Independent research-led innovation lab for personal & humane AI</p>
      
      <div className="about-mini-subtitle">statement</div>
      <p>
        Lovelace Research aims to be a new PARC, infused with design thinking.
        We believe in fundamental paradigm redesign that ultimately translates into
        transformative products.
      </p>
    </>
  );

  const fullDescription = (
    <>
      <div className="about-mini-subtitle">name</div>
      <p>Lovelace Research</p>
      
      <div className="about-mini-subtitle">one-liner</div>
      <p>Independent research-led innovation lab for personal & humane AI</p>
      
      <div className="about-mini-subtitle">statement</div>
      <p>
        Lovelace Research aims to be a new PARC, infused with design thinking.
        We believe in fundamental paradigm redesign that ultimately translates into
        transformative products.
      </p>
      
      <div className="about-mini-subtitle">why we do it</div>
      <p>
        We believe that meaningful progress in AI requires a fundamental rethinking of current paradigms.
        Our methodology combines rigorous research with practical application, bringing together expertise 
        from AI research, design, and human-computer interaction.
      </p>
      
      <div className="about-mini-subtitle">what do we do</div>
      <p>
        We explore fundamental questions about AI systems, focusing on mental models, frameworks,
        and architectures that prioritize human values and personal alignment. Our work aims to
        create meaningful change in how we think about and build AI technologies.
      </p>
    </>
  );

  return (
    <section id="about">
      <div className="container">
        <div className="title-block">
          <h2>About</h2>
        </div>
        <div className="toggle-button-container">
          <button className={`toggle-button ${!showFull ? 'active' : ''}`} onClick={() => setShowFull(false)}>
            In short
          </button>
          <button className={`toggle-button ${showFull ? 'active' : ''}`} onClick={() => setShowFull(true)}>
            Full
          </button>
        </div>
        <div style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          {showFull ? fullDescription : shortDescription}
        </div>
      </div>
    </section>
  );
}
