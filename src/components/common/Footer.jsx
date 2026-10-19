import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-white">
      <div className="page-shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo size="md" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
              Askly helps hosts run live polls and word clouds, then see real answers as they arrive.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary">Product</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><a href="/#features" className="hover:text-primary">Features</a></li>
                <li><a href="/#how-it-works" className="hover:text-primary">How it works</a></li>
                <li><Link to="/join" className="hover:text-primary">Join a session</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary">Hosts</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><Link to="/login" className="hover:text-primary">Log in</Link></li>
                <li><Link to="/signup" className="hover:text-primary">Create account</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">Workspace</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary">Audience</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>No participant login</li>
                <li>One response per question</li>
                <li>Private host surveys</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Askly. Smart Polling, Real Insights.</p>
          <p>Host data stays owner-only. Votes require an active session.</p>
        </div>
      </div>
    </footer>
  );
}
