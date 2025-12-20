import Link from 'next/link';
import BodyClass from '@/components/BodyClass';

export default function InteractionConvergencePage() {
    return (
        <main className="page-content">
            <BodyClass className="page-interaction-convergence" />
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
                <section className="section">
                    <div className="container">
                        <h1>Interaction Convergence</h1>
                        <p>Content coming soon.</p>
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
        </main>
    );
}
