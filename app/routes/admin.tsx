import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateMatch, useMatches } from "~/hooks";
import * as ApiService from "~/services/api";
import {
  CreateMatchForm,
  Alert,
  ErrorBoundary,
  UpdateScoreForm,
  LoadingSpinner,
} from "~/components";
import type { CreateMatchRequest, UpdateScoreRequest, ApiError } from "~/types";
import type { Route } from "./+types/matches";

type TabType = "create" | "update";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sportzy-Admin" },
    {
      name: "description",
      content: "Admin panel for managing matches on Sportzy.",
    },
  ];
}

function AdminContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("create");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<ApiError | null>(null);

  const {
    createMatch,
    isLoading: isCreating,
    error: createError,
  } = useCreateMatch();

  const {
    matches,
    isLoading: isLoadingMatches,
    error: matchesError,
  } = useMatches(50);

  const liveMatches = matches.filter((match) => match.status === "live");

  const handleCreateMatch = async (data: CreateMatchRequest) => {
    const result = await createMatch(data);
    if (result) {
      setSuccessMessage(
        `Match "${data.homeTeam} vs ${data.awayTeam}" created successfully!`,
      );
      setTimeout(() => {
        navigate(`/matches/${result.id}`);
      }, 2000);
    }
  };

  const handleUpdateScore = async (
    matchId: number,
    scores: UpdateScoreRequest,
  ) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await ApiService.updateScore(matchId, scores);
      window.location.reload();
    } catch (err) {
      const apiError =
        err instanceof ApiService.ApiServiceError
          ? {
              status: err.status,
              message: err.message,
              details: err.details,
            }
          : { status: 500, message: String(err) };
      setUpdateError(apiError);
      console.error("Failed to update score:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedMatch = selectedMatchId
    ? liveMatches.find((m) => m.id === selectedMatchId)
    : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-150 h-150 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-125 h-125 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/3 w-100 h-100 bg-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-white font-semibold text-sm uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Match{" "}
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-emerald-400 text-transparent bg-clip-text">
              Management
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Create new matches and update live scores in real-time
          </p>
        </div>

        {successMessage && (
          <div className="mb-6">
            <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-emerald-400 font-semibold mb-1">
                    Success
                  </h4>
                  <p className="text-emerald-300/80 text-sm">
                    {successMessage}
                  </p>
                </div>
                <button
                  onClick={() => setSuccessMessage("")}
                  className="text-emerald-400 hover:text-emerald-300"
                  aria-label="Close success message"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === "create"
                  ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
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
              Create Match
            </button>
            <button
              onClick={() => setActiveTab("update")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === "update"
                  ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Update Scores
              {liveMatches.length > 0 && (
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full border border-red-500/30">
                  {liveMatches.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <div className="max-w-3xl">
            <CreateMatchForm
              onSubmit={handleCreateMatch}
              isLoading={isCreating}
              error={createError}
            />

            <div className="mt-12 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-400 text-lg">Need Help?</h3>
              </div>
              <ul className="text-blue-300/80 text-sm space-y-2 ml-13">
                <li>
                  • Match dates should be in ISO 8601 format (YYYY-MM-DDTHH:MM)
                </li>
                <li>• End time must be after start time</li>
                <li>• Initial scores default to 0-0</li>
                <li>• Matches will be created with a "scheduled" status</li>
                <li>
                  • You can update scores once the match is marked as "live"
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            {isLoadingMatches && (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-400 mt-6 font-medium">
                    Loading matches...
                  </p>
                </div>
              </div>
            )}

            {matchesError && (
              <div className="mb-6">
                <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
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
                      <h4 className="text-red-400 font-semibold mb-1">
                        Error Loading Matches
                      </h4>
                      <p className="text-red-300/80 text-sm">
                        {matchesError.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isLoadingMatches && !matchesError && liveMatches.length === 0 && (
              <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-500/20 rounded-2xl mb-6">
                  <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Live Matches
                </h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  There are no live matches at the moment. Scores can only be
                  updated for live matches.
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/50 hover:scale-105 inline-flex items-center gap-2"
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
                </button>
              </div>
            )}

            {!isLoadingMatches && !matchesError && liveMatches.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Live Matches ({liveMatches.length})
                    </h2>
                  </div>
                  {liveMatches.map((match) => (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatchId(match.id)}
                      className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all ${
                        selectedMatchId === match.id
                          ? "border-2 border-blue-500 shadow-xl shadow-blue-500/20 scale-105"
                          : "border border-white/10 hover:border-white/30 hover:scale-102"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
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
                          </div>
                          <span className="text-sm font-bold text-gray-400 uppercase">
                            {match.sport} • #{match.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 backdrop-blur-xl rounded-full border border-red-500/30">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <span className="text-xs font-bold text-red-400">
                            LIVE
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-bold text-xl mb-2">
                            {match.homeTeam}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {match.awayTeam}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-4xl font-black text-white">
                            {match.homeScore}
                          </div>
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <span className="text-gray-400 font-bold">-</span>
                          </div>
                          <div className="text-4xl font-black text-white">
                            {match.awayScore}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Update Score
                      </h3>
                    </div>

                    {!selectedMatch ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-500/20 rounded-2xl mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
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
                        <p className="text-gray-400 text-sm">
                          Select a match to update its score
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-6 pb-4 border-b border-white/10">
                          <p className="text-sm text-gray-400 mb-2">
                            Selected Match
                          </p>
                          <p className="font-bold text-white text-lg">
                            {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {selectedMatch.sport.toUpperCase()} • Match #
                            {selectedMatch.id}
                          </p>
                        </div>

                        <UpdateScoreForm
                          match={selectedMatch}
                          onUpdate={handleUpdateScore}
                          isLoading={isUpdating}
                          error={updateError}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminRoute() {
  return (
    <ErrorBoundary>
      <AdminContent />
    </ErrorBoundary>
  );
}
