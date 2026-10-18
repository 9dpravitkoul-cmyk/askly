import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { syncUserProfile } from '../lib/userProfile';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    // Set up real-time Firebase Auth state observer
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && !currentUser.isAnonymous) {
        // Attempt safe profile sync without blocking state
        syncUserProfile(currentUser);
      }
      setLoading(false);
    });

    // Cleanup observer on unmount
    return () => unsubscribe();
  }, []);

  const signupWithEmail = async (email, password, displayName = '') => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('auth/configuration-missing');
    }
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName.trim()) {
      try {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      } catch (error) {
        // The account is already created; a profile update must not make signup
        // appear to have failed or prevent the user from entering the app.
        console.warn('[Askly] Could not update the Firebase display name:', error.message);
      }
    }
    await syncUserProfile(cred.user, displayName);
    return cred.user;
  };

  const loginWithEmail = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('auth/configuration-missing');
    }
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    await syncUserProfile(cred.user);
    return cred.user;
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      throw new Error('auth/configuration-missing');
    }
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user);
    return cred.user;
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('auth/configuration-missing');
    }
    await sendPasswordResetEmail(auth, email.trim());
  };

  const value = {
    user,
    loading,
    isConfigured: isFirebaseConfigured,
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
