'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface AdcashAdProps {
  zoneId: string;
}

declare global {
  interface Window {
    aclib: any;
  }
}

export default function AdcashAd({ zoneId }: AdcashAdProps) {
  useEffect(() => {
    // Wait for aclib to be loaded
    const interval = setInterval(() => {
      if (window.aclib) {
        window.aclib.runAutoTag({ zoneId });
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [zoneId]);

  return (
    <>
      <Script
        id="aclib"
        src="https://adcash.com/libs/js/aclib.js"
        strategy="beforeInteractive"
      />
      <div id={`ac-${zoneId}`}></div>
    </>
  );
}
