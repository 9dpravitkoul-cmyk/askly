import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Logo from '../components/common/Logo';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function JoinPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanCode = code.replace(/\s+/g, '').trim();
    if (!cleanCode) {
      setError('Please enter a session code');
      return;
    }
    if (cleanCode.length < 6) {
      setError('Session code should be 6 digits (e.g. 489201)');
      return;
    }
    // Will navigate to active session view in Phase 5
    navigate(`/session/${cleanCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light-gray">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-2xl border border-brand-border-gray shadow-lg p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audience Fast-Join</span>
          </div>

          <h1 className="text-2xl font-bold text-brand-navy mb-2">
            Join a Live Session
          </h1>
          <p className="text-sm text-brand-text-secondary mb-8">
            Enter the 6-digit code shown on the host presenter screen.
          </p>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="session-code" className="sr-only">
                Session Code
              </label>
              <input
                id="session-code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="123 456"
                maxLength={8}
                className="w-full text-center text-2xl sm:text-3xl font-mono font-bold tracking-widest py-3.5 px-4 rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy bg-brand-light-gray/50 uppercase"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-navy hover:bg-brand-navy-light text-white font-semibold text-base rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-border-gray text-xs text-brand-text-secondary">
            <span>Are you a presenter? </span>
            <Link to="/login" className="text-brand-navy font-semibold hover:underline">
              Log in to your host dashboard
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
