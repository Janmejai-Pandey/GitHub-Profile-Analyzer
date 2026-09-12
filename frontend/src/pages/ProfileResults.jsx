import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Users, UserPlus, BookOpen, MapPin, Building2,
  Star, GitFork, Circle, Sparkles, TrendingUp, AlertCircle,
} from 'lucide-react';
import { getProfile, getRepos, getDashboard, getAIAnalysis } from '../services/api';

export default function ProfileResults({ username, onBack }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [error, setError] = useState(null);

  // filter/sort state for repo list
  const [sortBy, setSortBy] = useState('updated');
  const [languageFilter, setLanguageFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;

    async function loadCore() {
      setLoading(true);
      setError(null);
      try {
        const [profileData, reposData, dashboardData] = await Promise.all([
          getProfile(username),
          getRepos(username, { sort: sortBy }),
          getDashboard(username),
        ]);
        if (cancelled) return;
        setProfile(profileData);
        setRepos(reposData);
        setDashboard(dashboardData);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadAI() {
      setAiLoading(true);
      try {
        const analysisData = await getAIAnalysis(username);
        if (!cancelled) setAnalysis(analysisData);
      } catch {
        // AI failure shouldn't block the rest of the page
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    }

    loadCore();
    loadAI();

    return () => { cancelled = true; };
  }, [username, sortBy]);

  const languages = ['all', ...new Set(repos.map((r) => r.language).filter(Boolean))];
  const visibleRepos = languageFilter === 'all'
    ? repos
    : repos.filter((r) => r.language === languageFilter);

  return (
    <div className="min-h-screen bg-[#080811] text-white relative overflow-hidden">
      {/* background glow, consistent with landing page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-900/20 via-indigo-800/10 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to search
        </button>

        {loading && <LoadingState />}

        {error && !loading && <ErrorState message={error} />}

        {!loading && !error && profile && (
          <>
            <ProfileHeader profile={profile} />
            <DashboardSection dashboard={dashboard} />
            <AIInsightsSection analysis={analysis} loading={aiLoading} />
            <ReposSection
              repos={visibleRepos}
              languages={languages}
              sortBy={sortBy}
              setSortBy={setSortBy}
              languageFilter={languageFilter}
              setLanguageFilter={setLanguageFilter}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ---------------- Sub-components ----------------

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Fetching profile data...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <p className="text-white font-medium">Couldn't load this profile</p>
      <p className="text-gray-500 text-sm max-w-sm">{message}</p>
    </div>
  );
}

function ProfileHeader({ profile }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md flex flex-col sm:flex-row gap-6 items-start">
      <img
        src={profile.avatar_url}
        alt={profile.login}
        className="w-24 h-24 rounded-2xl border border-white/10"
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{profile.name || profile.login}</h1>
        <a
          href={profile.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-cyan-400 text-sm hover:underline"
        >
          @{profile.login}
        </a>
        {profile.bio && <p className="text-gray-400 mt-2 text-sm max-w-xl">{profile.bio}</p>}

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
          {profile.location && (
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</span>
          )}
          {profile.company && (
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {profile.company}</span>
          )}
        </div>

        <div className="flex gap-6 mt-4">
          <Stat icon={<Users className="w-4 h-4" />} label="Followers" value={profile.followers} />
          <Stat icon={<UserPlus className="w-4 h-4" />} label="Following" value={profile.following} />
          <Stat icon={<BookOpen className="w-4 h-4" />} label="Repos" value={profile.public_repos} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-cyan-400">{icon}</span>
      <span className="font-semibold">{value?.toLocaleString?.() ?? value}</span>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  );
}

function DashboardSection({ dashboard }) {
  if (!dashboard) return null;
  const maxCount = Math.max(...dashboard.top_languages.map((l) => l.repo_count), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:col-span-1">
        <h3 className="text-sm text-gray-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" /> Top Languages
        </h3>
        <div className="space-y-3">
          {dashboard.top_languages.map((lang) => (
            <div key={lang.language}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{lang.language}</span>
                <span>{lang.repo_count}</span>
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

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
        <Star className="w-6 h-6 text-yellow-400 mb-2" />
        <span className="text-2xl font-bold">{dashboard.total_stars.toLocaleString()}</span>
        <span className="text-gray-500 text-xs mt-1">Total Stars</span>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
        <GitFork className="w-6 h-6 text-purple-400 mb-2" />
        <span className="text-2xl font-bold">{dashboard.total_forks.toLocaleString()}</span>
        <span className="text-gray-500 text-xs mt-1">Total Forks</span>
      </div>

      {dashboard.most_starred_repo && (
        <div className="bg-gradient-to-br from-yellow-500/[0.06] to-transparent border border-yellow-500/20 rounded-2xl p-5 md:col-span-3">
          <h3 className="text-xs text-yellow-400/80 mb-2 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Most Starred Repository
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <a
                href={dashboard.most_starred_repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-white hover:text-cyan-300 transition-colors"
              >
                {dashboard.most_starred_repo.name}
              </a>
              {dashboard.most_starred_repo.description && (
                <p className="text-gray-500 text-xs mt-1">{dashboard.most_starred_repo.description}</p>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-sm text-yellow-300 font-medium shrink-0 ml-4">
              <Star className="w-4 h-4 fill-yellow-400" />
              {dashboard.most_starred_repo.stargazers_count.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function AIInsightsSection({ analysis, loading }) {
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/10 border border-white/10 rounded-2xl p-6 mb-8">
      <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
        <Sparkles className="w-4 h-4 text-purple-400" /> AI Insights
      </h3>

      {loading && <p className="text-gray-500 text-sm">Analysing developer profile...</p>}

      {!loading && analysis && (
        <>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">{analysis.summary}</p>
          <div className="flex flex-wrap gap-2">
            {analysis.strengths.map((s) => (
              <span key={s} className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-cyan-300">
                {s}
              </span>
            ))}
          </div>
          {analysis.suggested_technologies?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Suggested technologies to explore:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.suggested_technologies.map((t) => (
                  <span key={t} className="text-xs bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-purple-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReposSection({ repos, languages, sortBy, setSortBy, languageFilter, setLanguageFilter }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-medium text-gray-300">Repositories ({repos.length})</h3>
        <div className="flex gap-3">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-[#0d0d1a]">
                {lang === 'all' ? 'All languages' : lang}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
          >
            <option value="updated" className="bg-[#0d0d1a]">Recently updated</option>
            <option value="created" className="bg-[#0d0d1a]">Recently created</option>
            <option value="stars" className="bg-[#0d0d1a]">Most stars</option>
            <option value="full_name" className="bg-[#0d0d1a]">Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <RepoCard key={repo.full_name} repo={repo} />
        ))}
      </div>
    </div>
  );
}

function RepoCard({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-colors block"
    >
      <h4 className="font-medium text-white mb-1">{repo.name}</h4>
      {repo.description && (
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{repo.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <Circle className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" /> {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {repo.stargazers_count.toLocaleString()}</span>
        <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {repo.forks_count.toLocaleString()}</span>
        <span className="text-gray-600">· Updated {formatDate(repo.updated_at)}</span>
      </div>
    </a>
  );
}

function formatDate(isoString) {
  if (!isoString) return 'recently';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}