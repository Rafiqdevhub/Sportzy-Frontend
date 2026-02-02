import { useParams } from "react-router";
import { useState } from "react";
import {
  useMatch,
  useCommentary,
  useCreateCommentary,
  useWebSocket,
  useSubscribeToMatch,
  useUpdateScore,
} from "~/hooks";
import {
  ScoreBoard,
  CommentaryList,
  Alert,
  LoadingSpinner,
  ErrorBoundary,
} from "~/components";
import type { UpdateScoreRequest } from "~/types";

function MatchDetailContent() {
  const params = useParams();
  const matchId = params.id ? parseInt(params.id, 10) : null;

  if (!matchId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-red-400"
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
                Invalid Match
              </h3>
              <p className="text-red-300/80">Match ID not found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { match, isLoading, error } = useMatch(matchId);
  const {
    commentary,
    isLoading: commentaryLoading,
    error: commentaryError,
  } = useCommentary(matchId, 50);
  const {
    createCommentary,
    isLoading: isCreating,
    error: createError,
  } = useCreateCommentary(matchId);
  const {
    updateScore,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateScore(matchId);
  const { isConnected } = useWebSocket();

  // Subscribe to live updates
  useSubscribeToMatch(matchId);

  const [commentaryForm, setCommentaryForm] = useState<{
    minute?: number;
    message: string;
  }>({
    minute: undefined,
    message: "",
  });

  const [scoreForm, setScoreForm] = useState<UpdateScoreRequest>({
    homeScore: 0,
    awayScore: 0,
  });

  const handleCommentarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentaryForm.message?.trim()) {
      return;
    }

    const result = await createCommentary({
      minute: commentaryForm.minute ?? 0,
      message: commentaryForm.message,
    });

    if (result) {
      setCommentaryForm({ minute: undefined, message: "" });
    }
  };

  const handleScoreUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateScore(scoreForm);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-red-400"
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
                Failed to load match
              </h3>
              <p className="text-red-300/80">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 mt-6 font-medium">Loading match...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-red-400"
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
                Match Not Found
              </h3>
              <p className="text-red-300/80">
                The requested match does not exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-150 h-150 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-125 h-125 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/3 w-100 h-100 bg-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <a
            href="/matches"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-semibold rounded-xl transition-all border border-white/10 hover:border-white/30"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Matches
          </a>
        </div>

        {/* Score Board */}
        <div className="mb-8">
          <ScoreBoard match={match} />
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-6">
            <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-yellow-400 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-yellow-400 font-semibold text-sm">
                    Connection Status
                  </h4>
                  <p className="text-yellow-300/80 text-sm">
                    Real-time updates not connected. Reconnecting...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Commentary Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Live Commentary
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-xl rounded-full border border-blue-500/30">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span className="text-sm text-blue-300 font-semibold">
                    {commentary.length} updates
                  </span>
                </div>
              </div>

              {/* Errors */}
              {commentaryError && (
                <div className="mb-6">
                  <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
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
                      <div>
                        <h4 className="text-red-400 font-semibold text-sm mb-1">
                          Commentary Error
                        </h4>
                        <p className="text-red-300/80 text-sm">
                          {(commentaryError as any).message ||
                            "Failed to load commentary"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {createError && (
                <div className="mb-6">
                  <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
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
                      <div>
                        <h4 className="text-red-400 font-semibold text-sm mb-1">
                          Failed to add commentary
                        </h4>
                        <p className="text-red-300/80 text-sm">
                          {createError.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Commentary List */}
              <CommentaryList
                commentary={commentary}
                isLoading={commentaryLoading}
                error={commentaryError as any}
                emptyMessage="No commentary yet. Be the first to add one!"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Commentary Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Add Commentary</h3>
              </div>

              <form onSubmit={handleCommentarySubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="minute"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Minute
                  </label>
                  <input
                    type="number"
                    id="minute"
                    min="0"
                    value={commentaryForm.minute ?? ""}
                    onChange={(e) =>
                      setCommentaryForm({
                        ...commentaryForm,
                        minute: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    placeholder="e.g., 45"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={commentaryForm.message ?? ""}
                    onChange={(e) =>
                      setCommentaryForm({
                        ...commentaryForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Add your commentary..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/50 hover:shadow-blue-700/60 hover:scale-105"
                >
                  {isCreating ? "Adding..." : "Add Commentary"}
                </button>
              </form>
            </div>

            {/* Update Score Form (if match is live) */}
            {match.status === "live" && (
              <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">Update Score</h3>
                </div>

                {updateError && (
                  <div className="mb-4">
                    <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-3">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
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
                        <div>
                          <h4 className="text-red-400 font-semibold text-sm mb-1">
                            Update Error
                          </h4>
                          <p className="text-red-300/80 text-sm">
                            {updateError.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleScoreUpdate} className="space-y-4">
                  <div>
                    <label
                      htmlFor="homeScore"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      {match.homeTeam}
                    </label>
                    <input
                      type="number"
                      id="homeScore"
                      min="0"
                      value={scoreForm.homeScore}
                      onChange={(e) =>
                        setScoreForm({
                          ...scoreForm,
                          homeScore: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="awayScore"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      {match.awayTeam}
                    </label>
                    <input
                      type="number"
                      id="awayScore"
                      min="0"
                      value={scoreForm.awayScore}
                      onChange={(e) =>
                        setScoreForm({
                          ...scoreForm,
                          awayScore: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/50 hover:shadow-emerald-700/60 hover:scale-105"
                  >
                    {isUpdating ? "Updating..." : "Update Score"}
                  </button>
                </form>
              </div>
            )}

            {/* Match Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Match Info</h3>
              </div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <dt className="text-gray-400 text-sm font-medium">Sport</dt>
                  <dd className="text-white font-semibold">{match.sport}</dd>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <dt className="text-gray-400 text-sm font-medium">Status</dt>
                  <dd className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        match.status === "live"
                          ? "bg-red-500 animate-pulse"
                          : match.status === "scheduled"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                      }`}
                    ></span>
                    <span className="text-white font-semibold capitalize">
                      {match.status}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between py-3">
                  <dt className="text-gray-400 text-sm font-medium">
                    Start Time
                  </dt>
                  <dd className="text-white font-semibold text-sm">
                    {new Date(match.startTime).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchDetailRoute() {
  return (
    <ErrorBoundary>
      <MatchDetailContent />
    </ErrorBoundary>
  );
}
