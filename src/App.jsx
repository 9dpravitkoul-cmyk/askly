import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateSurveyPlaceholderPage from './pages/CreateSurveyPlaceholderPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/surveys/new" element={<CreateSurveyPlaceholderPage />} />
      <Route path="/surveys/:id/edit" element={<CreateSurveyPlaceholderPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
