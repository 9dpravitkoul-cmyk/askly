import React from 'react';
import { Layers, Sparkles, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TemplatesView({ onUseTemplate }) {
  const navigate = useNavigate();

  const templates = [
    {
      id: 'tpl-1',
      title: 'College Lecture Comprehension',
      category: 'Education',
      description: 'Quick formative assessment for lecture mid-points. Gauges concept clarity and student questions.',
      questions: 3,
      formats: 'Multiple Choice & Word Cloud',
      tags: ['University', 'Quick Poll']
    },
    {
      id: 'tpl-2',
      title: 'Conference Keynote Icebreaker',
      category: 'Events',
      description: 'Engage hundreds of attendees in under 60 seconds with live word clouds and excitement bar charts.',
      questions: 2,
      formats: 'Word Cloud & Multiple Choice',
      tags: ['Keynote', 'Icebreaker']
    },
    {
      id: 'tpl-3',
      title: 'Agile Sprint Retrospective',
      category: 'Workplace',
      description: 'Anonymous team sentiment check to identify project blockers and celebrate wins.',
      questions: 4,
      formats: 'Multiple Choice & Open Cloud',
      tags: ['Team', 'Sprint']
    },
    {
      id: 'tpl-4',
      title: 'Workshop Skill Diagnostic',
      category: 'Training',
      description: 'Pre-workshop baseline poll to tailor tutorial pace according to attendee experience.',
      questions: 3,
      formats: 'Multiple Choice',
      tags: ['Hands-on', 'Baseline']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-border-gray pb-4">
        <h2 className="text-xl font-bold text-brand-navy">Survey & Poll Templates</h2>
        <p className="text-xs text-brand-text-secondary mt-1">
          Jumpstart your session using verified templates designed for high audience response rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-brand-border-gray p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-light-blue text-brand-navy border border-brand-border-gray">
                  {tpl.category}
                </span>
                <span className="text-[11px] text-brand-text-secondary font-medium">
                  {tpl.questions} Questions
                </span>
              </div>

              <h3 className="text-base font-bold text-brand-navy mb-1.5">{tpl.title}</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed mb-4">{tpl.description}</p>

              <div className="flex items-center gap-1.5 flex-wrap">
                {tpl.tags.map(t => (
                  <span key={t} className="text-[11px] bg-brand-light-gray px-2 py-0.5 rounded text-brand-text-secondary border border-brand-border-gray">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border-gray flex items-center justify-between">
              <span className="text-[11px] text-brand-text-secondary font-medium">{tpl.formats}</span>
              <button
                onClick={() => navigate('/surveys/new')}
                className="px-3.5 py-1.5 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Use Template</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
