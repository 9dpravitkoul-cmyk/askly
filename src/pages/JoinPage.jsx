import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Logo from '../components/common/Logo';
import { ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export default function JoinPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryCode = searchParams.get('code');
    if (queryCode) {
      navigate(`/session/${queryCode.replace(/\s/g, '').toUpperCase()}`, { replace: true });
    }
  }, [navigate, searchParams]);

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanCode = code.replace(/\s+/g, '').trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter a session code');
      return;
    }
    if (!/^[A-HJ-NP-Z2-9]{8}$/.test(cleanCode)) {
      setError('Enter the 8-character code shown on the presenter screen.');
      return;
    }
    navigate(`/session/${cleanCode}`);
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.toUpperCase();
    setCode(val);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-200">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 sm:p-10 text-center shadow-card transition-all">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Audience Live Join</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text mb-2">
            Join a Live Session
          </h1>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Enter the 8-character PIN code displayed on the host screen. No login or signup required.
          </p>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="session-code" className="sr-only">
                Session Code
              </label>
              <div className="relative">
                <input
                  id="session-code"
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="ABCD2345"
                  maxLength={10}
                  autoCapitalize="characters"
                  autoComplete="off"
                  autoCorrect="off"
                  className="w-full text-center text-3xl sm:text-4xl font-mono font-black tracking-[0.25em] py-4 px-4 rounded-2xl border border-border bg-surface-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary text-text placeholder:text-muted/40 uppercase shadow-inner"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm sm:text-base font-bold text-white shadow-soft hover:bg-primary-hover active:scale-[0.99] transition-all"
            >
              <span>Enter Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-xs text-muted">
            <span>Are you a presenter? </span>
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Host your own session
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
