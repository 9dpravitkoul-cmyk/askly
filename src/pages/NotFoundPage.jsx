import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-6 text-center transition-colors duration-200">
      <div className="mb-6">
        <Logo size="lg" />
      </div>
      <span className="text-7xl font-black text-primary font-mono mb-2 tracking-tight">404</span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">Page Not Found</h1>
      <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
        The destination you requested does not exist or has been relocated to another workspace URL.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-soft hover:bg-primary-hover active:scale-95 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
