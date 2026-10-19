import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Menu, HelpCircle, LogOut, User, Settings, ExternalLink, X, ShieldCheck } from 'lucide-react';

export default function DashboardTopNav({
  searchTerm = '',
  onSearchChange,
  onOpenSidebar
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close account menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setAccountMenuOpen(false);
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Askly Host';
  const email = user?.email || 'host@askly.io';
  const initials = (user?.displayName || user?.email || 'Host')
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AH';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-white px-4 sm:px-7">
        {/* Left: Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
          <button
            onClick={onOpenSidebar}
              className="ui-interactive rounded-xl p-2 text-muted hover:bg-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Surveys Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-brand-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search surveys by title, question, or format..."
              className="ui-field min-h-10 w-full bg-background py-2 pl-10 pr-9 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-primary"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Help & User Account Menu */}
        <div className="flex items-center gap-3">
          {/* Functional Help Button */}
          <button
            onClick={() => setHelpModalOpen(true)}
            className="ui-interactive rounded-xl p-2 text-muted hover:bg-background hover:text-primary"
            title="Help & Keyboard Shortcuts"
            aria-label="Help & Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* User Avatar & Account Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="ui-interactive flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={accountMenuOpen}
              aria-label="User Account Menu"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-9 h-9 rounded-xl object-cover border border-brand-border-gray shadow-xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="block font-semibold text-brand-navy max-w-[120px] truncate">{displayName}</span>
                <span className="block text-[11px] text-brand-text-secondary">Host Presenter</span>
              </div>
            </button>

            {/* Account Menu Dropdown */}
            {accountMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-border bg-white py-2 text-sm shadow-card">
                <div className="px-4 py-2.5 border-b border-brand-border-gray">
                  <p className="font-semibold text-brand-navy text-xs truncate">{displayName}</p>
                  <p className="text-[11px] text-brand-text-secondary truncate mt-0.5">{email}</p>
                </div>

                <Link
                  to="/"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray transition-colors text-xs font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Public Landing Page</span>
                </Link>

                <div className="my-1 border-t border-brand-border-gray" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-brand-border-gray max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setHelpModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-brand-light-blue text-brand-navy flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">Askly Host Quick Guide</h3>
            <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed">
              Welcome to your host workspace. Here are quick tips for managing polls and presentations:
            </p>
            <div className="mt-4 space-y-2.5 text-xs text-brand-text-primary">
              <div className="rounded-xl border border-border bg-background p-3">
                <span className="mb-0.5 block font-semibold text-primary">Launching a session</span>
                Use Launch on a survey with at least one saved question. The control room shows the join code and QR.
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <span className="mb-0.5 block font-semibold text-primary">Live results</span>
                Word clouds group matching phrases. Bar charts use actual vote counts from Firestore.
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <span className="mb-0.5 block font-semibold text-primary">One vote per question</span>
                Each participant gets an anonymous Firebase UID. A second vote on the same question is rejected.
              </div>
            </div>
            <button
              onClick={() => setHelpModalOpen(false)}
              className="mt-5 w-full py-2.5 bg-brand-navy text-white text-xs font-semibold rounded-xl hover:bg-brand-navy-light transition-colors"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}
