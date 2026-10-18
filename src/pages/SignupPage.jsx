import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Logo from '../components/common/Logo';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phase 3 will integrate live Firebase Authentication & Google sign-in
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light-gray">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-14">
        <div className="max-w-md w-full bg-white rounded-2xl border border-brand-border-gray shadow-lg p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <h1 className="text-2xl font-bold text-center text-brand-navy mb-1">
            Create Host Account
          </h1>
          <p className="text-sm text-center text-brand-text-secondary mb-8">
            Start creating interactive polls and gathering audience insights today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prof. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-brand-navy hover:bg-brand-navy-light text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
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
