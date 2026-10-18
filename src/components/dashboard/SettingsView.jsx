import React, { useState } from 'react';
import { Settings, Shield, Bell, Smartphone, Moon } from 'lucide-react';

export default function SettingsView() {
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showLivePercentages, setShowLivePercentages] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-brand-border-gray pb-4">
        <h2 className="text-xl font-bold text-brand-navy">Session Preferences</h2>
        <p className="text-xs text-brand-text-secondary mt-1">
          Configure default behavior for your interactive polling rooms and audience joining flows.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border-gray p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-4 text-xs">
          {/* Setting item 1 */}
          <div className="flex items-center justify-between py-2 border-b border-brand-border-gray">
            <div>
              <p className="font-semibold text-brand-navy text-sm">Anonymous Audience Participation</p>
              <p className="text-brand-text-secondary mt-0.5">
                Participants do not need to register or provide personal credentials to submit votes.
              </p>
            </div>
            <button
              onClick={() => setAllowAnonymous(!allowAnonymous)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                allowAnonymous ? 'bg-brand-navy' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  allowAnonymous ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Setting item 2 */}
          <div className="flex items-center justify-between py-2 border-b border-brand-border-gray">
            <div>
              <p className="font-semibold text-brand-navy text-sm">Real-time Percentage Visibility</p>
              <p className="text-brand-text-secondary mt-0.5">
                Display live percentages and animated bars on host screen as votes arrive.
              </p>
            </div>
            <button
              onClick={() => setShowLivePercentages(!showLivePercentages)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                showLivePercentages ? 'bg-brand-navy' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  showLivePercentages ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Setting item 3 */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-brand-navy text-sm">Auto-Advance Questions</p>
              <p className="text-brand-text-secondary mt-0.5">
                Automatically transition to the next question when voting timer expires.
              </p>
            </div>
            <button
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                autoAdvance ? 'bg-brand-navy' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoAdvance ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-2 text-xs text-brand-text-secondary">
          Settings are saved to local session preferences.
        </div>
      </div>
    </div>
  );
}
