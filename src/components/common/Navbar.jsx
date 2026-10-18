import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border-gray">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-brand-text-secondary">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-brand-navy transition-colors focus:outline-none focus:text-brand-navy"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-brand-navy transition-colors focus:outline-none focus:text-brand-navy"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="hover:text-brand-navy transition-colors focus:outline-none focus:text-brand-navy"
            >
              Interactive Preview
            </button>
            <Link
              to="/join"
              className="text-brand-navy font-medium hover:text-brand-navy-light flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-brand-orange" />
              Join a Session
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-light-blue rounded-lg transition-colors border border-transparent hover:border-brand-border-gray"
            >
              Log In
            </Link>
            <Link
              to="/surveys/new"
              className="ui-interactive inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover"
            >
              Create a Survey
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-navy"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-border-gray bg-white px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-text-primary hover:bg-brand-light-blue rounded-lg"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-text-primary hover:bg-brand-light-blue rounded-lg"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('preview')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-text-primary hover:bg-brand-light-blue rounded-lg"
          >
            Interactive Preview
          </button>
          <Link
            to="/join"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-navy hover:bg-brand-light-blue rounded-lg flex items-center justify-between"
          >
            <span>Join a Session</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange">Fast Join</span>
          </Link>
          <div className="pt-4 border-t border-brand-border-gray flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-brand-navy border border-brand-border-gray hover:bg-brand-light-gray rounded-lg"
            >
              Log In
            </Link>
            <Link
              to="/surveys/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy-light rounded-lg shadow-sm"
            >
              Create a Survey
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
