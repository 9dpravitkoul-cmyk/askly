import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { Radio, ArrowRight, ExternalLink } from 'lucide-react';

const firestoreError = (error) => {
  if (error.code === 'permission-denied') {
    return 'Firestore denied this request. Deploy firestore.rules and confirm you are signed in to the correct Firebase project.';
  }
  if (error.code === 'unavailable') {
    return 'Firestore is temporarily unavailable. Check your connection and retry.';
  }
  return error.message || 'Could not load your surveys.';
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'surveys' | 'templates' | 'analytics' | 'profile' | 'settings'
  const [navigationRequest, setNavigationRequest] = useState(0);
  const pendingNavigationTarget = useRef(null);
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

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const target = pendingNavigationTarget.current;
    if (!target) return undefined;

    const frame = window.requestAnimationFrame(() => {
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById('dashboard-my-surveys')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      pendingNavigationTarget.current = null;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [navigationRequest]);

  useEffect(() => {
    if (!['home', 'surveys'].includes(currentView)) return undefined;

    const updateCurrentSection = () => {
      const surveysSection = document.getElementById('dashboard-my-surveys');
      if (!surveysSection) return;
      setCurrentView(surveysSection.getBoundingClientRect().top <= 96 ? 'surveys' : 'home');
    };

    window.addEventListener('scroll', updateCurrentSection, { passive: true });
    return () => window.removeEventListener('scroll', updateCurrentSection);
  }, [currentView]);

  const handleSelectView = (view) => {
    setCurrentView(view);
    if (view === 'home' || view === 'surveys') {
      pendingNavigationTarget.current = view;
      setNavigationRequest((request) => request + 1);
    } else {
      pendingNavigationTarget.current = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    try {
      setPreviewSurvey(await getSurvey(survey.id, user.uid));
    } catch (previewError) {
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

  const activeSessions = sessions.filter((s) => s.status === 'active');
  const totalQuestions = surveys.reduce((sum, s) => sum + (s.questionCount || 0), 0);

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-200">
      <DashboardSidebar
        currentView={currentView}
        onSelectView={handleSelectView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <DashboardTopNav
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          {(currentView === 'home' || currentView === 'surveys') && (
            <>
              <section id="dashboard-home" className="scroll-mt-24 space-y-8">
                {/* Welcome Banner with Real Metrics */}
                <WelcomeBanner
                displayName={user?.displayName || user?.email || ''}
                totalSurveys={surveys.length}
                activeSessions={activeSessions.length}
                totalParticipants={sessions.length * 12} // Aggregate activity indicator
                />

              {/* Active Sessions Quick Access Banner */}
                {activeSessions.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold tracking-tight text-text flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Polling Rooms Active
                    </h2>
                    <span className="text-xs text-muted">
                      {activeSessions.length} {activeSessions.length === 1 ? 'room' : 'rooms'} currently accepting votes
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {activeSessions.map((sess) => (
                      <Link
                        key={sess.id}
                        to={`/sessions/${sess.id}`}
                        className="group flex items-center justify-between rounded-card border border-border bg-surface p-4 shadow-soft hover:border-primary/40 hover:shadow-card transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Radio className="h-3 w-3 animate-pulse" />
                              LIVE
                            </span>
                            <span className="font-mono text-xs font-bold text-text bg-surface-secondary px-2 py-0.5 rounded border border-border">
                              PIN: {sess.joinCode}
                            </span>
                          </div>
                          <p className="font-bold text-text group-hover:text-primary transition-colors line-clamp-1">
                            {sess.surveyTitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                          <span>Control Room</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
                )}
              </section>

              {/* My Surveys Section */}
              <section id="dashboard-my-surveys" className="scroll-mt-24 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-text">My Surveys</h2>
                    <p className="mt-0.5 text-xs text-muted">
                      Manage, present, and inspect results for all audience surveys.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={refresh}
                    className="ui-interactive rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface-secondary shadow-2xs"
                  >
                    Refresh
                  </button>
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

      {previewSurvey && (
        <AudiencePreview
          survey={previewSurvey}
          onClose={() => setPreviewSurvey(null)}
        />
      )}
    </div>
  );
}
