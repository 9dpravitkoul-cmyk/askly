import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Logo from '../components/common/Logo';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function JoinPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryCode = searchParams.get('code');
    if (queryCode) navigate(`/session/${queryCode.replace(/\s/g, '').toUpperCase()}`, { replace: true });
  }, [navigate, searchParams]);

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanCode = code.replace(/\s+/g, '').trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter a session code');
      return;
    }
    if (!/^[A-HJ-NP-Z2-9]{8}$/.test(cleanCode)) {
      setError('Enter the 8-character code shown by your host.');
      return;
    }
    navigate(`/session/${cleanCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light-gray">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 text-center shadow-card sm:p-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-strong">Audience join</p>
          <h1 className="mb-2 text-2xl font-bold text-primary">Join a live session</h1>
          <p className="mb-8 text-sm text-muted">
            Enter the 8-character code on the host screen. You do not need an account.
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
                placeholder="ABCD 2345"
                maxLength={10}
                autoCapitalize="characters"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-base font-semibold text-white shadow-sm hover:bg-accent-strong"
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
