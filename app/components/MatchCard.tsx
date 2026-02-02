import type React from "react";
import { useNavigate } from "react-router";
import type { Match } from "~/types";

interface MatchCardProps {
  match: Match;
  onClick?: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(match);
    } else {
      navigate(`/matches/${match.id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "finished":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 hover:scale-105 transition-all cursor-pointer shadow-xl group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
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
          <h3 className="text-lg font-bold text-white">
            {match.sport.toUpperCase()}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-xl ${getStatusColor(match.status)} flex items-center gap-2`}
        >
          {match.status === "live" && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          {getStatusText(match.status)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-center mb-3">
          <div className="flex-1">
            <p className="text-gray-300 font-semibold text-lg mb-2">
              {match.homeTeam}
            </p>
            <p className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors">
              {match.homeScore}
            </p>
          </div>
          <div className="px-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <p className="text-gray-400 text-sm font-bold">VS</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-300 font-semibold text-lg mb-2">
              {match.awayTeam}
            </p>
            <p className="text-4xl font-black text-white group-hover:text-purple-400 transition-colors">
              {match.awayScore}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 text-gray-400">
          <svg
            className="w-4 h-4"
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
          <p className="text-sm">
            <span className="font-medium">Start:</span>{" "}
            {formatDate(match.startTime)}
          </p>
        </div>
      </div>
    </div>
  );
};
