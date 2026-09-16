'use client';

import { useEffect, useState } from 'react';
import CommandSearch from './CommandSearch';

export default function SiteChrome() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
      setShowTop(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[60] h-0.5 bg-transparent">
        <div className="h-full bg-cyan-300 transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
      <CommandSearch />
      {showTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 rounded-full border border-white/10 bg-[#11161d]/95 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-2xl backdrop-blur hover:bg-cyan-300 hover:text-slate-950"
        >
          Top
        </button>
      ) : null}
    </>
  );
}
