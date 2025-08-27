"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EmailCopy from './EmailCopy';
import PageNav from './PageNav';
import { navLinks } from './navLinks';

interface SidebarProps {
  pageNavSections?: { id: string; title: string }[];
}

export default function Sidebar({ pageNavSections }: SidebarProps) {
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
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className={pathname === link.href ? 'nav-active' : ''}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <PageNav sections={pageNavSections || []} />
            <div className="sidebar-block sidebar-block--footer" style={{ borderRadius: '4px' }}>
                <div className="sidebar-contact">
                    <a href="https://instagram.com/lovelaceresearch" target="_blank" rel="noopener noreferrer">IG</a>
                    <EmailCopy />
                </div>
            </div>
        </aside>
    );
}
