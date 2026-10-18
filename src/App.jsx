import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CreateSurveyPlaceholderPage from './pages/CreateSurveyPlaceholderPage';
import HostSessionPage from './pages/HostSessionPage';
import SessionResultsPage from './pages/SessionResultsPage';
import ParticipantSessionPage from './pages/ParticipantSessionPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/session/:code" element={<ParticipantSessionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Host Workspace Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surveys/new"
          element={
            <ProtectedRoute>
              <CreateSurveyPlaceholderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surveys/:id/edit"
          element={
            <ProtectedRoute>
              <CreateSurveyPlaceholderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions/:id"
          element={
            <ProtectedRoute>
              <HostSessionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions/:id/results"
          element={
            <ProtectedRoute>
              <SessionResultsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
