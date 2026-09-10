import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        <div className="glass-dark p-8 rounded-2xl border border-white/10">
          <div className="text-6xl font-black gradient-text mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-gray-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Go Home
            </Link>
            <Link
              href="/search"
              className="inline-block w-full px-6 py-3 glass-dark border border-white/10 text-white rounded-xl font-semibold hover:border-purple-500/30 transition-all duration-300"
            >
              Search Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
