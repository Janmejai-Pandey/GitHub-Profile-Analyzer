import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Shuffle } from 'lucide-react';
import ProfileResults from './pages/ProfileResults';
import CosmicParallaxBg from './components/CosmicParallaxBg';

export default function App() {
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState(null); // null = show landing page
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

  return (
    <div className="min-h-screen bg-[#080811] text-white relative overflow-hidden flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <CosmicParallaxBg
          head="GHOST"
          text="GitHub, has, officially, seen, truth"
          loop={true}
          showHorizon={true}
          showTitle={false}
          className="w-full h-full"
        />
      </div>

      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-md border border-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 fill-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              GHOST
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-gray-400 border-l border-white/10 pl-2.5">
              GitHub Has Officially Seen Truth
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-20 max-w-4xl mx-auto w-full px-4 flex-1 flex flex-col justify-between items-center py-6 sm:py-10">
        {/* Above Horizon: Cinematic GHOST title sitting right above the atmospheric glow */}
        <div className="w-full flex-1 flex flex-col justify-end items-center pb-8 sm:pb-12">
          <h1 className="cosmic-title">
            GHOST
          </h1>
        </div>

        {/* Below Horizon: Search bar & Quick Try sitting on the planet's dark curvature */}
        <div className="w-full flex-1 flex flex-col justify-start items-center pt-8 sm:pt-12">
          <form onSubmit={handleSearch} className="max-w-xl w-full mx-auto mb-5 px-2">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-md opacity-35 group-hover:opacity-75 transition duration-300" />

              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-[#090b14]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl gap-2 sm:gap-0">
                <div className="flex items-center flex-1 px-1">
                  <Search className="w-5 h-5 text-cyan-400 ml-2 mr-2 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a GitHub username..."
                    className="w-full bg-transparent text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none py-1.5 font-medium"
                  />
                </div>
                <div className="flex items-center shrink-0">
                  <button
                    type="submit"
                    disabled={!username.trim()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:hover:from-cyan-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
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
            <span className="text-gray-400 font-medium">Quick Try:</span>
            {['torvalds', 'gaearon', 'shadcn'].map((user) => (
              <button
                key={user}
                type="button"
                onClick={() => handleQuickTry(user)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 hover:text-cyan-300 font-mono transition-colors active:scale-95"
              >
                @{user}
              </button>
            ))}
            <button
              type="button"
              onClick={handleRandomUser}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 transition-colors active:scale-95 text-xs font-medium"
              title="Analyze a random notable open-source developer"
            >
              <Shuffle className="w-3 h-3" />
              <span>Random Creator</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}