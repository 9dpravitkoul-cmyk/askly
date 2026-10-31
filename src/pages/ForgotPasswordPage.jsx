import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Logo from '../components/common/Logo';
import { useAuth } from '../contexts/AuthContext';
import { getFriendlyAuthErrorMessage } from '../lib/authErrors';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { resetPassword, isConfigured } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(cleanEmail);
      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      const code = err.code || err.message;
      setError(getFriendlyAuthErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-200">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-14 sm:py-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 sm:p-9 shadow-card">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Reset Password
            </h1>
            <p className="mt-1 text-sm text-muted">
              Enter your registered email and we will send a password reset link.
            </p>
          </div>

          {!isConfigured && (
            <div className="mb-6 p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Firebase Configuration Required</span>
                <span>To send live password reset emails, populate your Firebase keys in <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono">.env.local</code>.</span>
              </div>
            </div>
          )}

          {success ? (
            <div className="space-y-6 text-center animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text mb-1">Reset link dispatched!</h3>
                <p className="text-xs text-muted leading-relaxed">
                  We've sent password reset instructions to <strong className="text-text font-semibold">{email}</strong>. Please check your inbox and spam folder.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-xs font-semibold text-text mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="host@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border bg-surface-secondary/50 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-400 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Dispatching Link...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Password Reset Email</span>
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
