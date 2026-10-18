import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-light-gray flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <Logo size="lg" />
      </div>
      <span className="text-6xl font-black text-brand-navy font-mono mb-2">404</span>
      <h1 className="text-2xl font-bold text-brand-navy mb-2">Page Not Found</h1>
      <p className="text-sm text-brand-text-secondary max-w-sm mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-navy text-white text-sm font-semibold rounded-xl hover:bg-brand-navy-light transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
