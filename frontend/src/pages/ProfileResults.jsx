import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Users, UserPlus, BookOpen, MapPin, Building2,
  Star, GitFork, Circle, Sparkles, TrendingUp, AlertCircle,
  Search, ExternalLink, Globe, FileText, Share2, Check, Link as LinkIcon, RotateCcw,
} from 'lucide-react';
import {
  getProfile, getRepos, getDashboard, getAIAnalysis, getOpenSourceContributions,
} from '../services/api';
import OpenSourceSection from '../components/OpenSourceSection';
import ResumeSuggestionsSection from '../components/ResumeSuggestionsSection';
import FollowersModal from '../components/FollowersModal';

export default function ProfileResults({ username, onBack, onSearchUser }) {
  const [currentUsername, setCurrentUsername] = useState(username);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [openSource, setOpenSource] = useState(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [openSourceLoading, setOpenSourceLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/Sort state for repo list
  const [sortBy, setSortBy] = useState('updated');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [repoSearchQuery, setRepoSearchQuery] = useState('');

  // Top nav quick search
  const [quickSearch, setQuickSearch] = useState('');

  // Followers / Following Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('followers');

  // Copy profile link toast
  const [copiedLink, setCopiedLink] = useState(false);

  // Retry trigger to reliably re-run effect
  const [retryTrigger, setRetryTrigger] = useState(0);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadCore() {
      setLoading(true);
      setError(null);
      try {
        const [profileData, reposData, dashboardData] = await Promise.all([
          getProfile(currentUsername),
          getRepos(currentUsername, { sort: sortBy }),
          getDashboard(currentUsername),
        ]);
        if (cancelled) return;
        setProfile(profileData);
        setRepos(reposData);
        setDashboard(dashboardData);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not retrieve profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadAI() {
      setAiLoading(true);
      try {
        const analysisData = await getAIAnalysis(currentUsername);
        if (!cancelled) setAnalysis(analysisData);
      } catch {
        // AI failure shouldn't block the rest of the page
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    }

    async function loadOpenSource() {
      setOpenSourceLoading(true);
      try {
        const osData = await getOpenSourceContributions(currentUsername);
        if (!cancelled) setOpenSource(osData);
      } catch {
        // Non-blocking
      } finally {
        if (!cancelled) setOpenSourceLoading(false);
      }
    }

    loadCore();
    loadAI();
    loadOpenSource();

    return () => { cancelled = true; };
  }, [currentUsername, sortBy, retryTrigger]);

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      const user = quickSearch.trim();
      setQuickSearch('');
      if (onSearchUser) {
        onSearchUser(user);
      } else {
        setCurrentUsername(user);
      }
    }
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const openFollowers = (tab = 'followers') => {
    setModalTab(tab);
    setModalOpen(true);
  };

  // Filter repos by language and search text
  const languages = ['all', ...new Set(repos.map((r) => r.language).filter(Boolean))];
  const visibleRepos = repos.filter((r) => {
    const matchesLang = languageFilter === 'all' || r.language === languageFilter;
    const matchesSearch = !repoSearchQuery.trim() ||
      r.name.toLowerCase().includes(repoSearchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(repoSearchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#080811] text-white relative overflow-x-hidden selection:bg-purple-500 selection:text-white pb-20">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-900/20 via-indigo-800/10 to-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* 1. Sticky Navigation Top Bar */}
      <header className="sticky top-0 z-30 bg-[#080811]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to search</span>
            </button>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-md border border-white/10">
                <svg className="w-4 h-4 fill-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </div>
              <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                GHOST
              </span>
            </div>
          </div>

          {/* Quick Search in Top Bar */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleQuickSearchSubmit} className="relative w-36 sm:w-56">
              <input
                type="text"
                placeholder="Search username..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 focus:border-cyan-400/50 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            <button
              onClick={handleShareProfile}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors shrink-0"
              title="Copy Profile Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {loading && <LoadingState />}
        {error && !loading && (
          <ErrorState
            message={error}
            username={currentUsername}
            onRetry={handleRetry}
            onBack={onBack}
            onSearchUser={(user) => {
              if (onSearchUser) {
                onSearchUser(user);
              } else {
                setCurrentUsername(user);
              }
            }}
          />
        )}

        {!loading && !error && profile && (
          <>
            {/* Quick Section Jump Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none text-xs text-gray-400">
              <a href="#overview-section" className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-colors shrink-0">
                Overview & Stats
              </a>
              <a href="#ai-insights-section" className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-colors shrink-0 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Insights
              </a>
              <a href="#opensource-section" className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-colors shrink-0 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Open-Source
              </a>
              <a href="#resume-section" className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-colors shrink-0 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Resume & Career
              </a>
              <a href="#repos-section" className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-colors shrink-0 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Repositories ({repos.length})
              </a>
            </div>

            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              onOpenFollowers={() => openFollowers('followers')}
              onOpenFollowing={() => openFollowers('following')}
            />

            {/* Developer Dashboard (Stars, Forks, Top Languages, Most Starred & Forked) */}
            <div id="overview-section">
              <DashboardSection dashboard={dashboard} />
            </div>

            {/* AI Insights Card */}
            <div id="ai-insights-section">
              <AIInsightsSection analysis={analysis} loading={aiLoading} />
            </div>

            {/* Open-Source Contribution Analysis Section */}
            <OpenSourceSection data={openSource} loading={openSourceLoading} />

            {/* Resume & Profile Optimization Section */}
            <ResumeSuggestionsSection analysis={analysis} loading={aiLoading} />

            {/* Repositories Section */}
            <div id="repos-section">
              <ReposSection
                repos={visibleRepos}
                totalCount={repos.length}
                languages={languages}
                sortBy={sortBy}
                setSortBy={setSortBy}
                languageFilter={languageFilter}
                setLanguageFilter={setLanguageFilter}
                searchQuery={repoSearchQuery}
                setSearchQuery={setRepoSearchQuery}
              />
            </div>
          </>
        )}
      </main>

      {/* Followers / Following Modal */}
      <FollowersModal
        key={`${currentUsername}-${modalTab}`}
        username={currentUsername}
        initialTab={modalTab}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectUser={(newUser) => {
          if (onSearchUser) {
            onSearchUser(newUser);
          } else {
            setCurrentUsername(newUser);
          }
        }}
      />
    </div>
  );
}

// ---------------- Sub-components ----------------

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-36 gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full" />
      </div>
      <p className="text-gray-300 text-sm font-medium">Synthesizing developer telemetry...</p>
      <p className="text-gray-500 text-xs">Fetching repositories, contributions & AI insights</p>
    </div>
  );
}

function ErrorState({ message, username, onRetry, onBack, onSearchUser }) {
  const [newQuery, setNewQuery] = useState('');

  const handleInlineSearch = (e) => {
    e.preventDefault();
    if (newQuery.trim() && onSearchUser) {
      onSearchUser(newQuery.trim());
    }
  };

  const is404 =
    message?.toLowerCase().includes('not found') ||
    message?.includes('404');

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center max-w-md mx-auto px-4">
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-1 shadow-lg shadow-red-500/5">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>

      <div>
        <h2 className="text-white font-bold text-xl tracking-tight">
          {is404 ? 'Profile Not Found' : 'Unable to analyze profile'}
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed">
          {is404 ? (
            <>
              GitHub user <span className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded font-semibold">{username}</span> could not be found. Please check for spelling mistakes.
            </>
          ) : (
            message
          )}
        </p>
      </div>

      {/* Inline Quick Search Input to fix typos immediately */}
      {onSearchUser && (
        <form onSubmit={handleInlineSearch} className="w-full relative mt-2">
          <input
            type="text"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="Try another username (e.g. torvalds)..."
            className="w-full bg-white/[0.05] border border-white/15 focus:border-purple-500/60 rounded-xl px-4 py-2.5 pl-10 pr-20 text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            disabled={!newQuery.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:hover:bg-purple-600 text-white text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Search
          </button>
        </form>
      )}

      {/* Action Buttons: Try Again & Back to Home */}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
}

function ProfileHeader({ profile, onOpenFollowers, onOpenFollowing }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md relative overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative group">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-white/15 object-cover shadow-2xl"
          />
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600/30 to-cyan-500/30 blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {profile.name || profile.login}
              </h1>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 text-sm hover:underline mt-0.5"
              >
                @{profile.login}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors"
            >
              View on GitHub
            </a>
          </div>

          {profile.bio && (
            <p className="text-gray-300 mt-3 text-sm max-w-2xl leading-relaxed font-normal">
              {profile.bio}
            </p>
          )}

          {/* Location, Company, Blog metadata */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs sm:text-sm text-gray-400">
            {profile.location && (
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-500" /> {profile.location}</span>
            )}
            {profile.company && (
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-gray-500" /> {profile.company}</span>
            )}
            {profile.blog && (
              <a
                href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:underline"
              >
                <LinkIcon className="w-4 h-4 text-gray-500" />
                {profile.blog.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {/* Interactive Network Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mt-5 pt-4 border-t border-white/5">
            <button
              onClick={onOpenFollowers}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left group"
              title="Click to view followers"
            >
              <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {profile.followers?.toLocaleString?.() ?? profile.followers}
                </div>
                <div className="text-gray-500 text-[11px]">Followers (inspect)</div>
              </div>
            </button>

            <button
              onClick={onOpenFollowing}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left group"
              title="Click to view following"
            >
              <div className="p-1 rounded bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  {profile.following?.toLocaleString?.() ?? profile.following}
                </div>
                <div className="text-gray-500 text-[11px]">Following (inspect)</div>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-indigo-500/10 text-indigo-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">
                  {profile.public_repos?.toLocaleString?.() ?? profile.public_repos}
                </div>
                <div className="text-gray-500 text-[11px]">Public Repos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSection({ dashboard }) {
  if (!dashboard) return null;
  const maxCount = Math.max(...dashboard.top_languages.map((l) => l.repo_count), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Top Languages Visualization */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:col-span-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Primary Stack
            </span>
            <span className="text-xs text-gray-500 font-normal">By Repo Count</span>
          </h3>

          <div className="space-y-3.5">
            {dashboard.top_languages.map((lang) => (
              <div key={lang.language}>
                <div className="flex justify-between text-xs text-gray-300 mb-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Circle className="w-2 h-2 fill-cyan-400 text-cyan-400" />
                    {lang.language}
                  </span>
                  <span className="text-gray-400 font-mono">{lang.repo_count} repos</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{ width: `${(lang.repo_count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-gray-500 flex justify-between">
          <span>Analyzed {dashboard.repos_analyzed} repos</span>
          <span>Normalized weights</span>
        </div>
      </div>

      {/* Total Stars Metric */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-3">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
        </div>
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {dashboard.total_stars.toLocaleString()}
        </span>
        <span className="text-gray-400 text-xs mt-1 font-medium">Total Earned Stars</span>
        <span className="text-[11px] text-gray-500 mt-1">Across all public projects</span>
      </div>

      {/* Total Forks Metric */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-purple-500/30 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
          <GitFork className="w-6 h-6 text-purple-400" />
        </div>
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {dashboard.total_forks.toLocaleString()}
        </span>
        <span className="text-gray-400 text-xs mt-1 font-medium">Total Project Forks</span>
        <span className="text-[11px] text-gray-500 mt-1">Community iterations</span>
      </div>

      {/* Highlights: Most Starred & Most Forked Repos */}
      {(dashboard.most_starred_repo || dashboard.most_forked_repo) && (
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboard.most_starred_repo && (
            <div className="bg-gradient-to-br from-yellow-500/[0.07] to-transparent border border-yellow-500/20 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
              <div>
                <h3 className="text-xs font-semibold text-yellow-400 mb-2 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Most Starred Repository
                </h3>
                <a
                  href={dashboard.most_starred_repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-white text-base hover:text-cyan-300 transition-colors inline-block"
                >
                  {dashboard.most_starred_repo.name}
                </a>
                {dashboard.most_starred_repo.description && (
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {dashboard.most_starred_repo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-yellow-500/15 text-xs text-yellow-300 font-medium">
                <span className="text-gray-400 text-[11px]">Flagship Project</span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  {dashboard.most_starred_repo.stargazers_count.toLocaleString()} stars
                </span>
              </div>
            </div>
          )}

          {dashboard.most_forked_repo && (
            <div className="bg-gradient-to-br from-purple-500/[0.07] to-transparent border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
              <div>
                <h3 className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-purple-400" /> Most Forked Repository
                </h3>
                <a
                  href={dashboard.most_forked_repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-white text-base hover:text-purple-300 transition-colors inline-block"
                >
                  {dashboard.most_forked_repo.name}
                </a>
                {dashboard.most_forked_repo.description && (
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {dashboard.most_forked_repo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-500/15 text-xs text-purple-300 font-medium">
                <span className="text-gray-400 text-[11px]">Widely Forked</span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5" />
                  {dashboard.most_forked_repo.forks_count.toLocaleString()} forks
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AIInsightsSection({ analysis, loading }) {
  const data = analysis?.analysis || analysis || null;
  const summaryText =
    data?.developer_summary ||
    data?.summary ||
    '';
  const strengths = data?.strengths || [];
  const suggestedTech =
    data?.suggested_technologies ||
    data?.recommendations ||
    [];

  return (
    <div className="bg-gradient-to-br from-purple-900/20 via-indigo-900/15 to-cyan-900/10 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
          <Sparkles className="w-4 h-4 text-purple-400" /> AI Executive Summary
        </h3>
        <span className="text-xs text-cyan-300 font-mono bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
          DeepMind Synthesis
        </span>
      </div>

      {loading && (
        <div className="py-4 space-y-3">
          <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
        </div>
      )}

      {!loading && (
        <>
          <p className="text-gray-300 text-sm mb-5 leading-relaxed font-normal">
            {summaryText ||
              "Profile synthesis generated from public repository contributions, primary language distributions, and commit frequency."}
          </p>

          <div className="space-y-4">
            {strengths.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Demonstrated Strengths
                </p>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-cyan-300 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {suggestedTech.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Suggested Technologies to Accelerate Growth
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTech.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-purple-500/10 border border-purple-500/25 px-3 py-1 rounded-lg text-purple-300 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ReposSection({
  repos, totalCount, languages, sortBy, setSortBy, languageFilter, setLanguageFilter,
  searchQuery, setSearchQuery,
}) {
  return (
    <div>
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Analyzed Repositories
            <span className="text-xs text-gray-500 font-normal">
              ({repos.length} of {totalCount})
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Filter by tech stack or search specific project names.</p>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Repo Name Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search repos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 pl-8 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-colors w-36 sm:w-44"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Language Dropdown */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cyan-400/50"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-[#0d0d1a]">
                {lang === 'all' ? 'All Languages' : lang}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cyan-400/50"
          >
            <option value="updated" className="bg-[#0d0d1a]">Recently Updated</option>
            <option value="created" className="bg-[#0d0d1a]">Recently Created</option>
            <option value="stars" className="bg-[#0d0d1a]">Most Stars</option>
            <option value="full_name" className="bg-[#0d0d1a]">Repository Name</option>
          </select>
        </div>
      </div>

      {repos.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center text-gray-500 text-sm">
          No repositories match your current filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <RepoCard key={repo.full_name || repo.name} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}

function RepoCard({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/30 rounded-2xl p-5 transition-all duration-200 block group"
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
          {repo.name}
          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
        </h4>
        {repo.fork && (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 border border-white/10 text-gray-400">
            Fork
          </span>
        )}
      </div>

      {repo.description && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed font-normal">
          {repo.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap pt-2 border-t border-white/5">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <Circle className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
            <span className="text-gray-300 font-medium">{repo.language}</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400" /> {repo.stargazers_count.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5 text-purple-400" /> {repo.forks_count.toLocaleString()}
        </span>
        <span className="text-gray-500 text-[11px] ml-auto">
          Updated {formatDate(repo.updated_at)}
        </span>
      </div>
    </a>
  );
}

function formatDate(isoString) {
  if (!isoString) return 'recently';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}