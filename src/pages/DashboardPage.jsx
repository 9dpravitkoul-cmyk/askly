import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopNav from '../components/dashboard/DashboardTopNav';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import SurveyList from '../components/dashboard/SurveyList';
import AudiencePreview from '../components/survey/AudiencePreview';
import TemplatesView from '../components/dashboard/TemplatesView';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import ProfileView from '../components/dashboard/ProfileView';
import SettingsView from '../components/dashboard/SettingsView';
import { useAuth } from '../contexts/AuthContext';
import { deleteSurvey, getSurvey, listUserSurveys } from '../lib/surveys';
import { startSession } from '../lib/sessions';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [startingSessionId, setStartingSessionId] = useState(null);
  const [previewSurvey, setPreviewSurvey] = useState(null);

  const refreshSurveys = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true); setError('');
    try { setSurveys(await listUserSurveys(user.uid)); }
    catch (loadError) {
      logFirestorePermissionFailure('listUserSurveys', ['surveys (list where ownerUid == signed-in UID)'], loadError);
      setError(firestoreError(loadError));
    }
    finally { setLoading(false); }
  }, [user?.uid]);

  useEffect(() => { refreshSurveys(); }, [refreshSurveys]);

  const handleDelete = async (survey) => {
    if (!window.confirm(`Delete “${survey.title}” and its questions? This cannot be undone.`)) return;
    setDeletingId(survey.id); setError('');
    try { await deleteSurvey(survey.id, user.uid); setSurveys((current) => current.filter((item) => item.id !== survey.id)); }
    catch (deleteError) {
      logFirestorePermissionFailure('deleteSurvey', [`surveys/{surveyId}`, `surveySessionLocks/{surveyId}`, `surveys/{surveyId}/questions/*`], deleteError);
      setError(firestoreError(deleteError));
    }
    finally { setDeletingId(null); }
  };

  const handlePreview = async (survey) => {
    setError('');
    try { setPreviewSurvey(await getSurvey(survey.id, user.uid)); }
    catch (previewError) {
      logFirestorePermissionFailure('getSurvey preview', ['surveys/{surveyId}', 'surveys/{surveyId}/questions (list)'], previewError);
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
      logFirestorePermissionFailure('startSession transaction', [
        'surveys/{surveyId} (get)',
        'surveySessionLocks/{surveyId} (get/create/update)',
        'sessionLookups/{joinCode} (get/create)',
        'sessions/{sessionId} (create or existing active session get)',
      ], startError);
      setError(firestoreError(startError));
    }
    finally { setStartingSessionId(null); }
  };

  return <div className="min-h-screen bg-brand-light-gray flex">
    <DashboardSidebar currentView={currentView} onSelectView={(view) => { setCurrentView(view); window.scrollTo({ top: 0, behavior: 'smooth' }); }} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
      <DashboardTopNav searchTerm={searchTerm} onSearchChange={setSearchTerm} onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-7">
        {(currentView === 'home' || currentView === 'surveys') && <>
          <WelcomeBanner displayName={user?.displayName || user?.email || ''} />
          <section><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold tracking-tight text-brand-navy">My Surveys</h2><p className="mt-1 text-sm text-brand-text-secondary">Your saved drafts and published surveys.</p></div><button onClick={refreshSurveys} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-brand-navy transition hover:bg-white">Refresh</button></div><SurveyList surveys={surveys} searchTerm={searchTerm} loading={loading} error={error} onDelete={handleDelete} onPreview={handlePreview} onStartSession={handleStartSession} startingSessionId={startingSessionId} deletingId={deletingId} /></section>
        </>}
        {currentView === 'templates' && <TemplatesView onUseTemplate={() => setCurrentView('surveys')} />}
        {currentView === 'analytics' && <AnalyticsView surveys={surveys} />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'settings' && <SettingsView />}
      </main>
    </div>
    {previewSurvey && <AudiencePreview survey={previewSurvey} onClose={() => setPreviewSurvey(null)} />}
  </div>;
}
