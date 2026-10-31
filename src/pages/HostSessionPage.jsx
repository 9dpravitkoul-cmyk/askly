import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Loader2,
  Maximize2,
  Minimize2,
  Radio,
  RotateCcw,
  Sparkles,
  Square,
  Users,
} from 'lucide-react';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';
import QuestionResults from '../components/results/QuestionResults';
import { StatusBadge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  getHostSession,
  getJoinUrl,
  subscribeHostSession,
  subscribeSessionVotes,
  uniqueParticipantCount,
  updateSessionStatus,
} from '../lib/sessions';
import { db, logFirestorePermissionFailure } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function HostSessionPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [listening, setListening] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState('');
  const statusUpdateInFlight = useRef(false);

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

        const result = await getDocs(
          query(collection(db, 'surveys', value.surveyId, 'questions'), orderBy('order'))
        );
        if (!current) return;
        setQuestions(result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() })));

        stopSession = subscribeHostSession(
          id,
          user.uid,
          (next) => setSession(next),
          (listenError) => {
            if (current) setError(listenError.message || 'Lost the session connection.');
          }
        );

        stopVotes = subscribeSessionVotes(
          id,
          (nextVotes) => {
            if (!current) return;
            setVotes(nextVotes);
            setListening(true);
          },
          (listenError) => {
            if (!current) return;
            setListening(false);
            setError(
              listenError.code === 'permission-denied'
                ? 'Could not read votes for this session. Confirm you are signed in as the host.'
                : 'Live vote updates disconnected. Reload to reconnect.'
            );
          }
        );
      } catch (loadError) {
        logFirestorePermissionFailure('getHostSession', ['sessions/{sessionId}'], loadError);
        if (current) setError(loadError.message || 'Could not load the session.');
      } finally {
        if (current) setLoading(false);
      }
    }

    load();
    return () => {
      current = false;
      stopSession?.();
      stopVotes?.();
    };
  }, [id, user?.uid]);

  const handleStatus = async (status) => {
    if (statusUpdateInFlight.current || saving) return;
    statusUpdateInFlight.current = true;
    setSaving(true);
    setError('');
    try {
      const result = await updateSessionStatus(id, user?.uid, status);
      if (!result?.success || !result.session) {
        const serviceError = new Error(result?.error?.message || 'The session update did not complete. Please retry.');
        serviceError.code = result?.error?.code;
        throw serviceError;
      }

      setSession(result.session);
      toast.success(status === 'active' ? 'Session reopened for audience responses' : 'Session closed. Voting is paused.');
      if (status === 'closed') navigate('/dashboard', { replace: true });
    } catch (actionError) {
      logFirestorePermissionFailure('updateSessionStatus', ['sessions/{sessionId}'], actionError);
      const msg =
        actionError?.code === 'permission-denied'
          ? 'Firestore denied this session update. Confirm you are the survey owner and that firestore.rules are published.'
          : actionError?.message || 'Could not update the session. Please retry.';
      setError(msg);
      toast.error(msg);
    } finally {
      statusUpdateInFlight.current = false;
      setSaving(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      toast.success('Join link copied to clipboard');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not access clipboard. Copy the URL directly from the screen.');
      toast.error('Could not copy link');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center gap-2 bg-background text-primary">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm font-medium text-muted">Loading Askly Control Room…</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-4">
        <section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 text-center shadow-soft">
          <p role="alert" className="text-sm text-danger font-medium">
            {error || 'Session unavailable or access denied.'}
          </p>
          <Link
            to="/dashboard"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to host workspace</span>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            aria-label="Back to dashboard"
            className="rounded-xl border border-border bg-surface p-2 text-muted hover:bg-surface-secondary hover:text-text transition-all active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Logo size="md" />
          <div className="hidden h-5 w-px bg-border sm:block" />
          <span className="hidden text-xs font-semibold uppercase tracking-wider text-muted sm:inline-block">
            Control Room
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit full screen' : 'Full screen presenter mode'}
            className="hidden sm:inline-flex rounded-xl border border-border bg-surface p-2 text-muted hover:bg-surface-secondary hover:text-text transition-all active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <Link
            to={`/sessions/${id}/results`}
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text hover:border-primary/40 hover:text-primary transition-all active:scale-95"
          >
            <BarChart3 className="h-4 w-4 text-secondary" />
            <span>Detailed Report</span>
          </Link>
          <button
            type="button"
            onClick={() => handleStatus(session.status === 'active' ? 'closed' : 'active')}
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95 disabled:opacity-60 ${
              session.status === 'active'
                ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400'
                : 'bg-primary text-white hover:bg-primary-hover shadow-soft'
            }`}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : session.status === 'active' ? (
              <Square className="h-3.5 w-3.5 fill-current" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            <span>{session.status === 'active' ? 'End Session' : 'Reopen Session'}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-6">
        {/* Title & Live Status */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <StatusBadge status={session.status}>
                {session.status === 'active' ? 'Live Session' : 'Ended'}
              </StatusBadge>
              <span className="flex items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-muted border border-border">
                <Users className="h-3.5 w-3.5 text-primary" />
                <strong className="text-text">{participantCount}</strong>
                <span>active {participantCount === 1 ? 'participant' : 'participants'}</span>
              </span>
            </div>
            <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-text sm:text-3xl">
              {session.surveyTitle}
            </h1>
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

        {/* Join Info Grid: Code & QR Code */}
        <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Join Code Card */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Audience Join Instructions
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      session.status === 'active' ? 'bg-live animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  {session.status === 'active' ? 'Accepting Live Votes' : 'Responses Paused'}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted">
                Direct your audience to go to{' '}
                <strong className="text-text font-semibold">askly-sand.vercel.app/join</strong> and
                enter:
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-border bg-surface-secondary px-6 py-3 shadow-inner">
                  <p className="font-mono text-3xl sm:text-5xl font-black tracking-[0.2em] text-primary">
                    {session.joinCode}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-xs font-bold text-text hover:border-primary/40 hover:text-primary transition-all active:scale-95 shadow-xs"
                >
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-muted" />}
                  <span>{copied ? 'Link Copied' : 'Copy Join Link'}</span>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                <span className="truncate">{joinUrl}</span>
                <a
                  href={joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open</span>
                </a>
              </div>

            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-secondary" />
                <span>
                  {participantCount} {participantCount === 1 ? 'person' : 'people'} have voted
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Radio className={`h-4 w-4 ${session.status === 'active' ? 'text-live' : 'text-slate-400'}`} />
                <span>{session.status === 'active' ? 'Live Cloud Sync' : 'Session Closed'}</span>
              </span>
            </div>
          </div>

          {/* QR Code Card - Always crisp white background for phone cameras */}
          <aside className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
            <h2 className="text-sm font-bold text-text">Scan to Join Live</h2>
            <p className="mt-0.5 text-xs text-muted">Point mobile camera at the QR code</p>

            <div className="mt-4 rounded-2xl bg-white p-3 shadow-md border border-slate-200">
              <QRCodeSVG
                value={joinUrl}
                size={180}
                level="Q"
                includeMargin
                className="block h-auto w-full"
                aria-label={`QR code to join session ${session.joinCode}`}
              />
            </div>

            <button
              type="button"
              onClick={copyLink}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-primary-hover transition-all active:scale-95"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Direct URL'}</span>
            </button>
          </aside>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Interactive Live View
                </span>
                <h2 className="text-lg font-bold text-text mt-0.5">
                  Question {questionIndex + 1} of {questions.length}
                </h2>
              </div>

              {questions.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuestionIndex((c) => Math.max(0, c - 1))}
                    disabled={questionIndex === 0}
                    className="rounded-xl border border-border bg-surface p-2 text-text hover:bg-surface-secondary disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex flex-wrap gap-1">
                    {questions.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setQuestionIndex(index)}
                        className={`min-w-8 h-8 rounded-xl px-2 text-xs font-bold transition-all ${
                          index === questionIndex
                            ? 'bg-primary text-white shadow-soft'
                            : 'border border-border bg-surface text-muted hover:border-primary/40 hover:text-text'
                        }`}
                      >
                        Q{index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuestionIndex((c) => Math.min(questions.length - 1, c + 1))}
                    disabled={questionIndex === questions.length - 1}
                    className="rounded-xl border border-border bg-surface p-2 text-text hover:bg-surface-secondary disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {question ? (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    {question.type === 'wordCloud' ? 'Dynamic Word Cloud' : 'Multiple Choice Poll'}
                  </span>
                </div>
                <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-text">
                  {question.text}
                </h3>
                <QuestionResults question={question} votes={votes} compact={false} />
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-muted">
                This survey has no questions configured.
              </div>
            )}
        </section>
      </main>
    </div>
  );
}
