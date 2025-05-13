'use client';

import { useEffect } from 'react';

export default function GoogleAdsense() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error loading AdSense:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-1318099833166063"
      data-ad-slot="auto"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
