'use client';

import { useEffect } from 'react';

interface AdcashAdProps {
  zoneId: string;
}

export default function AdcashAd({ zoneId }: AdcashAdProps) {
  useEffect(() => {
    // Initialize Adcash
    // @ts-ignore
    if (window.aclib) {
      // @ts-ignore
      window.aclib.runAutoTag({
        zoneId: zoneId,
      });
    }

    return () => {
      // No cleanup needed as the main script handles this
    };
  }, [zoneId]);

  return <div className="adcash-ad-container" data-zone={zoneId}></div>;
}
