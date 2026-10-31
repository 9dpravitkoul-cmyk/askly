import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Menu, HelpCircle, LogOut, ExternalLink, X, User } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

export default function DashboardTopNav({
  searchTerm = '',
  onSearchChange,
  onOpenSidebar,
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
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AH';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-8 transition-colors duration-200">
        {/* Left: Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="ui-interactive rounded-xl p-2 text-muted hover:bg-surface-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
            aria-label="Open sidebar navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Surveys Input */}
          <div className="relative w-full">
            <Search className="h-4 w-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search surveys by title, question, or format..."
              className="ui-field min-h-10 w-full bg-surface-secondary/70 py-2 pl-10 pr-9 text-xs sm:text-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-text"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Theme Toggle, Help & User Account Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Functional Help Button */}
          <button
            type="button"
            onClick={() => setHelpModalOpen(true)}
            className="ui-interactive flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted hover:border-primary/40 hover:text-text shadow-xs"
            title="Help & Guide"
            aria-label="Help & Guide"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* User Avatar & Account Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="ui-interactive flex items-center gap-2.5 rounded-xl border border-border bg-surface p-1 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
              aria-expanded={accountMenuOpen}
              aria-label="User Account Menu"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="h-8 w-8 rounded-lg object-cover border border-border shadow-2xs"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs shadow-2xs">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block text-left text-xs leading-tight pr-2">
                <span className="block font-bold text-text max-w-[120px] truncate">{displayName}</span>
                <span className="block text-[10px] text-muted">Host Presenter</span>
              </div>
            </button>

            {/* Account Menu Dropdown */}
            {accountMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface py-2 text-sm shadow-card animate-in fade-in zoom-in-95 duration-100">
                <div className="border-b border-border px-4 py-2.5">
                  <p className="font-bold text-text text-xs truncate">{displayName}</p>
                  <p className="text-[11px] text-muted truncate mt-0.5">{email}</p>
                </div>

                <div className="p-1">
                  <Link
                    to="/"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted hover:bg-surface-secondary hover:text-text transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Public Landing Page</span>
                  </Link>

                  <div className="my-1 border-t border-border" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-danger hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setHelpModalOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-muted hover:bg-surface-secondary hover:text-text"
              aria-label="Close guide"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary mb-3">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-text">Askly Host Quick Guide</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Welcome to your host workspace. Here are quick tips for managing polls and presentations:
            </p>
            <div className="mt-4 space-y-2.5 text-xs text-text">
              <div className="rounded-xl border border-border bg-surface-secondary p-3">
                <span className="mb-0.5 block font-bold text-primary">🚀 Launching a Session</span>
                Click "Launch" on any active survey to start the host screen with live QR code and join PIN.
              </div>
              <div className="rounded-xl border border-border bg-surface-secondary p-3">
                <span className="mb-0.5 block font-bold text-primary">📊 Live Word Clouds</span>
                Word clouds dynamically group duplicate keywords and automatically scale based on submission volume.
              </div>
              <div className="rounded-xl border border-border bg-surface-secondary p-3">
                <span className="mb-0.5 block font-bold text-primary">🔒 Duplicate Prevention</span>
                Each audience participant receives an isolated session token to prevent multiple votes on single questions.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHelpModalOpen(false)}
              className="ui-interactive mt-5 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}
