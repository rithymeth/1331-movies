'use client';

import Script from 'next/script';

interface AdcashAdProps {
  zoneId: string;
}

export default function AdcashAd({ zoneId }: AdcashAdProps) {
  return (
    <>
      <Script
        src={`https://adcash.com/apu.php?zoneid=${zoneId}`}
        strategy="afterInteractive"
      />
      <div id={`ac-${zoneId}`} className="adcash-container"></div>
    </>
  );
}
