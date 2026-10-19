import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronRight, Loader2, Radio, Send } from 'lucide-react';
import Logo from '../components/common/Logo';
import {
  ensureParticipantAuth,
  getParticipantQuestions,
  getPublicSessionByCode,
  submitParticipantVote,
  subscribePublicLookup,
} from '../lib/sessions';
import { logFirestorePermissionFailure } from '../lib/firebase';

function getJoinErrorMessage(error, stage) {
  if (error?.code === 'auth/admin-restricted-operation' || error?.code === 'auth/operation-not-allowed') {
    return 'Anonymous participant sign-in is disabled for this Firebase project. The host needs to enable Anonymous in Firebase Console under Authentication → Sign-in method.';
  }
  if (stage === 'anonymous authentication' && error?.code === 'auth/network-request-failed') {
    return 'Could not reach Firebase Authentication. Check your internet connection and try joining again.';
  }
  return error?.message || 'Could not load this session. Please try again.';
}

export default function ParticipantSessionPage() {
  const { code } = useParams();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [participantUid, setParticipantUid] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [saving, setSaving] = useState({});
  const [questionErrors, setQuestionErrors] = useState({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let stopLookup;
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
        stopLookup = subscribePublicLookup(code, (next) => {
          if (!active) return;
          setSession((current) => ({ ...current, ...next }));
        }, () => {});
        if (value.status === 'active' && value.surveyId) {
          stage = 'survey question list';
          const items = await getParticipantQuestions(value.surveyId);
          if (!active) return;
          setQuestions(items);
          stage = 'anonymous authentication';
          try {
            const participant = await ensureParticipantAuth();
            if (!active) return;
            setParticipantUid(participant.uid);
          } catch (authError) {
            if (authError?.code === 'auth/admin-restricted-operation' || authError?.code === 'auth/operation-not-allowed') {
              // Questions can still be shown; submitting will repeat this instruction.
            } else {
              throw authError;
            }
          }
        }
      } catch (loadError) {
        logFirestorePermissionFailure(stage, [
          stage === 'session lookup' ? 'sessionLookups/{joinCode} (get)' : 'surveys/{surveyId}/questions (list)',
        ], loadError);
        if (active) setError(getJoinErrorMessage(loadError, stage));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; stopLookup?.(); };
  }, [code]);

  const question = questions[index];
  const closed = session && session.status !== 'active';

  const setAnswer = (questionId, value) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setQuestionErrors((current) => ({ ...current, [questionId]: '' }));
  };

  const submitAnswer = async (currentQuestion) => {
    if (saving[currentQuestion.id] || submitted[currentQuestion.id] || closed) return;
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multipleChoice' && !answer) {
      setQuestionErrors((current) => ({ ...current, [currentQuestion.id]: 'Choose one option before submitting.' }));
      return;
    }
    const response = String(answer || '').trim();
    if (currentQuestion.type === 'wordCloud' && !response) {
      setQuestionErrors((current) => ({ ...current, [currentQuestion.id]: 'Enter a response before submitting.' }));
      return;
    }
    if (currentQuestion.type === 'wordCloud' && response.length > currentQuestion.maxLength) {
      setQuestionErrors((current) => ({ ...current, [currentQuestion.id]: `Keep your response to ${currentQuestion.maxLength} characters or fewer.` }));
      return;
    }

    setSaving((current) => ({ ...current, [currentQuestion.id]: true }));
    setQuestionErrors((current) => ({ ...current, [currentQuestion.id]: '' }));
    let stage = 'anonymous authentication';
    try {
      const participant = participantUid
        ? { uid: participantUid }
        : await ensureParticipantAuth();
      if (!participantUid) setParticipantUid(participant.uid);
      const option = currentQuestion.type === 'multipleChoice'
        ? currentQuestion.options.find((item) => item.id === answer)
        : undefined;
      stage = 'vote write';
      await submitParticipantVote({
        sessionId: session.sessionId,
        question: currentQuestion,
        participantUid: participant.uid,
        option,
        response,
      });
      setSubmitted((current) => {
        const next = { ...current, [currentQuestion.id]: true };
        try { localStorage.setItem(`askly-votes-${session.sessionId}-${participant.uid}`, JSON.stringify(next)); } catch { /* Firestore still enforces uniqueness. */ }
        return next;
      });
    } catch (submitError) {
      if (submitError?.code === 'auth/admin-restricted-operation' || submitError?.code === 'auth/operation-not-allowed') {
        setQuestionErrors((current) => ({ ...current, [currentQuestion.id]: getJoinErrorMessage(submitError, 'anonymous authentication') }));
      } else {
        const message = submitError.code === 'permission-denied'
          ? 'This response was already submitted, or the session has closed.'
          : submitError.message || 'Could not submit your response. Please try again.';
        setQuestionErrors((current) => ({ ...current, [currentQuestion.id]: message }));
      }
    } finally {
      setSaving((current) => ({ ...current, [currentQuestion.id]: false }));
    }
  };

  useEffect(() => {
    if (!session?.sessionId || !participantUid) return;
    try {
      setSubmitted(JSON.parse(localStorage.getItem(`askly-votes-${session.sessionId}-${participantUid}`) || '{}'));
    } catch {
      setSubmitted({});
    }
  }, [session?.sessionId, participantUid]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border bg-white px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Logo size="sm" />
          {session && <span className="font-mono text-xs tracking-widest text-muted">{session.code}</span>}
        </div>
      </header>
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto w-full max-w-lg">
          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white p-10 text-sm text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />Joining session…
            </div>
          ) : error ? (
            <section className="rounded-2xl border border-border bg-white p-8 text-center shadow-soft">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600"><AlertCircle /></div>
              <h1 className="mt-4 text-xl font-bold text-primary">Could not join</h1>
              <p role="alert" className="mt-2 text-sm text-muted">{error}</p>
              <Link to="/join" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Enter another code</Link>
            </section>
          ) : (
            <>
              <section className="mb-4 rounded-2xl border border-border bg-white p-5 shadow-soft">
                <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${closed ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-success'}`}>
                  <span className={`h-2 w-2 rounded-full ${closed ? 'bg-slate-400' : 'bg-live'}`} />
                  {closed ? 'Session ended' : 'Live'}
                </p>
                <h1 className="mt-3 text-2xl font-bold text-primary">{session.surveyTitle}</h1>
                <p className="mt-2 text-sm text-muted">
                  {closed
                    ? 'The host has ended this session. New responses are not accepted.'
                    : 'No account needed. Submit one answer per question.'}
                </p>
              </section>

              {closed ? null : questions.length === 0 ? (
                <section className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted">
                  <Radio className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-3">There are no questions in this survey yet.</p>
                </section>
              ) : question ? (
                <section className="rounded-2xl border border-border bg-white p-5 shadow-soft sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Question {index + 1} of {questions.length} · {question.type === 'wordCloud' ? 'Word Cloud' : 'Multiple Choice'}
                  </p>
                  <h2 className="mt-2 text-lg font-bold leading-snug text-primary">{question.text}</h2>
                  {question.type === 'multipleChoice' ? (
                    <fieldset className="mt-5 space-y-2" disabled={Boolean(submitted[question.id]) || Boolean(saving[question.id])}>
                      <legend className="sr-only">Choose one answer</legend>
                      {(question.options || []).map((option) => (
                        <label key={option.id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${answers[question.id] === option.id ? 'border-primary bg-primary-soft' : 'border-border'}`}>
                          <input type="radio" name={`question-${question.id}`} value={option.id} checked={answers[question.id] === option.id} onChange={() => setAnswer(question.id, option.id)} className="accent-[var(--color-primary)]" />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </fieldset>
                  ) : (
                    <div className="mt-5">
                      <label htmlFor={`answer-${question.id}`} className="sr-only">Your response</label>
                      <textarea
                        id={`answer-${question.id}`}
                        value={answers[question.id] || ''}
                        onChange={(event) => setAnswer(question.id, event.target.value)}
                        maxLength={question.maxLength}
                        disabled={Boolean(submitted[question.id]) || Boolean(saving[question.id])}
                        rows={3}
                        placeholder="Type a short response"
                        className="w-full rounded-xl border border-border px-4 py-3 text-base disabled:bg-slate-50"
                      />
                      <p className="mt-1 text-right text-xs text-muted">{(answers[question.id] || '').length}/{question.maxLength}</p>
                    </div>
                  )}
                  {questionErrors[question.id] && <p role="alert" className="mt-3 text-sm text-red-700">{questionErrors[question.id]}</p>}
                  {submitted[question.id] ? (
                    <div className="mt-5">
                      <p className="inline-flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" />Response submitted</p>
                      <p className="mt-2 text-sm text-muted">The host can see live totals. Vote results stay on the host screen.</p>
                      {index < questions.length - 1 && (
                        <button type="button" onClick={() => setIndex(index + 1)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white">
                          Next question <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button type="button" onClick={() => submitAnswer(question)} disabled={Boolean(saving[question.id])} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white disabled:opacity-60">
                      {saving[question.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {saving[question.id] ? 'Submitting…' : 'Submit response'}
                    </button>
                  )}
                  {questions.length > 1 && (
                    <div className="mt-5 flex justify-between text-xs font-semibold text-muted">
                      <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)} className="disabled:opacity-30">Previous</button>
                      <span>{index + 1}/{questions.length}</span>
                      <button type="button" disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)} className="disabled:opacity-30">Skip</button>
                    </div>
                  )}
                </section>
              ) : null}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
