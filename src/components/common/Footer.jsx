import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Shield, HelpCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-brand-border-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-brand-text-secondary leading-relaxed max-w-sm">
              Smart Polling, Real Insights. An audience engagement platform designed to empower speakers, educators, and teams with real-time feedback.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All systems operational • Built with React & Firebase</span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-sm text-brand-text-secondary">
                <li>
                  <a href="#features" className="hover:text-brand-navy transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-brand-navy transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#preview" className="hover:text-brand-navy transition-colors">
                    Interactive Demos
                  </a>
                </li>
                <li>
                  <Link to="/join" className="hover:text-brand-navy transition-colors">
                    Join Session
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm text-brand-text-secondary">
                <li>
                  <Link to="/login" className="hover:text-brand-navy transition-colors">
                    Host Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-brand-navy transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-brand-navy transition-colors">
                    Host Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Informational & Security */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-4">
                Trust & Security
              </h4>
              <ul className="space-y-2.5 text-sm text-brand-text-secondary">
                <li className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-navy" />
                  <span>Firestore Rules</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-navy" />
                  <span>Anonymous Voting</span>
                </li>
                <li>
                  <span className="text-xs text-brand-text-secondary/80">No ads • Privacy-first</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-brand-border-gray flex flex-col sm:flex-row items-center justify-between text-xs text-brand-text-secondary gap-4">
          <p>© {currentYear} Askly. Smart Polling, Real Insights. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with React, Vite, Tailwind CSS & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
