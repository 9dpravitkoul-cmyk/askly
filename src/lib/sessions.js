import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from './firebase';

const SESSIONS = 'sessions';
const LOOKUPS = 'sessionLookups';
const LOCKS = 'surveySessionLocks';
// Omits I, O, 0, and 1 to reduce transcription errors.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;
const MAX_CODE_ATTEMPTS = 8;

function requireDatabase() {
  if (!db) throw new Error('Firestore is not configured.');
}

function generateJoinCode() {
  const bytes = new Uint8Array(CODE_LENGTH);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else throw new Error('Secure random code generation is unavailable in this browser.');
  return Array.from(bytes, (value) => CODE_ALPHABET[value % CODE_ALPHABET.length]).join('');
}

function collisionError() {
  const error = new Error('That join code was just taken. Generating another code.');
  error.code = 'join-code-collision';
  return error;
}

export async function startSession(surveyId, uid) {
  requireDatabase();
  if (!surveyId || !uid) throw new Error('Sign in to start a session for this survey.');
  const surveyRef = doc(db, 'surveys', surveyId);
  const lockRef = doc(db, LOCKS, surveyId);

  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
    const joinCode = generateJoinCode();
    const sessionRef = doc(collection(db, SESSIONS));
    const lookupRef = doc(db, LOOKUPS, joinCode);
    try {
      return await runTransaction(db, async (transaction) => {
        const [surveySnapshot, lockSnapshot, lookupSnapshot] = await Promise.all([
          transaction.get(surveyRef),
          transaction.get(lockRef),
          transaction.get(lookupRef),
        ]);
        if (!surveySnapshot.exists() || surveySnapshot.data().ownerUid !== uid) {
          throw new Error('Survey not found, or you do not have permission to host it.');
        }
        if (!Number.isInteger(surveySnapshot.data().questionCount) || surveySnapshot.data().questionCount < 1) {
          throw new Error('Add and save at least one valid question before starting a live session.');
        }

        if (lockSnapshot.exists() && lockSnapshot.data().status === 'active') {
          const activeRef = doc(db, SESSIONS, lockSnapshot.data().sessionId);
          const activeSnapshot = await transaction.get(activeRef);
          if (activeSnapshot.exists()) {
            const active = activeSnapshot.data();
            if (active.ownerUid === uid && active.surveyId === surveyId && active.status === 'active') {
              return { id: activeSnapshot.id, ...active };
            }
          }
        }

        if (lookupSnapshot.exists()) throw collisionError();
        const surveyTitle = surveySnapshot.data().title;
        const timestamp = serverTimestamp();
        const sessionData = {
          surveyId,
          ownerUid: uid,
          surveyTitle,
          joinCode,
          status: 'active',
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        transaction.set(sessionRef, sessionData);
        transaction.set(lookupRef, {
          sessionId: sessionRef.id,
          surveyId,
          surveyTitle,
          status: 'active',
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        transaction.set(lockRef, {
          ownerUid: uid,
          surveyId,
          sessionId: sessionRef.id,
          status: 'active',
          updatedAt: timestamp,
        });
        return { id: sessionRef.id, ...sessionData };
      });
    } catch (error) {
      if (error.code === 'join-code-collision') continue;
      throw error;
    }
  }
  throw new Error('Could not reserve a unique join code. Please try again.');
}

export async function getHostSession(sessionId, uid) {
  requireDatabase();
  if (!uid) throw new Error('Sign in to view this host session.');
  const sessionRef = doc(db, SESSIONS, sessionId);
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);
    if (!snapshot.exists() || snapshot.data().ownerUid !== uid) {
      throw new Error('Session not found, or you do not have permission to manage it.');
    }
    const session = snapshot.data();
    const lookupRef = doc(db, LOOKUPS, session.joinCode);
    const lookupSnapshot = await transaction.get(lookupRef);
    if (lookupSnapshot.exists() && lookupSnapshot.data().sessionId !== sessionId) {
      throw new Error('The public join code points to a different session.');
    }
    if (!lookupSnapshot.exists() || !lookupSnapshot.data().surveyId) {
      transaction.set(lookupRef, {
        sessionId,
        surveyId: session.surveyId,
        surveyTitle: session.surveyTitle,
        status: session.status,
        createdAt: lookupSnapshot.exists() ? lookupSnapshot.data().createdAt : session.createdAt,
        updatedAt: serverTimestamp(),
      });
    }
    return { id: snapshot.id, ...session };
  });
}

export async function updateSessionStatus(sessionId, uid, status) {
  requireDatabase();
  if (!uid) throw new Error('Sign in to manage this session.');
  if (!['active', 'closed'].includes(status)) throw new Error('Session status is invalid.');
  const sessionRef = doc(db, SESSIONS, sessionId);

  return runTransaction(db, async (transaction) => {
    const sessionSnapshot = await transaction.get(sessionRef);
    if (!sessionSnapshot.exists() || sessionSnapshot.data().ownerUid !== uid) {
      throw new Error('Session not found, or you do not have permission to manage it.');
    }
    const current = sessionSnapshot.data();
    const lockRef = doc(db, LOCKS, current.surveyId);
    const lookupRef = doc(db, LOOKUPS, current.joinCode);
    const [surveySnapshot, lockSnapshot, lookupSnapshot] = await Promise.all([
      transaction.get(doc(db, 'surveys', current.surveyId)),
      transaction.get(lockRef),
      transaction.get(lookupRef),
    ]);
    if (!surveySnapshot.exists() || surveySnapshot.data().ownerUid !== uid) {
      throw new Error('The owning survey is unavailable.');
    }
    if (lookupSnapshot.exists() && lookupSnapshot.data().sessionId !== sessionId) {
      throw new Error('The public join code record points to a different session.');
    }
    if (lookupSnapshot.exists() && lookupSnapshot.data().surveyId && lookupSnapshot.data().surveyId !== current.surveyId) {
      throw new Error('The public join code points to a different survey. Refresh the page and try again.');
    }
    if (status === 'active' && lockSnapshot.exists()
      && lockSnapshot.data().status === 'active'
      && lockSnapshot.data().sessionId !== sessionId) {
      const otherSnapshot = await transaction.get(doc(db, SESSIONS, lockSnapshot.data().sessionId));
      if (otherSnapshot.exists() && otherSnapshot.data().status === 'active') {
        throw new Error('Another live session is already active for this survey. Close it before reopening this one.');
      }
    }

    const timestamp = serverTimestamp();
    transaction.update(sessionRef, { status, updatedAt: timestamp });
    // Repair older or missing lookup records from the authoritative session
    // while applying the status transition.
    transaction.set(lookupRef, {
      sessionId,
      surveyId: current.surveyId,
      surveyTitle: current.surveyTitle,
      status,
      createdAt: lookupSnapshot.exists() ? lookupSnapshot.data().createdAt : current.createdAt,
      updatedAt: timestamp,
    });
    transaction.set(lockRef, {
      ownerUid: uid,
      surveyId: current.surveyId,
      sessionId,
      status,
      updatedAt: timestamp,
    });
    // Return only after Firestore has committed all three synchronized writes.
    return { id: sessionId, ...current, status };
  });
}

export async function getPublicSessionByCode(inputCode) {
  requireDatabase();
  const code = String(inputCode || '').replace(/\s/g, '').toUpperCase();
  if (!/^[A-HJ-NP-Z2-9]{8}$/.test(code)) throw new Error('Enter a valid 8-character session code.');
  const snapshot = await getDoc(doc(db, LOOKUPS, code));
  if (!snapshot.exists()) throw new Error('No session was found for that code. Check it and try again.');
  const data = snapshot.data();
  let session = data;
  // Older lookup records may have only the public code and session ID. The
  // session is the canonical source for its survey reference; Firestore rules
  // permit this read only through the matching public lookup.
  if (!session.surveyId) {
    const sessionSnapshot = await getDoc(doc(db, SESSIONS, data.sessionId));
    if (!sessionSnapshot.exists()) throw new Error('This session is no longer available. Ask the host to reopen it.');
    session = sessionSnapshot.data();
  }
  if (!session.surveyId) throw new Error('This session has no saved survey reference. Ask the host to check the session setup.');
  return {
    code,
    sessionId: data.sessionId,
    surveyId: session.surveyId,
    surveyTitle: data.surveyTitle || session.surveyTitle,
    status: data.status || session.status,
  };
}

export async function ensureParticipantAuth() {
  requireDatabase();
  if (!auth) throw new Error('Firebase Authentication is not configured.');
  await auth.authStateReady();
  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
}

export async function getParticipantQuestions(surveyId) {
  requireDatabase();
  if (!surveyId) throw new Error('This session does not have participant questions available. Ask the host to reopen the session.');
  const result = await getDocs(query(collection(db, 'surveys', surveyId, 'questions'), orderBy('order')));
  return result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
}

export async function submitParticipantVote({ sessionId, question, participantUid, option, response }) {
  requireDatabase();
  if (!sessionId || !question?.id || !participantUid) throw new Error('Participant session is not ready.');
  const voteId = `${question.id}_${participantUid}`;
  const voteRef = doc(db, SESSIONS, sessionId, 'votes', voteId);
  const common = {
    questionId: question.id,
    participantUid,
    type: question.type,
    createdAt: serverTimestamp(),
  };
  const vote = question.type === 'multipleChoice'
    ? { ...common, option }
    : { ...common, response: String(response || '').trim() };
  await setDoc(voteRef, vote);
}
