import React, { useState } from 'react';
import { BarChart3, Cloud, Check, Plus, Users, Sparkles, RefreshCw } from 'lucide-react';

export default function SamplePollPreview() {
  const [activeTab, setActiveTab] = useState('choice'); // 'choice' | 'cloud'

  // Poll state
  const [selectedOption, setSelectedOption] = useState(0);
  const [votes, setVotes] = useState({
    0: 42, // Scaling Cloud Architecture
    1: 31, // AI & Intelligent Agents
    2: 19, // User Experience & Design
    3: 8,  // Security & Compliance
  });

  const pollOptions = [
    { id: 0, text: 'Scaling Cloud Architecture', color: 'bg-primary' },
    { id: 1, text: 'AI & Intelligent Agents', color: 'bg-secondary' },
    { id: 2, text: 'User Experience & Design', color: 'bg-accent' },
    { id: 3, text: 'Security & Compliance', color: 'bg-slate-500' },
  ];

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  const handleVote = (id) => {
    if (selectedOption === id) return;
    setVotes((prev) => ({
      ...prev,
      [selectedOption]: Math.max(0, prev[selectedOption] - 1),
      [id]: prev[id] + 1,
    }));
    setSelectedOption(id);
  };

  // Word Cloud state
  const initialWords = [
    { text: 'Clarity', count: 38 },
    { text: 'Trust', count: 46 },
    { text: 'Speed', count: 29 },
    { text: 'Alignment', count: 34 },
    { text: 'Focus', count: 24 },
    { text: 'Transparency', count: 40 },
    { text: 'Feedback', count: 26 },
    { text: 'Synergy', count: 20 },
    { text: 'Creativity', count: 32 },
  ];
  const [cloudWords, setCloudWords] = useState(initialWords);
  const [newWord, setNewWord] = useState('');

  const handleAddWord = (e) => {
    e.preventDefault();
    const clean = newWord.trim();
    if (!clean) return;

    setCloudWords((prev) => {
      const match = prev.find((w) => w.text.toLowerCase() === clean.toLowerCase());
      if (match) {
        return prev.map((w) =>
          w.text.toLowerCase() === clean.toLowerCase() ? { ...w, count: w.count + 8 } : w
        );
      }
      return [...prev, { text: clean, count: 25 }];
    });
    setNewWord('');
  };

  const handleUpvoteWord = (index) => {
    setCloudWords((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, count: item.count + 6 } : item))
    );
  };

  const maxCloudCount = Math.max(1, ...cloudWords.map((w) => w.count));

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-card transition-colors duration-200">
      {/* Top Session Mock Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-bold text-text uppercase tracking-wider text-[11px]">Live Session</span>
          <span className="text-muted hidden sm:inline">·</span>
          <span className="hidden sm:inline font-mono font-medium text-muted bg-surface-secondary px-2 py-0.5 rounded border border-border text-[11px]">
            PIN: 489 201
          </span>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-surface-secondary p-1 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('choice')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              activeTab === 'choice'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Poll</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              activeTab === 'cloud'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <Cloud className="h-3.5 w-3.5" />
            <span>Word Cloud</span>
          </button>
        </div>
      </div>

      {/* Main interactive area */}
      <div className="pt-5">
        {activeTab === 'choice' ? (
          <div>
            <div className="mb-4">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                Interactive Multiple Choice
              </span>
              <h3 className="text-base sm:text-lg font-bold text-text mt-1 leading-snug">
                What is your team’s top priority for next quarter?
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Click any option below to simulate audience voting and observe instant recalculation.
              </p>
            </div>

            <div className="space-y-2.5">
              {pollOptions.map((opt) => {
                const count = votes[opt.id] || 0;
                const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isSelected = selectedOption === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleVote(opt.id)}
                    className={`relative w-full overflow-hidden rounded-xl border p-3.5 text-left transition-all group ${
                      isSelected
                        ? 'border-primary bg-primary-soft/50 shadow-xs'
                        : 'border-border bg-surface hover:border-primary/40'
                    }`}
                  >
                    {/* Animated fill bar */}
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/10 dark:bg-primary/20 transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary text-white'
                              : 'border-muted/40 group-hover:border-primary'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? 'font-bold text-primary' : 'text-text'}`}>
                          {opt.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 pl-2 shrink-0">
                        <span className="font-mono text-xs text-muted">{count} votes</span>
                        <span className="font-mono text-xs font-bold text-text w-9 text-right">
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
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                Dynamic Word Cloud
              </span>
              <h3 className="text-base sm:text-lg font-bold text-text mt-1 leading-snug">
                Describe effective collaboration in one word.
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Click any word to increase its weight or add a new word below.
              </p>
            </div>

            {/* Cloud area */}
            <div className="min-h-[200px] flex flex-wrap items-center justify-center gap-3 rounded-xl border border-border bg-surface-secondary/50 p-5 text-center">
              {cloudWords.map((word, idx) => {
                const ratio = word.count / maxCloudCount;
                const fontSize = Math.round(14 + ratio * 20); // 14px to 34px
                const isHighlight = ratio > 0.8;
                const isMid = ratio > 0.5 && ratio <= 0.8;

                const colorClass = isHighlight
                  ? 'text-primary font-extrabold'
                  : isMid
                  ? 'text-accent font-bold'
                  : 'text-text font-semibold';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUpvoteWord(idx)}
                    title={`${word.text}: ${word.count} mentions`}
                    style={{ fontSize: `${fontSize}px` }}
                    className={`${colorClass} transition-all duration-200 hover:scale-110 cursor-pointer select-none leading-none px-1.5 py-0.5 rounded hover:bg-surface-secondary`}
                  >
                    {word.text}
                  </button>
                );
              })}
            </div>

            {/* Submit word form */}
            <form onSubmit={handleAddWord} className="mt-3.5 flex gap-2">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Submit a word (e.g. Resilience)..."
                maxLength={20}
                className="ui-field min-h-10 flex-1 py-1.5 text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="ui-interactive inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Submit</span>
              </button>
            </form>
          </div>
        )}

        {/* Footer Meta */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-3.5 text-xs text-muted">
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-bold text-text">{totalVotes}</span>
            <span>responses gathered</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Interactive Demo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
