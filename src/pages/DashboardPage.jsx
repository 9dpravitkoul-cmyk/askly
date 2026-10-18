import React, { useState } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopNav from '../components/dashboard/DashboardTopNav';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import QuickActions from '../components/dashboard/QuickActions';
import SurveyList from '../components/dashboard/SurveyList';
import SurveyPreviewModal from '../components/dashboard/SurveyPreviewModal';
import LaunchSessionModal from '../components/dashboard/LaunchSessionModal';
import TemplatesView from '../components/dashboard/TemplatesView';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import ProfileView from '../components/dashboard/ProfileView';
import SettingsView from '../components/dashboard/SettingsView';
import { INITIAL_MOCK_SURVEYS } from '../data/mockSurveys';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState('surveys'); // 'home' | 'surveys' | 'templates' | 'analytics' | 'profile' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [surveys, setSurveys] = useState(INITIAL_MOCK_SURVEYS);
  const [previewSurvey, setPreviewSurvey] = useState(null);
  const [launchSurvey, setLaunchSurvey] = useState(null);

  const activeSurveysCount = surveys.filter(s => s.status === 'active').length;

  return (
    <div className="min-h-screen bg-brand-light-gray flex">
      {/* Sidebar (Desktop fixed & Mobile Drawer) */}
      <DashboardSidebar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar width on lg screens) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar with Search & Account */}
        <DashboardTopNav
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        {/* Dashboard Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Main Dashboard / Surveys View */}
          {(currentView === 'home' || currentView === 'surveys') && (
            <>
              {/* Welcome Section */}
              <WelcomeBanner
                totalSurveys={surveys.length}
                activeSurveys={activeSurveysCount}
              />

              {/* Quick Actions (4 cards) */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                    Quick Actions
                  </h2>
                </div>
                <QuickActions
                  onSelectTemplate={() => setCurrentView('templates')}
                  onSelectLiveSession={() => {
                    const firstActive = surveys.find(s => s.status === 'active') || surveys[0];
                    setLaunchSurvey(firstActive);
                  }}
                  onSelectAnalytics={() => setCurrentView('analytics')}
                />
              </div>

              {/* My Surveys Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-brand-navy">My Surveys</h2>
                    <p className="text-xs text-brand-text-secondary mt-0.5">
                      Manage, present, and inspect results for all audience surveys.
                    </p>
                  </div>
                </div>

                <SurveyList
                  surveys={surveys}
                  searchTerm={searchTerm}
                  onSelectSurveyPreview={(survey) => setPreviewSurvey(survey)}
                  onLaunchSession={(survey) => setLaunchSurvey(survey)}
                />
              </div>
            </>
          )}

          {/* Templates View */}
          {currentView === 'templates' && (
            <TemplatesView
              onUseTemplate={(template) => {
                // Future Phase 4 integration
              }}
            />
          )}

          {/* Analytics View */}
          {currentView === 'analytics' && (
            <AnalyticsView surveys={surveys} />
          )}

          {/* Profile View */}
          {currentView === 'profile' && (
            <ProfileView />
          )}

          {/* Settings View */}
          {currentView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Survey Preview Details Modal */}
      {previewSurvey && (
        <SurveyPreviewModal
          survey={previewSurvey}
          onClose={() => setPreviewSurvey(null)}
          onLaunch={(survey) => {
            setPreviewSurvey(null);
            setLaunchSurvey(survey);
          }}
        />
      )}

      {/* Live Session Room Modal */}
      {launchSurvey && (
        <LaunchSessionModal
          survey={launchSurvey}
          onClose={() => setLaunchSurvey(null)}
        />
      )}
    </div>
  );
}
