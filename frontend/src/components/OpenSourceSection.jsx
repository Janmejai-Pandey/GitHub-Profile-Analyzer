import React from 'react';
import {
  Globe, GitPullRequest, GitCommit, CheckCircle2,
  GitBranch, Star, ExternalLink, Sparkles, Flame, ShieldAlert,
} from 'lucide-react';

export default function OpenSourceSection({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-purple-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Open-Source Contribution Analysis</h3>
            <p className="text-xs text-gray-400">Analyzing public commits, external PRs, and community repos...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section id="opensource-section" className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-600/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 border border-white/15 flex items-center justify-center shadow-inner">
            <Globe className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg font-bold text-white tracking-tight">Open-Source Ecosystem Impact</h3>
              {data.community_rank && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-300">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400/30" />
                  {data.community_rank}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Contributions to repositories owned by organizations and other maintainers.
            </p>
          </div>
        </div>

        {/* Mock/Preview Badge */}
        {data.is_mock && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs self-start sm:self-center font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry Preview</span>
          </div>
        )}
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        <MetricCard
          icon={<GitCommit className="w-4 h-4 text-cyan-400" />}
          label="Total External Contribs"
          value={data.total_external_contributions}
          trend="Public repositories"
        />
        <MetricCard
          icon={<GitPullRequest className="w-4 h-4 text-emerald-400" />}
          label="Merged PRs"
          value={data.pull_requests_merged}
          trend="Accepted upstream"
        />
        <MetricCard
          icon={<CheckCircle2 className="w-4 h-4 text-purple-400" />}
          label="Code Reviews Given"
          value={data.code_reviews}
          trend="Peer peer reviews"
        />
        <MetricCard
          icon={<GitBranch className="w-4 h-4 text-pink-400" />}
          label="External Repos"
          value={data.external_repos_count}
          trend="Different codebases"
        />
      </div>

      {/* Two Column Grid: Contributed Repos & Suggested Repos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-4 border-t border-white/5">
        {/* Left Column: Contributed Repos */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-cyan-400" />
              Flagship External Contributions
            </h4>
            <span className="text-xs text-gray-500">{data.contributed_repositories?.length || 0} tracked</span>
          </div>

          <div className="space-y-3">
            {data.contributed_repositories?.map((repo) => (
              <div
                key={repo.full_name || repo.name}
                className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-sm text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                    >
                      {repo.full_name || repo.name}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                    </a>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-500/15 border border-purple-500/25 text-purple-300">
                      {repo.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-300 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{repo.stars?.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                  {repo.description}
                </p>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-400 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {repo.language}
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">
                    {repo.contributions_count} commits / patches
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Suggested Repos to Contribute to */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Curated Repos to Contribute To
            </h4>
            <span className="text-xs text-purple-300 font-mono">Matched by Stack</span>
          </div>

          <div className="space-y-3">
            {data.suggested_repos_to_contribute?.map((suggested) => (
              <div
                key={suggested.full_name}
                className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:from-white/[0.05] hover:to-white/[0.02] border border-white/10 hover:border-purple-500/30 rounded-xl p-4 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <a
                      href={suggested.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-sm text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5"
                    >
                      {suggested.full_name}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-300 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{suggested.stars?.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                  {suggested.description}
                </p>

                {/* Match Reason Tag */}
                <div className="mt-2.5 px-2.5 py-1 rounded-md bg-purple-900/25 border border-purple-500/20 text-[11px] text-purple-200">
                  <span className="text-purple-400 font-medium">Why it matches:</span> {suggested.match_reason}
                </div>

                {/* Footer with Good First Issues & Issues Link */}
                <div className="flex items-center justify-between mt-3 text-xs pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    {suggested.language}
                  </span>

                  <a
                    href={`${suggested.html_url}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    {suggested.good_first_issues} Good First Issues
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-xs font-medium">{label}</span>
        <div className="p-1 rounded-md bg-white/5">{icon}</div>
      </div>
      <div>
        <div className="text-xl font-bold text-white tracking-tight">{value?.toLocaleString?.() ?? value}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{trend}</div>
      </div>
    </div>
  );
}
