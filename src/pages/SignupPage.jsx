import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Logo from '../components/common/Logo';
import { useAuth } from '../contexts/AuthContext';
import { getFriendlyAuthErrorMessage } from '../lib/authErrors';
import { ArrowRight, Lock, Mail, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, signupWithEmail, loginWithGoogle, isConfigured } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !user.isAnonymous) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || googleLoading) return;
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError('Please provide your name or presenter title.');
      return;
    }
    if (!cleanEmail) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter matching passwords.');
      return;
    }

    try {
      setLoading(true);
      await signupWithEmail(cleanEmail, password, cleanName);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      const code = err.code || err.message;
      setError(getFriendlyAuthErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (loading || googleLoading) return;
    setError('');
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Google sign-up error:', err);
      const code = err.code || err.message;
      setError(getFriendlyAuthErrorMessage(code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light-gray">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <h1 className="text-2xl font-bold text-center text-brand-navy mb-1">
            Create your Askly account
          </h1>
          <p className="text-sm text-center text-brand-text-secondary mb-8 leading-relaxed">
            Start creating interactive polls, word clouds, and gathering live audience insights.
          </p>

          {!isConfigured && (
            <div className="mb-6 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Firebase Setup Notice</span>
                <span>To enable live sign-up, add your Firebase keys to <code className="bg-amber-100/70 px-1 py-0.5 rounded font-mono">.env.local</code>. (See walkthrough in chat).</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-brand-light-gray text-brand-text-primary text-sm font-semibold rounded-xl border border-brand-border-gray shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed mb-5"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-navy" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border-gray" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-brand-text-secondary font-medium">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold text-brand-navy mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Prof. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-brand-navy mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="alex@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-semibold text-brand-navy mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy bg-white"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-navy p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="block text-xs font-semibold text-brand-navy mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy bg-white"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-border-gray text-center text-xs text-brand-text-secondary">
            <span>Already have an account? </span>
            <Link to="/login" className="text-brand-navy font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
