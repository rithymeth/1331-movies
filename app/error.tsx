'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        <div className="glass-dark p-8 rounded-2xl border border-red-500/20">
          <div className="text-6xl font-black text-red-400 mb-4">500</div>
          <h1 className="text-3xl font-bold text-white mb-4">Something went wrong!</h1>
          <p className="text-gray-400 mb-8">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          <div className="space-y-4">
            <button
              onClick={reset}
              className="inline-block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-block w-full px-6 py-3 glass-dark border border-white/10 text-white rounded-xl font-semibold hover:border-purple-500/30 transition-all duration-300"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
