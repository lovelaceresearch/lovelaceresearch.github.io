"use client";

import { useEffect } from 'react';

export default function RndClient() {
  useEffect(() => {
    const load = async () => {
      const mod = await import('@/lib/rnd');
      if (mod && typeof mod.init === 'function') {
        mod.init();
      }
    };
    load();
  }, []);
  return null;
}


