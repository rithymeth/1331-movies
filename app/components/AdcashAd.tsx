'use client';

import Script from 'next/script';

interface AdcashAdProps {
  zoneId: string;
}

export default function AdcashAd({ zoneId }: AdcashAdProps) {
  return (
    <>
      <Script
        id={`adcash-${zoneId}`}
        strategy="afterInteractive"
        src={`https://www.profitablecreativeformat.com/${zoneId}/invoke.js`}
      />
      <div className="adcash-zone" data-zone={zoneId}></div>
    </>
  );
}
