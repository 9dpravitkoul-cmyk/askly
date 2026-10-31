import React from 'react';
import { X, FileQuestion, BarChart3, Cloud, Users, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SurveyPreviewModal({ survey, onClose, onLaunch }) {
  if (!survey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] flex flex-col shadow-card overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-text">
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-start justify-between bg-surface-secondary/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-soft text-primary border border-border uppercase font-mono">
                Survey Preview
              </span>
              <span className="text-xs text-muted">•</span>
              <span className="text-xs text-muted font-mono">{survey.id}</span>
            </div>
            <h3 className="text-xl font-bold text-text">{survey.title}</h3>
            <p className="text-xs text-muted mt-1">{survey.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-text hover:bg-surface-secondary transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Questions List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between text-xs text-muted pb-3 border-b border-border">
            <span className="font-semibold text-text">
              {survey.questions ? survey.questions.length : survey.questionCount} Questions in this survey
            </span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>{survey.responsesCount || 0} Recorded responses</span>
            </div>
          </div>

          {survey.questions && survey.questions.length > 0 ? (
            survey.questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-surface-secondary/40 rounded-xl p-4 border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">
                    Question {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-text bg-surface px-2.5 py-1 rounded-lg border border-border shadow-2xs">
                    {q.type === 'word-cloud' || q.type === 'wordCloud' ? (
                      <>
                        <Cloud className="w-3.5 h-3.5 text-accent-strong" />
                        <span>Word Cloud</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-3.5 h-3.5 text-primary" />
                        <span>Multiple Choice</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-text">{q.text}</p>

                {(q.type === 'multiple-choice' || q.type === 'multipleChoice') && q.options && (
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="text-xs bg-surface px-3 py-2 rounded-lg border border-border flex items-center justify-between text-text shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-primary-soft text-primary font-mono text-[10px] flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{typeof opt === 'string' ? opt : opt.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(q.type === 'word-cloud' || q.type === 'wordCloud') && (
                  <div className="text-xs text-muted bg-surface p-3 rounded-lg border border-border italic shadow-2xs">
                    Accepts open text inputs from audience members (limit: {q.maxLength || 28} characters).
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-muted text-center py-6">
              No questions configured yet. Click Edit Questions to configure polls and word clouds.
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-secondary/40 border-t border-border flex items-center justify-between gap-3">
          <Link
            to={`/surveys/${survey.id}/edit`}
            className="px-4 py-2 text-xs font-semibold text-text hover:bg-surface rounded-xl border border-border transition-colors"
          >
            Edit Questions
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-muted hover:text-text rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onLaunch) onLaunch(survey);
              }}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-soft transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
