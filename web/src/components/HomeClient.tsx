"use client";

import { useEffect } from 'react';

export default function HomeClient() {
  useEffect(() => {
    // Bootstrap the existing JS logic by dynamically importing and running it
    const load = async () => {
      const mod = await import('@/lib/home');
      if (mod && typeof mod.initLandingPage === 'function') {
        mod.initLandingPage();
      }
    };
    load();
  }, []);
  return null;
}


