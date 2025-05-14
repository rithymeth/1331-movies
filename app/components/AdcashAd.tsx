'use client';

import { useEffect } from 'react';

interface AdcashAdProps {
  zoneId: string;
}

export default function AdcashAd({ zoneId }: AdcashAdProps) {
  useEffect(() => {
    // Load Adcash script
    const script = document.createElement('script');
    script.src = 'https://aclib.net/libs/aclib.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.aclib) {
        // @ts-ignore
        window.aclib.runAutoTag({
          zoneId: zoneId,
        });
      }
    };

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, [zoneId]);

  return <div className="adcash-ad-container" data-zone={zoneId}></div>;
}
