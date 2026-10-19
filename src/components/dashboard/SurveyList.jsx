import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Copy, Eye, FileQuestion, LayoutGrid, List as ListIcon, Play, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, EmptyState, Modal, Skeleton, SkeletonGroup } from '../ui';

const formatDate = (value) => {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : 'Just created';
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
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('modified');
  const [view, setView] = useState('grid');
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return surveys.filter((survey) => {
      const statusMatches = filter === 'all' || survey.status === filter;
      const textMatches = !query || `${survey.title} ${survey.description || ''} ${survey.questionSearch || ''}`.toLowerCase().includes(query);
      return statusMatches && textMatches;
    }).sort((a, b) => sort === 'title'
      ? a.title.localeCompare(b.title)
      : (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0));
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
          <div key={item} className="space-y-4 rounded-card border border-border bg-white p-5">
            <Skeleton className="h-5 w-20" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" />
          </div>
        ))}
      </SkeletonGroup>
    );
  }

  if (error) return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-3 sm:flex-row">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'draft', 'published'].map((key) => (
            <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-xl px-3 py-2 text-sm font-semibold capitalize ${filter === key ? 'bg-primary text-white' : 'text-muted hover:bg-white'}`}>
              {key === 'all' ? 'All' : key} <span className="ml-1 text-xs opacity-70">{counts[key]}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 self-end">
          <select aria-label="Sort surveys" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm">
            <option value="modified">Recently updated</option>
            <option value="title">Title A–Z</option>
          </select>
          <div className="flex rounded-lg border bg-white p-0.5">
            <button type="button" aria-label="Grid view" onClick={() => setView('grid')} className={`rounded p-2 ${view === 'grid' ? 'bg-primary-soft text-primary' : ''}`}><LayoutGrid className="h-4 w-4" /></button>
            <button type="button" aria-label="List view" onClick={() => setView('list')} className={`rounded p-2 ${view === 'list' ? 'bg-primary-soft text-primary' : ''}`}><ListIcon className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="py-12"
          icon={FileQuestion}
          title={surveys.length ? 'No surveys match these filters' : 'Your surveys will appear here'}
          description={surveys.length ? 'Try another status filter or search term.' : 'Create your first survey to start collecting audience feedback.'}
          action={!surveys.length && (
            <Link to="/surveys/new" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-strong">
              <Plus className="h-4 w-4" />Create survey
            </Link>
          )}
        />
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3' : 'divide-y divide-border overflow-hidden rounded-card border border-border bg-white'}>
          {filtered.map((survey) => (
            <article key={survey.id} className={`flex bg-white p-5 ${view === 'grid' ? 'flex-col justify-between rounded-card border border-border shadow-soft' : 'flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'}`}>
              <div>
                <Badge variant={survey.status === 'published' ? 'success' : 'neutral'}>{survey.status === 'published' ? 'Published' : 'Draft'}</Badge>
                <h3 className="mt-3 text-base font-bold tracking-tight text-primary">{survey.title}</h3>
                {survey.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{survey.description}</p>}
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><FileQuestion className="h-3.5 w-3.5" />{survey.questionCount || 0} {survey.questionCount === 1 ? 'question' : 'questions'}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Updated {formatDate(survey.updatedAt)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => onPreview(survey)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-primary"><Eye className="h-3.5 w-3.5" />Preview</button>
                <Link to={`/surveys/${survey.id}/edit`} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-primary">Edit</Link>
                <button type="button" onClick={() => onDuplicate(survey)} disabled={duplicatingId === survey.id} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-primary disabled:opacity-50"><Copy className="h-3.5 w-3.5" />{duplicatingId === survey.id ? 'Copying…' : 'Duplicate'}</button>
                <button type="button" onClick={() => onStartSession(survey)} disabled={startingSessionId === survey.id || !(survey.questionCount > 0)} aria-label={`Start live session for ${survey.title}`} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
                  <Play className="h-3.5 w-3.5 fill-current" />{startingSessionId === survey.id ? 'Starting…' : 'Launch'}
                </button>
                <button type="button" onClick={() => setPendingDelete(survey)} disabled={deletingId === survey.id} aria-label={`Delete ${survey.title}`} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete this survey?"
        description={pendingDelete ? `“${pendingDelete.title}” and its questions will be removed. Live sessions must be closed first.` : ''}
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="danger" loading={deletingId === pendingDelete?.id} onClick={async () => {
              const target = pendingDelete;
              await onDelete(target);
              setPendingDelete(null);
            }}>Delete survey</Button>
          </div>
        )}
      />
    </div>
  );
}
