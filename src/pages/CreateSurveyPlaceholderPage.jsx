import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BarChart3, Check, Cloud, Copy, Eye, Loader2, Plus, Radio, Save, Trash2, X } from 'lucide-react';
import Logo from '../components/common/Logo';
import SurveyTypeSelection from '../components/survey/SurveyTypeSelection';
import { Badge, Button, Input, Modal, Textarea } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { getSurvey, saveSurvey } from '../lib/surveys';
import { startSession } from '../lib/sessions';

const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const applyQuestionType = (question, type) => {
  const text = typeof question?.text === 'string' ? question.text : '';
  const id = question?.id || makeId();
  if (type === 'wordCloud') {
    return {
      id,
      type: 'wordCloud',
      text,
      maxLength: Number.isInteger(question?.maxLength) && question.maxLength >= 1 && question.maxLength <= 280 ? question.maxLength : 25,
    };
  }
  const options = Array.isArray(question?.options) && question.options.length >= 2
    ? question.options.map((option, optionIndex) => ({
      id: typeof option?.id === 'string' && option.id ? option.id : makeId(),
      label: typeof option?.label === 'string' ? option.label : `Option ${optionIndex + 1}`,
    }))
    : [{ id: makeId(), label: 'Option 1' }, { id: makeId(), label: 'Option 2' }];
  return { id, type: 'multipleChoice', text, options };
};
const newQuestion = (type = 'wordCloud') => applyQuestionType({ id: makeId(), text: '' }, type);
const friendlyError = (error) => {
  if (error.code === 'permission-denied') return 'Firestore denied this action. Check that the survey security rules are deployed and you are signed in to the owning account.';
  if (error.code === 'unavailable' || error.code === 'network-request-failed') return 'Could not reach Firebase. Check your connection and try again.';
  return error.message || 'Could not load or save this survey. Please try again.';
};

function validateQuestion(question, index) {
  if (typeof question.text !== 'string' || !question.text.trim()) return `Question ${index + 1} needs question text.`;
  if (question.type === 'wordCloud') {
    if (!Number.isInteger(Number(question.maxLength)) || Number(question.maxLength) < 1 || Number(question.maxLength) > 280) {
      return `Question ${index + 1}: response length must be between 1 and 280 characters.`;
    }
  } else {
    const options = (Array.isArray(question.options) ? question.options : []).map((option) => typeof option?.label === 'string' ? option.label.trim() : '');
    if (options.length < 2 || options.some((option) => !option)) return `Question ${index + 1} needs at least two non-empty options.`;
    if (new Set(options.map((option) => option.toLocaleLowerCase())).size !== options.length) return `Question ${index + 1} has duplicate options.`;
    if (options.length > 20) return `Question ${index + 1} can have at most 20 options.`;
  }
  return '';
}

function normalizeQuestion(question, index) {
  const source = question && typeof question === 'object' ? question : {};
  const id = typeof source.id === 'string' && source.id ? source.id : `question-${index + 1}`;
  if (source.type === 'multipleChoice') {
    const options = Array.isArray(source.options) ? source.options.map((option, optionIndex) => {
      const legacyLabel = typeof option === 'string' ? option : '';
      return {
        id: typeof option?.id === 'string' && option.id ? option.id : `${id}-option-${optionIndex + 1}`,
        label: typeof option?.label === 'string' ? option.label : legacyLabel,
      };
    }) : [];
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

function AudiencePreview({ title, description, questions, onClose }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const question = questions[index];
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <section className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl">
        <div className="flex justify-between items-start gap-4">
          <div><p className="text-xs font-semibold text-brand-orange">PREVIEW · responses are not saved</p><h2 id="preview-title" className="text-xl font-bold text-brand-navy mt-1">{title || 'Untitled survey'}</h2><p className="text-sm text-brand-text-secondary mt-1">{description}</p></div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-brand-light-gray" aria-label="Close preview"><X className="w-5 h-5" /></button>
        </div>
        <div className="mt-7">
          {question ? <>
            <p className="text-xs text-brand-text-secondary mb-2">Question {index + 1} of {questions.length}</p>
            <h3 className="text-lg font-semibold text-brand-navy">{question.text || 'Your question will appear here'}</h3>
            {question.type === 'wordCloud' ? <input aria-label="Preview answer" maxLength={Number(question.maxLength)} value={answers[question.id] || ''} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder="Type your response" className="mt-4 w-full rounded-xl border border-brand-border-gray p-3 focus:ring-2 focus:ring-brand-navy" /> : <div className="mt-4 space-y-2">{question.options.filter((option) => option.label.trim()).map((option) => <label key={option.id} className="flex gap-3 items-center p-3 border border-brand-border-gray rounded-xl"><input type="radio" name={`preview-${question.id}`} checked={answers[question.id] === option.id} onChange={() => setAnswers({ ...answers, [question.id]: option.id })} />{option.label}</label>)}</div>}
          </> : <p className="text-sm text-brand-text-secondary">Add at least one question to preview this survey.</p>}
        </div>
        <div className="mt-7 flex justify-between"><button disabled={index === 0} onClick={() => setIndex(index - 1)} className="px-4 py-2 border border-brand-border-gray rounded-lg disabled:opacity-40">Previous</button>{question && index < questions.length - 1 ? <button onClick={() => setIndex(index + 1)} className="px-4 py-2 bg-brand-navy text-white rounded-lg">Next question</button> : <button onClick={onClose} className="px-4 py-2 bg-brand-navy text-white rounded-lg">Done</button>}</div>
      </section>
    </div>
  );
}

export default function CreateSurveyPlaceholderPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requestedType = searchParams.get('type');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
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
    getSurvey(id, user.uid).then((survey) => {
      if (!active) return;
      setTitle(survey.title || '');
      setDescription(survey.description || '');
      setStatus(survey.status || 'draft');
      setQuestions((survey.questions || []).map(normalizeQuestion));
      setDirty(false);
    }).catch((loadError) => {
      if (active) setError(friendlyError(loadError));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, user?.uid]);

  useEffect(() => {
    if (!dirty || saving) return undefined;
    const beforeUnload = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty, saving]);

  const titleError = useMemo(() => !title.trim() ? 'Survey title is required.' : title.trim().length > 120 ? 'Title must be 120 characters or fewer.' : '', [title]);
  const validationErrors = useMemo(() => questions.map(validateQuestion).filter(Boolean), [questions]);
  const updateQuestion = (questionId, change) => { setDirty(true); setQuestions((current) => current.map((question) => question.id === questionId ? { ...question, ...change } : question)); };
  const changeQuestionType = (questionId, type) => {
    setDirty(true);
    setQuestions((current) => current.map((question) => question.id === questionId ? applyQuestionType(question, type) : question));
  };

  const handleSave = async (nextStatus = 'draft') => {
    setError(''); setNotice('');
    if (saving) return;
    if (titleError) { setError(titleError); return; }
    if (validationErrors.length) {
      setError(validationErrors[0]);
      return;
    }
    if (nextStatus === 'published' && !questions.length) {
      setError(validationErrors[0] || 'Add and complete at least one question before publishing.');
      return;
    }
    setSaving(true);
    try {
      const savedId = await saveSurvey({ id, uid: user.uid, title, description, status: nextStatus, questions });
      setDirty(false); setStatus(nextStatus); setNotice(nextStatus === 'published' ? 'Survey marked ready to launch.' : 'Draft saved to Firestore.');
      if (!id) navigate(`/surveys/${savedId}/edit`, { replace: true });
    } catch (saveError) { setError(friendlyError(saveError)); }
    finally { setSaving(false); }
  };

  const handleStartLiveSession = async () => {
    if (startLock.current || saving) return;
    setError(''); setNotice('');
    if (titleError) { setError(titleError); return; }
    if (!questions.length) { setError('Add at least one question before starting a live session.'); return; }
    if (validationErrors.length) { setError(validationErrors[0]); return; }
    if (!user?.uid) { setError('Sign in again before starting a live session.'); return; }

    startLock.current = true;
    setStartingSession(true);
    setSaving(true);
    try {
      const savedId = await saveSurvey({ id, uid: user.uid, title, description, status, questions });
      setDirty(false);
      if (!id) navigate(`/surveys/${savedId}/edit`, { replace: true });
      const session = await startSession(savedId, user.uid);
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
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) event.preventDefault();
  };
  const moveQuestion = (index, offset) => {
    const target = index + offset;
    if (target < 0 || target >= questions.length) return;
    setDirty(true);
    setQuestions((current) => { const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
  };

  const addQuestion = (type) => {
    if (questions.length >= 200) return;
    const question = newQuestion(type);
    questionToFocus.current = question.id;
    setQuestions((current) => [...current, question]);
    setDirty(true);
    setAddQuestionOpen(false);
  };

  if (!id && !['wordCloud', 'multipleChoice'].includes(requestedType)) return <SurveyTypeSelection />;

  if (loading) return <div className="min-h-screen grid place-items-center text-brand-navy"><Loader2 className="animate-spin" /> Loading survey…</div>;

  return <div className="min-h-screen bg-brand-light-gray">
    <header className="sticky top-0 z-20 bg-white border-b border-brand-border-gray px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3"><Link onClick={leaveEditor} to="/dashboard" className="p-2 rounded-lg hover:bg-brand-light-gray" aria-label="Back to dashboard"><ArrowLeft className="w-5 h-5" /></Link><Logo size="md" /><span className="hidden sm:block text-sm text-brand-text-secondary border-l pl-3">{id ? 'Edit survey' : 'New survey'}</span></div>
      <div className="flex flex-wrap justify-end gap-2"><button onClick={() => setPreview(true)} disabled={saving} className="px-3 py-2 border border-brand-border-gray rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"><Eye className="w-4 h-4" /> Preview</button><button onClick={() => handleSave('draft')} disabled={saving} className="px-3 py-2 bg-brand-navy text-white rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-60">{saving && !startingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Draft</button><button onClick={handleStartLiveSession} disabled={saving || startingSession} className="px-3 py-2 bg-brand-orange text-white rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-60">{startingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}{startingSession ? 'Starting…' : 'Start Live Session'}</button></div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
    <div className="space-y-6">
      <div><h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">{id ? 'Edit your survey' : 'Create a survey'}</h1><p className="text-sm text-brand-text-secondary mt-1">Draft saves are private to your account. Publish marks the survey ready for a future live session.</p></div>
      {(error || notice) && <div role={error ? 'alert' : 'status'} className={`p-3 rounded-xl border text-sm ${error ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>{error || notice}</div>}
      <section className="space-y-4 rounded-card border border-border bg-white p-5 shadow-soft sm:p-7">
        <div className="flex items-center justify-between"><h2 className="font-bold text-brand-navy">Survey details</h2><Badge variant={status === 'published' ? 'success' : 'neutral'}>{status === 'published' ? 'Published' : 'Draft'}</Badge></div>
        <Input id="survey-title" label={<>Title <span className="text-accent-strong">*</span></>} maxLength={120} value={title} onChange={(event) => { setTitle(event.target.value); setDirty(true); }} placeholder="e.g. Campus event feedback" />
        <Textarea id="survey-description" label={<>Description <span className="font-normal text-muted">(optional)</span></>} maxLength={500} value={description} onChange={(event) => { setDescription(event.target.value); setDirty(true); }} rows={3} placeholder="Tell participants what this survey is about" />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between"><div><h2 className="font-bold text-brand-navy">Questions <span className="text-brand-text-secondary font-normal">({questions.length})</span></h2><p className="text-xs text-brand-text-secondary mt-1">Up to 200 questions per survey.</p></div><Button onClick={() => setAddQuestionOpen(true)} disabled={questions.length >= 200}><Plus className="h-4 w-4" />Add question</Button></div>
        {questions.length >= 200 && <p className="text-sm text-amber-800">You’ve reached the 200-question limit for this survey.</p>}
        {questions.length === 0 && <div className="rounded-card border border-dashed border-border bg-white p-10 text-center"><p className="font-semibold text-brand-navy">Start with a question</p><p className="text-sm text-brand-text-secondary mt-1">Choose a question type to add your first prompt.</p><Button className="mt-5" onClick={() => setAddQuestionOpen(true)}><Plus className="h-4 w-4" />Add question</Button></div>}
        {questions.map((question, index) => <article key={question.id} className="space-y-4 rounded-card border border-border bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-background text-xs font-bold text-primary">{index + 1}</span><Badge variant={question.type === 'wordCloud' ? 'accent' : 'primary'}>{question.type === 'wordCloud' ? 'Word Cloud' : 'Multiple Choice'}</Badge><select aria-label={`Question ${index + 1} type`} value={question.type === 'multipleChoice' ? 'multipleChoice' : 'wordCloud'} onChange={(event) => changeQuestionType(question.id, event.target.value)} className="min-h-9 rounded-lg border border-border bg-white px-2 text-xs text-muted"><option value="wordCloud">Change type: Word Cloud</option><option value="multipleChoice">Change type: Multiple Choice</option></select></div><div className="flex gap-1"><button title="Move up" aria-label="Move question up" disabled={!index} onClick={() => moveQuestion(index, -1)} className="rounded-lg p-2 text-muted hover:bg-background hover:text-primary disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button><button title="Move down" aria-label="Move question down" disabled={index === questions.length - 1} onClick={() => moveQuestion(index, 1)} className="rounded-lg p-2 text-muted hover:bg-background hover:text-primary disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button><button title="Duplicate question" aria-label="Duplicate question" onClick={() => { const copy = { ...question, id: makeId(), options: (question.options || []).map((option) => ({ ...option, id: makeId() })) }; setQuestions((current) => [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]); setDirty(true); }} className="rounded-lg p-2 text-muted hover:bg-background hover:text-primary"><Copy className="h-4 w-4" /></button><button title="Delete question" aria-label="Delete question" onClick={() => setConfirmDeleteQuestion(question.id)} className="rounded-lg p-2 text-danger hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></div>
          <Input id={`question-${question.id}`} label="Question text" value={question.text} onChange={(event) => updateQuestion(question.id, { text: event.target.value })} maxLength={300} placeholder={question.type === 'wordCloud' ? 'Describe our college in one word.' : 'What did you think of the event?'} />
          {question.type === 'wordCloud' ? <div className="max-w-xs"><label htmlFor={`length-${question.id}`} className="block text-xs font-semibold text-brand-text-secondary mb-1.5">Maximum response length (1–280)</label><input id={`length-${question.id}`} type="number" min={1} max={280} value={question.maxLength} onChange={(event) => updateQuestion(question.id, { maxLength: event.target.value === '' ? '' : Number(event.target.value) })} className="w-full border border-brand-border-gray rounded-xl px-3.5 py-2.5" /></div> : <div className="space-y-2"><div className="flex justify-between"><h3 className="text-xs font-semibold text-brand-text-secondary">Answer options ({question.options.length}/20)</h3><button disabled={question.options.length >= 20} onClick={() => updateQuestion(question.id, { options: [...question.options, { id: makeId(), label: '' }] })} className="text-xs font-semibold text-brand-navy disabled:opacity-40">+ Add option</button></div>{question.options.map((option, optionIndex) => <div key={option.id} className="flex gap-2"><input aria-label={`Option ${optionIndex + 1}`} value={option.label} maxLength={120} onChange={(event) => updateQuestion(question.id, { options: question.options.map((item) => item.id === option.id ? { ...item, label: event.target.value } : item) })} placeholder={`Option ${optionIndex + 1}`} className="flex-1 border border-brand-border-gray rounded-lg px-3 py-2" /><button aria-label={`Move option ${optionIndex + 1} up`} disabled={optionIndex === 0} onClick={() => { const next = [...question.options]; [next[optionIndex - 1], next[optionIndex]] = [next[optionIndex], next[optionIndex - 1]]; updateQuestion(question.id, { options: next }); }} className="p-2 border border-brand-border-gray rounded-lg disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button><button aria-label={`Move option ${optionIndex + 1} down`} disabled={optionIndex === question.options.length - 1} onClick={() => { const next = [...question.options]; [next[optionIndex + 1], next[optionIndex]] = [next[optionIndex], next[optionIndex + 1]]; updateQuestion(question.id, { options: next }); }} className="p-2 border border-brand-border-gray rounded-lg disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button><button aria-label={`Remove option ${optionIndex + 1}`} disabled={question.options.length <= 2} onClick={() => updateQuestion(question.id, { options: question.options.filter((item) => item.id !== option.id) })} className="p-2 text-red-600 border border-brand-border-gray rounded-lg disabled:opacity-30"><X className="w-4 h-4" /></button></div>)}</div>}
          {validateQuestion(question, index) && <p className="text-xs text-amber-700">{validateQuestion(question, index)}</p>}
          {confirmDeleteQuestion === question.id && <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center justify-between gap-3"><span className="text-sm text-red-800">Delete this question?</span><div className="flex gap-2"><button onClick={() => setConfirmDeleteQuestion(null)} className="px-3 py-1.5 text-xs border border-red-200 rounded-lg">Cancel</button><button onClick={() => { setQuestions((current) => current.filter((item) => item.id !== question.id)); setConfirmDeleteQuestion(null); setDirty(true); }} className="px-3 py-1.5 text-xs bg-red-700 text-white rounded-lg">Delete question</button></div></div>}
        </article>)}
      </section>
      <footer className="sticky bottom-3 z-10 flex flex-col items-start justify-between gap-3 rounded-card border border-border bg-white/95 p-4 shadow-card backdrop-blur sm:flex-row sm:items-center sm:p-5"><p className="text-xs text-brand-text-secondary">{saving ? 'Saving…' : error ? 'Save failed' : dirty ? 'Unsaved changes' : 'Saved'} · Changes save privately to your account.</p><div className="flex w-full gap-2 sm:w-auto"><Button variant="secondary" onClick={() => handleSave('draft')} disabled={saving || Boolean(titleError)} className="flex-1 sm:flex-none">Save Draft</Button><Button onClick={() => handleSave('published')} disabled={saving || Boolean(titleError) || !questions.length || Boolean(validationErrors.length)} className="flex-1 sm:flex-none">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Publish</Button></div></footer>
    </div>
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-card border border-border bg-white p-5 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-wider text-accent-strong">Participant preview</p>
        <h2 className="mt-2 text-lg font-bold text-primary">{title || 'Untitled survey'}</h2>
        <p className="mt-1 text-sm text-muted">{description || 'Description appears here.'}</p>
        {questions[0] ? (
          <div className="mt-5">
            <p className="text-xs text-muted">Question 1 of {questions.length}</p>
            <p className="mt-2 font-semibold text-primary">{questions[0].text || 'Your question will appear here'}</p>
            {questions[0].type === 'wordCloud' ? (
              <div className="mt-3 rounded-xl border border-dashed border-border px-3 py-8 text-center text-sm text-muted">Short answer field</div>
            ) : (
              <div className="mt-3 space-y-2">
                {(questions[0].options || []).filter((option) => option.label.trim()).map((option) => (
                  <div key={option.id} className="rounded-xl border border-border px-3 py-2 text-sm">{option.label}</div>
                ))}
              </div>
            )}
          </div>
        ) : <p className="mt-5 text-sm text-muted">Add a question to see how it will look on a phone.</p>}
      </div>
    </aside>
    </div>
    </main>
    {preview && <AudiencePreview title={title} description={description} questions={questions} onClose={() => setPreview(false)} />}
    <Modal open={addQuestionOpen} onClose={() => setAddQuestionOpen(false)} title="How would you like to collect responses?" description="Choose a format to start building your survey." className="bg-background sm:!max-w-2xl">
      <div className="grid items-stretch gap-4 sm:grid-cols-2">
        <button type="button" onClick={() => addQuestion('wordCloud')} className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><span className="absolute inset-x-0 top-0 h-1 bg-accent" /><span className="flex items-center justify-between pt-1"><span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-accent-strong"><Cloud className="h-4 w-4" /></span><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Open-ended</span></span><span aria-hidden="true" className="mt-3 grid h-24 place-items-center rounded-lg bg-[#F7F8FA]"><span className="relative grid h-16 w-20 place-items-center rounded-full bg-white text-accent-strong shadow-sm"><Cloud className="h-8 w-8" /><i className="absolute left-1 top-4 h-2 w-2 rounded-full bg-primary/20" /><i className="absolute right-1 top-6 h-3 w-3 rounded-full bg-accent/30" /><i className="absolute bottom-1 left-7 h-2 w-2 rounded-full bg-primary/30" /></span></span><span className="mt-3 block text-base font-bold tracking-tight text-[#142E59]">Word Cloud</span><span className="mt-1 block min-h-10 text-sm leading-5 text-muted">Collect ideas and short responses from your audience.</span><span className="mt-3 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-primary">Choose Word Cloud<ArrowRight className="h-4 w-4 text-accent-strong transition-transform group-hover:translate-x-0.5" /></span></button>
        <button type="button" onClick={() => addQuestion('multipleChoice')} className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><span className="absolute inset-x-0 top-0 h-1 bg-primary" /><span className="flex items-center justify-between pt-1"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary"><BarChart3 className="h-4 w-4" /></span><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Quick polls</span></span><span aria-hidden="true" className="mt-3 block h-24 rounded-lg bg-[#F7F8FA] p-3"><span className="block text-[11px] font-semibold text-text">Which topic next?</span>{[['Product ideas', 76], ['Customer stories', 56], ['Team culture', 34]].map(([label, width], index) => <span key={label} className="mt-1.5 flex items-center gap-1.5"><span className={`h-3 w-3 shrink-0 rounded-full border ${index === 0 ? 'border-primary bg-primary' : 'border-slate-300 bg-white'}`} /><span className="min-w-0 flex-1 truncate text-[9px] text-muted">{label}</span><span className="h-1 w-10 overflow-hidden rounded-full bg-white"><span className="block h-full rounded-full bg-primary/70" style={{ width: `${width}%` }} /></span></span>)}</span><span className="mt-3 block text-base font-bold tracking-tight text-[#142E59]">Multiple Choice</span><span className="mt-1 block min-h-10 text-sm leading-5 text-muted">Let participants choose from predefined answers.</span><span className="mt-3 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-primary">Choose Multiple Choice<ArrowRight className="h-4 w-4 text-accent-strong transition-transform group-hover:translate-x-0.5" /></span></button>
      </div>
    </Modal>
  </div>;
}
