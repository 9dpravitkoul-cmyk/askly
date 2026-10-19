import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SURVEY_TEMPLATES, createSurveyFromTemplate } from '../../lib/surveys';

export default function TemplatesView({ onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  const useTemplate = async (templateId) => {
    if (!user?.uid || busyId) return;
    setBusyId(templateId);
    setError('');
    try {
      const surveyId = await createSurveyFromTemplate(templateId, user.uid);
      onCreated?.();
      navigate(`/surveys/${surveyId}/edit`);
    } catch (createError) {
      setError(createError.message || 'Could not create that survey.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-primary">Templates</h2>
        <p className="mt-1 text-sm text-muted">Start from a real survey draft. Each template creates an editable copy in your workspace.</p>
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SURVEY_TEMPLATES.map((template) => (
          <article key={template.id} className="flex flex-col justify-between rounded-card border border-border bg-white p-6 shadow-soft">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{template.category}</p>
              <h3 className="mt-2 text-base font-bold text-primary">{template.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{template.description}</p>
              <p className="mt-3 text-xs text-muted">{template.questions.length} questions</p>
            </div>
            <button
              type="button"
              onClick={() => useTemplate(template.id)}
              disabled={Boolean(busyId)}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {busyId === template.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Use template
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
