import React from 'react';
import { X, FileQuestion, BarChart3, Cloud, Users, Play, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SurveyPreviewModal({ survey, onClose, onLaunch }) {
  if (!survey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-brand-border-gray max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-brand-border-gray flex items-start justify-between bg-brand-light-gray/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-light-blue text-brand-navy border border-brand-border-gray uppercase font-mono">
                Survey Preview
              </span>
              <span className="text-xs text-brand-text-secondary">•</span>
              <span className="text-xs text-brand-text-secondary font-mono">{survey.id}</span>
            </div>
            <h3 className="text-xl font-bold text-brand-navy">{survey.title}</h3>
            <p className="text-xs text-brand-text-secondary mt-1">{survey.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Questions List */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex items-center justify-between text-xs text-brand-text-secondary pb-3 border-b border-brand-border-gray">
            <span className="font-semibold text-brand-navy">
              {survey.questions ? survey.questions.length : survey.questionCount} Questions in this survey
            </span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-orange" />
              <span>{survey.responsesCount} Recorded responses</span>
            </div>
          </div>

          {survey.questions && survey.questions.length > 0 ? (
            survey.questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-brand-light-gray/40 rounded-xl p-4 border border-brand-border-gray space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-orange">
                    Question {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-navy bg-white px-2 py-0.5 rounded border border-brand-border-gray">
                    {q.type === 'word-cloud' ? (
                      <>
                        <Cloud className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Word Cloud</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-3.5 h-3.5 text-brand-navy" />
                        <span>Multiple Choice</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-brand-navy">{q.text}</p>

                {q.type === 'multiple-choice' && q.options && (
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="text-xs bg-white px-3 py-2 rounded-lg border border-brand-border-gray flex items-center justify-between text-brand-text-primary"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-brand-light-blue text-brand-navy font-mono text-[10px] flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'word-cloud' && (
                  <div className="text-xs text-brand-text-secondary bg-white p-3 rounded-lg border border-brand-border-gray italic">
                    Accepts single-word audience text inputs (limit: {q.maxLength || 25} characters).
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-brand-text-secondary text-center py-4">
              No questions configured yet. Click Edit to add questions.
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-brand-light-gray/50 border-t border-brand-border-gray flex items-center justify-between gap-3">
          <Link
            to={`/surveys/${survey.id}/edit`}
            className="px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-light-blue rounded-xl border border-brand-border-gray transition-colors"
          >
            Edit Questions
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-brand-text-secondary hover:text-brand-navy rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onLaunch) onLaunch(survey);
              }}
              className="px-4 py-2 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
              <span>Launch Live Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
