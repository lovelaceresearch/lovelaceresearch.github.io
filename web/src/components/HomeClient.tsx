"use client";

import { useEffect } from 'react';

export default function HomeClient() {
  useEffect(() => {
    // Ensure body classes from other routes are cleared when entering home
    const body = document.body;
    if (body) {
      body.classList.remove('page-office', 'page-rnd');
    }
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


