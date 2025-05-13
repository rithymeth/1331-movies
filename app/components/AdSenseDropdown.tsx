'use client';

import { useEffect, useState } from 'react';

interface AdSenseDropdownProps {
  format?: 'auto' | 'fluid';
  layout?: 'in-article' | 'display';
  slot?: string;
}

export default function AdSenseDropdown({ format = 'auto', layout = 'display', slot = '' }: AdSenseDropdownProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Error loading AdSense:', err);
      }
    }
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="sticky top-0 z-50 bg-gray-900 shadow-lg transition-all duration-300">
      <div className="w-full overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '90px'
          }}
          data-ad-client="ca-pub-1318099833166063"
          data-ad-slot={slot || 'auto'}
          data-ad-format={format}
          data-full-width-responsive="true"
          data-ad-layout={layout}
        />
      </div>
    </div>
  );
}
