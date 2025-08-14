"use client";

import { useState } from 'react';

export default function AboutClient() {
  const [showFull, setShowFull] = useState(false);

  const shortDescription = (
    <p>
      Lovelace Research aims to be a new PARC, infused with design thinking.
      We believe in fundamental paradigm redesign that ultimately translates into
      transformative products.
    </p>
  );

  const fullDescription = (
    <>
      <p>
        Lovelace Research aims to be a new PARC, infused with design thinking.
        We believe in fundamental paradigm redesign that ultimately translates into
        transformative products.
      </p>
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
          <p>Independent research-led innovation lab for personal & humane AI</p>
          {showFull ? fullDescription : shortDescription}
        </div>
      </div>
    </section>
  );
}
