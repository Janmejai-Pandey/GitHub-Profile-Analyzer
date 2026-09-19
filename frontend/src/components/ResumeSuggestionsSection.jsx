import React, { useState } from 'react';
import {
  FileText, Briefcase, Sparkles, CheckCircle2, AlertTriangle,
  Lightbulb, Copy, Check, Code2, ArrowUpRight, Award, Compass,
} from 'lucide-react';

export default function ResumeSuggestionsSection({ analysis, loading }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (loading) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-purple-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Resume & Profile Optimization</h3>
            <p className="text-xs text-gray-400">Synthesizing role matches, skill gaps, and resume bullets...</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-24 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
          <div className="h-32 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const data = analysis?.analysis || analysis;
  if (!data) return null;

  const handleCopyBullet = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!data.resume_suggestions?.length) return;
    const allText = data.resume_suggestions.map((b) => `• ${b}`).join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <section id="resume-section" className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/20 to-pink-500/20 border border-white/15 flex items-center justify-center shadow-inner">
            <Briefcase className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg font-bold text-white tracking-tight">Career & Profile Optimization</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <Sparkles className="w-3 h-3 text-purple-400" />
                AI Generated Guidance
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Evidence-based recommendations, role positioning, and resume-ready achievements.
            </p>
          </div>
        </div>
      </div>

      {data.best_suited_role && (
        <div className="my-6 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-cyan-900/20 border border-purple-500/30 rounded-xl p-5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                  Best-Suited Developer Role
                </span>
                <h4 className="text-xl font-bold text-white mt-0.5 tracking-tight">
                  {data.best_suited_role.role}
                </h4>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed max-w-2xl">
                  {data.best_suited_role.reason}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-cyan-300 font-medium flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Role Match: High Confidence
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4.5">
          <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Identified Skill Gaps & Observability
          </h4>
          <div className="space-y-2.5">
            {data.skill_gaps?.map((gap, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300 bg-amber-500/[0.04] border border-amber-500/15 rounded-lg p-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{gap}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4.5">
          <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            Strategic Recommendations
          </h4>
          <div className="space-y-2.5">
            {data.recommendations?.map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300 bg-cyan-500/[0.04] border border-cyan-500/15 rounded-lg p-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.projects_to_build?.length > 0 && (
        <div className="my-6 pt-5 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                What to Build Next — Recommended Projects
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                High-leverage project concepts designed to close skill gaps and demonstrate modern architecture.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.projects_to_build.map((project, i) => (
              <div
                key={i}
                className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-purple-500/30 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h5 className="font-semibold text-sm text-white">{project.title}</h5>
                    <span className="p-1 rounded bg-white/5 text-gray-400">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.readme_suggestions?.length > 0 && (
        <div className="my-6 pt-5 border-t border-white/5">
          <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            GitHub Profile & README Enhancements
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.readme_suggestions.map((sugg, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/10 rounded-xl p-3.5 text-xs text-gray-300 flex items-start gap-2.5 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-300 font-mono text-[10px] shrink-0">
                  {i + 1}
                </div>
                <span>{sugg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.resume_suggestions?.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
            <div>
              <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Resume & LinkedIn Achievement Bullets
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Quantified, impact-driven bullet points synthesized directly from repository commits and stars.
              </p>
            </div>

            <button
              onClick={handleCopyAll}
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">All Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Bullets</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {data.resume_suggestions.map((bullet, i) => (
              <div
                key={i}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-xl p-3.5 transition-colors flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-2.5 text-xs text-gray-200 leading-relaxed">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>{bullet}</span>
                </div>

                <button
                  onClick={() => handleCopyBullet(bullet, i)}
                  className="shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all opacity-80 group-hover:opacity-100"
                  title="Copy bullet point"
                >
                  {copiedIndex === i ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
