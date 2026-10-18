import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if credentials have been populated with real values
const requiredConfigValues = Object.values(firebaseConfig);
export const isFirebaseConfigured = requiredConfigValues.every(
  (value) => value && !value.startsWith('your_')
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn(
    '[Askly] Firebase configuration missing or incomplete. Please create a .env.local file with your Firebase credentials to enable live authentication.'
  );
}

export { app, auth, db, googleProvider };

// Safe, temporary Firestore diagnostics: never include document contents,
// user identifiers, Firebase credentials, or join-code values.
export function logFirestorePermissionFailure(operation, paths, error) {
  if (error?.code !== 'permission-denied') return;
  console.error('[Askly Firestore diagnostic]', {
    operation,
    paths,
    errorCode: error.code,
    projectId: db?.app?.options?.projectId || firebaseConfig.projectId || 'unconfigured',
  });
}
