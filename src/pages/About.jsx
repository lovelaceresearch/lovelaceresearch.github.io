import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const About = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch('/contributors.json');
        const data = await response.json();
        setContributors(data.contributors);
      } catch (error) {
        console.error('Error loading contributors:', error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <Layout>
      {/* ---------------- Overview ---------------- */}
      <section id="overview" className="hero">
        <div className="container">
          <div className="title-block">
            <h2>Overview</h2>
          </div>
          <h1>Independent research-led innovation lab for personal & humane AI</h1>
          <p className="subtitle">Alternative research, Innovative product, Thoughtful impact.</p>
          <p>
            Lovelace Research aims to be a new PARC, infused with design thinking.
            We believe in fundamental paradigm redesign that ultimately translates into
            transformative products.
          </p>
          <p className="description">
            We explore fundamental questions about AI systems, focusing on mental models, frameworks,
            and architectures that prioritize human values and personal alignment. Our work aims to
            create meaningful change in how we think about and build AI technologies.
          </p>
        </div>
      </section>

      {/* ---------------- Contributors ---------------- */}
      <section id="contributors">
        <div className="container">
          <div className="title-block">
            <h2>Contributors</h2>
          </div>
          <p>
            Our interdisciplinary team brings together expertise from AI research, design, and
            human-computer interaction.
          </p>

          <div className="contributors-grid" id="contributors-grid">
            {contributors.map((contributor, index) => (
              <div key={index} className="contributor-card">
                <div className="contributor-photo">
                  <div className="photo-placeholder">
                    {contributor.photo ? (
                      <img
                        src={contributor.photo}
                        alt={contributor.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      contributor.initials
                    )}
                  </div>
                </div>
                <div className="contributor-info">
                  <h3>{contributor.name}</h3>
                  <p className="role">{contributor.role}</p>
                  <p className="affiliation">{contributor.affiliation}</p>
                  <div className="keywords">
                    {contributor.keywords.map((keyword, i) => (
                      <span key={i} className="keyword">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="contributor-links">
                    {contributor.links.map((link, i) => (
                      <a key={i} href={link.url} className="link-pill" target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Approach ---------------- */}
      <section id="approach">
        <div className="container">
          <div className="title-block">
            <h2>Approach</h2>
          </div>
          <p>
            We believe that meaningful progress in AI requires a fundamental rethinking of current
            paradigms. Our methodology combines rigorous research with practical application.
          </p>

          <ul className="approach-points">
            <li>Research-led innovation that prioritizes long-term impact over short-term gains</li>
            <li>Design-thinking principles applied to technical AI research</li>
            <li>Focus on personal and humane AI that augments human capabilities</li>
            <li>Interdisciplinary collaboration across technology, design, and social sciences</li>
            <li>Open research culture that shares insights with the broader community</li>
          </ul>
        </div>
      </section>

      {/* ---------------- Lovelace ---------------- */}
      <section id="lovelace">
        <div className="container">
          <div className="title-block">
            <h2>Ada Lovelace</h2>
          </div>
          <p>
            Lovelace, the visionary mathematician who authored the first algorithm, inspires our name
            and ethos. We strive to embody her blend of technical mastery and imaginative foresight as
            we explore the future of human-centric AI.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default About;
