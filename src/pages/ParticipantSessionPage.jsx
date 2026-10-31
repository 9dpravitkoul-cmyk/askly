import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Radio,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';
import {
  ensureParticipantAuth,
  getParticipantQuestions,
  getPublicSessionByCode,
  submitParticipantVote,
  subscribePublicLookup,
} from '../lib/sessions';
import { logFirestorePermissionFailure } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

function getJoinErrorMessage(error, stage) {
  if (error?.code === 'auth/admin-restricted-operation' || error?.code === 'auth/operation-not-allowed') {
    return 'Anonymous participant sign-in is disabled in this Firebase project. Ask the presenter to enable Anonymous Authentication in the Firebase Console.';
  }
  if (stage === 'anonymous authentication' && error?.code === 'auth/network-request-failed') {
    return 'Could not reach Firebase Authentication. Check your network connection and retry.';
  }
  return error?.message || 'Could not load this session. Please verify the code and try again.';
}

export default function ParticipantSessionPage() {
  const { code } = useParams();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [participantUid, setParticipantUid] = useState('');
  const [participantName, setParticipantName] = useState(() => {
    return localStorage.getItem('askly-participant-name') || '';
  });
  const [nameEditing, setNameEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');

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

        stopLookup = subscribePublicLookup(
          code,
          (next) => {
            if (!active) return;
            setSession((current) => ({ ...current, ...next }));
          },
          () => {}
        );

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
            if (participant.displayName && !participantName) {
              setParticipantName(participant.displayName);
            }
          } catch (authError) {
            if (
              authError?.code === 'auth/admin-restricted-operation' ||
              authError?.code === 'auth/operation-not-allowed'
            ) {
              // Questions can still be displayed
            } else {
              throw authError;
            }
          }
        }
      } catch (loadError) {
        logFirestorePermissionFailure(
          stage,
          [stage === 'session lookup' ? 'sessionLookups/{joinCode} (get)' : 'surveys/{surveyId}/questions (list)'],
          loadError
        );
        if (active) setError(getJoinErrorMessage(loadError, stage));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
      stopLookup?.();
    };
  }, [code]);

  const question = questions[index];
  const closed = session && session.status !== 'active';

  const setAnswer = (questionId, value) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setQuestionErrors((current) => ({ ...current, [questionId]: '' }));
  };

  const handleSaveName = async (e) => {
    e?.preventDefault();
    const clean = nameInput.trim();
    if (!clean) return;
    setParticipantName(clean);
    localStorage.setItem('askly-participant-name', clean);
    setNameEditing(false);
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: clean });
      } catch {
        // Safe fallback
      }
    }
  };

  const submitAnswer = async (currentQuestion) => {
    if (saving[currentQuestion.id] || submitted[currentQuestion.id] || closed) return;
    const answer = answers[currentQuestion.id];

    if (currentQuestion.type === 'multipleChoice' && !answer) {
      setQuestionErrors((current) => ({
        ...current,
        [currentQuestion.id]: 'Please tap an option before submitting.',
      }));
      return;
    }
    const response = String(answer || '').trim();
    if (currentQuestion.type === 'wordCloud' && !response) {
      setQuestionErrors((current) => ({
        ...current,
        [currentQuestion.id]: 'Type a word or phrase before submitting.',
      }));
      return;
    }
    if (currentQuestion.type === 'wordCloud' && response.length > currentQuestion.maxLength) {
      setQuestionErrors((current) => ({
        ...current,
        [currentQuestion.id]: `Please keep your response to ${currentQuestion.maxLength} characters.`,
      }));
      return;
    }

    setSaving((current) => ({ ...current, [currentQuestion.id]: true }));
    setQuestionErrors((current) => ({ ...current, [currentQuestion.id]: '' }));

    try {
      const participant = participantUid
        ? { uid: participantUid }
        : await ensureParticipantAuth();
      if (!participantUid) setParticipantUid(participant.uid);

      const option =
        currentQuestion.type === 'multipleChoice'
          ? currentQuestion.options.find((item) => item.id === answer)
          : undefined;

      await submitParticipantVote({
        sessionId: session.sessionId,
        question: currentQuestion,
        participantUid: participant.uid,
        option,
        response,
      });

      setSubmitted((current) => {
        const next = { ...current, [currentQuestion.id]: true };
        try {
          localStorage.setItem(`askly-votes-${session.sessionId}-${participant.uid}`, JSON.stringify(next));
        } catch {
          // LocalStorage fallback
        }
        return next;
      });
    } catch (submitError) {
      if (
        submitError?.code === 'auth/admin-restricted-operation' ||
        submitError?.code === 'auth/operation-not-allowed'
      ) {
        setQuestionErrors((current) => ({
          ...current,
          [currentQuestion.id]: getJoinErrorMessage(submitError, 'anonymous authentication'),
        }));
      } else {
        const message =
          submitError.code === 'permission-denied'
            ? 'This response was already recorded, or the session has ended.'
            : submitError.message || 'Could not submit your vote. Please try again.';
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

  const progressPercent = questions.length ? Math.round(((index + 1) / questions.length) * 100) : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-text transition-colors duration-200">
      {/* Participant Top Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2.5">
            {session && (
              <span className="font-mono text-xs font-bold tracking-widest text-primary bg-primary-soft px-2.5 py-1 rounded-lg">
                #{session.code}
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 sm:py-8">
        <div className="mx-auto w-full max-w-lg space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-12 text-center shadow-soft">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm font-semibold text-text">Connecting to Live Room…</p>
              <p className="text-xs text-muted">Securing real-time connection</p>
            </div>
          ) : error ? (
            <section className="rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-text">Session Unavailable</h1>
              <p role="alert" className="mt-2 text-sm text-muted">
                {error}
              </p>
              <Link
                to="/join"
                className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-primary-hover active:scale-95 transition-all"
              >
                Enter Another Code
              </Link>
            </section>
          ) : (
            <>
              {/* Session Overview Card */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      closed
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        closed ? 'bg-slate-400' : 'bg-live animate-pulse'
                      }`}
                    />
                    {closed ? 'Session Ended' : 'Live Audience Session'}
                  </span>

                  {/* Nickname button / indicator */}
                  {nameEditing ? (
                    <form onSubmit={handleSaveName} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Your nickname"
                        maxLength={20}
                        autoFocus
                        className="h-7 w-28 rounded-lg border border-border bg-surface-secondary px-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-primary px-2 py-1 text-[11px] font-bold text-white"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setNameInput(participantName);
                        setNameEditing(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-primary transition-colors"
                      title="Edit your display name"
                    >
                      <User className="h-3 w-3" />
                      <span>{participantName ? participantName : 'Set Nickname'}</span>
                    </button>
                  )}
                </div>

                <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-text">
                  {session.surveyTitle}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted">
                  {closed
                    ? 'The presenter has concluded this live session.'
                    : 'Your anonymous responses are updated live on the host screen.'}
                </p>

                {/* Progress bar */}
                {questions.length > 1 && !closed && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex justify-between text-[11px] font-semibold text-muted mb-1.5">
                      <span>Question {index + 1} of {questions.length}</span>
                      <span>{progressPercent}% Complete</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>

              {closed ? (
                <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted shadow-soft">
                  <p className="font-semibold text-text">Voting is currently closed</p>
                  <p className="mt-1 text-xs">Thanks for taking part in this session!</p>
                </div>
              ) : questions.length === 0 ? (
                <section className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted shadow-soft">
                  <Radio className="mx-auto h-6 w-6 text-primary mb-2" />
                  <p>No questions active in this survey yet.</p>
                </section>
              ) : question ? (
                <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7 shadow-soft space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      {question.type === 'wordCloud' ? 'Word Cloud' : 'Multiple Choice'}
                    </span>
                    <span className="text-xs font-semibold text-muted">
                      {index + 1} / {questions.length}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold leading-snug text-text">
                    {question.text}
                  </h2>

                  {/* Question Inputs */}
                  {question.type === 'multipleChoice' ? (
                    <fieldset
                      className="space-y-2.5"
                      disabled={Boolean(submitted[question.id]) || Boolean(saving[question.id])}
                    >
                      <legend className="sr-only">Choose an option</legend>
                      {(question.options || []).map((option) => {
                        const isSelected = answers[question.id] === option.id;
                        return (
                          <label
                            key={option.id}
                            className={`flex min-h-14 cursor-pointer items-center justify-between rounded-xl border p-4 text-sm font-medium transition-all active:scale-[0.99] ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-xs'
                                : 'border-border bg-surface-secondary/40 text-text hover:border-border hover:bg-surface-secondary/70'
                            }`}
                          >
                            <span className="break-words pr-2">{option.label}</span>
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.id}
                              checked={isSelected}
                              onChange={() => setAnswer(question.id, option.id)}
                              className="h-4 w-4 accent-[var(--color-primary)] shrink-0"
                            />
                          </label>
                        );
                      })}
                    </fieldset>
                  ) : (
                    <div>
                      <label htmlFor={`answer-${question.id}`} className="sr-only">
                        Your short phrase
                      </label>
                      <textarea
                        id={`answer-${question.id}`}
                        value={answers[question.id] || ''}
                        onChange={(e) => setAnswer(question.id, e.target.value)}
                        maxLength={question.maxLength}
                        disabled={Boolean(submitted[question.id]) || Boolean(saving[question.id])}
                        rows={3}
                        placeholder="Type your response here..."
                        className="w-full rounded-xl border border-border bg-surface-secondary/50 px-4 py-3 text-base text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <div className="mt-1.5 flex justify-end text-xs text-muted">
                        <span>
                          {(answers[question.id] || '').length}/{question.maxLength} characters
                        </span>
                      </div>
                    </div>
                  )}

                  {questionErrors[question.id] && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                    >
                      {questionErrors[question.id]}
                    </p>
                  )}

                  {/* Submission State Button / Confirmation */}
                  {submitted[question.id] ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Response recorded!</span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        Your answer is live on the presenter's screen.
                      </p>

                      {index < questions.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setIndex(index + 1)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-soft hover:bg-primary-hover active:scale-95 transition-all"
                        >
                          <span>Proceed to Next Question</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => submitAnswer(question)}
                      disabled={Boolean(saving[question.id])}
                      className="flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-soft hover:bg-primary-hover active:scale-[0.99] transition-all disabled:opacity-60"
                    >
                      {saving[question.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>{saving[question.id] ? 'Submitting…' : 'Submit Response'}</span>
                    </button>
                  )}

                  {/* Multi-Question Nav Footer */}
                  {questions.length > 1 && (
                    <div className="flex items-center justify-between pt-3 border-t border-border text-xs font-semibold text-muted">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => setIndex(index - 1)}
                        className="inline-flex items-center gap-1 hover:text-text disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </button>
                      <span>
                        {index + 1} of {questions.length}
                      </span>
                      <button
                        type="button"
                        disabled={index === questions.length - 1}
                        onClick={() => setIndex(index + 1)}
                        className="inline-flex items-center gap-1 hover:text-text disabled:opacity-30 transition-colors"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
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
