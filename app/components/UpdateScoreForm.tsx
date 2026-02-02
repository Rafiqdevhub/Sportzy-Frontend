import type React from "react";
import { useState } from "react";
import type { Match, ApiError } from "~/types";
import { Alert } from "./Alert";

interface UpdateScoreFormProps {
  match: Match;
  onUpdate: (
    matchId: number,
    scores: { homeScore: number; awayScore: number },
  ) => Promise<void>;
  isLoading?: boolean;
  error?: ApiError | null;
}

export const UpdateScoreForm: React.FC<UpdateScoreFormProps> = ({
  match,
  onUpdate,
  isLoading = false,
  error,
}) => {
  const [homeScore, setHomeScore] = useState(match.homeScore);
  const [awayScore, setAwayScore] = useState(match.awayScore);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    await onUpdate(match.id, { homeScore, awayScore });

    if (!error) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (match.status !== "live") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800 text-sm">
          Scores can only be updated for live matches. Current status:{" "}
          <strong>{match.status}</strong>
        </p>
      </div>
    );
  }

  return (
    <div>
      {showSuccess && (
        <div className="mb-4">
          <Alert
            type="success"
            title="Score Updated"
            message="Match score has been updated successfully!"
            dismissible
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Alert
            type="error"
            title="Update Error"
            message={error.message}
            dismissible
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`homeScore-${match.id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {match.homeTeam}
            </label>
            <input
              type="number"
              id={`homeScore-${match.id}`}
              min="0"
              value={homeScore}
              onChange={(e) => setHomeScore(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`awayScore-${match.id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {match.awayTeam}
            </label>
            <input
              type="number"
              id={`awayScore-${match.id}`}
              min="0"
              value={awayScore}
              onChange={(e) => setAwayScore(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          {isLoading ? "Updating..." : "Update Score"}
        </button>
      </form>
    </div>
  );
};
