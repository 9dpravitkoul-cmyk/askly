import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { BarChart3, FileQuestion, Home, Layers, Plus, Settings, UserRound, X } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'surveys', label: 'My Surveys', icon: FileQuestion },
  { id: 'templates', label: 'Templates', icon: Layers },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar({ currentView = 'surveys', onSelectView, isOpen = false, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  const handleNavClick = (id) => { onSelectView?.(id); onClose?.(); };
  return <>
    {isOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden" onClick={onClose} />}
    <aside aria-label="Workspace navigation" className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-200 motion-reduce:transition-none lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-[72px] items-center justify-between border-b border-border px-5"><Logo size="md" /><button type="button" onClick={onClose} aria-label="Close navigation" className="rounded-lg p-2 text-muted hover:bg-background lg:hidden"><X className="h-5 w-5" /></button></div>
      <nav aria-label="Host navigation" className="flex-1 space-y-1 px-3 py-5">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-current={currentView === id ? 'page' : undefined} onClick={() => handleNavClick(id)} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition ${currentView === id ? 'bg-primary-soft font-semibold text-primary' : 'text-muted hover:bg-background hover:text-primary'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
      <div className="border-t border-border p-4"><Link to="/surveys/new" onClick={onClose} className="ui-interactive flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-white hover:bg-primary-hover"><Plus className="h-4 w-4" />Create Survey</Link><Link to="/" className="mt-3 block rounded-lg px-2 py-2 text-xs text-muted hover:text-primary">Askly · Smart Polling</Link></div>
    </aside>
  </>;
}
