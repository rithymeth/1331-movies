'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface AdcashAdProps {
  zoneId: string;
}

declare global {
  interface Window {
    aclib?: {
      runAutoTag: (config: { zoneId: string }) => void;
    };
  }
}

export default function AdcashAd({ zoneId }: AdcashAdProps) {
  useEffect(() => {
    const initAd = () => {
      if (window.aclib) {
        window.aclib.runAutoTag({
          zoneId: zoneId,
        });
      } else {
        // If script is not loaded yet, wait and try again
        setTimeout(initAd, 100);
      }
    };

    // Start initialization process
    initAd();

    return () => {
      // No cleanup needed as ads are managed by Adcash
    };
  }, [zoneId]);

  return (
    <>
      <Script
        src={`https://adcash.com/apu.php?zoneid=${zoneId}`}
        strategy="beforeInteractive"
      />
      <div className="adcash-ad-container" data-zone={zoneId}></div>
    </>
  );
}
