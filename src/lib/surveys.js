import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

const SURVEYS = 'surveys';
const MAX_QUESTIONS = 200;

function validateSurveyInput({ title, description, questions }) {
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) {
    throw new Error('Survey title is required and must be 120 characters or fewer.');
  }
  if (typeof description !== 'string' || description.length > 500) {
    throw new Error('Survey description must be 500 characters or fewer.');
  }
  if (!Array.isArray(questions) || questions.length > MAX_QUESTIONS) {
    throw new Error(`A survey can have at most ${MAX_QUESTIONS} questions.`);
  }
  questions.forEach((question, index) => {
    if (!question.id || typeof question.text !== 'string' || !question.text.trim() || question.text.trim().length > 300) {
      throw new Error(`Question ${index + 1} needs text of 1 to 300 characters.`);
    }
    if (question.type === 'wordCloud') {
      if (!Number.isInteger(Number(question.maxLength)) || Number(question.maxLength) < 1 || Number(question.maxLength) > 280) {
        throw new Error(`Question ${index + 1} response length must be between 1 and 280 characters.`);
      }
      return;
    }
    if (question.type !== 'multipleChoice') throw new Error(`Question ${index + 1} has an unsupported type.`);
    const options = question.options || [];
    const labels = options.map((option) => typeof option.label === 'string' ? option.label.trim() : '');
    if (options.length < 2 || options.length > 20 || labels.some((label) => !label || label.length > 120)) {
      throw new Error(`Question ${index + 1} needs 2 to 20 valid answer options.`);
    }
    if (new Set(labels.map((label) => label.toLocaleLowerCase())).size !== labels.length) {
      throw new Error(`Question ${index + 1} has duplicate answer options.`);
    }
  });
}

function requireDatabase() {
  if (!db) {
    throw new Error('Firestore is not configured. Add the Firebase web app values to .env.local and enable Cloud Firestore in Firebase Console.');
  }
}

function questionsRef(surveyId) {
  return collection(db, SURVEYS, surveyId, 'questions');
}

function toQuestionData(question, index) {
  const common = {
    id: question.id,
    type: question.type,
    text: question.text.trim(),
    order: index,
  };
  if (question.type === 'wordCloud') return { ...common, maxLength: question.maxLength };
  return { ...common, options: question.options.map((option) => ({ ...option, label: option.label.trim() })) };
}

function saveSurveyQuestions(batch, surveyId, questions, existing = []) {
  const nextIds = new Set(questions.map((question) => question.id));
  existing.forEach((questionDoc) => {
    if (!nextIds.has(questionDoc.id)) batch.delete(questionDoc.ref);
  });
  questions.forEach((question, index) => {
    batch.set(doc(db, SURVEYS, surveyId, 'questions', question.id), toQuestionData(question, index));
  });
}

export async function listUserSurveys(uid) {
  requireDatabase();
  if (!uid) throw new Error('Sign in to view your surveys.');
  const result = await getDocs(query(collection(db, SURVEYS), where('ownerUid', '==', uid)));
  return result.docs
    .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }))
    .sort((a, b) => (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0));
}

export async function getSurvey(surveyId, uid) {
  requireDatabase();
  if (!uid) throw new Error('Sign in to view this survey.');
  const snapshot = await getDoc(doc(db, SURVEYS, surveyId));
  if (!snapshot.exists() || snapshot.data().ownerUid !== uid) {
    throw new Error('Survey not found, or you do not have permission to edit it.');
  }
  const questionSnapshots = await getDocs(questionsRef(surveyId));
  const questions = questionSnapshots.docs
    .map((questionDoc) => ({ id: questionDoc.id, ...questionDoc.data() }))
    .sort((a, b) => a.order - b.order);
  return { id: snapshot.id, ...snapshot.data(), questions };
}

export async function saveSurvey({ id, uid, title, description, status, questions }) {
  requireDatabase();
  if (!uid) throw new Error('Sign in to save a survey.');
  if (!['draft', 'published'].includes(status)) throw new Error('Survey status is invalid.');
  validateSurveyInput({ title, description, questions });

  const surveyRef = id ? doc(db, SURVEYS, id) : doc(collection(db, SURVEYS));
  const batch = writeBatch(db);
  let existingQuestions = [];
  if (id) {
    const existing = await getDoc(surveyRef);
    if (!existing.exists() || existing.data().ownerUid !== uid) {
      throw new Error('Survey not found, or you do not have permission to edit it.');
    }
    existingQuestions = (await getDocs(questionsRef(id))).docs;
  }
  batch.set(surveyRef, {
    title: title.trim(),
    description: description.trim(),
    ownerUid: uid,
    status,
    questionCount: questions.length,
    questionSearch: questions.map((question) => question.text.trim()).join(' '),
    updatedAt: serverTimestamp(),
    ...(id ? {} : { createdAt: serverTimestamp() }),
  }, { merge: Boolean(id) });
  saveSurveyQuestions(batch, surveyRef.id, questions, existingQuestions);
  await batch.commit();
  return surveyRef.id;
}

export async function duplicateSurvey(surveyId, uid) {
  const survey = await getSurvey(surveyId, uid);
  const questions = (survey.questions || []).map((question, index) => {
    const id = globalThis.crypto?.randomUUID?.() || `question-${Date.now()}-${index}`;
    if (question.type === 'multipleChoice') {
      return {
        id,
        type: 'multipleChoice',
        text: question.text,
        options: (question.options || []).map((option, optionIndex) => ({
          id: globalThis.crypto?.randomUUID?.() || `${id}-option-${optionIndex + 1}`,
          label: option.label,
        })),
      };
    }
    return {
      id,
      type: 'wordCloud',
      text: question.text,
      maxLength: Number.isInteger(question.maxLength) ? question.maxLength : 25,
    };
  });
  const copyTitle = `${survey.title} (copy)`.slice(0, 120);
  return saveSurvey({
    uid,
    title: copyTitle,
    description: typeof survey.description === 'string' ? survey.description : '',
    status: 'draft',
    questions,
  });
}

export const SURVEY_TEMPLATES = [
  {
    id: 'lecture-check',
    title: 'Lecture check-in',
    category: 'Education',
    description: 'A short mid-class pulse on clarity and remaining questions.',
    questions: [
      { type: 'multipleChoice', text: 'How clear was today’s main concept?', options: ['Very clear', 'Mostly clear', 'A bit foggy', 'I need a recap'] },
      { type: 'wordCloud', text: 'What should we review before next class?', maxLength: 40 },
    ],
  },
  {
    id: 'session-icebreaker',
    title: 'Session icebreaker',
    category: 'Events',
    description: 'Warm up a room in under a minute before the main talk.',
    questions: [
      { type: 'wordCloud', text: 'In one word, what brought you here today?', maxLength: 24 },
      { type: 'multipleChoice', text: 'How are you feeling about this session?', options: ['Ready to go', 'Curious', 'Cautiously optimistic', 'Need coffee first'] },
    ],
  },
  {
    id: 'team-retro',
    title: 'Team retrospective',
    category: 'Workplace',
    description: 'Anonymous sentiment on what helped and what blocked the last sprint.',
    questions: [
      { type: 'multipleChoice', text: 'How did this sprint feel overall?', options: ['Smooth', 'Uneven', 'Stretched', 'Blocked'] },
      { type: 'wordCloud', text: 'What should we keep doing?', maxLength: 40 },
      { type: 'wordCloud', text: 'What slowed us down?', maxLength: 40 },
    ],
  },
];

export async function createSurveyFromTemplate(templateId, uid) {
  const template = SURVEY_TEMPLATES.find((item) => item.id === templateId);
  if (!template) throw new Error('That template is no longer available.');
  const questions = template.questions.map((question, index) => {
    const id = globalThis.crypto?.randomUUID?.() || `question-${Date.now()}-${index}`;
    if (question.type === 'multipleChoice') {
      return {
        id,
        type: 'multipleChoice',
        text: question.text,
        options: question.options.map((label, optionIndex) => ({
          id: `${id}-option-${optionIndex + 1}`,
          label,
        })),
      };
    }
    return { id, type: 'wordCloud', text: question.text, maxLength: question.maxLength };
  });
  return saveSurvey({
    uid,
    title: template.title,
    description: template.description,
    status: 'draft',
    questions,
  });
}

export async function deleteSurvey(surveyId, uid) {
  requireDatabase();
  if (!uid) throw new Error('Sign in to delete a survey.');
  const surveyRef = doc(db, SURVEYS, surveyId);
  const survey = await getDoc(surveyRef);
  if (!survey.exists() || survey.data().ownerUid !== uid) {
    throw new Error('Survey not found, or you do not have permission to delete it.');
  }
  const sessionLock = await getDoc(doc(db, 'surveySessionLocks', surveyId));
  if (sessionLock.exists() && sessionLock.data().status === 'active') {
    throw new Error('Close the live session before deleting this survey.');
  }
  const batch = writeBatch(db);
  const questions = await getDocs(questionsRef(surveyId));
  questions.docs.forEach((question) => batch.delete(question.ref));
  batch.delete(surveyRef);
  await batch.commit();
}
