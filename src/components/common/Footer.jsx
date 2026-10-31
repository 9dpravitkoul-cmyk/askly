import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface transition-colors duration-200">
      <div className="page-shell py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
          <div className="space-y-4">
            <Logo size="md" />
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              An audience engagement platform for presentations, classrooms, and conferences.
            </p>
            <p className="text-xs text-muted">Made for presentations, classrooms, and events</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-text mb-3">Product</h2>
              <ul className="space-y-2.5 text-sm text-muted">
                <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="/#preview" className="hover:text-primary transition-colors">Interactive Demo</a></li>
                <li><Link to="/join" className="hover:text-primary transition-colors">Join a Session</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-text mb-3">Presenters</h2>
              <ul className="space-y-2.5 text-sm text-muted">
                <li><Link to="/login" className="hover:text-primary transition-colors">Host Login</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Create Account</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Host Dashboard</Link></li>
                <li><Link to="/surveys/new" className="hover:text-primary transition-colors">Survey Builder</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-text mb-3">Audience</h2>
              <ul className="space-y-2.5 text-sm text-muted">
                <li>No app download</li>
                <li>Guest participation</li>
                <li>One vote per question</li>
                <li>Anonymous privacy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Askly. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              End-to-end encrypted sessions
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
