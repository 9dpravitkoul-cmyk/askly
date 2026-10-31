import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Copy, Eye, FileQuestion, LayoutGrid, List as ListIcon, Play, Plus, Trash2, Edit3, ArrowUpDown } from 'lucide-react';
import { Badge, Button, EmptyState, Modal, Skeleton, SkeletonGroup } from '../ui';

const formatDate = (value) => {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : 'Just now';
};

export default function SurveyList({
  surveys = [],
  searchTerm = '',
  loading = false,
  error = '',
  onDelete,
  onPreview,
  onStartSession,
  onDuplicate,
  startingSessionId = null,
  deletingId = null,
  duplicatingId = null,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'draft' | 'published'
  const [sort, setSort] = useState('modified'); // 'modified' | 'title'
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return surveys
      .filter((survey) => {
        const statusMatches = filter === 'all' || survey.status === filter;
        const textMatches =
          !query ||
          `${survey.title} ${survey.description || ''} ${survey.questionSearch || ''}`
            .toLowerCase()
            .includes(query);
        return statusMatches && textMatches;
      })
      .sort((a, b) =>
        sort === 'title'
          ? a.title.localeCompare(b.title)
          : (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0)
      );
  }, [surveys, filter, searchTerm, sort]);

  const counts = {
    all: surveys.length,
    draft: surveys.filter((survey) => survey.status === 'draft').length,
    published: surveys.filter((survey) => survey.status === 'published').length,
  };

  if (loading) {
    return (
      <SkeletonGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" label="Loading surveys">
        {[0, 1, 2].map((item) => (
          <div key={item} className="space-y-4 rounded-card border border-border bg-surface p-5 shadow-soft">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </SkeletonGroup>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters & Toolbar */}
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-3 sm:flex-row sm:items-center">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['all', 'published', 'draft'].map((key) => {
            const active = filter === key;
            const label = key === 'all' ? 'All Surveys' : key === 'published' ? 'Published' : 'Drafts';
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted hover:bg-surface-secondary hover:text-text'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    active ? 'bg-white/20 text-white' : 'bg-surface-secondary text-muted'
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sorting & View Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-muted shadow-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
            <select
              aria-label="Sort surveys"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="bg-transparent font-medium text-text focus:outline-none cursor-pointer"
            >
              <option value="modified">Recently updated</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>

          <div className="flex rounded-xl border border-border bg-surface p-0.5 shadow-xs">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView('grid')}
              className={`rounded-lg p-1.5 transition-colors ${
                view === 'grid' ? 'bg-primary-soft text-primary font-bold' : 'text-muted hover:text-text'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView('list')}
              className={`rounded-lg p-1.5 transition-colors ${
                view === 'list' ? 'bg-primary-soft text-primary font-bold' : 'text-muted hover:text-text'
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Empty State or Grid/List */}
      {filtered.length === 0 ? (
        <EmptyState
          className="py-14"
          icon={FileQuestion}
          title={surveys.length ? 'No surveys match these filters' : 'No surveys created yet'}
          description={
            surveys.length
              ? 'Try adjusting your search query or switching tabs.'
              : 'Create your first interactive polling session to engage your audience.'
          }
          action={
            <Link
              to="/surveys/new"
              className="ui-interactive inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-soft hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
              <span>Create Survey</span>
            </Link>
          }
        />
      ) : view === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((survey) => (
            <article
              key={survey.id}
              className="group flex flex-col justify-between rounded-card border border-border bg-surface p-5 shadow-soft hover:border-primary/40 hover:shadow-card transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={survey.status === 'published' ? 'success' : 'neutral'}>
                    {survey.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <span className="text-[11px] font-mono text-muted">
                    {formatDate(survey.updatedAt)}
                  </span>
                </div>

                <h3 className="text-base font-bold tracking-tight text-text group-hover:text-primary transition-colors line-clamp-1">
                  {survey.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted min-h-[2.25rem]">
                  {survey.description || 'Interactive polling survey with live questions and automated insights.'}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted border-t border-border pt-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileQuestion className="h-3.5 w-3.5 text-primary" />
                    {survey.questionCount || 0} {survey.questionCount === 1 ? 'question' : 'questions'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onPreview(survey)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-text hover:bg-surface-secondary hover:text-primary transition-colors"
                    title="Audience Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>
                  <Link
                    to={`/surveys/${survey.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-text hover:bg-surface-secondary hover:text-primary transition-colors"
                    title="Edit Survey"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDuplicate(survey)}
                    disabled={duplicatingId === survey.id}
                    className="inline-flex items-center rounded-lg border border-border p-1.5 text-muted hover:bg-surface-secondary hover:text-text transition-colors disabled:opacity-50"
                    title="Duplicate Survey"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(survey)}
                    disabled={deletingId === survey.id}
                    className="inline-flex items-center rounded-lg border border-red-500/20 p-1.5 text-danger hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Delete Survey"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onStartSession(survey)}
                  disabled={startingSessionId === survey.id || !(survey.questionCount > 0)}
                  aria-label={`Start live session for ${survey.title}`}
                  className="ui-interactive inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{startingSessionId === survey.id ? 'Starting…' : 'Launch'}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="divide-y divide-border overflow-hidden rounded-card border border-border bg-surface shadow-soft">
          {filtered.map((survey) => (
            <article
              key={survey.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-surface-secondary/40 transition-colors"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <Badge variant={survey.status === 'published' ? 'success' : 'neutral'}>
                    {survey.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <h3 className="text-sm sm:text-base font-bold text-text">
                    {survey.title}
                  </h3>
                </div>
                <p className="text-xs text-muted line-clamp-1">
                  {survey.questionCount || 0} questions · Updated {formatDate(survey.updatedAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onPreview(survey)}
                  className="rounded-lg border border-border p-2 text-muted hover:text-text hover:bg-surface-secondary"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <Link
                  to={`/surveys/${survey.id}/edit`}
                  className="rounded-lg border border-border p-2 text-muted hover:text-text hover:bg-surface-secondary"
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => onDuplicate(survey)}
                  disabled={duplicatingId === survey.id}
                  className="rounded-lg border border-border p-2 text-muted hover:text-text hover:bg-surface-secondary disabled:opacity-50"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onStartSession(survey)}
                  disabled={startingSessionId === survey.id || !(survey.questionCount > 0)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-hover shadow-xs disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Launch</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(survey)}
                  disabled={deletingId === survey.id}
                  className="rounded-lg border border-red-500/20 p-2 text-danger hover:bg-red-500/10 disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete this survey?"
        description={
          pendingDelete
            ? `“${pendingDelete.title}” and its questions will be permanently removed. Live sessions must be closed first.`
            : ''
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deletingId === pendingDelete?.id}
              onClick={async () => {
                const target = pendingDelete;
                await onDelete(target);
                setPendingDelete(null);
              }}
            >
              Delete Survey
            </Button>
          </div>
        }
      />
    </div>
  );
}
