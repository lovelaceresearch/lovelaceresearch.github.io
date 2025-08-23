"use client";

import { usePathname } from 'next/navigation';

interface PageNavProps {
  sections: { id: string; title: string }[];
}

export default function PageNav({ sections }: PageNavProps) {
  const pathname = usePathname();

  // Only show page nav if there are sections to show
  if (!sections || sections.length === 0) {
    return null;
  }

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-nav-block">
      <nav className="page-nav">
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <button 
                onClick={() => handleSectionClick(section.id)}
                className="page-nav-link"
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
