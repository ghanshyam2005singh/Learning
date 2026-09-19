import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-slate-800 mb-2 select-none">404</div>
        <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors w-full sm:w-auto"
          >
            Go Home
          </Link>
          <Link
            href="/javascript"
            className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors w-full sm:w-auto"
          >
            JavaScript Track
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-600">
          <Link href="/javascript" className="hover:text-slate-400 transition-colors">JavaScript</Link>
          <Link href="/databases" className="hover:text-slate-400 transition-colors">Databases</Link>
          <Link href="/devops" className="hover:text-slate-400 transition-colors">DevOps</Link>
        </div>
      </div>
    </div>
  );
}
