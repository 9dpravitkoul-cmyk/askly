import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, BarChart3, Check, Copy, Loader2, Radio, RotateCcw, Square, Users } from 'lucide-react';
import Logo from '../components/common/Logo';
import QuestionResults from '../components/results/QuestionResults';
import { StatusBadge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { getHostSession, getJoinUrl, isUsingFallbackProductionOrigin, subscribeHostSession, subscribeSessionVotes, uniqueParticipantCount, updateSessionStatus } from '../lib/sessions';
import { db, logFirestorePermissionFailure } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function HostSessionPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const joinUrl = useMemo(() => (session ? getJoinUrl(session.joinCode) : ''), [session]);
  const participantCount = uniqueParticipantCount(votes);
  const question = questions[questionIndex];

  useEffect(() => {
    let current = true;
    let stopSession;
    let stopVotes;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const value = await getHostSession(id, user?.uid);
        if (!current) return;
        setSession(value);
        const result = await getDocs(query(collection(db, 'surveys', value.surveyId, 'questions'), orderBy('order')));
        if (!current) return;
        setQuestions(result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() })));
        stopSession = subscribeHostSession(id, user.uid, (next) => setSession(next), (listenError) => {
          if (current) setError(listenError.message || 'Lost the session connection.');
        });
        stopVotes = subscribeSessionVotes(id, (nextVotes) => {
          if (!current) return;
          setVotes(nextVotes);
          setListening(true);
        }, (listenError) => {
          if (!current) return;
          setListening(false);
          setError(listenError.code === 'permission-denied'
            ? 'Could not read votes for this session. Confirm you are signed in as the host.'
            : 'Live vote updates disconnected. Reload to reconnect.');
        });
      } catch (loadError) {
        logFirestorePermissionFailure('getHostSession', ['sessions/{sessionId}'], loadError);
        if (current) setError(loadError.message || 'Could not load the session.');
      } finally {
        if (current) setLoading(false);
      }
    }
    load();
    return () => { current = false; stopSession?.(); stopVotes?.(); };
  }, [id, user?.uid]);

  const handleStatus = async (status) => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateSessionStatus(id, user.uid, status);
      setSession(updated);
    } catch (actionError) {
      logFirestorePermissionFailure('updateSessionStatus', ['sessions/{sessionId}'], actionError);
      setError(actionError.code === 'permission-denied'
        ? 'Firestore denied this session update. Confirm you are the survey owner and that firestore.rules are published.'
        : actionError.message || 'Could not update the session. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not access the clipboard. Copy the URL shown under the QR code.');
    }
  };

  if (loading) {
    return <div className="grid min-h-screen place-items-center gap-2 text-primary"><Loader2 className="h-5 w-5 animate-spin" />Loading host session…</div>;
  }
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
      <header className="flex items-center gap-3 border-b border-border bg-white px-4 py-3 sm:px-8">
        <button type="button" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard" className="rounded-lg p-2 hover:bg-background"><ArrowLeft className="h-5 w-5" /></button>
        <Logo size="md" />
        <span className="border-l border-border pl-3 text-sm text-muted">Control room</span>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <StatusBadge status={session.status}>{session.status === 'active' ? 'Live' : 'Ended'}</StatusBadge>
            <h1 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">{session.surveyTitle}</h1>
            <p className="mt-1 text-sm text-muted">Share the code or QR. Participants land on the active questions without signing up.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/sessions/${id}/results`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong">
              <BarChart3 className="h-4 w-4" />Full results
            </Link>
            <button
              type="button"
              onClick={() => handleStatus(session.status === 'active' ? 'closed' : 'active')}
              disabled={saving}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60 ${session.status === 'active' ? 'border border-red-200 bg-white text-red-700' : 'bg-primary text-white'}`}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : session.status === 'active' ? <Square className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
              {session.status === 'active' ? 'End session' : 'Reopen session'}
            </button>
          </div>
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

        <section className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="rounded-card border border-border bg-white p-5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Join code</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="break-all font-mono text-3xl font-black tracking-[0.18em] text-primary sm:text-5xl">{session.joinCode}</p>
              <button type="button" onClick={copyLink} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary-soft px-3 py-2 text-sm font-semibold text-primary">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <p className="mt-4 break-all text-sm text-muted">{joinUrl}</p>
            {isUsingFallbackProductionOrigin() && (
              <p className="mt-2 text-xs text-warning">QR and copy link use the production URL so phones never receive localhost.</p>
            )}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-5 text-sm text-muted">
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />{listening ? `${participantCount} ${participantCount === 1 ? 'participant' : 'participants'} with a submitted vote` : 'Connecting to vote data…'}</span>
              <span className="inline-flex items-center gap-2"><Radio className={`h-4 w-4 ${session.status === 'active' ? 'text-live' : 'text-slate-400'}`} />{session.status === 'active' ? 'Voting is open' : 'Voting is closed'}</span>
            </div>
          </div>
          <aside className="flex flex-col items-center rounded-card border border-border bg-white p-6 text-center">
            <h2 className="font-bold text-primary">Scan to join</h2>
            <p className="mt-1 text-xs text-muted">Opens the participant voting page.</p>
            <div className="mt-4 w-full max-w-[240px] rounded-xl border border-border bg-white p-3">
              <QRCodeSVG value={joinUrl} size={220} level="Q" includeMargin className="block h-auto w-full" aria-label={`QR code to join session ${session.joinCode}`} />
            </div>
            <p className="mt-3 break-all text-xs font-medium text-primary">{joinUrl}</p>
            <button type="button" onClick={copyLink} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Link copied' : 'Copy join link'}
            </button>
          </aside>
        </section>

        <section className="mt-6 rounded-card border border-border bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold text-primary">Live preview</h2>
            {questions.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {questions.map((item, index) => (
                  <button key={item.id} type="button" onClick={() => setQuestionIndex(index)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${index === questionIndex ? 'bg-primary text-white' : 'border border-border text-primary'}`}>
                    Q{index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
          {question ? (
            <>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{question.type === 'wordCloud' ? 'Word Cloud' : 'Multiple Choice'}</p>
              <h3 className="mt-2 text-xl font-bold text-primary">{question.text}</h3>
              <QuestionResults question={question} votes={votes} compact />
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">This survey has no questions to preview.</p>
          )}
        </section>
      </main>
    </div>
  );
}
