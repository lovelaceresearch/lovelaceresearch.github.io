import Link from 'next/link';
import HomeClient from '@/components/HomeClient';

export default function Page() {
  return (
    <main className="page-content">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link href="/">Lovelace Research</Link>
          </div>
          <div className="nav-menu">
            <Link href="/rnd" className="nav-link">R&D</Link>
            <Link href="/office" className="nav-link">Office</Link>
          </div>
        </div>
      </nav>

      <section className="hover-scroll-section">
        <div className="hover-scroll-container" id="hoverScrollContainer">
          <div className="hover-scroll-content" aria-live="polite"></div>
        </div>
      </section>

      <div className="main-content-group">
        <section className="headline-section">
          <div className="headline-container">
            <div className="headline-left">
              <img src="/images/logos/logo-black.svg" alt="Lovelace Research" width={64} height={64} />
            </div>
            <div className="headline-right">
              <h2 className="section-title">Lovelace Research is an R&D Lab for human-centred AI paradigm, prototype and product.</h2>
            </div>
          </div>
        </section>

        <section className="featured-projects">
          <div className="projects-container">
            <div className="projects-header">
              <h2 className="section-title"></h2>
              <h2 className="section-title section-title--left">R&D <br />Fueled by vision, curiosity and the hacker mind.</h2>
            </div>
            <div className="projects-grid" id="featuredProjectsGrid"></div>
          </div>
        </section>

        <section className="office-section">
          <div className="office-container">
            <div className="office-title">
              <h2 className="section-title">Office <br />Led by people worked with world-leaders in AI and design, including <span className="company-name" data-company="OpenAI">OpenAI</span>, <span className="company-name" data-company="Meta">Meta</span>, <span className="company-name" data-company="Pentagram">Pentagram</span> and more.</h2>
              <div className="office-list">
                <span className="company-name company-name--list" data-company="MODEM">MODEM</span>
                <span className="company-name company-name--list" data-company="Huawei">Huawei</span>
                <span className="company-name company-name--list" data-company="Imperial College London">Imperial College London</span>
                <span className="company-name company-name--list" data-company="Snap Inc">Snap Inc</span>
                <span className="company-name company-name--list" data-company="OPPO">OPPO</span>
                <span className="company-name company-name--list" data-company="LG">LG</span>
                <span className="company-name company-name--list" data-company="Ministry of Science and ICT">Ministry of Science and ICT</span>
              </div>
            </div>
            <div id="officeImageContainer" className="office-image-viewport"></div>
          </div>
        </section>

        <section className="approach-section">
          <div className="approach-container">
            <div className="projects-header">
              <img src="/images/general/appr.png" alt="Imperial College London" className="approach-image" />
              <h2 className="section-title section-title--left">Hybrid Approach <br />Of Future Research and Design Thinking, Macro to Micro.</h2>
              <p className="approach-intro">
                Founded at Albertopolis, home to Imperial College and the Royal College of Art, and named after Ada Lovelace, we bring together expertise in human-centred AI and design thinking to build transformative AI products and prototypes. Like the PARC, think tank with hands-on development.
              </p>
              <p className="approach-description">
                As an alternative to current technology-driven AI development, we centre humans and open development to co-design desirable technology for humanity. Our practice spans paradigm-setting, prototyping, and product development. We believe in fundamental paradigm redesign that translates into transformative products—practical alternatives to the status quo.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-grid">
              <div className="footer-text">
                <p>Lovelace Research is an R&D office for human-centred AI paradigm, prototype and product based in London. We bring together expertise in human-centred AI and design thinking to build transformative AI products and prototypes.</p>
              </div>
              <div className="footer-right">
                <div className="footer-contact">
                  <a href="mailto:office@lovelace-research.com" className="contact-email">office@lovelace-research.com</a>
                  <a href="https://instagram.com/lovelaceresearch" className="contact-instagram" target="_blank" rel="noopener">@lovelaceresearch</a>
                </div>
                <p className="footer-copyright">© 2025 Lovelace Research. All rights reserved. Third-party logos and trademarks are the property of their respective owners.</p>
              </div>
            </div>
          </div>
          <div className="footer-logo">
            <img src="/images/logos/logo-huge.svg" alt="Lovelace Research" />
          </div>
        </div>
      </footer>

      <HomeClient />
    </main>
  );
}


