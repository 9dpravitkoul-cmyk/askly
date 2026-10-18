import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  Home,
  FileQuestion,
  Layers,
  BarChart2,
  User,
  Settings,
  Plus,
  X,
  Sparkles
} from 'lucide-react';

export default function DashboardSidebar({
  currentView = 'surveys',
  onSelectView,
  isOpen = false,
  onClose
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'surveys', label: 'My Surveys', icon: FileQuestion },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    if (onSelectView) {
      onSelectView(id);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-brand-border-gray flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Logo */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-brand-border-gray">
            <Logo size="md" />
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Host Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-brand-light-blue text-brand-navy font-semibold'
                      : 'text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray'
                  }`}
                >
                  {/* Narrow Navy Indicator for Active Item */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-navy rounded-r-full" />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-navy' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Promotional Card */}
        <div className="p-4 border-t border-brand-border-gray">
          <div className="bg-brand-light-gray rounded-2xl p-4 border border-brand-border-gray">
            <div className="w-8 h-8 rounded-lg bg-white border border-brand-border-gray flex items-center justify-center mb-2.5 text-brand-orange shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-brand-navy leading-snug">
              Turn ideas into insights
            </h4>
            <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed">
              Create engaging polls and get real-time results.
            </p>
            <Link
              to="/surveys/new"
              className="mt-3.5 w-full py-2 px-3 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Survey</span>
            </Link>
          </div>

          <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-brand-text-secondary">
            <span>Askly Host v1.0</span>
            <Link to="/" className="text-brand-navy hover:underline font-medium">
              Public Home
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
