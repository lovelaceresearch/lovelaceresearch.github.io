import Link from 'next/link';
import OfficeClient from '@/components/OfficeClient';
import BodyClass from '@/components/BodyClass';

export default function OfficePage() {
  return (
    <main className="office-content">
      <BodyClass className="page-office" />
      <nav className="navbar navbar--office">
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

      <div className="office-wrapper">
        <section className="office-header-section">
          <div className="office-header-grid">
            <h1 className="office-header-title">Office</h1>
            <p className="office-header-subtitle">Led by people worked with world-leaders in AI and design</p>
          </div>
        </section>

        <section className="office-hero-section">
          <img src="/images/general/3.jpg" alt="Office" className="office-hero-image" />
        </section>

        <section className="office-body-section">
          <p className="section-title">
            Founded at Albertopolis, home to Imperial College London and the Royal College of Art, and named after Ada Lovelace, we bring together expertise in human-centred AI and design thinking to build transformative AI products and prototypes.
          </p>
        </section>

        <section className="office-practice-section">
          <div className="practice-container">
            <h2 className="section-title">What We Do</h2>
            <div className="practice-grid">
              <div className="practice-item">
                <h3 className="practice-title">Paradigm Leading</h3>
                <p className="practice-description">Through teaching, community building, artwork and research</p>
              </div>
              <div className="practice-item">
                <h3 className="practice-title">New Product Development</h3>
                <p className="practice-description">Digital & Physical product Prototyping and development</p>
              </div>
              <div className="practice-item">
                <h3 className="practice-title">Academic Research</h3>
                <p className="practice-description">In HCI, Human-Centred Computing and Design Research</p>
              </div>
            </div>
          </div>
        </section>

        <section className="office-approach-section">
          <div className="office-approach-container">
            <h2 className="section-title">Approach</h2>
            <div className="approach-content">
              <p className="approach-text">
                As an alternative to technology-driven AI development, we centre humans and open development to co-design desirable technology for humanity.
                <br /><br />
                Our practice spans paradigm-setting, prototyping, and product development aiming for practical alternatives.
              </p>
              <img src="/images/general/DSC06366.jpg" alt="Approach" className="approach-image" />
            </div>
          </div>
        </section>

        <section className="office-contributors-section">
          <h2 className="section-title">Contributors</h2>
          <div className="contributors-grid" id="contributorsGrid"></div>
        </section>

        <section className="office-contact-section">
          <h2 className="section-title">Contact</h2>
          <div className="contact-links">
            <div className="contact-email-wrapper">
              <button className="contact-email-button" id="copyEmailButton">office@lovelace-research.com</button>
              <span className="email-tooltip" id="emailTooltip">Copy email</span>
            </div>
            <a href="https://instagram.com/lovelaceresearch" className="contact-link" target="_blank" rel="noopener">Instagram↗</a>
            <a href="https://linkedin.com/company/lovelace-research" className="contact-link" target="_blank" rel="noopener">LinkedIn↗</a>
          </div>
        </section>
      </div>

      <div className="footer-divider"></div>
      <footer className="footer footer--office">
        <div className="footer-container">
          <div className="footer-logo">
            <img src="/images/logos/logo-huge.svg" alt="Lovelace Research" />
          </div>
        </div>
      </footer>

      <OfficeClient />
    </main>
  );
}


