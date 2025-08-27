"use client";

import { useEffect, useState } from 'react';

interface Logo {
  src: string;
  alt: string;
}

export default function LogoWall() {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    fetch('/data/logos.json')
      .then(r => r.json())
      .then((data: { logos: Logo[] }) => {
        setLogos(data.logos || []);
      })
      .catch(() => {
        // fallback to 1-12 if json missing
        const logoFiles = Array.from({ length: 12 }, (_, i) => `${i + 1}.svg`);
        const logoList = logoFiles.map((filename, index) => ({
          src: `/images/logos/${filename}`,
          alt: `Logo ${index + 1}`
        }));
        setLogos(logoList);
      });
  }, []);

  return (
    <div className="logo-wall">
      {logos.map((logo, index) => (
        <div key={index} className="logo-item">
          <img src={logo.src} alt={logo.alt} />
        </div>
      ))}
    </div>
  );
}
