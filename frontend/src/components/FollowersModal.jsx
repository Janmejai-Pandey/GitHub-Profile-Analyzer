import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { getFollowers, getFollowing } from '../services/api';

export default function FollowersModal({ username, initialTab = 'followers', isOpen, onClose, onSelectUser }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const data = activeTab === 'followers'
          ? await getFollowers(username)
          : await getFollowing(username);
        if (!cancelled) setUsers(data || []);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [username, activeTab, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0d0d1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Connections for @{username}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 px-6 pt-2 bg-white/[0.01]">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'followers'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Followers
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-2 pb-3 px-2 text-xs font-medium border-b-2 transition-colors ml-4 ${
              activeTab === 'following'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Following
          </button>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs">Loading network...</span>
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-xs">
              No {activeTab} found for this profile.
            </div>
          )}

          {!loading && users.map((user) => (
            <div
              key={user.login}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-10 h-10 rounded-xl border border-white/10 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {user.name || user.login}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>@{user.login}</span>
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 hover:text-cyan-400 transition-colors"
                      title="Open GitHub profile"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectUser(user.login);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-600/60 to-cyan-600/60 hover:from-indigo-500 hover:to-cyan-500 text-white transition-all shadow-sm shrink-0 active:scale-95"
              >
                <span>Analyze</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
