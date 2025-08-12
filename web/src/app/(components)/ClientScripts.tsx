"use client";

import { useEffect } from "react";

export default function ClientScripts() {
  useEffect(() => {
    // Attach existing vanilla JS behaviors after mount
    const commonScript = document.createElement('script');
    commonScript.src = '/common.js';
    commonScript.defer = true;
    document.body.appendChild(commonScript);

    const slideScript = document.createElement('script');
    slideScript.src = '/slideshow.js';
    slideScript.defer = true;
    document.body.appendChild(slideScript);

    return () => {
      commonScript.remove();
      slideScript.remove();
    };
  }, []);

  return null;
}

