import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Safely creates or checks a user profile document in Firestore.
 * Does NOT overwrite existing profile data if it already exists.
 * Fails gracefully if Firestore is not enabled yet, ensuring authentication is unaffected.
 */
export async function syncUserProfile(user, fallbackDisplayName = '') {
  if (!db || !user?.uid) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || fallbackDisplayName || user.email?.split('@')[0] || 'Askly Host',
        email: user.email || '',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('[Askly] User profile sync skipped (Firestore rules or connection unavailable):', err.message);
  }
}
