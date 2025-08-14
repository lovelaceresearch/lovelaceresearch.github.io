"use client";

import { useEffect, useState } from 'react';

interface Logo {
  src: string;
  alt: string;
}

export default function LogoWall() {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    // Auto-generate logos based on the 12 logo files in the directory
    const logoFiles = [
      '1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg',
      '7.svg', '8.svg', '9.svg', '10.svg', '11.svg', '12.svg'
    ];
    
    const logoList = logoFiles.map((filename, index) => ({
      src: `/images/logos/${filename}`,
      alt: `Logo ${index + 1}`
    }));
    
    setLogos(logoList);
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
