import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BarChart3, Loader2 } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Logo from '../components/common/Logo';
import QuestionResults, { validVote } from '../components/results/QuestionResults';
import { StatusBadge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { getHostSession, subscribeHostSession, subscribeSessionVotes } from '../lib/sessions';

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
      setLoading(true); setError(''); setVotes([]); setQuestions([]); setQuestionIndex(0);
      try {
        const hostSession = await getHostSession(id, user?.uid);
        if (!active) return;
        setSession(hostSession);
        const result = await getDocs(query(collection(db, 'surveys', hostSession.surveyId, 'questions'), orderBy('order')));
        if (!active) return;
        setQuestions(result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() })));
        stopSession = subscribeHostSession(id, user?.uid, (next) => setSession(next), (listenError) => {
          if (active) setError(listenError.message || 'Could not receive session updates.');
        });
        stopVotes = subscribeSessionVotes(id, (nextVotes) => {
          if (!active) return;
          setVotes(nextVotes);
          setError('');
        }, (listenError) => {
          if (!active) return;
          setError(listenError.code === 'permission-denied'
            ? 'You do not have access to these results. Confirm that you are signed in as the session owner.'
            : 'Live results disconnected. Check your connection and reload this page to reconnect.');
        });
      } catch (loadError) {
        if (active) setError(loadError.code === 'permission-denied'
          ? 'You do not have permission to view these results.'
          : loadError.message || 'Could not load session results.');
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; stopSession?.(); stopVotes?.(); };
  }, [id, user?.uid]);

  const validVotes = useMemo(() => votes.filter((vote) => questions.some((question) => validVote(vote, question))), [votes, questions]);
  const question = questions[questionIndex];
  if (loading) return <div className="grid min-h-screen place-items-center gap-2 text-primary"><Loader2 className="h-5 w-5 animate-spin" />Loading results…</div>;
  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-4">
        <section className="w-full max-w-lg rounded-2xl border border-border bg-white p-7">
          <p role="alert" className="text-sm text-red-700">{error || 'Session unavailable.'}</p>
          <Link to="/dashboard" className="mt-5 inline-flex text-sm font-semibold text-primary">Back to dashboard</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(`/sessions/${id}`)} aria-label="Back to session controls" className="rounded-lg p-2 hover:bg-background"><ArrowLeft className="h-5 w-5" /></button>
          <Logo size="md" />
          <span className="border-l border-border pl-3 text-sm text-muted">Results</span>
        </div>
        <Link to={`/sessions/${id}`} className="text-sm font-semibold text-primary hover:text-accent-strong">Control room</Link>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <StatusBadge status={session.status}>{session.status === 'active' ? 'Voting is open' : 'Final results'}</StatusBadge>
            <h1 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">{session.surveyTitle}</h1>
            <p className="mt-2 text-sm text-muted">Join code: <span className="font-mono font-bold tracking-widest text-primary">{session.joinCode}</span></p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm">
            <BarChart3 className="h-4 w-4 text-accent-strong" />
            <span className="font-bold tabular-nums text-primary">{validVotes.length}</span>
            <span className="text-muted">total responses</span>
          </div>
        </div>
        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        {questions.length ? (
          <>
            <nav aria-label="Question results" className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {questions.map((item, index) => (
                <button key={item.id} type="button" onClick={() => setQuestionIndex(index)} aria-current={index === questionIndex ? 'step' : undefined} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${index === questionIndex ? 'bg-primary text-white' : 'border border-border bg-white text-primary hover:border-primary'}`}>
                  Question {index + 1}
                </button>
              ))}
            </nav>
            <section aria-live="polite" className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Question {questionIndex + 1} of {questions.length} · {question.type === 'wordCloud' ? 'Word Cloud' : 'Multiple Choice'}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setQuestionIndex((current) => Math.max(0, current - 1))} disabled={questionIndex === 0} aria-label="Previous question" className="rounded-lg border border-border p-2 text-primary disabled:opacity-40"><ArrowLeft className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setQuestionIndex((current) => Math.min(questions.length - 1, current + 1))} disabled={questionIndex === questions.length - 1} aria-label="Next question" className="rounded-lg border border-border p-2 text-primary disabled:opacity-40"><ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
              <h2 className="mt-3 break-words text-xl font-bold leading-snug text-primary sm:text-2xl">{question.text}</h2>
              <QuestionResults question={question} votes={votes} />
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <p className="font-semibold text-primary">No questions in this survey</p>
            <p className="mt-1 text-sm text-muted">Return to the control room to review the survey.</p>
          </section>
        )}
      </main>
    </div>
  );
}
