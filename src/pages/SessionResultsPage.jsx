import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BarChart3, Loader2, Wifi, WifiOff } from 'lucide-react';
import { collection, doc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import Logo from '../components/common/Logo';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { getHostSession } from '../lib/sessions';

function validVote(vote, question) {
  if (!vote || vote.questionId !== question.id || vote.type !== question.type
    || typeof vote.participantUid !== 'string' || vote.id !== `${question.id}_${vote.participantUid}`) return false;
  if (question.type === 'wordCloud') {
    return typeof vote.response === 'string' && vote.response.trim().length > 0
      && vote.response.length <= question.maxLength;
  }
  return question.type === 'multipleChoice' && (question.options || []).some((option) =>
    vote.option && option.id === vote.option.id && option.label === vote.option.label);
}

function ResultsForQuestion({ question, votes }) {
  const answers = votes.filter((vote) => validVote(vote, question));
  if (question.type === 'wordCloud') {
    const phrases = new Map();
    answers.forEach(({ response }) => {
      const display = response.normalize('NFC').trim().replace(/\s+/g, ' ');
      const key = display.toLocaleLowerCase();
      const phrase = phrases.get(key) || { text: display, count: 0 };
      phrase.count += 1;
      phrases.set(key, phrase);
    });
    const words = [...phrases.values()].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
    const max = Math.max(1, ...words.map((word) => word.count));
    return <>
      <p className="mt-2 text-sm text-brand-text-secondary">{answers.length} {answers.length === 1 ? 'response' : 'responses'}</p>
      {words.length ? <div className="mt-6 flex min-h-56 flex-wrap content-center items-center justify-center gap-x-5 gap-y-4 rounded-2xl bg-brand-light-gray p-5 sm:gap-x-8 sm:p-8" aria-label="Word cloud results">
        {words.map((word, index) => <span key={word.text.toLocaleLowerCase()} title={`${word.count} ${word.count === 1 ? 'response' : 'responses'}`} className={`max-w-full break-words text-center font-bold ${index % 3 === 1 ? 'text-brand-orange' : 'text-brand-navy'}`} style={{ fontSize: `clamp(15px, ${Math.round(12 + (word.count / max) * 20)}px, 32px)` }}>{word.text}</span>)}
      </div> : <div className="mt-6 rounded-2xl border border-dashed border-brand-border-gray bg-brand-light-gray p-10 text-center"><p className="font-semibold text-brand-navy">No responses yet</p><p className="mt-1 text-sm text-brand-text-secondary">Submitted words and phrases will appear here.</p></div>}
    </>;
  }

  const options = question.options || [];
  const counts = new Map(options.map((option) => [option.id, 0]));
  answers.forEach((vote) => counts.set(vote.option.id, (counts.get(vote.option.id) || 0) + 1));
  const maxCount = Math.max(0, ...counts.values());
  return <>
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-brand-text-secondary">{answers.length} {answers.length === 1 ? 'response' : 'responses'}</p>{answers.length === 0 && <span className="rounded-full bg-brand-light-gray px-3 py-1 text-xs font-medium text-brand-text-secondary">Waiting for the first vote</span>}</div>
    <div className="mt-6 overflow-x-auto pb-2"><div className="grid items-end gap-3 border-b border-brand-border-gray px-1 sm:gap-5" style={{ gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(5.5rem, 1fr))`, minWidth: `${Math.max(options.length * 92, 100)}px` }}>{options.map((option) => {
      const count = counts.get(option.id) || 0;
      const percentage = answers.length ? Math.round((count / answers.length) * 100) : 0;
      const barHeight = maxCount ? (count / maxCount) * 100 : 0;
      return <div key={option.id} className="flex min-w-0 flex-col items-center">
        <p className="mb-2 text-center text-xs font-semibold tabular-nums text-brand-navy sm:text-sm">{count} <span className="text-brand-text-secondary">· {percentage}%</span></p>
        <div className="flex h-52 w-full items-end justify-center rounded-t-lg bg-brand-light-gray/70 sm:h-64"><div role="progressbar" aria-label={`${option.label}: ${percentage}%`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} className="w-3/5 max-w-16 rounded-t-md bg-brand-orange transition-[height] duration-500 ease-out" style={{ height: `${barHeight}%`, minHeight: count ? '4px' : '0' }} /></div>
        <p title={option.label} className="mt-2 min-h-12 w-full break-words text-center text-xs font-medium leading-4 text-brand-navy sm:text-sm">{option.label}</p>
      </div>;
    })}</div></div>
  </>;
}

export default function SessionResultsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listening, setListening] = useState(false);
  const [connected, setConnected] = useState(typeof navigator === 'undefined' || navigator.onLine);
  const [error, setError] = useState('');

  useEffect(() => {
    const online = () => setConnected(true);
    const offline = () => setConnected(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, []);

  useEffect(() => {
    let active = true;
    let stopSession;
    let stopVotes;
    async function load() {
      setLoading(true); setError(''); setListening(false); setVotes([]); setQuestions([]); setQuestionIndex(0);
      try {
        const hostSession = await getHostSession(id, user?.uid);
        if (!active) return;
        setSession(hostSession);
        const result = await getDocs(query(collection(db, 'surveys', hostSession.surveyId, 'questions'), orderBy('order')));
        if (!active) return;
        const items = result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
        setQuestions(items);
        stopSession = onSnapshot(doc(db, 'sessions', id), (snapshot) => {
          if (snapshot.exists() && snapshot.data().ownerUid === user?.uid) setSession({ id: snapshot.id, ...snapshot.data() });
        }, (listenError) => { if (active) setError(listenError.message || 'Could not receive session updates.'); });
        stopVotes = onSnapshot(query(collection(db, 'sessions', id, 'votes')), (snapshot) => {
          if (!active) return;
          setVotes(snapshot.docs.map((voteDoc) => ({ id: voteDoc.id, ...voteDoc.data() })));
          setListening(true);
          setError('');
        }, (listenError) => {
          if (active) {
            setListening(false);
            setError(listenError.code === 'permission-denied'
              ? 'You do not have access to these results. Confirm that you are signed in as the session owner.'
              : 'Live results disconnected. Check your connection and reload this page to reconnect.');
          }
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
  if (loading) return <div className="min-h-screen grid place-items-center gap-2 text-brand-navy"><Loader2 className="h-5 w-5 animate-spin" />Loading results…</div>;
  if (!session) return <div className="min-h-screen bg-brand-light-gray p-4 grid place-items-center"><section className="w-full max-w-lg rounded-2xl border border-brand-border-gray bg-white p-7"><p role="alert" className="text-sm text-red-700">{error || 'Session unavailable.'}</p><Link to="/dashboard" className="mt-5 inline-flex text-sm font-semibold text-brand-navy">Back to dashboard</Link></section></div>;

  const connectionMessage = !connected ? 'You are offline. Results may be out of date.'
    : listening ? 'Live updates connected'
      : error ? 'Live updates are unavailable.' : 'Connecting to live results…';
  return <div className="min-h-screen bg-brand-light-gray">
    <header className="flex items-center justify-between gap-3 border-b border-brand-border-gray bg-white px-4 py-3 sm:px-8"><div className="flex items-center gap-3"><button onClick={() => navigate(`/sessions/${id}`)} aria-label="Back to session controls" className="rounded-lg p-2 hover:bg-brand-light-gray"><ArrowLeft className="h-5 w-5" /></button><Logo size="md" /><span className="border-l pl-3 text-sm text-brand-text-secondary">Live results</span></div><Link to={`/sessions/${id}`} className="text-sm font-semibold text-brand-navy hover:text-brand-orange">Session controls</Link></header>
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${session.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}><span className={`h-2 w-2 rounded-full ${session.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />{session.status === 'active' ? 'Voting is open' : 'Voting is closed'}</div><h1 className="mt-3 text-2xl font-bold text-brand-navy sm:text-3xl">{session.surveyTitle}</h1><p className="mt-2 text-sm text-brand-text-secondary">Join code: <span className="font-mono font-bold tracking-widest text-brand-navy">{session.joinCode}</span></p></div><div className="flex items-center gap-2 rounded-xl border border-brand-border-gray bg-white px-4 py-3 text-sm"><BarChart3 className="h-4 w-4 text-brand-orange" /><span className="font-bold tabular-nums text-brand-navy">{validVotes.length}</span><span className="text-brand-text-secondary">total responses</span></div></div>
      <div role="status" className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${connected && listening ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>{connected && listening ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}{connectionMessage}</div>
      {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {questions.length ? <>
        <nav aria-label="Question results" className="mb-4 flex gap-2 overflow-x-auto pb-2">{questions.map((item, index) => <button key={item.id} type="button" onClick={() => setQuestionIndex(index)} aria-current={index === questionIndex ? 'step' : undefined} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${index === questionIndex ? 'bg-brand-navy text-white' : 'border border-brand-border-gray bg-white text-brand-navy hover:border-brand-navy'}`}>Question {index + 1}</button>)}</nav>
        <section aria-live="polite" className="rounded-2xl border border-brand-border-gray bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">Question {questionIndex + 1} of {questions.length} · {question.type === 'wordCloud' ? 'Word Cloud' : 'Multiple Choice'}</p><div className="flex gap-2"><button type="button" onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))} disabled={questionIndex === 0} aria-label="Previous question" className="rounded-lg border border-brand-border-gray p-2 text-brand-navy disabled:opacity-40"><ArrowLeft className="h-4 w-4" /></button><button type="button" onClick={() => setQuestionIndex((index) => Math.min(questions.length - 1, index + 1))} disabled={questionIndex === questions.length - 1} aria-label="Next question" className="rounded-lg border border-brand-border-gray p-2 text-brand-navy disabled:opacity-40"><ArrowRight className="h-4 w-4" /></button></div></div>
          <h2 className="mt-3 break-words text-xl font-bold leading-snug text-brand-navy sm:text-2xl">{question.text}</h2>
          <ResultsForQuestion question={question} votes={votes} />
        </section>
      </> : <section className="rounded-2xl border border-dashed border-brand-border-gray bg-white p-8 text-center"><p className="font-semibold text-brand-navy">No questions in this survey</p><p className="mt-1 text-sm text-brand-text-secondary">Return to session controls to review the survey.</p></section>}
    </main>
  </div>;
}
