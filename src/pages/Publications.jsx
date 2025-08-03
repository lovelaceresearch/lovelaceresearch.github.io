import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Publications = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/publications.json');
        const data = await response.json();
        setPublications(data.publications);
      } catch (error) {
        console.error('Error loading publications:', error);
      }
    };

    fetchPublications();
  }, []);

  return (
    <Layout>
      <section id="research">
        <div className="container">
          <div className="title-block">
            <h2>Research Areas</h2>
          </div>
          <p>Our interdisciplinary research spans multiple domains, each contributing to our vision of personal and humane AI.</p>
          
          <div className="research-grid">
            {/* Hardcoded research areas as in the original HTML */}
            <div className="research-item">
              <h3>Mental Models</h3>
              <p>Understanding how humans conceptualize and interact with AI systems to build more intuitive interfaces.</p>
            </div>
            <div className="research-item">
              <h3>Frameworks</h3>
              <p>Developing theoretical and practical frameworks for evaluating and designing AI systems.</p>
            </div>
            <div className="research-item">
              <h3>Futures</h3>
              <p>Exploring potential trajectories of AI development and their implications for society.</p>
            </div>
            <div className="research-item">
              <h3>System Architecture</h3>
              <p>Designing AI architectures that prioritize transparency, control, and human agency.</p>
            </div>
            <div className="research-item">
              <h3>Fine-tuning</h3>
              <p>Advancing techniques for personalizing AI models while maintaining safety and alignment.</p>
            </div>
            <div className="research-item">
              <h3>Personal Model Alignment</h3>
              <p>Ensuring AI systems align with individual values and preferences without compromising broader safety.</p>
            </div>
            <div className="research-item">
              <h3>Reasoning</h3>
              <p>Improving AI reasoning capabilities while maintaining interpretability and human oversight.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="publications">
        <div className="container">
          <div className="title-block">
            <h2>Publications</h2>
          </div>
          <p>Our contributors' research on the field of personal and humane AI.</p>
          
          <div className="publications-list" id="publications-list">
            {publications.map((publication, index) => (
              <div key={index} className="publication-item">
                <h3 className="publication-title">{publication.title}</h3>
                <div className="publication-meta">
                  <span className="publication-authors">{publication.authors.join(', ')}</span> • 
                  <span className="publication-venue">{publication.venue}</span> • 
                  <span className="publication-year">{publication.year}</span>
                </div>
                <p className="publication-abstract">{publication.abstract}</p>
                <div className="publication-footer">
                  <div className="publication-links">
                    {publication.links.map((link, i) => (
                      <a key={i} href={link.url} className="publication-link" target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                  <div className="publication-tags">
                    {publication.tags.map((tag, i) => (
                      <span key={i} className="publication-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Publications;
