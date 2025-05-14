'use client';

import Script from 'next/script';

interface AdcashAdProps {
  zoneId: string;
}

export default function AdcashAd({ zoneId }: AdcashAdProps) {
  return (
    <>
      <Script
        src={`https://adcash.com/script/${zoneId}.js`}
        strategy="afterInteractive"
      />
      <div className="adcash-zone" data-zone={zoneId}></div>
    </>
  );
}
