import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  Play,
  Eye,
  Edit3,
  MoreVertical,
  Star,
  Users,
  Clock,
  Plus,
  AlertCircle,
  CheckCircle2,
  Share2,
  Trash2,
  Copy
} from 'lucide-react';

export default function SurveyList({
  surveys = [],
  searchTerm = '',
  onSelectSurveyPreview,
  onLaunchSession
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'draft' | 'active' | 'completed' | 'favorites'
  const [sortBy, setSortBy] = useState('modified'); // 'modified' | 'title' | 'responses'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [surveyList, setSurveyList] = useState(surveys);
  const navigate = useNavigate();

  // Keep internal list in sync if props change
  React.useEffect(() => {
    setSurveyList(surveys);
  }, [surveys]);

  // Toggle favorite in mock state
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    setSurveyList(prev =>
      prev.map(s => (s.id === id ? { ...s, favorite: !s.favorite } : s))
    );
  };

  // Delete survey in mock state
  const handleDeleteSurvey = (id, e) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    setSurveyList(prev => prev.filter(s => s.id !== id));
  };

  // Duplicate survey in mock state
  const handleDuplicateSurvey = (survey, e) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    const newSurvey = {
      ...survey,
      id: `survey-${Date.now()}`,
      title: `${survey.title} (Copy)`,
      status: 'draft',
      responsesCount: 0,
      lastModified: 'Just now',
      favorite: false
    };
    setSurveyList(prev => [newSurvey, ...prev]);
  };

  // Filter and sort computation
  const filteredSurveys = useMemo(() => {
    let result = [...surveyList];

    // Status / category tab filter
    if (activeFilter === 'draft') {
      result = result.filter(s => s.status === 'draft');
    } else if (activeFilter === 'active') {
      result = result.filter(s => s.status === 'active');
    } else if (activeFilter === 'completed') {
      result = result.filter(s => s.status === 'completed');
    } else if (activeFilter === 'favorites') {
      result = result.filter(s => s.favorite === true);
    }

    // Search query filter (matches title, description, or question text)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          s.questionSummary.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'responses') {
      result.sort((a, b) => b.responsesCount - a.responsesCount);
    } else {
      // default: last modified
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [surveyList, activeFilter, searchTerm, sortBy]);

  const tabs = [
    { id: 'all', label: 'All', count: surveyList.length },
    { id: 'active', label: 'Active', count: surveyList.filter(s => s.status === 'active').length },
    { id: 'draft', label: 'Drafts', count: surveyList.filter(s => s.status === 'draft').length },
    { id: 'completed', label: 'Completed', count: surveyList.filter(s => s.status === 'completed').length },
    { id: 'favorites', label: 'Favorites', count: surveyList.filter(s => s.favorite).length },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Toolbar Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-brand-border-gray">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === tab.id
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-brand-light-gray text-brand-text-secondary'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode & Sorting Controls */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary bg-white px-3 py-1.5 rounded-xl border border-brand-border-gray">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-navy" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium text-brand-navy focus:outline-none cursor-pointer"
              aria-label="Sort surveys"
            >
              <option value="modified">Last Modified</option>
              <option value="title">Title (A-Z)</option>
              <option value="responses">Most Responses</option>
            </select>
          </div>

          {/* Grid / List Mode */}
          <div className="flex bg-white rounded-xl border border-brand-border-gray p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-brand-text-secondary transition-colors ${
                viewMode === 'grid' ? 'bg-brand-light-blue text-brand-navy' : 'hover:text-brand-navy'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-brand-text-secondary transition-colors ${
                viewMode === 'list' ? 'bg-brand-light-blue text-brand-navy' : 'hover:text-brand-navy'
              }`}
              title="List View"
              aria-label="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Development Mock Data Notice */}
      <div className="flex items-center justify-between text-xs px-3.5 py-2 bg-brand-light-blue/40 rounded-xl border border-brand-border-gray text-brand-navy">
        <div className="flex items-center gap-2">
          <span className="font-semibold">⚡ Development Workspace:</span>
          <span className="text-brand-text-secondary hidden sm:inline">
            Displaying sample mock surveys. In Phase 4, your surveys will persist in Google Cloud Firestore.
          </span>
        </div>
        <span className="font-mono text-brand-text-secondary text-[11px]">
          {filteredSurveys.length} {filteredSurveys.length === 1 ? 'survey' : 'surveys'}
        </span>
      </div>

      {/* Main Surveys Display: Empty State or Grid/List */}
      {filteredSurveys.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-border-gray p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-brand-light-gray flex items-center justify-center mx-auto mb-4 text-brand-text-secondary border border-brand-border-gray">
            <FileQuestion className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy mb-1">No surveys found</h3>
          <p className="text-xs text-brand-text-secondary leading-relaxed mb-6">
            {searchTerm
              ? `No surveys matched your search for "${searchTerm}". Try resetting filters or search terms.`
              : `You don't have any surveys under the "${activeFilter}" filter yet.`}
          </p>
          <div className="flex items-center justify-center gap-3">
            {searchTerm && (
              <button
                onClick={() => setActiveFilter('all')}
                className="px-4 py-2 border border-brand-border-gray hover:bg-brand-light-gray text-xs font-semibold rounded-xl text-brand-navy transition-colors"
              >
                Clear Filters
              </button>
            )}
            <Link
              to="/surveys/new"
              className="px-5 py-2 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Survey</span>
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSurveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white rounded-2xl border border-brand-border-gray p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div>
                {/* Header: Status & Favorite & Menu */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(survey.status)}
                    {survey.joinCode && (
                      <span className="text-[11px] font-mono text-brand-text-secondary bg-brand-light-gray px-2 py-0.5 rounded border border-brand-border-gray">
                        PIN: {survey.joinCode}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleFavorite(survey.id, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        survey.favorite
                          ? 'text-brand-orange hover:text-brand-orange-hover'
                          : 'text-slate-300 hover:text-slate-400'
                      }`}
                      title={survey.favorite ? 'Remove favorite' : 'Mark as favorite'}
                      aria-label="Toggle favorite"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>

                    {/* More actions dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === survey.id ? null : survey.id);
                        }}
                        className="p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray"
                        aria-label="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeDropdownId === survey.id && (
                        <div
                          className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-brand-border-gray shadow-lg py-1.5 z-20 text-xs font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleDuplicateSurvey(survey, e)}
                            className="w-full text-left px-3 py-2 text-brand-text-primary hover:bg-brand-light-gray flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5 text-brand-text-secondary" />
                            <span>Duplicate Survey</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteSurvey(survey.id, e)}
                            className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Survey</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-brand-navy mb-1.5 leading-snug line-clamp-1 group-hover:text-brand-navy-light transition-colors">
                  {survey.title}
                </h3>
                <p className="text-xs text-brand-text-secondary line-clamp-2 leading-relaxed mb-4">
                  {survey.description || 'Interactive polling survey with live questions and automated insight charts.'}
                </p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-brand-text-secondary mb-5">
                  <div className="flex items-center gap-1.5 font-medium">
                    <FileQuestion className="w-3.5 h-3.5 text-brand-navy" />
                    <span>{survey.questionCount} {survey.questionCount === 1 ? 'Question' : 'Questions'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{survey.responsesCount} responses</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{survey.lastModified}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-3 border-t border-brand-border-gray flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSurveyPreview(survey)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-navy hover:bg-brand-light-blue transition-colors flex items-center gap-1 border border-brand-border-gray"
                    title="Inspect questions and results"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <Link
                    to={`/surveys/${survey.id}/edit`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray transition-colors flex items-center gap-1 border border-brand-border-gray"
                    title="Edit survey"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                </div>

                <button
                  onClick={() => onLaunchSession(survey)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-navy hover:bg-brand-navy-light text-white transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Present in live audience room"
                >
                  <Play className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                  <span>Launch</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-brand-border-gray divide-y divide-brand-border-gray overflow-hidden shadow-xs">
          {filteredSurveys.map((survey) => (
            <div
              key={survey.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-light-gray/30 transition-colors"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2.5">
                  {getStatusBadge(survey.status)}
                  <h3 className="text-sm sm:text-base font-bold text-brand-navy">
                    {survey.title}
                  </h3>
                  {survey.favorite && (
                    <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                  )}
                </div>
                <p className="text-xs text-brand-text-secondary line-clamp-1">
                  {survey.questionSummary} • Last modified {survey.lastModified}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="block text-sm font-bold text-brand-navy font-mono">
                    {survey.responsesCount}
                  </span>
                  <span className="block text-[11px] text-brand-text-secondary">responses</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSurveyPreview(survey)}
                    className="p-2 rounded-lg text-brand-navy hover:bg-brand-light-blue border border-brand-border-gray"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/surveys/${survey.id}/edit`}
                    className="p-2 rounded-lg text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray border border-brand-border-gray"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onLaunchSession(survey)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-navy hover:bg-brand-navy-light text-white flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
