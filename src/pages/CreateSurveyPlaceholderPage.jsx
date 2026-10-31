import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Check,
  Cloud,
  Copy,
  Eye,
  Loader2,
  Plus,
  Radio,
  Save,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';
import SurveyTypeSelection from '../components/survey/SurveyTypeSelection';
import AudiencePreview from '../components/survey/AudiencePreview';
import { Badge, Button, Input, Modal, Textarea } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getSurvey, saveSurvey } from '../lib/surveys';
import { startSession } from '../lib/sessions';

const makeId = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const applyQuestionType = (question, type) => {
  const text = typeof question?.text === 'string' ? question.text : '';
  const id = question?.id || makeId();
  if (type === 'wordCloud') {
    return {
      id,
      type: 'wordCloud',
      text,
      maxLength:
        Number.isInteger(question?.maxLength) && question.maxLength >= 1 && question.maxLength <= 280
          ? question.maxLength
          : 25,
    };
  }
  const options =
    Array.isArray(question?.options) && question.options.length >= 2
      ? question.options.map((option, optionIndex) => ({
          id: typeof option?.id === 'string' && option.id ? option.id : makeId(),
          label: typeof option?.label === 'string' ? option.label : `Option ${optionIndex + 1}`,
        }))
      : [
          { id: makeId(), label: 'Option 1' },
          { id: makeId(), label: 'Option 2' },
        ];
  return { id, type: 'multipleChoice', text, options };
};

const newQuestion = (type = 'wordCloud') => applyQuestionType({ id: makeId(), text: '' }, type);

const friendlyError = (error) => {
  if (error.code === 'permission-denied') {
    return 'Firestore denied this action. Check that security rules are deployed and you are signed in.';
  }
  if (error.code === 'unavailable' || error.code === 'network-request-failed') {
    return 'Could not reach Firebase. Check your connection and try again.';
  }
  return error.message || 'Could not save survey. Please try again.';
};

function validateQuestion(question, index) {
  if (typeof question.text !== 'string' || !question.text.trim()) {
    return `Question ${index + 1} needs question text.`;
  }
  if (question.type === 'wordCloud') {
    if (
      !Number.isInteger(Number(question.maxLength)) ||
      Number(question.maxLength) < 1 ||
      Number(question.maxLength) > 280
    ) {
      return `Question ${index + 1}: response length must be between 1 and 280 characters.`;
    }
  } else {
    const options = (Array.isArray(question.options) ? question.options : []).map((option) =>
      typeof option?.label === 'string' ? option.label.trim() : ''
    );
    if (options.length < 2 || options.some((option) => !option)) {
      return `Question ${index + 1} needs at least two non-empty options.`;
    }
    if (new Set(options.map((option) => option.toLocaleLowerCase())).size !== options.length) {
      return `Question ${index + 1} has duplicate options.`;
    }
    if (options.length > 20) {
      return `Question ${index + 1} can have at most 20 options.`;
    }
  }
  return '';
}

function normalizeQuestion(question, index) {
  const source = question && typeof question === 'object' ? question : {};
  const id = typeof source.id === 'string' && source.id ? source.id : `question-${index + 1}`;
  if (source.type === 'multipleChoice') {
    const options = Array.isArray(source.options)
      ? source.options.map((option, optionIndex) => {
          const legacyLabel = typeof option === 'string' ? option : '';
          return {
            id: typeof option?.id === 'string' && option.id ? option.id : `${id}-option-${optionIndex + 1}`,
            label: typeof option?.label === 'string' ? option.label : legacyLabel,
          };
        })
      : [];
    return { ...source, id, text: typeof source.text === 'string' ? source.text : '', options };
  }
  return {
    ...source,
    id,
    type: source.type === 'wordCloud' ? 'wordCloud' : source.type,
    text: typeof source.text === 'string' ? source.text : '',
    maxLength: Number.isInteger(source.maxLength) ? source.maxLength : 25,
  };
}

export default function CreateSurveyPlaceholderPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requestedType = searchParams.get('type');
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(!id);
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState(null);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const questionToFocus = useRef(null);
  const startLock = useRef(false);

  useEffect(() => {
    if (!id && ['wordCloud', 'multipleChoice'].includes(requestedType) && questions.length === 0) {
      const question = newQuestion(requestedType);
      questionToFocus.current = question.id;
      setQuestions([question]);
      setDirty(true);
    }
  }, [id, requestedType, questions.length]);

  useEffect(() => {
    if (!questionToFocus.current) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`question-${questionToFocus.current}`)?.focus();
      questionToFocus.current = null;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [questions]);

  useEffect(() => {
    if (!id || !user?.uid) return undefined;
    let active = true;
    setLoading(true);
    getSurvey(id, user.uid)
      .then((survey) => {
        if (!active) return;
        setTitle(survey.title || '');
        setDescription(survey.description || '');
        setStatus(survey.status || 'draft');
        setQuestions((survey.questions || []).map(normalizeQuestion));
        setDirty(false);
      })
      .catch((loadError) => {
        if (active) setError(friendlyError(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, user?.uid]);

  useEffect(() => {
    if (!dirty || saving) return undefined;
    const beforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty, saving]);

  const titleError = useMemo(
    () =>
      !title.trim()
        ? 'Survey title is required.'
        : title.trim().length > 120
        ? 'Title must be 120 characters or fewer.'
        : '',
    [title]
  );

  const validationErrors = useMemo(
    () => questions.map(validateQuestion).filter(Boolean),
    [questions]
  );

  const updateQuestion = (questionId, change) => {
    setDirty(true);
    setQuestions((current) =>
      current.map((q) => (q.id === questionId ? { ...q, ...change } : q))
    );
  };

  const changeQuestionType = (questionId, type) => {
    setDirty(true);
    setQuestions((current) =>
      current.map((q) => (q.id === questionId ? applyQuestionType(q, type) : q))
    );
  };

  const handleSave = async (nextStatus = 'draft') => {
    setError('');
    if (saving) return;
    if (titleError) {
      setError(titleError);
      return;
    }
    if (validationErrors.length) {
      setError(validationErrors[0]);
      return;
    }
    if (nextStatus === 'published' && !questions.length) {
      setError('Add and complete at least one question before publishing.');
      return;
    }

    setSaving(true);
    try {
      const savedId = await saveSurvey({
        id,
        uid: user.uid,
        title,
        description,
        status: nextStatus,
        questions,
      });
      setDirty(false);
      setStatus(nextStatus);
      toast.success(nextStatus === 'published' ? 'Survey published!' : 'Draft saved.');
      if (!id) navigate(`/surveys/${savedId}/edit`, { replace: true });
    } catch (saveError) {
      setError(friendlyError(saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleStartLiveSession = async () => {
    if (startLock.current || saving) return;
    setError('');
    if (titleError) {
      setError(titleError);
      return;
    }
    if (!questions.length) {
      setError('Add at least one question before starting a live session.');
      return;
    }
    if (validationErrors.length) {
      setError(validationErrors[0]);
      return;
    }
    if (!user?.uid) {
      setError('Please sign in before starting a live session.');
      return;
    }

    startLock.current = true;
    setStartingSession(true);
    setSaving(true);
    try {
      const savedId = await saveSurvey({
        id,
        uid: user.uid,
        title,
        description,
        status,
        questions,
      });
      setDirty(false);
      if (!id) navigate(`/surveys/${savedId}/edit`, { replace: true });
      const session = await startSession(savedId, user.uid);
      toast.success('Live room created!');
      navigate(`/sessions/${session.id}`);
    } catch (startError) {
      setError(friendlyError(startError));
    } finally {
      startLock.current = false;
      setSaving(false);
      setStartingSession(false);
    }
  };

  const leaveEditor = (event) => {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) {
      event.preventDefault();
    }
  };

  const moveQuestion = (index, offset) => {
    const target = index + offset;
    if (target < 0 || target >= questions.length) return;
    setDirty(true);
    setQuestions((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addQuestion = (type) => {
    if (questions.length >= 200) return;
    const question = newQuestion(type);
    questionToFocus.current = question.id;
    setQuestions((current) => [...current, question]);
    setDirty(true);
    setAddQuestionOpen(false);
  };

  if (!id && !['wordCloud', 'multipleChoice'].includes(requestedType)) {
    return <SurveyTypeSelection />;
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-primary bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          <span>Loading survey…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Editor Header */}
      <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            onClick={leaveEditor}
            to="/dashboard"
            className="rounded-xl p-2 text-muted hover:bg-surface-secondary hover:text-text transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo size="md" />
          <span className="hidden sm:block text-xs font-semibold text-muted border-l border-border pl-3">
            {id ? 'Edit Survey' : 'New Survey'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setPreview(true)}
            disabled={saving}
            className="ui-interactive inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text hover:bg-surface-secondary disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="ui-interactive inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text hover:bg-surface-secondary disabled:opacity-50"
          >
            {saving && !startingSession ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Save className="h-4 w-4 text-muted" />
            )}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleStartLiveSession}
            disabled={saving || startingSession}
            className="ui-interactive inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-primary-hover disabled:opacity-50"
          >
            {startingSession ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Radio className="h-4 w-4 text-accent" />
            )}
            <span>{startingSession ? 'Launching…' : 'Start Live Session'}</span>
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10 space-y-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            {id ? 'Edit Survey' : 'Create a Survey'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Configure questions, reorder options, and launch a real-time polling room.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs sm:text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Survey Details Card */}
        <section className="space-y-4 rounded-card border border-border bg-surface p-5 sm:p-7 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-text">Survey Details</h2>
            <Badge variant={status === 'published' ? 'success' : 'neutral'}>
              {status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>

          <Input
            id="survey-title"
            label={
              <>
                Title <span className="text-primary">*</span>
              </>
            }
            maxLength={120}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            placeholder="e.g. Q4 Company All-Hands Feedback"
          />

          <Textarea
            id="survey-description"
            label="Description (optional)"
            maxLength={500}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDirty(true);
            }}
            rows={3}
            placeholder="Provide context or instructions for your audience..."
          />
        </section>

        {/* Questions Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-text">
                Questions <span className="text-muted font-normal">({questions.length})</span>
              </h2>
              <p className="mt-0.5 text-xs text-muted">Supported types: Multiple Choice & Word Cloud</p>
            </div>
            <Button onClick={() => setAddQuestionOpen(true)} disabled={questions.length >= 200}>
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </Button>
          </div>

          {questions.length === 0 && (
            <div className="rounded-card border border-dashed border-border bg-surface p-10 text-center">
              <p className="font-bold text-text">Start with a question</p>
              <p className="mt-1 text-xs text-muted">
                Choose Multiple Choice or Word Cloud to begin building.
              </p>
              <Button className="mt-4" onClick={() => setAddQuestionOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>Add First Question</span>
              </Button>
            </div>
          )}

          {questions.map((question, index) => (
            <article
              key={question.id}
              className="space-y-4 rounded-card border border-border bg-surface p-5 sm:p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface-secondary text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <Badge variant={question.type === 'wordCloud' ? 'accent' : 'primary'}>
                    {question.type === 'wordCloud' ? 'Word Cloud' : 'Multiple Choice'}
                  </Badge>
                  <select
                    aria-label={`Question ${index + 1} type`}
                    value={question.type === 'multipleChoice' ? 'multipleChoice' : 'wordCloud'}
                    onChange={(e) => changeQuestionType(question.id, e.target.value)}
                    className="min-h-9 rounded-lg border border-border bg-surface px-2.5 text-xs text-text focus:outline-none focus:border-primary"
                  >
                    <option value="wordCloud">Word Cloud</option>
                    <option value="multipleChoice">Multiple Choice</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Move up"
                    aria-label="Move question up"
                    disabled={index === 0}
                    onClick={() => moveQuestion(index, -1)}
                    className="rounded-lg p-2 text-muted hover:bg-surface-secondary hover:text-text disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    aria-label="Move question down"
                    disabled={index === questions.length - 1}
                    onClick={() => moveQuestion(index, 1)}
                    className="rounded-lg p-2 text-muted hover:bg-surface-secondary hover:text-text disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Duplicate question"
                    aria-label="Duplicate question"
                    onClick={() => {
                      const copy = {
                        ...question,
                        id: makeId(),
                        options: (question.options || []).map((opt) => ({ ...opt, id: makeId() })),
                      };
                      setQuestions((curr) => [
                        ...curr.slice(0, index + 1),
                        copy,
                        ...curr.slice(index + 1),
                      ]);
                      setDirty(true);
                    }}
                    className="rounded-lg p-2 text-muted hover:bg-surface-secondary hover:text-text"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Delete question"
                    aria-label="Delete question"
                    onClick={() => setConfirmDeleteQuestion(question.id)}
                    className="rounded-lg p-2 text-danger hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Input
                id={`question-${question.id}`}
                label="Question Prompt"
                value={question.text}
                onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                maxLength={300}
                placeholder={
                  question.type === 'wordCloud'
                    ? 'Describe our workplace culture in one word...'
                    : 'Which strategic initiative should we focus on next?'
                }
              />

              {question.type === 'wordCloud' ? (
                <div className="max-w-xs space-y-1.5">
                  <label
                    htmlFor={`length-${question.id}`}
                    className="block text-xs font-semibold text-muted"
                  >
                    Maximum Character Length (1–280)
                  </label>
                  <input
                    id={`length-${question.id}`}
                    type="number"
                    min={1}
                    max={280}
                    value={question.maxLength}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        maxLength: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="ui-field min-h-10 text-sm max-w-[120px]"
                  />
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text">
                      Answer Options ({question.options.length}/20)
                    </span>
                    <button
                      type="button"
                      disabled={question.options.length >= 20}
                      onClick={() =>
                        updateQuestion(question.id, {
                          options: [...question.options, { id: makeId(), label: '' }],
                        })
                      }
                      className="font-bold text-primary hover:underline disabled:opacity-40"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <span className="w-5 text-center font-mono text-xs font-bold text-muted">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <input
                          aria-label={`Option ${optIdx + 1}`}
                          value={option.label}
                          maxLength={120}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              options: question.options.map((item) =>
                                item.id === option.id ? { ...item, label: e.target.value } : item
                              ),
                            })
                          }
                          placeholder={`Option ${optIdx + 1}`}
                          className="ui-field min-h-10 flex-1 py-1.5 text-xs sm:text-sm"
                        />
                        <button
                          type="button"
                          aria-label="Move option up"
                          disabled={optIdx === 0}
                          onClick={() => {
                            const next = [...question.options];
                            [next[optIdx - 1], next[optIdx]] = [next[optIdx], next[optIdx - 1]];
                            updateQuestion(question.id, { options: next });
                          }}
                          className="rounded-lg p-2 border border-border text-muted hover:text-text disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move option down"
                          disabled={optIdx === question.options.length - 1}
                          onClick={() => {
                            const next = [...question.options];
                            [next[optIdx + 1], next[optIdx]] = [next[optIdx], next[optIdx + 1]];
                            updateQuestion(question.id, { options: next });
                          }}
                          className="rounded-lg p-2 border border-border text-muted hover:text-text disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Remove option"
                          disabled={question.options.length <= 2}
                          onClick={() =>
                            updateQuestion(question.id, {
                              options: question.options.filter((item) => item.id !== option.id),
                            })
                          }
                          className="rounded-lg p-2 border border-red-500/20 text-danger hover:bg-red-500/10 disabled:opacity-30"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validateQuestion(question, index) && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {validateQuestion(question, index)}
                </p>
              )}

              {confirmDeleteQuestion === question.id && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 flex items-center justify-between gap-3 animate-in fade-in">
                  <span className="text-xs font-semibold text-danger">Delete this question?</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteQuestion(null)}
                      className="px-3 py-1 rounded-lg border border-border text-xs text-text hover:bg-surface"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuestions((curr) => curr.filter((item) => item.id !== question.id));
                        setConfirmDeleteQuestion(null);
                        setDirty(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-danger text-white text-xs font-semibold shadow-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* Sticky Action Footer */}
        <footer className="sticky bottom-4 z-10 flex flex-col items-start justify-between gap-3 rounded-card border border-border bg-surface/95 p-4 shadow-card backdrop-blur-md sm:flex-row sm:items-center">
          <p className="text-xs text-muted">
            {saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved'}{' '}
            · Private to your host account.
          </p>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="secondary"
              onClick={() => handleSave('draft')}
              disabled={saving || Boolean(titleError)}
              className="flex-1 sm:flex-none"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={
                saving ||
                Boolean(titleError) ||
                !questions.length ||
                Boolean(validationErrors.length)
              }
              className="flex-1 sm:flex-none"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Publish
            </Button>
          </div>
        </footer>
      </main>

      {/* Audience Preview Modal */}
      {preview && (
        <AudiencePreview
          survey={{ title, description, questions }}
          onClose={() => setPreview(false)}
        />
      )}

      {/* Add Question Modal */}
      <Modal
        open={addQuestionOpen}
        onClose={() => setAddQuestionOpen(false)}
        title="Add a Question"
        description="Choose a question format for your audience."
      >
        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <button
            type="button"
            onClick={() => addQuestion('multipleChoice')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-5 text-left shadow-soft hover:border-primary/50 hover:shadow-card transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-surface-secondary px-2 py-0.5 rounded">
                  Quick Poll
                </span>
              </div>
              <h3 className="font-bold text-text text-base group-hover:text-primary transition-colors">
                Multiple Choice
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Provide predefined options and collect votes with live percentage distribution.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
              Choose Multiple Choice
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => addQuestion('wordCloud')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-5 text-left shadow-soft hover:border-accent hover:shadow-card transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Cloud className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-surface-secondary px-2 py-0.5 rounded">
                  Open Ended
                </span>
              </div>
              <h3 className="font-bold text-text text-base group-hover:text-primary transition-colors">
                Word Cloud
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Allow short free-form answers that dynamically cluster into an animated word cloud.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
              Choose Word Cloud
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-accent" />
            </span>
          </button>
        </div>
      </Modal>
    </div>
  );
}
