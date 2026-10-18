import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, BarChart3, Check, Copy, Loader2, Radio, RotateCcw, Square } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../contexts/AuthContext';
import { getHostSession, updateSessionStatus } from '../lib/sessions';
import { logFirestorePermissionFailure } from '../lib/firebase';

export default function HostSessionPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const joinUrl = useMemo(() => session ? `${window.location.origin}/session/${session.joinCode}` : '', [session]);

  useEffect(() => {
    let current = true;
    getHostSession(id, user?.uid)
      .then((value) => { if (current) setSession(value); })
      .catch((loadError) => {
        logFirestorePermissionFailure('getHostSession transaction', ['sessions/{sessionId} (get)', 'sessionLookups/{joinCode} (get/repair)'], loadError);
        if (current) setError(loadError.message || 'Could not load the session.');
      })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [id, user?.uid]);

  const handleStatus = async (status) => {
    setSaving(true);
    setError('');
    try {
      // The transaction commits the session, public lookup, and survey lock
      // together; update the UI only after that promise resolves.
      const updated = await updateSessionStatus(id, user.uid, status);
      setSession(updated);
    } catch (actionError) {
      logFirestorePermissionFailure('updateSessionStatus transaction', [
        'sessions/{sessionId} (get/update)',
        'surveys/{surveyId} (get)',
        'surveySessionLocks/{surveyId} (get/create/update)',
        'sessionLookups/{joinCode} (get/create/update)',
      ], actionError);
      setError(actionError.code === 'permission-denied'
        ? 'Firestore denied this session update. Confirm you are signed in as the survey owner and that the latest firestore.rules are published to this Firebase project.'
        : actionError.message || 'Could not update the session. Please retry.');
    }
    finally { setSaving(false); }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { setError('Could not access the clipboard. Copy the link from the address shown below the QR code.'); }
  };

  if (loading) return <div className="min-h-screen grid place-items-center text-brand-navy"><Loader2 className="w-5 h-5 animate-spin" /> Loading host session…</div>;
  if (!session) return <div className="min-h-screen bg-brand-light-gray p-4 grid place-items-center"><section className="bg-white rounded-2xl border border-brand-border-gray p-7 max-w-lg w-full"><p role="alert" className="text-sm text-red-700">{error || 'Session unavailable.'}</p><Link to="/dashboard" className="inline-flex mt-5 text-sm font-semibold text-brand-navy">Back to dashboard</Link></section></div>;

  return <div className="min-h-screen bg-brand-light-gray">
    <header className="bg-white border-b border-brand-border-gray px-4 sm:px-8 py-3 flex items-center gap-3"><button onClick={() => navigate('/dashboard')} aria-label="Back to dashboard" className="p-2 rounded-lg hover:bg-brand-light-gray"><ArrowLeft className="w-5 h-5" /></button><Logo size="md" /><span className="text-sm text-brand-text-secondary border-l pl-3">Host session</span></header>
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6"><div><div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${session.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}><span className={`w-2 h-2 rounded-full ${session.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />{session.status === 'active' ? 'Session active' : 'Session closed'}</div><h1 className="mt-3 text-2xl sm:text-3xl font-bold text-brand-navy">{session.surveyTitle}</h1><p className="mt-1 text-sm text-brand-text-secondary">Share the code or QR so participants can answer each question.</p></div>
        <div className="flex flex-wrap gap-2"><Link to={`/sessions/${id}/results`} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-orange text-white"><BarChart3 className="w-4 h-4" />View Live Results</Link><button onClick={() => handleStatus(session.status === 'active' ? 'closed' : 'active')} disabled={saving} className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 ${session.status === 'active' ? 'bg-white text-red-700 border border-red-200' : 'bg-brand-navy text-white'}`}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : session.status === 'active' ? <Square className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}{session.status === 'active' ? 'Close session' : 'Reopen session'}</button></div>
      </div>
      {error && <div role="alert" className="mb-5 p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800">{error}</div>}
      <section className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="bg-white rounded-2xl border border-brand-border-gray p-5 sm:p-8"><p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Join code</p><div className="mt-3 flex items-center gap-3"><div className="font-mono text-3xl sm:text-5xl font-black tracking-[0.18em] text-brand-navy break-all">{session.joinCode}</div><button onClick={copyLink} className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-light-blue text-brand-navy text-sm font-semibold">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy link'}</button></div><p className="mt-4 text-xs sm:text-sm text-brand-text-secondary break-all">{joinUrl}</p>
          <div className="mt-8 pt-5 border-t border-brand-border-gray flex items-center gap-2 text-sm text-brand-text-secondary"><Radio className={`w-4 h-4 ${session.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} />{session.status === 'active' ? 'Participants with this link can view the session landing page.' : 'The session is closed. Reopen it to accept participants again.'}</div>
        </div>
        <aside className="bg-white rounded-2xl border border-brand-border-gray p-6 flex flex-col items-center text-center"><h2 className="font-bold text-brand-navy">Scan to join</h2><p className="mt-1 text-xs text-brand-text-secondary">Opens the participant landing page.</p><div className="mt-5 bg-white p-3 border border-brand-border-gray rounded-xl"><QRCodeSVG value={joinUrl} size={220} level="Q" includeMargin /></div><button onClick={copyLink} className="mt-4 w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-lg bg-brand-navy text-white text-sm font-semibold">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Link copied' : 'Copy join link'}</button></aside>
      </section>
    </main>
  </div>;
}
