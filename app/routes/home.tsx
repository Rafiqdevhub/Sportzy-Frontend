import type { Route } from "./+types/home";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sportzy - Live Match Updates & Commentary" },
    {
      name: "description",
      content:
        "Watch live matches and follow expert commentary in real-time. Join Sportzy for the ultimate sports experience!",
    },
  ];
}

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-150 h-150 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-125 h-125 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-full border border-white/10 shadow-xl">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-white font-semibold text-sm uppercase tracking-wider">
                Live Sports • Real-Time Updates
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
                Experience Sports
                <br />
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-emerald-400 text-transparent bg-clip-text">
                  Like Never Before
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Dive into the heart of the action with real-time scores, expert
                commentary, and comprehensive coverage of your favorite
                sports—all in one place.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              <button
                onClick={() => navigate("/matches")}
                className="group px-10 py-5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-2xl shadow-blue-600/50 hover:shadow-blue-700/60 hover:scale-105 flex items-center gap-3 text-lg cursor-pointer"
              >
                <svg
                  className="w-6 h-6 group-hover:rotate-12 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                View All Matches
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="group px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-bold rounded-xl transition-all border border-white/20 hover:border-white/30 hover:scale-105 flex items-center gap-3 text-lg cursor-pointer"
              >
                <svg
                  className="w-6 h-6 group-hover:rotate-90 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Match
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20 mb-20">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                100+
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                Live Matches Daily
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                5+
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                Sports Covered
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                Live Updates
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                ∞
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                Instant Replays
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 py-20 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Why Choose Sportzy?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to stay connected to the sports you love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-linear-to-br from-blue-600/10 to-blue-900/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/50">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Lightning Fast Updates
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Experience real-time score updates and live commentary with zero
                delay. Never miss a crucial moment with our instant notification
                system.
              </p>
            </div>

            <div className="group bg-linear-to-br from-purple-600/10 to-purple-900/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/50">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Expert Analysis
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Get in-depth match analysis, player statistics, and expert
                commentary from seasoned sports analysts and commentators.
              </p>
            </div>

            <div className="group bg-linear-to-br from-emerald-600/10 to-emerald-900/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-500/40 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/50">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Global Coverage
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Follow Football, Cricket, Tennis, Basketball, Baseball and more.
                Comprehensive coverage of leagues and tournaments worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              All Your Favorite Sports
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive coverage across multiple sports and leagues
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                name: "Football",
                icon: "⚽",
                color: "from-green-600 to-green-800",
              },
              {
                name: "Cricket",
                icon: "🏏",
                color: "from-blue-600 to-blue-800",
              },
              {
                name: "Tennis",
                icon: "🎾",
                color: "from-yellow-600 to-yellow-800",
              },
              {
                name: "Basketball",
                icon: "🏀",
                color: "from-orange-600 to-orange-800",
              },
              {
                name: "Baseball",
                icon: "⚾",
                color: "from-red-600 to-red-800",
              },
            ].map((sport) => (
              <div
                key={sport.name}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:border-white/30 transition-all hover:scale-105 cursor-pointer"
              >
                <div
                  className={`text-6xl mb-4 group-hover:scale-125 transition-transform`}
                >
                  {sport.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{sport.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
