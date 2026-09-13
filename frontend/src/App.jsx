import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Shuffle } from 'lucide-react';
import ProfileResults from './pages/ProfileResults';
import Galaxy from './components/Galaxy';
import VariableProximity from './components/VariableProximity';

export default function App() {
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState(null); // null = show landing page
  const titleContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Global keyboard shortcuts (/ to focus search)
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '/' || e.key === 's') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

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

  const randomUsers = ['torvalds', 'gaearon', 'shadcn', 'antfu', 'sindresorhus', 'rich-harris'];
  const handleRandomUser = () => {
    const picked = randomUsers[Math.floor(Math.random() * randomUsers.length)];
    handleQuickTry(picked);
  };

  const handleBackToHome = () => {
    setSearchedUser(null);
    setUsername('');
  };

  // ---------- RESULTS VIEW ----------
  if (searchedUser) {
    return (
      <ProfileResults
        key={searchedUser}
        username={searchedUser}
        onBack={handleBackToHome}
        onSearchUser={handleQuickTry}
      />
    );
  }

  // ---------- LANDING VIEW ----------
  return (
    <div className="min-h-screen bg-[#080811] text-white relative overflow-hidden flex flex-col justify-between selection:bg-purple-500 selection:text-white">

      {/* Fullscreen Interactive WebGL Galaxy */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          focal={[0.5, 0.5]}
          rotation={[1.0, 0.0]}
          starSpeed={0.5}
          density={1}
          hueShift={140}
          speed={1.0}
          mouseInteraction={true}
          glowIntensity={0.3}
          saturation={0.0}
          mouseRepulsion={true}
          repulsionStrength={2}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          autoCenterRepulsion={0}
          transparent={true}
          lightMode={false}
        />
      </div>

      {/* 1. Clean Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-md border border-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 fill-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            gh·analyse
          </span>
        </div>
      </header>

      {/* 2. Main Hero Content */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-4 text-center my-auto py-8 sm:py-12">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300 mb-6 sm:mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ENGINEERING TELEMETRY</span>
          <span className="text-gray-500">•</span>
          <span className="text-cyan-400">v3.0</span>
        </div>

        {/* Interactive Hero Title with VariableProximity */}
        <div ref={titleContainerRef} className="cursor-default select-none mb-4 sm:mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <VariableProximity
              label="Deep-Dive Any"
              className="text-white block"
              fromFontVariationSettings="'wght' 400, 'opsz' 14"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={titleContainerRef}
              radius={120}
              falloff="gaussian"
            />
            <span className="bg-gradient-to-r from-violet-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm inline-block">
              <VariableProximity
                label="GitHub Profile."
                className="bg-gradient-to-r from-violet-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent inline-block"
                fromFontVariationSettings="'wght' 500, 'opsz' 14"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={titleContainerRef}
                radius={120}
                falloff="gaussian"
              />
            </span>
          </h1>
        </div>

        {/* Hero Subtitle */}
        <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal px-2">
          Inspect repository velocity, upstream open-source pull requests, language telemetry, and AI career intelligence in seconds.
        </p>

        {/* 3. Search Bar Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6 px-2">
          <div className="relative group">
            {/* Glow border on hover/focus */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300" />

            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-[#0d0d1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl gap-2 sm:gap-0">
              <div className="flex items-center flex-1 px-1">
                <Search className="w-5 h-5 text-gray-400 ml-2 mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a GitHub username (e.g. torvalds, gaearon)..."
                  className="w-full bg-transparent text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none py-1.5"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-block text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">
                  / to focus
                </span>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98]"
                >
                  <span>Analyse</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick Try Pills & Random Creator */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-400 px-2">
          <span>Quick Try:</span>
          {['torvalds', 'gaearon', 'shadcn'].map((user) => (
            <button
              key={user}
              onClick={() => handleQuickTry(user)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 hover:text-cyan-300 font-mono transition-colors active:scale-95"
            >
              @{user}
            </button>
          ))}
          <button
            onClick={handleRandomUser}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 transition-colors active:scale-95 text-xs font-medium"
            title="Analyze a random notable open-source developer"
          >
            <Shuffle className="w-3 h-3" />
            <span>Random Creator</span>
          </button>
        </div>
      </main>

      {/* 4. Minimalist Clean Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 border-t border-white/5">
        <div>
          GitHub Profile Analyzer • Built with React 19, Tailwind CSS & Vite
        </div>
        <div>
          <span>Dark Theme (#080811)</span>
        </div>
      </footer>
    </div>
  );
}