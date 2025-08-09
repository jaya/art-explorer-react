"use client";

import { useEffect } from "react";

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

export function ImagePreloader({
  images,
  priority = false,
}: ImagePreloaderProps) {
  useEffect(() => {
    const preloadImages = async () => {
      if (priority) {
        images.slice(0, 5).forEach((src) => {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = src;
          document.head.appendChild(link);
        });
      }

      const imagePromises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.allSettled(imagePromises);
        console.log(`Preloaded ${images.length} images`);
      } catch (error) {
        console.warn("Some images failed to preload:", error);
      }
    };

    preloadImages();
  }, [images, priority]);

  return null;
}
