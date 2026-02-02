/**
 * ScoreBoard Component
 * Displays match score information
 */

import type React from "react";
import type { Match } from "~/types";

interface ScoreBoardProps {
  match: Match;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ match }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "text-red-600";
      case "scheduled":
        return "text-blue-600";
      case "finished":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-50";
      case "scheduled":
        return "bg-blue-50";
      case "finished":
        return "bg-gray-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className={`rounded-lg p-8 ${getStatusBg(match.status)}`}>
      <div className="mb-6">
        <p
          className={`text-sm font-semibold uppercase tracking-wide ${getStatusColor(match.status)}`}
        >
          {match.status === "live" && "🔴 "}{" "}
          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          {formatDate(match.startTime)}
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <p className="text-gray-700 font-semibold text-xl mb-3">
            {match.homeTeam}
          </p>
          <p className="text-6xl font-bold text-gray-900 tabular-nums">
            {match.homeScore}
          </p>
        </div>

        <div className="px-6 text-center">
          <p className="text-gray-500 font-semibold text-2xl">-</p>
        </div>

        <div className="text-center flex-1">
          <p className="text-gray-700 font-semibold text-xl mb-3">
            {match.awayTeam}
          </p>
          <p className="text-6xl font-bold text-gray-900 tabular-nums">
            {match.awayScore}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Sport</p>
          <p className="font-semibold text-gray-900">{match.sport}</p>
        </div>
        <div>
          <p className="text-gray-600">Match ID</p>
          <p className="font-semibold text-gray-900">#{match.id}</p>
        </div>
      </div>
    </div>
  );
};
