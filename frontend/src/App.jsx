import React, { useState } from 'react';
import { Search, ArrowRight, HelpCircle } from 'lucide-react';
import ProfileResults from './pages/ProfileResults';

export default function App() {
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState(null); // null = show landing page

  const handleSearch = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setSearchedUser(username.trim());
    }
  };

  const handleQuickTry = (user) => {
    setUsername(user);
    setSearchedUser(user);
  };

  const handleBackToHome = () => {
    setSearchedUser(null);
    setUsername('');
  };

  // ---------- RESULTS VIEW ----------
  if (searchedUser) {
    return <ProfileResults username={searchedUser} onBack={handleBackToHome} />;
  }

  // ---------- LANDING VIEW (your original design) ----------
  return (
    <div className="min-h-screen bg-[#080811] text-white relative overflow-hidden flex flex-col justify-between selection:bg-purple-500 selection:text-white">

      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-900/30 via-indigo-800/20 to-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-600/10 blur-[90px] rounded-full pointer-events-none" />

      {/* Subtle Star / Particle background points */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* 1. Header Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-md border border-white/10">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            gh·analyse
          </span>
        </div>

        <nav className="flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          <a href="#api" className="hover:text-white transition-colors">API</a>
        </nav>
      </header>

      {/* 2. Main Hero Content */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-4 text-center my-auto py-12">

        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GITHUB PROFILE ANALYSER</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">v3.0</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          Decode any <br />
          <span className="bg-gradient-to-r from-violet-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
            GitHub profile.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Score, rank, and visualise any developer's GitHub activity with cinematic data breakdowns.
        </p>

        {/* 3. Search Bar Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
          <div className="relative group">
            {/* Glow border on hover/focus */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-300"></div>

            <div className="relative flex items-center bg-[#0d0d1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Search className="w-5 h-5 text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a GitHub username..."
                className="w-full bg-transparent text-white placeholder-gray-500 text-base focus:outline-none px-2"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98]"
              >
                Analyse <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick Try Links */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span>Try:</span>
          <button
            onClick={() => handleQuickTry('torvalds')}
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors"
          >
            torvalds
          </button>
          <button
            onClick={() => handleQuickTry('gaearon')}
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors"
          >
            gaearon
          </button>
        </div>
      </main>

      {/* 4. Footer floating helper */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-end">
        <button className="bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white transition-all">
          <HelpCircle className="w-5 h-5" />
        </button>
      </footer>

    </div>
  );
}