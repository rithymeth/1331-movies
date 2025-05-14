'use client';

import { useEffect } from 'react';

interface AdcashAdProps {
  zoneId: string;
}

export default function AdcashAd({ zoneId }: AdcashAdProps) {
  useEffect(() => {
    // Create and inject the script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.profitablecreativeformat.com/${zoneId}/invoke.js`;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(script);
    };
  }, [zoneId]);

  return <div className="adcash-zone" data-zone={zoneId}></div>;
}
