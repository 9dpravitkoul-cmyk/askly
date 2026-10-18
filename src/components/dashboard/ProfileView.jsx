import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Loader2 } from 'lucide-react';

export default function ProfileView() {
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Askly Host';
  const email = user?.email || 'No email address on this account';
  const initials = (user?.displayName || user?.email || 'Host')
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AH';

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setError('');
    try {
      await logout();
    } catch {
      setError('Could not sign out right now. Please try again.');
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-brand-border-gray pb-4">
        <h2 className="text-xl font-bold text-brand-navy">Host Profile</h2>
        <p className="text-xs text-brand-text-secondary mt-1">Your account details and sign-in options.</p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border-gray p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-brand-border-gray">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-16 h-16 rounded-2xl object-cover border border-brand-border-gray shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-brand-navy">{displayName}</h3>
            <p className="text-xs text-brand-text-secondary">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-brand-navy mb-1">Full Name</label>
            <input
              type="text"
              readOnly
              value={displayName}
              className="w-full px-3.5 py-2.5 bg-brand-light-gray rounded-xl border border-brand-border-gray text-brand-text-primary"
            />
          </div>
          <div>
            <label className="block font-semibold text-brand-navy mb-1">Email Address</label>
            <input
              type="email"
              readOnly
              value={email}
              className="w-full px-3.5 py-2.5 bg-brand-light-gray rounded-xl border border-brand-border-gray text-brand-text-primary"
            />
          </div>
        </div>

        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
        <button type="button" onClick={handleSignOut} disabled={signingOut} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">
          {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}
