'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface PropellerAdProps {
  zoneId: string;
  adType?: 'push' | 'interstitial' | 'onclick';
}

declare global {
  interface Window {
    propellerads: any;
  }
}

export default function PropellerAd({ zoneId, adType = 'push' }: PropellerAdProps) {
  useEffect(() => {
    // Initialize PropellerAds when the component mounts
    if (window.propellerads) {
      switch (adType) {
        case 'push':
          window.propellerads.push({
            zoneId: zoneId,
            type: 'push'
          });
          break;
        case 'interstitial':
          window.propellerads.push({
            zoneId: zoneId,
            type: 'interstitial'
          });
          break;
        case 'onclick':
          window.propellerads.push({
            zoneId: zoneId,
            type: 'onclick'
          });
          break;
      }
    }
  }, [zoneId, adType]);

  return (
    <>
      <Script
        id="propellerads-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(
            document.createElement('script'),
            'https://propu.sh/pfe/current/tag.min.js',
            '${zoneId}',
            document.body || document.documentElement
            )
          `
        }}
      />
      <div id={`propeller-${zoneId}`}></div>
    </>
  );
}
