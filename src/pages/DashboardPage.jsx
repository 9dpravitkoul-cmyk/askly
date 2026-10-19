import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopNav from '../components/dashboard/DashboardTopNav';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import SurveyList from '../components/dashboard/SurveyList';
import AudiencePreview from '../components/survey/AudiencePreview';
import TemplatesView from '../components/dashboard/TemplatesView';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import ProfileView from '../components/dashboard/ProfileView';
import SettingsView from '../components/dashboard/SettingsView';
import { StatusBadge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { deleteSurvey, duplicateSurvey, getSurvey, listUserSurveys } from '../lib/surveys';
import { listHostSessions, startSession } from '../lib/sessions';
import { logFirestorePermissionFailure } from '../lib/firebase';

const firestoreError = (error) => {
  if (error.code === 'permission-denied') return 'Firestore denied this request. Deploy firestore.rules and confirm you are signed in to the correct Firebase project.';
  if (error.code === 'unavailable') return 'Firestore is temporarily unavailable. Check your connection and retry.';
  return error.message || 'Could not load your surveys.';
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('surveys');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [startingSessionId, setStartingSessionId] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [previewSurvey, setPreviewSurvey] = useState(null);

  const refresh = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    setError('');
    try {
      const [surveyList, sessionList] = await Promise.all([
        listUserSurveys(user.uid),
        listHostSessions(user.uid),
      ]);
      setSurveys(surveyList);
      setSessions(sessionList);
    } catch (loadError) {
      logFirestorePermissionFailure('listUserSurveys/listHostSessions', ['surveys', 'sessions'], loadError);
      setError(firestoreError(loadError));
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleDelete = async (survey) => {
    setDeletingId(survey.id);
    setError('');
    try {
      await deleteSurvey(survey.id, user.uid);
      setSurveys((current) => current.filter((item) => item.id !== survey.id));
    } catch (deleteError) {
      logFirestorePermissionFailure('deleteSurvey', ['surveys/{surveyId}'], deleteError);
      setError(firestoreError(deleteError));
    } finally {
      setDeletingId(null);
    }
  };

  const handlePreview = async (survey) => {
    setError('');
    try { setPreviewSurvey(await getSurvey(survey.id, user.uid)); }
    catch (previewError) {
      logFirestorePermissionFailure('getSurvey preview', ['surveys/{surveyId}'], previewError);
      setError(firestoreError(previewError));
    }
  };

  const handleStartSession = async (survey) => {
    setStartingSessionId(survey.id);
    setError('');
    try {
      const session = await startSession(survey.id, user.uid);
      navigate(`/sessions/${session.id}`);
    } catch (startError) {
      logFirestorePermissionFailure('startSession', ['sessions'], startError);
      setError(firestoreError(startError));
    } finally {
      setStartingSessionId(null);
    }
  };

  const handleDuplicate = async (survey) => {
    setDuplicatingId(survey.id);
    setError('');
    try {
      const newId = await duplicateSurvey(survey.id, user.uid);
      await refresh();
      navigate(`/surveys/${newId}/edit`);
    } catch (duplicateError) {
      setError(firestoreError(duplicateError));
    } finally {
      setDuplicatingId(null);
    }
  };

  const liveSessions = sessions.filter((session) => session.status === 'active').slice(0, 4);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar currentView={currentView} onSelectView={(view) => { setCurrentView(view); window.scrollTo({ top: 0, behavior: 'smooth' }); }} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <DashboardTopNav searchTerm={searchTerm} onSearchChange={setSearchTerm} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-7 p-4 sm:p-6 lg:p-8">
          {(currentView === 'home' || currentView === 'surveys') && (
            <>
              <WelcomeBanner displayName={user?.displayName || user?.email || ''} />
              {liveSessions.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold tracking-tight text-primary">Live sessions</h2>
                  <p className="mt-1 text-sm text-muted">Rooms that are currently accepting responses.</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {liveSessions.map((session) => (
                      <Link key={session.id} to={`/sessions/${session.id}`} className="rounded-card border border-border bg-white p-4 shadow-soft hover:border-primary/30">
                        <StatusBadge status={session.status}>Live</StatusBadge>
                        <p className="mt-2 font-bold text-primary">{session.surveyTitle}</p>
                        <p className="mt-1 font-mono text-sm tracking-[0.16em] text-muted">{session.joinCode}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-primary">My surveys</h2>
                    <p className="mt-1 text-sm text-muted">Drafts and published surveys saved to your account.</p>
                  </div>
                  <button type="button" onClick={refresh} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-white">Refresh</button>
                </div>
                <SurveyList
                  surveys={surveys}
                  searchTerm={searchTerm}
                  loading={loading}
                  error={error}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                  onStartSession={handleStartSession}
                  onDuplicate={handleDuplicate}
                  startingSessionId={startingSessionId}
                  deletingId={deletingId}
                  duplicatingId={duplicatingId}
                />
              </section>
            </>
          )}
          {currentView === 'templates' && <TemplatesView onCreated={refresh} />}
          {currentView === 'analytics' && <AnalyticsView surveys={surveys} sessions={sessions} />}
          {currentView === 'profile' && <ProfileView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
      {previewSurvey && <AudiencePreview survey={previewSurvey} onClose={() => setPreviewSurvey(null)} />}
    </div>
  );
}
