import React, { useState } from 'react';
import { BarChart3, Cloud, Plus, Sparkles, RefreshCw } from 'lucide-react';

export default function InteractivePreviews() {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'cloud'

  // Mock Poll Data
  const initialPollVotes = [
    { id: 1, label: 'Instant Realtime Sync', count: 42, color: 'bg-brand-navy' },
    { id: 2, label: 'No Audience App Required', count: 36, color: 'bg-brand-orange' },
    { id: 3, label: 'Clean, Non-distracting UI', count: 28, color: 'bg-blue-600' },
    { id: 4, label: 'QR Code Auto-Join', count: 21, color: 'bg-slate-700' },
  ];
  const [pollVotes, setPollVotes] = useState(initialPollVotes);

  // Mock Word Cloud Data
  const initialCloudWords = [
    { text: 'Clarity', weight: 38 },
    { text: 'Trust', weight: 46 },
    { text: 'Empathy', weight: 29 },
    { text: 'Speed', weight: 34 },
    { text: 'Alignment', weight: 24 },
    { text: 'Focus', weight: 31 },
    { text: 'Transparency', weight: 40 },
    { text: 'Feedback', weight: 26 },
    { text: 'Synergy', weight: 19 },
    { text: 'Creativity', weight: 33 },
  ];
  const [cloudWords, setCloudWords] = useState(initialCloudWords);
  const [newWord, setNewWord] = useState('');

  const totalPollVotes = pollVotes.reduce((sum, item) => sum + item.count, 0);

  const simulateVote = (id) => {
    setPollVotes(prev =>
      prev.map(item => (item.id === id ? { ...item, count: item.count + 1 } : item))
    );
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    const trimmed = newWord.trim();
    if (!trimmed) return;

    setCloudWords(prev => {
      const existing = prev.find(w => w.text.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        return prev.map(w =>
          w.text.toLowerCase() === trimmed.toLowerCase() ? { ...w, weight: w.weight + 8 } : w
        );
      }
      return [...prev, { text: trimmed, weight: 28 }];
    });
    setNewWord('');
  };

  const resetDemos = () => {
    setPollVotes(initialPollVotes);
    setCloudWords(initialCloudWords);
  };

  return (
    <section id="preview" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Product Demonstration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Experience Results Before You Launch
          </h2>
          <p className="text-base sm:text-lg text-brand-text-secondary mt-3">
            Test how Askly calculates percentages and scales word clouds in real time. (Demonstration preview uses client-side simulated data).
          </p>
        </div>

        {/* Tab Selector & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mb-6">
          <div className="flex bg-brand-light-gray p-1 rounded-xl border border-brand-border-gray">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'chart'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-brand-text-secondary hover:text-brand-navy'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Multiple Choice Bar Chart</span>
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'cloud'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-brand-text-secondary hover:text-brand-navy'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Live Word Cloud</span>
            </button>
          </div>

          <button
            onClick={resetDemos}
            className="text-xs text-brand-text-secondary hover:text-brand-navy flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border-gray hover:bg-brand-light-gray transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Display Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-brand-border-gray shadow-md overflow-hidden">
          {activeTab === 'chart' ? (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-border-gray gap-3">
                <div>
                  <span className="text-xs font-semibold text-brand-orange uppercase">Sample Multiple Choice Poll</span>
                  <h3 className="text-xl font-bold text-brand-navy mt-1">
                    What is most critical when presenting to your audience?
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-2xl font-black text-brand-navy font-mono">{totalPollVotes}</span>
                  <span className="block text-xs text-brand-text-secondary">Total Votes Recorded</span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="py-6 space-y-4">
                {pollVotes.map((item) => {
                  const percent = totalPollVotes > 0 ? Math.round((item.count / totalPollVotes) * 100) : 0;
                  return (
                    <div key={item.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-brand-navy">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => simulateVote(item.id)}
                            className="text-xs px-2 py-0.5 rounded bg-brand-light-blue text-brand-navy hover:bg-brand-navy hover:text-white transition-colors flex items-center gap-1 font-medium"
                            title="Simulate audience vote"
                          >
                            <Plus className="w-3 h-3" />
                            Vote
                          </button>
                          <span className="text-xs text-brand-text-secondary font-mono">{item.count} votes</span>
                          <span className="text-sm font-bold text-brand-navy font-mono w-10 text-right">{percent}%</span>
                        </div>
                      </div>

                      {/* Bar Fill */}
                      <div className="h-3 w-full bg-brand-light-gray rounded-full overflow-hidden border border-brand-border-gray">
                        <div
                          className={`h-full ${item.color} transition-all duration-500 ease-out rounded-full`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-brand-light-blue/40 rounded-xl border border-brand-border-gray flex items-center justify-between text-xs text-brand-navy">
                <span>💡 Tip: Click any "Vote" button above to observe instantaneous re-calculation of relative percentages.</span>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-border-gray gap-3">
                <div>
                  <span className="text-xs font-semibold text-brand-orange uppercase">Sample Live Word Cloud</span>
                  <h3 className="text-xl font-bold text-brand-navy mt-1">
                    What one word best describes effective teamwork?
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-2xl font-black text-brand-navy font-mono">{cloudWords.length}</span>
                  <span className="block text-xs text-brand-text-secondary">Unique Submissions</span>
                </div>
              </div>

              {/* Dynamic Word Cloud Container */}
              <div className="py-8 min-h-[260px] bg-brand-light-gray/50 rounded-xl my-4 border border-brand-border-gray flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-6">
                {cloudWords.map((w, index) => {
                  // Scale font size based on weight (min 14px, max 38px)
                  const fontSize = Math.min(38, Math.max(14, w.weight));
                  const isTop = w.weight >= 40;
                  const isMid = w.weight >= 28 && w.weight < 40;

                  const colorClass = isTop
                    ? 'text-brand-orange font-black'
                    : isMid
                    ? 'text-brand-navy font-bold'
                    : 'text-brand-navy-light font-semibold';

                  return (
                    <span
                      key={index}
                      style={{ fontSize: `${fontSize}px` }}
                      className={`${colorClass} transition-all duration-300 hover:scale-110 cursor-pointer select-none leading-none`}
                      title={`${w.text}: weight ${w.weight}`}
                      onClick={() => {
                        setCloudWords(prev =>
                          prev.map((item, i) =>
                            i === index ? { ...item, weight: item.weight + 6 } : item
                          )
                        );
                      }}
                    >
                      {w.text}
                    </span>
                  );
                })}
              </div>

              {/* Add Word Form */}
              <form onSubmit={handleAddWord} className="flex flex-col sm:flex-row gap-2 mt-4">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Type a word to add to the cloud (e.g. Resilience)..."
                  maxLength={25}
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-brand-border-gray focus:outline-none focus:ring-2 focus:ring-brand-navy bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Word</span>
                </button>
              </form>
              <p className="text-xs text-brand-text-secondary mt-2">
                Click any word in the cloud to increase its frequency weight or enter a new response above.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
