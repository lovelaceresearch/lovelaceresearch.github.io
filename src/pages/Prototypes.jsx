import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Prototypes = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/projects.json');
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Layout>
      <section id="projects">
        <div className="container">
          <div className="title-block">
            <h2>Prototypes</h2>
          </div>
          <p>Open-source tools and frameworks advancing personal and humane AI research.</p>
          
          <div className="projects-grid" id="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3 className="project-title">{project.title}</h3>
                <span className={`project-status ${project.status}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <p className="project-description">{project.description}</p>
                <div className="project-footer">
                  <div className="project-links">
                    {project.links.map((link, i) => (
                      <a key={i} href={link.url} className="project-link" target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  d</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Prototypes;
