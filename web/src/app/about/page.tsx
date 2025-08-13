import Link from "next/link";
export const metadata = {
  title: "About - Lovelace Research",
  description: "Our mission, team, and approach to personal and humane AI",
};

export default function AboutPage() {
  return (
    <div className="page-container">
      <aside className="sidebar">
        <div className="sidebar-block">
          <Link href="/" className="sidebar-title">Lovelace Research</Link>
          <p className="sidebar-subtitle">Independent research-led innovation lab for personal & humane AI</p>
        </div>
        <div className="sidebar-block">
          <nav className="sidebar-nav">
            <ul>
              <li><Link href="/prototypes">Prototypes</Link></li>
              <li><Link href="/publications">Publications</Link></li>
              <li><Link href="/reading-list">Reading List</Link></li>
              <li><Link href="/about" className="nav-active">About</Link></li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-block">
          <div className="sidebar-contact">
            <a href="https://instagram.com/lovelaceresearch" target="_blank">IG</a>
            <span className="email-container">
              <a href="#" id="email-link" data-email="office@lovelace-research.com">office@lovelace-research.com</a>
              <span id="hover-tooltip" className="hover-tooltip">Copy email</span>
              <span id="copied-message" className="copied-message">Copied!</span>
            </span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <section className="hero">
          <div className="container">
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

        <section id="contributors">
          <div className="container">
            <div className="title-block">
              <h2>Contributors</h2>
            </div>
            <p>Our interdisciplinary team brings together expertise from AI research, design, and human-computer interaction.</p>
            <div className="contributors-grid" id="contributors-grid" />
          </div>
        </section>

        <section id="approach">
          <div className="container">
            <div className="title-block">
              <h2>Approach</h2>
            </div>
            <p>
              We believe that meaningful progress in AI requires a fundamental rethinking of current paradigms.
              Our methodology combines rigorous research with practical application.
            </p>
            <ul className="approach-points">
              <li>Research-led innovation that prioritizes long-term impact over short-term gains</li>
              <li>Design thinking principles applied to technical AI research</li>
              <li>Focus on personal and humane AI that augments human capabilities</li>
              <li>Interdisciplinary collaboration across technology, design, and social sciences</li>
              <li>Open research culture that shares insights with the broader community</li>
            </ul>
          </div>
        </section>
      </main>

      <div className="mobile-nav-container">
        <div className="mobile-nav-menu">
          <div className="sidebar-block">
            <div className="sidebar-contact">
              <a href="https://instagram.com/lovelaceresearch" target="_blank">IG</a>
              <span className="email-container">
                <a href="#" id="email-link-mobile" data-email="office@lovelace-research.com">office@lovelace-research.com</a>
                <span id="hover-tooltip-mobile" className="hover-tooltip">Copy email</span>
                <span id="copied-message-mobile" className="copied-message">Copied!</span>
              </span>
            </div>
          </div>
          <div className="sidebar-block">
            <nav className="sidebar-nav">
              <ul>
                <li><a href="/prototypes/">Prototypes</a></li>
                <li><a href="/publications/">Publications</a></li>
                <li><a href="/reading-list/">Reading List</a></li>
                <li><a href="/about/" className="nav-active">About</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="mobile-nav-trigger">
          <div className="mobile-nav-trigger-content">
            <div className="mobile-nav-title">
              <Link href="/" className="sidebar-title">Lovelace Research</Link>
              <p className="sidebar-subtitle mobile-only">Independent research-led innovation lab for personal & humane AI</p>
            </div>
            <span className="icon">+</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}

