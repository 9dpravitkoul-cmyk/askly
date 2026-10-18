import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, FileQuestion, LayoutGrid, List as ListIcon, Loader2, Play, Plus, Trash2 } from 'lucide-react';
import { Badge, EmptyState, Skeleton, SkeletonGroup } from '../ui';

const formatDate = (value) => {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : 'Just created';
};

export default function SurveyList({ surveys = [], searchTerm = '', loading = false, error = '', onDelete, onPreview, onStartSession, startingSessionId = null, deletingId = null }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('modified');
  const [view, setView] = useState('grid');
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
  const counts = { all: surveys.length, draft: surveys.filter((survey) => survey.status === 'draft').length, published: surveys.filter((survey) => survey.status === 'published').length };

  if (loading) return <SkeletonGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" label="Loading surveys">{[0, 1, 2].map((item) => <div key={item} className="space-y-4 rounded-card border border-border bg-white p-5"><Skeleton className="h-5 w-20" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /><div className="flex gap-2 pt-2"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 flex-1" /></div></div>)}</SkeletonGroup>;
  if (error) return <div role="alert" className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-800">{error}</div>;

  return <div className="space-y-5">
    <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-brand-border-gray pb-3">
      <div className="flex gap-2 overflow-x-auto">{['all', 'draft', 'published'].map((key) => <button key={key} onClick={() => setFilter(key)} className={`rounded-xl px-3 py-2 text-sm font-semibold capitalize ${filter === key ? 'bg-brand-navy text-white' : 'text-brand-text-secondary hover:bg-white'}`}>{key === 'all' ? 'All' : key} <span className="ml-1 text-xs opacity-70">{counts[key]}</span></button>)}</div>
      <div className="flex gap-2 self-end"><select aria-label="Sort surveys" value={sort} onChange={(event) => setSort(event.target.value)} className="px-3 py-2 text-sm border border-brand-border-gray rounded-lg bg-white"><option value="modified">Recently updated</option><option value="title">Title A–Z</option></select><div className="flex rounded-lg border bg-white p-0.5"><button aria-label="Grid view" onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-brand-light-blue text-brand-navy' : ''}`}><LayoutGrid className="w-4 h-4" /></button><button aria-label="List view" onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-brand-light-blue text-brand-navy' : ''}`}><ListIcon className="w-4 h-4" /></button></div></div>
    </div>
    {filtered.length === 0 ? <EmptyState className="py-12" icon={FileQuestion} title={surveys.length ? 'No surveys match these filters' : 'Your surveys will appear here'} description={surveys.length ? 'Try another status filter or search term.' : 'Create your first survey to start collecting audience feedback.'} action={!surveys.length && <Link to="/surveys/new" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"><Plus className="h-4 w-4" />Create Survey</Link>} /> : <div className={view === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3' : 'divide-y divide-border overflow-hidden rounded-card border border-border bg-white'}>{filtered.map((survey) => <article key={survey.id} className={`flex bg-white p-5 ${view === 'grid' ? 'flex-col justify-between rounded-card border border-border shadow-soft transition hover:-translate-y-0.5 hover:shadow-card' : 'flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'}`}>
      <div><div className="flex items-center gap-2"><Badge variant={survey.status === 'published' ? 'success' : 'neutral'}>{survey.status === 'published' ? 'Published' : 'Draft'}</Badge></div><h3 className="mt-3 text-base font-bold tracking-tight text-brand-navy">{survey.title}</h3>{survey.description && <p className="mt-1 text-sm text-brand-text-secondary line-clamp-2">{survey.description}</p>}<div className="mt-4 flex flex-wrap gap-4 text-xs text-brand-text-secondary"><span className="flex items-center gap-1.5"><FileQuestion className="w-3.5 h-3.5" />{survey.questionCount || 0} {survey.questionCount === 1 ? 'question' : 'questions'}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Updated {formatDate(survey.updatedAt)}</span></div></div>
      <div className="flex flex-wrap gap-2 mt-4"><button onClick={() => onPreview(survey)} className="px-3 py-2 border border-brand-border-gray rounded-lg text-xs font-semibold text-brand-navy flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Preview</button><Link to={`/surveys/${survey.id}/edit`} className="px-3 py-2 border border-brand-border-gray rounded-lg text-xs font-semibold text-brand-navy">Edit</Link><button onClick={() => onStartSession(survey)} disabled={startingSessionId === survey.id} aria-label={`Start live session for ${survey.title}`} className="px-3 py-2 bg-brand-navy text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"><Play className="w-3.5 h-3.5 fill-current" />{startingSessionId === survey.id ? 'Starting…' : 'Start Live Session'}</button><button onClick={() => onDelete(survey)} disabled={deletingId === survey.id} aria-label={`Delete ${survey.title}`} className="px-3 py-2 border border-red-200 rounded-lg text-xs font-semibold text-red-700 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /></button></div>
    </article>)}</div>}
  </div>;
}
