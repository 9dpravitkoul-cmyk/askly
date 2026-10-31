import React from 'react';

export function validVote(vote, question) {
  if (!vote || vote.questionId !== question.id || vote.type !== question.type
    || typeof vote.participantUid !== 'string' || vote.id !== `${question.id}_${vote.participantUid}`) return false;
  if (question.type === 'wordCloud') {
    return typeof vote.response === 'string' && vote.response.trim().length > 0
      && vote.response.length <= question.maxLength;
  }
  return question.type === 'multipleChoice' && (question.options || []).some((option) =>
    vote.option && option.id === vote.option.id && option.label === vote.option.label);
}

const WORD_COLORS = [
  'text-primary',
  'text-secondary',
  'text-primary-dark',
  'text-secondary-hover',
];

export default function QuestionResults({ question, votes, compact = false }) {
  const answers = votes.filter((vote) => validVote(vote, question));

  if (question.type === 'wordCloud') {
    const phrases = new Map();
    answers.forEach(({ response }) => {
      const display = response.normalize('NFC').trim().replace(/\s+/g, ' ');
      const key = display.toLocaleLowerCase();
      const phrase = phrases.get(key) || { text: display, count: 0 };
      phrase.count += 1;
      phrases.set(key, phrase);
    });

    const words = [...phrases.values()].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
    const max = Math.max(1, ...words.map((word) => word.count));

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{answers.length} {answers.length === 1 ? 'response' : 'responses'} received</span>
          {words.length > 0 && <span>{words.length} unique {words.length === 1 ? 'word' : 'words'}</span>}
        </div>

        {words.length ? (
          <div
            className={`mt-4 flex flex-wrap content-center items-center justify-center gap-x-6 gap-y-5 rounded-2xl border border-border bg-surface-secondary/60 p-6 sm:p-10 transition-colors ${
              compact ? 'min-h-48' : 'min-h-72'
            }`}
            aria-label="Live word cloud results"
          >
            {words.map((word, index) => {
              const colorClass = WORD_COLORS[index % WORD_COLORS.length];
              const scale = 1 + (word.count / max) * 0.8;
              const fontSize = Math.round(15 + (word.count / max) * (compact ? 18 : 28));

              return (
                <div
                  key={word.text.toLocaleLowerCase()}
                  title={`${word.count} ${word.count === 1 ? 'response' : 'responses'}`}
                  className="group relative cursor-default transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <span
                    className={`inline-block font-extrabold tracking-tight transition-transform ${colorClass}`}
                    style={{ fontSize: `clamp(14px, ${fontSize}px, ${compact ? 32 : 48}px)` }}
                  >
                    {word.text}
                  </span>
                  {word.count > 1 && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary align-super">
                      {word.count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface-secondary/40 p-10 text-center">
            <p className="font-semibold text-text">Waiting for words</p>
            <p className="mt-1 text-xs text-muted">Submitted phrases appear here in real time, sized by popularity.</p>
          </div>
        )}
      </div>
    );
  }

  // Multiple Choice Bar Chart
  const options = question.options || [];
  const counts = new Map(options.map((option) => [option.id, 0]));
  answers.forEach((vote) => counts.set(vote.option.id, (counts.get(vote.option.id) || 0) + 1));
  const maxCount = Math.max(0, ...counts.values());
  const barMax = compact ? 170 : 240;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>{answers.length} {answers.length === 1 ? 'total response' : 'total responses'}</span>
        {answers.length === 0 && (
          <span className="rounded-full bg-surface-secondary px-2.5 py-1 font-medium text-muted">
            Waiting for first vote
          </span>
        )}
      </div>

      <div className="mt-5 overflow-x-auto pb-4">
        <div
          className="grid items-end gap-3 sm:gap-6 border-b border-border px-2 pt-4"
          style={{
            gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(5.5rem, 1fr))`,
            minWidth: `${Math.max(options.length * 90, 200)}px`,
          }}
        >
          {options.map((option, idx) => {
            const count = counts.get(option.id) || 0;
            const percentage = answers.length ? Math.round((count / answers.length) * 100) : 0;
            const barHeight = maxCount ? (count / maxCount) * barMax : 0;
            const isTop = count > 0 && count === maxCount;

            return (
              <div key={option.id} className="flex min-w-0 flex-col items-center group">
                {/* Count and Percentage label */}
                <div className="mb-2.5 flex flex-col items-center">
                  <span className={`text-xs sm:text-sm font-bold tabular-nums ${isTop ? 'text-primary' : 'text-text'}`}>
                    {count}
                  </span>
                  <span className="text-[11px] font-semibold text-muted">
                    {percentage}%
                  </span>
                </div>

                {/* Vertical Bar Track */}
                <div
                  className="flex w-full items-end justify-center rounded-t-xl bg-surface-secondary/70 p-1"
                  style={{ height: barMax }}
                >
                  <div
                    role="img"
                    aria-label={`${option.label}: ${count} votes, ${percentage} percent`}
                    className={`w-4/5 max-w-16 rounded-t-lg transition-[height] duration-500 ease-out shadow-xs ${
                      isTop
                        ? 'bg-gradient-to-t from-primary to-accent'
                        : 'bg-gradient-to-t from-primary/80 to-primary/60'
                    }`}
                    style={{
                      height: `${barHeight}px`,
                      minHeight: count ? '6px' : '0',
                    }}
                  />
                </div>

                {/* Option Label below axis */}
                <div className="mt-3 w-full text-center">
                  <p
                    title={option.label}
                    className="line-clamp-2 break-words text-xs sm:text-sm font-medium leading-tight text-text group-hover:text-primary transition-colors"
                  >
                    {option.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
