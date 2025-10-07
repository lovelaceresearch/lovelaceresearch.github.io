"use client";

import { useEffect } from 'react';

export default function OfficeClient() {
  useEffect(() => {
    const load = async () => {
      const mod = await import('@/lib/office');
      if (mod && typeof mod.init === 'function') {
        mod.init();
      }
    };
    load();
  }, []);
  return null;
}


