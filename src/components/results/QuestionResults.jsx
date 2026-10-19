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
      <>
        <p className="mt-2 text-sm text-muted">{answers.length} {answers.length === 1 ? 'response' : 'responses'}</p>
        {words.length ? (
          <div className={`mt-5 flex flex-wrap content-center items-center justify-center gap-x-5 gap-y-4 rounded-2xl bg-background p-5 ${compact ? 'min-h-40' : 'min-h-56 sm:gap-x-8 sm:p-8'}`} aria-label="Word cloud results">
            {words.map((word, index) => (
              <span
                key={word.text.toLocaleLowerCase()}
                title={`${word.count} ${word.count === 1 ? 'response' : 'responses'}`}
                className={`max-w-full break-words text-center font-bold ${index % 3 === 1 ? 'text-accent-strong' : 'text-primary'}`}
                style={{ fontSize: `clamp(14px, ${Math.round(12 + (word.count / max) * (compact ? 16 : 20))}px, ${compact ? 24 : 32}px)` }}
              >
                {word.text}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-8 text-center">
            <p className="font-semibold text-primary">Waiting for words</p>
            <p className="mt-1 text-sm text-muted">Submitted phrases appear here, sized by how often they are repeated.</p>
          </div>
        )}
      </>
    );
  }

  const options = question.options || [];
  const counts = new Map(options.map((option) => [option.id, 0]));
  answers.forEach((vote) => counts.set(vote.option.id, (counts.get(vote.option.id) || 0) + 1));
  const maxCount = Math.max(0, ...counts.values());
  const barMax = compact ? 160 : 220;

  return (
    <>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">{answers.length} {answers.length === 1 ? 'response' : 'responses'}</p>
        {answers.length === 0 && <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">Waiting for the first vote</span>}
      </div>
      <div className="mt-5 overflow-x-auto pb-2">
        <div
          className="grid items-end gap-3 border-b border-border px-1 sm:gap-5"
          style={{ gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(5.25rem, 1fr))`, minWidth: `${Math.max(options.length * 88, 100)}px` }}
        >
          {options.map((option) => {
            const count = counts.get(option.id) || 0;
            const percentage = answers.length ? Math.round((count / answers.length) * 100) : 0;
            const barHeight = maxCount ? (count / maxCount) * barMax : 0;
            return (
              <div key={option.id} className="flex min-w-0 flex-col items-center">
                <p className="mb-2 text-center text-xs font-semibold tabular-nums text-primary sm:text-sm">
                  {count} <span className="text-muted">· {percentage}%</span>
                </p>
                <div className="flex w-full items-end justify-center rounded-t-lg bg-background/80" style={{ height: barMax }}>
                  <div
                    role="img"
                    aria-label={`${option.label}: ${count} votes, ${percentage} percent`}
                    className="w-3/5 max-w-16 rounded-t-md bg-accent transition-[height] duration-500 ease-out motion-reduce:transition-none"
                    style={{ height: `${barHeight}px`, minHeight: count ? '4px' : '0' }}
                  />
                </div>
                <p title={option.label} className="mt-2 min-h-12 w-full break-words text-center text-xs font-medium leading-4 text-primary sm:text-sm">{option.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
