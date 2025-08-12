import ClientScripts from "./(components)/ClientScripts";
import Link from "next/link";

export default function Home() {
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
              <li><Link href="/about">About</Link></li>
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
        <section className="hero-slideshow">
          <div className="slide active">
            <div className="slide-content">
              <h1>Personal & Humane AI</h1>
            </div>
          </div>
          <div className="slide">
            <div className="slide-content">
              <h1>Research-led Innovation</h1>
            </div>
          </div>
          <div className="slide">
            <div className="slide-content">
              <h1>Lovelace Research</h1>
            </div>
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
            <nav className="mobile-nav">
              <ul>
                <li><a href="/prototypes/">Prototypes</a></li>
                <li><a href="/publications/">Publications</a></li>
                <li><a href="/reading-list/">Reading List</a></li>
                <li><a href="/about/">About</a></li>
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
      {/* Load legacy client scripts for email copy + slideshow */}
      <ClientScripts />
    </div>
  );
}
