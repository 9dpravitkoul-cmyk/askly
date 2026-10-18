import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, Radio, Send } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Logo from '../components/common/Logo';
import {
  ensureParticipantAuth,
  getParticipantQuestions,
  getPublicSessionByCode,
  submitParticipantVote,
} from '../lib/sessions';
import { logFirestorePermissionFailure } from '../lib/firebase';

export default function ParticipantSessionPage() {
  const { code } = useParams();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [participantUid, setParticipantUid] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [saving, setSaving] = useState({});
  const [questionErrors, setQuestionErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      setQuestions([]);
      setSession(null);
      let stage = 'session lookup';
      try {
        const value = await getPublicSessionByCode(code);
        if (!active) return;
        setSession(value);
        if (value.status === 'active') {
          stage = 'anonymous authentication';
          const participant = await ensureParticipantAuth();
          if (!active) return;
          setParticipantUid(participant.uid);
          stage = 'survey question list';
          const items = await getParticipantQuestions(value.surveyId);
          if (!active) return;
          setQuestions(items);
          const key = `askly-votes-${value.sessionId}-${participant.uid}`;
          try { setSubmitted(JSON.parse(localStorage.getItem(key) || '{}')); } catch { setSubmitted({}); }
        }
      } catch (loadError) {
        logFirestorePermissionFailure(stage, [
          stage === 'session lookup' ? 'sessionLookups/{joinCode} (get)' :
            stage === 'survey question list' ? 'surveys/{surveyId}/questions (list)' :
              'Firebase Authentication anonymous sign-in',
        ], loadError);
        if (active) setError(loadError.message || 'Could not load this session.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [code]);

  const setAnswer = (questionId, value) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setQuestionErrors((current) => ({ ...current, [questionId]: '' }));
  };

  const submitAnswer = async (question) => {
    const answer = answers[question.id];
    if (question.type === 'multipleChoice' && !answer) {
      setQuestionErrors((current) => ({ ...current, [question.id]: 'Choose one option before submitting.' }));
      return;
    }
    const response = String(answer || '').trim();
    if (question.type === 'wordCloud' && !response) {
      setQuestionErrors((current) => ({ ...current, [question.id]: 'Enter a response before submitting.' }));
      return;
    }
    if (question.type === 'wordCloud' && response.length > question.maxLength) {
      setQuestionErrors((current) => ({ ...current, [question.id]: `Keep your response to ${question.maxLength} characters or fewer.` }));
      return;
    }

    setSaving((current) => ({ ...current, [question.id]: true }));
    setQuestionErrors((current) => ({ ...current, [question.id]: '' }));
    try {
      const option = question.type === 'multipleChoice'
        ? question.options.find((item) => item.id === answer)
        : undefined;
      await submitParticipantVote({
        sessionId: session.sessionId,
        question,
        participantUid,
        option,
        response,
      });
      setSubmitted((current) => {
        const next = { ...current, [question.id]: true };
        try { localStorage.setItem(`askly-votes-${session.sessionId}-${participantUid}`, JSON.stringify(next)); } catch { /* UI cache is optional; Firestore rules enforce the vote. */ }
        return next;
      });
    } catch (submitError) {
      const message = submitError.code === 'permission-denied'
        ? 'This response was already submitted, or the session has closed. Refresh the page to check the session.'
        : submitError.message || 'Could not submit your response. Please try again.';
      setQuestionErrors((current) => ({ ...current, [question.id]: message }));
    } finally {
      setSaving((current) => ({ ...current, [question.id]: false }));
    }
  };

  return <div className="min-h-screen flex flex-col bg-brand-light-gray"><Navbar /><main className="flex-1 px-4 py-10 sm:py-16"><div className="mx-auto w-full max-w-3xl">
    <div className="flex justify-center mb-6"><Logo size="lg" /></div>
    {loading ? <div className="bg-white rounded-2xl border border-brand-border-gray p-10 text-sm text-brand-text-secondary flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Loading session…</div> : error ? <section className="bg-white rounded-2xl border border-brand-border-gray shadow-sm p-7 sm:p-10 text-center"><div className="mx-auto w-12 h-12 rounded-2xl bg-red-50 text-red-600 grid place-items-center"><AlertCircle /></div><h1 className="mt-4 text-xl font-bold text-brand-navy">Could not join this session</h1><p role="alert" className="mt-2 text-sm text-brand-text-secondary">{error}</p><Link to="/join" className="inline-flex mt-6 px-4 py-2 rounded-lg bg-brand-navy text-white text-sm font-semibold">Enter another code</Link></section> : <>
      <section className="bg-white rounded-2xl border border-brand-border-gray shadow-sm p-6 sm:p-8 mb-5"><div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${session.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}><span className={`w-2 h-2 rounded-full ${session.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />{session.status === 'active' ? 'Live session' : 'Session closed'}</div><h1 className="mt-3 text-2xl sm:text-3xl font-bold text-brand-navy">{session.surveyTitle}</h1><p className="mt-2 text-sm text-brand-text-secondary">{session.status === 'active' ? 'Answer each question below. You can submit one response per question.' : 'The host has closed this session. Responses are no longer being accepted.'}</p><p className="mt-4 font-mono tracking-widest text-brand-text-secondary">Join code: {session.code}</p></section>
      {session.status === 'active' && (questions.length ? <div className="space-y-4">{questions.map((question, index) => <section key={question.id} className="bg-white rounded-2xl border border-brand-border-gray shadow-sm p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">Question {index + 1} of {questions.length} · {question.type === 'wordCloud' ? 'Word Cloud' : 'Multiple Choice'}</p><h2 className="mt-2 text-lg font-bold text-brand-navy">{question.text}</h2>
        {question.type === 'multipleChoice' ? <fieldset className="mt-5 space-y-2" disabled={Boolean(submitted[question.id]) || Boolean(saving[question.id])}><legend className="sr-only">Choose one answer</legend>{(question.options || []).map((option) => <label key={option.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer ${answers[question.id] === option.id ? 'border-brand-navy bg-brand-light-blue/40' : 'border-brand-border-gray hover:bg-brand-light-gray'}`}><input type="radio" name={`question-${question.id}`} value={option.id} checked={answers[question.id] === option.id} onChange={() => setAnswer(question.id, option.id)} className="accent-brand-navy" /><span>{option.label}</span></label>)}</fieldset> : <div className="mt-5"><label htmlFor={`answer-${question.id}`} className="sr-only">Your response</label><textarea id={`answer-${question.id}`} value={answers[question.id] || ''} onChange={(event) => setAnswer(question.id, event.target.value)} maxLength={question.maxLength} disabled={Boolean(submitted[question.id]) || Boolean(saving[question.id])} rows={3} placeholder="Type your response" className="w-full rounded-xl border border-brand-border-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy disabled:bg-slate-50"/><p className="mt-1 text-right text-xs text-brand-text-secondary">{(answers[question.id] || '').length}/{question.maxLength}</p></div>}
        {questionErrors[question.id] && <p role="alert" className="mt-3 text-sm text-red-700">{questionErrors[question.id]}</p>}
        {submitted[question.id] ? <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="w-4 h-4" />Response submitted</p> : <button onClick={() => submitAnswer(question)} disabled={Boolean(saving[question.id])} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving[question.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{saving[question.id] ? 'Submitting…' : 'Submit response'}</button>}
      </section>)}</div> : <section className="rounded-2xl border border-brand-border-gray bg-white p-8 text-center text-sm text-brand-text-secondary"><Radio className="mx-auto h-6 w-6 text-brand-navy" /><p className="mt-3">There are no questions in this survey yet.</p></section>)}
    </>}
  </div></main><Footer /></div>;
}
