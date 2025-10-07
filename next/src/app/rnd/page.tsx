import Link from 'next/link';
import RndClient from '@/components/RndClient';
import BodyClass from '@/components/BodyClass';

export default function RndPage() {
  return (
    <main className="page-content">
      <BodyClass className="page-rnd" />
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
      <div className="main-content-group">
        <section className="rnd-header-section">
          <div className="projects-container">
            <div className="projects-header projects-header--rnd">
              <h2 className="section-title section-title--left">R&D</h2>
              <div className="rnd-filter-col" data-filter-group="category">
                <span className="filter-item" data-filter-value="product">Product</span>
                <span className="filter-item" data-filter-value="prototype">Prototype</span>
                <span className="filter-item" data-filter-value="paradigm">Paradigm</span>
              </div>
              <div className="rnd-filter-col" data-filter-group="status">
                <span className="filter-item" data-filter-value="shuffle">Shuffle!</span>
                <span className="filter-item" data-filter-value="featured">Featured</span>
                <span className="filter-item" data-filter-value="active">Ongoing</span>
                <span className="filter-item" data-filter-value="archive">Archive</span>
                <span className="filter-item" data-filter-value="previous">Previous</span>
              </div>
            </div>
            <div className="projects-grid" id="rndProjectsGrid"></div>
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
      <RndClient />
    </main>
  );
}


