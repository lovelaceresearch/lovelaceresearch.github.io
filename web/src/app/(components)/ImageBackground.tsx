'use client';

import { useState, useEffect } from 'react';
import styles from './ImageBackground.module.css';

interface Slide {
  id: string;
  filename: string;
  alt: string;
  order: number;
}

export default function ImageBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  // Load slides configuration and set up image paths
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetch('/data/slides.json');
        const data = await response.json();
        const sortedSlides = data.slides.sort((a: Slide, b: Slide) => a.order - b.order);
        
        setSlides(sortedSlides);
        const paths = sortedSlides.map((slide: Slide) => `/images/slides/${slide.filename}`);
        setImagePaths(paths);
        
        // Preload images to prevent flashing
        const preloadImages = async () => {
          const imagePromises = paths.map((src) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve; // Continue even if image fails to load
              img.src = src;
            });
          });
          
          await Promise.all(imagePromises);
          setImagesLoaded(true);
        };

        preloadImages();
      } catch (error) {
        console.error('Failed to load slides configuration:', error);
        // Fallback to default images if config fails
        const fallbackPaths = ['/images/slides/DSC06369.jpg', '/images/slides/DSC06366.jpg'];
        setImagePaths(fallbackPaths);
        setImagesLoaded(true);
      }
    };

    loadSlides();
  }, []);

  const switchToImage = async (newIndex: number) => {
    if (!imagePaths[newIndex]) return;
    
    // Preload the new image to ensure it's ready
    await new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = imagePaths[newIndex];
    });
    
    // Update instantly - no transition
    setCurrentIndex(newIndex);
  };

  const handleLeftClick = () => {
    const newIndex = currentIndex === 0 ? imagePaths.length - 1 : currentIndex - 1;
    switchToImage(newIndex);
  };

  const handleRightClick = () => {
    const newIndex = currentIndex === imagePaths.length - 1 ? 0 : currentIndex + 1;
    switchToImage(newIndex);
  };

  return (
    <>
      {/* Single background image layer */}
      <div className={styles.backgroundContainer}>
        <div 
          className={`${styles.backgroundImage} ${imagesLoaded ? styles.loaded : ''}`}
          style={{ 
            backgroundImage: imagesLoaded && imagePaths[currentIndex] ? `url(${imagePaths[currentIndex]})` : 'none',
            backgroundColor: imagesLoaded ? 'transparent' : '#f6f6f6'
          }}
        />
      </div>
      
      {/* Click areas layer - only over main content area */}
      <div className={styles.clickAreasContainer}>
        <div 
          className={`${styles.clickArea} ${styles.leftArea}`} 
          onClick={handleLeftClick}
          title={slides[currentIndex] ? `Previous: ${slides[currentIndex].alt}` : "Previous image"}
        />
        <div 
          className={`${styles.clickArea} ${styles.rightArea}`} 
          onClick={handleRightClick}
          title={slides[currentIndex] ? `Next: ${slides[currentIndex].alt}` : "Next image"}
        />
      </div>
    </>
  );
}
