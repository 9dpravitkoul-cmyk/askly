import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, HelpCircle, LogOut, User, Settings, ExternalLink, X } from 'lucide-react';

export default function DashboardTopNav({
  searchTerm = '',
  onSearchChange,
  onOpenSidebar
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <>
      <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-sm border-b border-brand-border-gray px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-navy"
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
              className="w-full pl-10 pr-9 py-2 text-sm bg-brand-light-gray rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy focus:bg-white transition-all text-brand-text-primary placeholder:text-brand-text-secondary/70"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-navy"
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
            className="p-2 rounded-xl text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray transition-colors border border-transparent hover:border-brand-border-gray"
            title="Help & Keyboard Shortcuts"
            aria-label="Help & Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* User Avatar & Account Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-brand-light-gray transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy border border-transparent hover:border-brand-border-gray"
              aria-expanded={accountMenuOpen}
              aria-label="User Account Menu"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AM
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="block font-semibold text-brand-navy">Prof. Alex Morgan</span>
                <span className="block text-[11px] text-brand-text-secondary">Host Presenter</span>
              </div>
            </button>

            {/* Account Menu Dropdown */}
            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-brand-border-gray shadow-xl py-2 z-50 text-sm">
                <div className="px-4 py-2 border-b border-brand-border-gray sm:hidden">
                  <p className="font-semibold text-brand-navy">Prof. Alex Morgan</p>
                  <p className="text-xs text-brand-text-secondary truncate">alex.morgan@university.edu</p>
                </div>

                <Link
                  to="/"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray transition-colors text-xs font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Public Landing Page</span>
                </Link>

                <div className="my-1 border-t border-brand-border-gray" />

                <Link
                  to="/login"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </Link>
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
              <div className="p-3 bg-brand-light-gray rounded-xl border border-brand-border-gray">
                <span className="font-semibold text-brand-navy block mb-0.5">🚀 Launching a Session</span>
                Click "Launch" on any active survey to start the host screen with live QR code and join PIN.
              </div>
              <div className="p-3 bg-brand-light-gray rounded-xl border border-brand-border-gray">
                <span className="font-semibold text-brand-navy block mb-0.5">📊 Live Word Clouds</span>
                Word clouds dynamically group duplicate keywords and automatically scale based on submission volume.
              </div>
              <div className="p-3 bg-brand-light-gray rounded-xl border border-brand-border-gray">
                <span className="font-semibold text-brand-navy block mb-0.5">🔒 Duplicate Prevention</span>
                Each audience participant receives an isolated session token to prevent multiple votes on single questions.
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
