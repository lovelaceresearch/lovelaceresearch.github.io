"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EmailCopy from './EmailCopy';

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-block" style={{ borderRadius: '4px' }}>
                <Link href="/" className="sidebar-title">Lovelace Research</Link>
                <p className="sidebar-subtitle">Independent research-led innovation lab for personal & humane AI</p>
            </div>
            <div className="sidebar-block" style={{ borderRadius: '4px' }}>
                <nav className="sidebar-nav">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li><Link href="/prototypes" className={pathname === '/prototypes' ? 'nav-active' : ''}>Prototypes</Link></li>
                        <li><Link href="/publications" className={pathname === '/publications' ? 'nav-active' : ''}>Publications</Link></li>
                        <li><Link href="/reading-list" className={pathname === '/reading-list' ? 'nav-active' : ''}>Reading List</Link></li>
                        <li><Link href="/about" className={pathname === '/about' ? 'nav-active' : ''}>About</Link></li>
                    </ul>
                </nav>
            </div>
            <div className="sidebar-block sidebar-block--footer" style={{ borderRadius: '4px' }}>
                <div className="sidebar-contact">
                    <a href="https://instagram.com/lovelaceresearch" target="_blank" rel="noopener noreferrer">IG</a>
                    <EmailCopy />
                </div>
            </div>
        </aside>
    );
}
