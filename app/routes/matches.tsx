import type React from "react";
import { useSearchParams } from "react-router";
import { useMatches } from "~/hooks";
import { MatchCard, ErrorBoundary } from "~/components";
import type { Route } from "../+types/root";

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
function MatchesContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string, 10)
    : 20;

  const { matches, isLoading, error } = useMatches(limit);

  const liveMatches = matches.filter((m) => m.status === "live");
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");
  const finishedMatches = matches.filter((m) => m.status === "finished");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-150 h-150 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-125 h-125 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/3 w-100 h-100 bg-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-full border border-white/10 shadow-xl mb-6">
            <svg
              className="w-5 h-5 text-blue-400"
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
            <span className="text-white font-semibold text-sm uppercase tracking-wider">
              All Matches
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
            Live & Upcoming
            <br />
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-emerald-400 text-transparent bg-clip-text">
              Match Center
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Watch live matches and follow the action in real-time across all
            sports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                <div className="relative">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">
                  {liveMatches.length}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  Live Matches
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-black text-white">
                  {scheduledMatches.length}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  Scheduled
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-black text-white">
                  {finishedMatches.length}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  Finished
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-400 font-bold text-lg mb-1">
                    Failed to load matches
                  </h3>
                  <p className="text-red-300/80">{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 mt-6 font-medium">Loading matches...</p>
          </div>
        )}

        {!isLoading && matches.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      Showing {matches.length} matches
                    </p>
                    <p className="text-gray-500 text-sm">
                      Limit: {limit} per page
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const newLimit = Math.max(5, limit - 10);
                      setSearchParams({ limit: String(newLimit) });
                    }}
                    disabled={limit <= 5}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-semibold rounded-xl transition-all border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Show Less
                  </button>
                  <button
                    onClick={() => {
                      const newLimit = Math.min(100, limit + 10);
                      setSearchParams({ limit: String(newLimit) });
                    }}
                    disabled={limit >= 100}
                    className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/50 hover:shadow-blue-700/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Show More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && matches.length === 0 && !error && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No Matches Found
                </h3>
                <p className="text-gray-400 mb-6">
                  There are no matches available at the moment. Be the first to
                  create one!
                </p>
                <a
                  href="/admin"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/50 hover:shadow-blue-700/60 hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
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
                  Create a Match
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchesRoute() {
  return (
    <ErrorBoundary>
      <MatchesContent />
    </ErrorBoundary>
  );
}
