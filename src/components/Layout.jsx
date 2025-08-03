import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <div className="page-container">
      <aside className="sidebar">
        <div className="sidebar-block">
          <Link to="/" className="sidebar-title">Lovelace Research</Link>
          <p className="sidebar-subtitle">Independent research-led innovation lab for personal & humane AI</p>
        </div>
        <div className="sidebar-block">
          <nav className="sidebar-nav">
            <ul>
              <li><NavLink to="/prototypes">Prototypes</NavLink></li>
              <li><NavLink to="/publications">Publications</NavLink></li>
              <li><NavLink to="/opinion-notes">Opinion Notes</NavLink></li>
              <li><NavLink to="/reading-list">Reading List</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-block sidebar-block--footer">
          <div className="sidebar-contact">
            <a href="https://instagram.com/lovelaceresearch" target="_blank" rel="noopener noreferrer">IG</a>
            <span className="email-container">
              <a href="mailto:office@lovelace-research.com" id="email-link" data-email="office@lovelace-research.com">office@lovelace-research.com</a>
              <span id="hover-tooltip" className="hover-tooltip">Copy email</span>
              <span id="copied-message" className="copied-message">Copied!</span>
            </span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>

      <div className="mobile-nav-container">
        <div className="mobile-nav-menu">
          <div className="sidebar-block">
            <div className="sidebar-contact">
              <a href="https://instagram.com/lovelaceresearch" target="_blank" rel="noopener noreferrer">IG</a>
              <span className="email-container">
                <a href="mailto:office@lovelace-research.com" id="email-link-mobile" data-email="office@lovelace-research.com">office@lovelace-research.com</a>
                <span id="hover-tooltip-mobile" className="hover-tooltip">Copy email</span>
                <span id="copied-message-mobile" className="copied-message">Copied!</span>
              </span>
            </div>
          </div>
          <div className="sidebar-block">
            <nav className="sidebar-nav">
              <ul>
                <li><NavLink to="/prototypes">Prototypes</NavLink></li>
                <li><NavLink to="/publications">Publications</NavLink></li>
                <li><NavLink to="/opinion-notes">Opinion Notes</NavLink></li>
                <li><NavLink to="/reading-list">Reading List</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="mobile-nav-trigger">
          <div className="mobile-nav-trigger-content">
            <div className="mobile-nav-title">
              <Link to="/" className="sidebar-title">Lovelace Research</Link>
              <p className="sidebar-subtitle mobile-only">Independent research-led innovation lab for personal & humane AI</p>
            </div>
            <span className="icon">+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
