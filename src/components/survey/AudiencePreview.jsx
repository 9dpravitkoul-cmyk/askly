import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AudiencePreview({ survey, onClose }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  if (!survey) return null;
  const question = survey.questions?.[index];
  const previewIssues = [
    !survey.title?.trim() && 'Add a survey title.',
    !survey.questions?.length && 'Add at least one question.',
    ...(survey.questions || []).flatMap((item, questionIndex) => {
      const issues = [];
      if (!item.text?.trim()) issues.push(`Question ${questionIndex + 1} needs text.`);
      if (item.type === 'multipleChoice' && (item.options || []).filter((option) => option.label?.trim()).length < 2) issues.push(`Question ${questionIndex + 1} needs at least two options.`);
      if (item.type === 'wordCloud' && (!Number.isInteger(item.maxLength) || item.maxLength < 1 || item.maxLength > 280)) issues.push(`Question ${questionIndex + 1} needs a valid response length.`);
      return issues;
    }),
  ].filter(Boolean);
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="audience-preview-title">
      <section className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl">
        <div className="flex justify-between items-start gap-4">
          <div><p className="text-xs font-semibold text-brand-orange">PREVIEW · responses are not saved</p><h2 id="audience-preview-title" className="text-xl font-bold text-brand-navy mt-1">{survey.title || 'Untitled survey'}</h2><p className="text-sm text-brand-text-secondary mt-1">{survey.description}</p></div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-brand-light-gray" aria-label="Close preview"><X className="w-5 h-5" /></button>
        </div>
        {previewIssues.length > 0 && <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900"><p className="font-semibold">This preview is incomplete</p><ul className="list-disc pl-4 mt-1">{previewIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
        <div className="mt-7">
          {question ? <>
            <p className="text-xs text-brand-text-secondary mb-2">Question {index + 1} of {survey.questions.length}</p>
            <h3 className="text-lg font-semibold text-brand-navy">{question.text || 'Your question will appear here'}</h3>
            {question.type === 'wordCloud' ? <input aria-label="Preview answer" maxLength={Number(question.maxLength)} value={answers[question.id] || ''} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder="Type your response" className="mt-4 w-full rounded-xl border border-brand-border-gray p-3 focus:ring-2 focus:ring-brand-navy" /> : <div className="mt-4 space-y-2">{question.options?.filter((option) => option.label.trim()).map((option) => <label key={option.id} className="flex gap-3 items-center p-3 border border-brand-border-gray rounded-xl"><input type="radio" name={`preview-${question.id}`} checked={answers[question.id] === option.id} onChange={() => setAnswers({ ...answers, [question.id]: option.id })} />{option.label}</label>)}</div>}
          </> : <p className="text-sm text-brand-text-secondary">Add at least one question to preview this survey.</p>}
        </div>
        <div className="mt-7 flex justify-between"><button disabled={index === 0} onClick={() => setIndex(index - 1)} className="px-4 py-2 border border-brand-border-gray rounded-lg disabled:opacity-40">Previous</button>{question && index < survey.questions.length - 1 ? <button onClick={() => setIndex(index + 1)} className="px-4 py-2 bg-brand-navy text-white rounded-lg">Next question</button> : <button onClick={onClose} className="px-4 py-2 bg-brand-navy text-white rounded-lg">Done</button>}</div>
      </section>
    </div>
  );
}
