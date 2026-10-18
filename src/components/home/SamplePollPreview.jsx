import React, { useState } from 'react';
import { Users, BarChart3, Cloud, CheckCircle2, QrCode } from 'lucide-react';

export default function SamplePollPreview() {
  const [activeTab, setActiveTab] = useState('choice'); // 'choice' | 'cloud'
  const [selectedOption, setSelectedOption] = useState(0);
  const [votes, setVotes] = useState({
    0: 24, // Full-Stack React & Firebase
    1: 18, // AI & Intelligent Agents
    2: 12, // Cloud-Native Architecture
    3: 7   // Cybersecurity & Zero Trust
  });

  const options = [
    { id: 0, text: 'Full-Stack React & Firebase', color: 'bg-brand-navy' },
    { id: 1, text: 'AI & Intelligent Agents', color: 'bg-brand-orange' },
    { id: 2, text: 'Cloud-Native Architecture', color: 'bg-blue-500' },
    { id: 3, text: 'Cybersecurity & Zero Trust', color: 'bg-slate-600' }
  ];

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  const handleVote = (id) => {
    if (selectedOption === id) return;
    setVotes(prev => ({
      ...prev,
      [selectedOption]: Math.max(0, prev[selectedOption] - 1),
      [id]: prev[id] + 1
    }));
    setSelectedOption(id);
  };

  const sampleWords = [
    { text: 'Engaging', size: 'text-2xl font-bold', color: 'text-brand-navy' },
    { text: 'Interactive', size: 'text-xl font-semibold', color: 'text-brand-orange' },
    { text: 'Instant', size: 'text-lg font-medium', color: 'text-brand-navy-light' },
    { text: 'Clean Design', size: 'text-xl font-bold', color: 'text-brand-navy' },
    { text: 'Realtime', size: 'text-3xl font-extrabold', color: 'text-brand-orange' },
    { text: 'Audience Insights', size: 'text-lg font-medium', color: 'text-slate-600' },
    { text: 'Collaborative', size: 'text-xl font-semibold', color: 'text-brand-navy' },
    { text: 'No-friction Join', size: 'text-base font-normal', color: 'text-brand-text-secondary' },
    { text: 'Empowering', size: 'text-lg font-medium', color: 'text-brand-navy' },
    { text: 'Dynamic', size: 'text-2xl font-bold', color: 'text-brand-navy-light' },
    { text: 'Mobile First', size: 'text-base font-semibold', color: 'text-brand-orange' },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-brand-navy/5 border border-brand-border-gray overflow-hidden transition-all">
      {/* Top Session Bar */}
      <div className="bg-brand-light-gray px-4 py-3 border-b border-brand-border-gray flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-brand-navy uppercase tracking-wider">Live Session</span>
          <span className="hidden sm:inline text-brand-text-secondary">•</span>
          <span className="hidden sm:inline font-mono font-medium text-brand-text-secondary bg-white px-2 py-0.5 rounded border border-brand-border-gray">
            CODE: 489 201
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg p-0.5 border border-brand-border-gray text-xs">
            <button
              onClick={() => setActiveTab('choice')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'choice'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-brand-text-secondary hover:text-brand-navy'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Poll</span>
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'cloud'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-brand-text-secondary hover:text-brand-navy'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Word Cloud</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview Content */}
      <div className="p-5 sm:p-6">
        {activeTab === 'choice' ? (
          <div>
            <div className="mb-4">
              <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
                Question 1 of 3
              </span>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy mt-1 leading-snug">
                Which technology would you most like to learn?
              </h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Click an option below to test the live voting simulation.
              </p>
            </div>

            {/* Multiple Choice Interactive List */}
            <div className="space-y-2.5">
              {options.map((opt) => {
                const count = votes[opt.id] || 0;
                const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isSelected = selectedOption === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(opt.id)}
                    className={`w-full text-left relative overflow-hidden rounded-xl border p-3.5 transition-all text-sm group ${
                      isSelected
                        ? 'border-brand-navy bg-brand-light-blue/40 shadow-xs'
                        : 'border-brand-border-gray hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Animated Progress Bar fill behind content */}
                    <div
                      className="absolute inset-y-0 left-0 bg-brand-light-blue/60 transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative flex items-center justify-between z-10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs transition-colors ${
                            isSelected
                              ? 'border-brand-navy bg-brand-navy text-white'
                              : 'border-slate-300 group-hover:border-slate-400'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-brand-navy font-semibold' : 'text-brand-text-primary'}`}>
                          {opt.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                        <span className="text-xs text-brand-text-secondary font-mono">
                          {count} votes
                        </span>
                        <span className="text-xs font-bold text-brand-navy font-mono w-9 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
                Question 2 of 3 • Word Cloud
              </span>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy mt-1 leading-snug">
                Describe our college in one word.
              </h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Real-time frequency visualization generated from audience submissions.
              </p>
            </div>

            {/* Word Cloud Visualizer */}
            <div className="bg-brand-light-gray/60 rounded-xl p-6 border border-brand-border-gray min-h-[220px] flex flex-wrap items-center justify-center gap-3 text-center">
              {sampleWords.map((word, idx) => (
                <span
                  key={idx}
                  className={`${word.size} ${word.color} transition-all duration-300 hover:scale-110 cursor-default select-none px-2 py-0.5`}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-brand-border-gray flex items-center justify-between text-xs text-brand-text-secondary">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-navy" />
            <span className="font-semibold text-brand-navy">{totalVotes + 1}</span>
            <span>participants joined</span>
          </div>
          <div className="flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-brand-text-secondary" />
            <span>Scan to vote</span>
          </div>
        </div>
      </div>
    </div>
  );
}
