"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EmailCopy from './EmailCopy';

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`mobile-nav-container ${isOpen ? 'is-open' : ''}`}>
            <div className="mobile-nav-menu">
                <div className="sidebar-block" style={{ borderRadius: '4px' }}>
                    <div className="sidebar-contact">
                        <a href="https://instagram.com/lovelaceresearch" target="_blank" rel="noopener noreferrer">IG</a>
                        <EmailCopy idSuffix="-mobile" />
                    </div>
                </div>
                <div className="sidebar-block" style={{ borderRadius: '4px' }}>
                    <nav className="mobile-nav">
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li><Link href="/prototypes" className={pathname === '/prototypes' ? 'nav-active' : ''}>Prototypes</Link></li>
                            <li><Link href="/publications" className={pathname === '/publications' ? 'nav-active' : ''}>Publications</Link></li>
                            <li><Link href="/reading-list" className={pathname === '/reading-list' ? 'nav-active' : ''}>Reading List</Link></li>
                            <li><Link href="/about" className={pathname === '/about' ? 'nav-active' : ''}>About</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="mobile-nav-trigger" onClick={toggleMenu}>
                <div className="mobile-nav-trigger-content">
                    <div className="mobile-nav-title">
                        <Link href="/" className="sidebar-title">Lovelace Research</Link>
                        <p className="sidebar-subtitle mobile-only">Independent research-led innovation lab for personal & humane AI</p>
                    </div>
                    <span className="icon">+</span>
                </div>
            </div>
        </div>
    );
}
