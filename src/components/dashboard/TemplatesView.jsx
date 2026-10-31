import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { SURVEY_TEMPLATES, createSurveyFromTemplate } from '../../lib/surveys';

export default function TemplatesView({ onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  const useTemplate = async (templateId) => {
    if (!user?.uid || busyId) return;
    setBusyId(templateId);
    setError('');
    try {
      const surveyId = await createSurveyFromTemplate(templateId, user.uid);
      toast.success('Template cloned into your workspace!');
      onCreated?.();
      navigate(`/surveys/${surveyId}/edit`);
    } catch (createError) {
      const msg = createError.message || 'Could not create that survey.';
      setError(msg);
      toast.error(msg);
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-text">Survey Templates</h2>
        <p className="mt-1 text-xs text-muted">
          Kickstart your engagement with ready-to-run interactive templates. Each template creates an independent, fully editable copy in your workspace.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SURVEY_TEMPLATES.map((template) => (
          <article
            key={template.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all hover:border-primary/40 hover:shadow-card"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-soft px-2.5 py-0.5 rounded-full">
                  {template.category}
                </span>
                <span className="text-xs text-muted font-medium">
                  {template.questions.length} questions
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-text">{template.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{template.description}</p>
            </div>

            <button
              type="button"
              onClick={() => useTemplate(template.id)}
              disabled={Boolean(busyId)}
              className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-soft hover:bg-primary-hover disabled:opacity-60 transition-all active:scale-95"
            >
              {busyId === template.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span>Use This Template</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
