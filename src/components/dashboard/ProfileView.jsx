import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Check, Edit2, Loader2, LogOut, Mail, Shield, User } from 'lucide-react';

export default function ProfileView() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(
    user?.displayName || user?.email?.split('@')[0] || 'Askly Host'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  const email = user?.email || 'No email associated with this account';
  const initials = (displayName || 'Host')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AH';

  const handleUpdateName = async (e) => {
    e.preventDefault();
    const cleanName = displayName.trim();
    if (!cleanName) return;

    setSavingName(true);
    setError('');
    try {
      if (user) {
        await updateProfile(user, { displayName: cleanName });
        // Also update users/{uid} document if exists
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            displayName: cleanName,
            updatedAt: serverTimestamp(),
          });
        } catch {
          // Rule/doc fallback safe
        }
      }
      setIsEditing(false);
      toast.success('Host profile name updated');
    } catch (err) {
      setError(err.message || 'Could not update profile name.');
      toast.error('Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setError('');
    try {
      await logout();
      toast.success('Signed out successfully');
    } catch {
      setError('Could not sign out right now. Please try again.');
      toast.error('Sign out failed');
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-text">Host Account Profile</h2>
        <p className="text-xs text-muted mt-1">Manage your host credentials and presenter details.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft space-y-6">
        {/* Avatar & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-16 h-16 rounded-2xl object-cover border border-border shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-text">{displayName}</h3>
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">
                  Verified Host
                </span>
              </div>
              <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3" />
                <span>{email}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text hover:border-primary/40 hover:text-primary transition-all"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Name'}</span>
          </button>
        </div>

        {/* Edit Form or Readonly View */}
        {isEditing ? (
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label htmlFor="host-name" className="block text-xs font-semibold text-text mb-1.5">
                Presenter Display Name
              </label>
              <input
                id="host-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="E.g. Dr. Jane Smith"
                className="w-full rounded-xl border border-border bg-surface-secondary px-3.5 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={savingName}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-primary-hover transition-all disabled:opacity-60"
              >
                {savingName ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted hover:text-text"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5">
              <p className="font-semibold text-muted mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Host Name</span>
              </p>
              <p className="text-sm font-bold text-text">{displayName}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5">
              <p className="font-semibold text-muted mb-1 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-secondary" />
                <span>Account Role</span>
              </p>
              <p className="text-sm font-bold text-text">Session Host / Presenter</p>
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        {/* Sign Out Action */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted">
            End your host session securely on this browser.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 transition-all active:scale-95 disabled:opacity-60"
          >
            {signingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
            <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
