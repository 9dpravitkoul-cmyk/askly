import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Download,
  Loader2,
  Printer,
  Radio,
  Users,
} from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';
import QuestionResults, { validVote } from '../components/results/QuestionResults';
import { StatusBadge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { getHostSession, subscribeHostSession, subscribeSessionVotes, uniqueParticipantCount } from '../lib/sessions';

export default function SessionResultsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let stopSession;
    let stopVotes;

    async function load() {
      setLoading(true);
      setError('');
      setVotes([]);
      setQuestions([]);
      setQuestionIndex(0);

      try {
        const hostSession = await getHostSession(id, user?.uid);
        if (!active) return;
        setSession(hostSession);

        const result = await getDocs(
          query(collection(db, 'surveys', hostSession.surveyId, 'questions'), orderBy('order'))
        );
        if (!active) return;
        setQuestions(result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() })));

        stopSession = subscribeHostSession(
          id,
          user?.uid,
          (next) => setSession(next),
          (listenError) => {
            if (active) setError(listenError.message || 'Could not receive session updates.');
          }
        );

        stopVotes = subscribeSessionVotes(
          id,
          (nextVotes) => {
            if (!active) return;
            setVotes(nextVotes);
            setError('');
          },
          (listenError) => {
            if (!active) return;
            setError(
              listenError.code === 'permission-denied'
                ? 'You do not have access to these results. Confirm that you are signed in as the session owner.'
                : 'Live results disconnected. Check your connection and reload this page to reconnect.'
            );
          }
        );
      } catch (loadError) {
        if (active) {
          setError(
            loadError.code === 'permission-denied'
              ? 'You do not have permission to view these results.'
              : loadError.message || 'Could not load session results.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
      stopSession?.();
      stopVotes?.();
    };
  }, [id, user?.uid]);

  const validVotes = useMemo(
    () => votes.filter((vote) => questions.some((question) => validVote(vote, question))),
    [votes, questions]
  );
  const participantCount = uniqueParticipantCount(votes);
  const question = questions[questionIndex];

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center gap-2 bg-background text-primary">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm font-medium text-muted">Compiling session results…</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-4">
        <section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 text-center shadow-soft">
          <p role="alert" className="text-sm font-medium text-danger">
            {error || 'Session results unavailable.'}
          </p>
          <Link
            to="/dashboard"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to workspace</span>
          </Link>
        </section>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-background text-text">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-md sm:px-8 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/sessions/${id}`)}
            aria-label="Back to session controls"
            className="rounded-xl border border-border bg-surface p-2 text-muted hover:bg-surface-secondary hover:text-text transition-all active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Logo size="md" />
          <div className="hidden h-5 w-px bg-border sm:block" />
          <span className="hidden text-xs font-semibold uppercase tracking-wider text-muted sm:inline-block">
            Analytics & Reports
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={handlePrint}
            title="Print or save as PDF report"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text hover:border-primary/40 hover:text-primary transition-all active:scale-95"
          >
            <Printer className="h-4 w-4 text-muted" />
            <span>Export PDF</span>
          </button>
          <Link
            to={`/sessions/${id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-primary-hover transition-all active:scale-95"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Control Room</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10 space-y-8">
        {/* Session Summary Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <StatusBadge status={session.status}>
                {session.status === 'active' ? 'Live Session' : 'Final Results'}
              </StatusBadge>
              <span className="font-mono text-xs font-semibold tracking-wider text-muted">
                Room #{session.joinCode}
              </span>
            </div>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
              {session.surveyTitle}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Live responses synchronized via Askly real-time data engine.
            </p>
          </div>

          {/* Metric Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-soft">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted">Participants</p>
                <p className="text-base font-bold tabular-nums text-text">{participantCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-soft">
              <BarChart3 className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-xs font-medium text-muted">Total Votes</p>
                <p className="text-base font-bold tabular-nums text-text">{validVotes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <div className="border-b border-border pb-3 print:hidden">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <BarChart3 className="h-4 w-4" />
            <span>Question Breakdown ({questions.length})</span>
          </h2>
        </div>

        {questions.length ? (
          <div className="space-y-6">
            {/* Question selection pills */}
            <nav
              aria-label="Question selector"
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none print:hidden"
            >
              {questions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setQuestionIndex(index)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    index === questionIndex
                      ? 'bg-primary text-white shadow-soft'
                      : 'border border-border bg-surface text-muted hover:border-primary/40 hover:text-text'
                  }`}
                >
                  Q{index + 1}: {item.type === 'wordCloud' ? 'Word Cloud' : 'Poll'}
                </button>
              ))}
            </nav>

            {/* Active Question Card */}
            <section
              aria-live="polite"
              className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    {question.type === 'wordCloud' ? 'Dynamic Word Cloud' : 'Multiple Choice Poll'}
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    Question {questionIndex + 1} of {questions.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 print:hidden">
                  <button
                    type="button"
                    onClick={() => setQuestionIndex((c) => Math.max(0, c - 1))}
                    disabled={questionIndex === 0}
                    aria-label="Previous question"
                    className="rounded-xl border border-border bg-surface p-2 text-muted hover:bg-surface-secondary hover:text-text disabled:opacity-30 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionIndex((c) => Math.min(questions.length - 1, c + 1))}
                    disabled={questionIndex === questions.length - 1}
                    aria-label="Next question"
                    className="rounded-xl border border-border bg-surface p-2 text-muted hover:bg-surface-secondary hover:text-text disabled:opacity-30 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h2 className="mt-4 break-words text-xl sm:text-2xl font-bold leading-snug text-text">
                {question.text}
              </h2>

              <QuestionResults question={question} votes={votes} compact={false} />
            </section>
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-soft">
            <p className="text-base font-semibold text-text">No questions configured in this survey</p>
            <p className="mt-1 text-xs text-muted">Return to the control room or survey editor to add questions.</p>
          </section>
        )}
      </main>
    </div>
  );
}


