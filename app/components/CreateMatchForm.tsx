import type React from "react";
import { useState } from "react";
import type { CreateMatchRequest } from "~/types";
import type { ApiError } from "~/types";

interface CreateMatchFormProps {
  onSubmit: (data: CreateMatchRequest) => Promise<void>;
  isLoading?: boolean;
  error?: ApiError | null;
}

export const CreateMatchForm: React.FC<CreateMatchFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<CreateMatchRequest>({
    sport: "football",
    homeTeam: "",
    awayTeam: "",
    startTime: "",
    endTime: "",
    homeScore: 0,
    awayScore: 0,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.homeTeam.trim()) {
      errors.homeTeam = "Home team is required";
    }
    if (!formData.awayTeam.trim()) {
      errors.awayTeam = "Away team is required";
    }
    if (!formData.startTime) {
      errors.startTime = "Start time is required";
    }
    if (!formData.endTime) {
      errors.endTime = "End time is required";
    }
    if (
      formData.startTime &&
      formData.endTime &&
      formData.startTime >= formData.endTime
    ) {
      errors.endTime = "End time must be after start time";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value, 10) : value,
    });
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        sport: "football",
        homeTeam: "",
        awayTeam: "",
        startTime: "",
        endTime: "",
        homeScore: 0,
        awayScore: 0,
      });
    } catch {
      // Error is handled by parent component
    }
  };

  const getErrorMessage = (fieldName: string): string | undefined => {
    return (
      validationErrors[fieldName] ||
      error?.details?.find((d) => d.path[0] === fieldName)?.message
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Create New Match</h2>
      </div>

      {error && !Object.keys(validationErrors).length && (
        <div className="mb-6 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
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
              <p className="text-red-400 font-semibold mb-1">{error.message}</p>
              {error.details && error.details.length > 0 && (
                <ul className="list-disc list-inside text-red-300/80 text-sm mt-2 space-y-1">
                  {error.details.map((detail, i) => (
                    <li key={i}>{detail.message}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            htmlFor="sport"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Sport
          </label>
          <select
            id="sport"
            name="sport"
            value={formData.sport}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="football" className="bg-gray-800">
              Football
            </option>
            <option value="cricket" className="bg-gray-800">
              Cricket
            </option>
            <option value="tennis" className="bg-gray-800">
              Tennis
            </option>
            <option value="basketball" className="bg-gray-800">
              Basketball
            </option>
            <option value="baseball" className="bg-gray-800">
              Baseball
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="homeTeam"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Home Team <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="homeTeam"
            name="homeTeam"
            value={formData.homeTeam}
            onChange={handleChange}
            placeholder="e.g., Arsenal FC"
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              getErrorMessage("homeTeam") ? "border-red-500" : "border-white/20"
            }`}
          />
          {getErrorMessage("homeTeam") && (
            <p className="text-red-400 text-sm mt-1">
              {getErrorMessage("homeTeam")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="awayTeam"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Away Team <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="awayTeam"
            name="awayTeam"
            value={formData.awayTeam}
            onChange={handleChange}
            placeholder="e.g., Liverpool FC"
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              getErrorMessage("awayTeam") ? "border-red-500" : "border-white/20"
            }`}
          />
          {getErrorMessage("awayTeam") && (
            <p className="text-red-400 text-sm mt-1">
              {getErrorMessage("awayTeam")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Start Time <span className="text-red-400">*</span>
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              getErrorMessage("startTime")
                ? "border-red-500"
                : "border-white/20"
            }`}
          />
          {getErrorMessage("startTime") && (
            <p className="text-red-400 text-sm mt-1">
              {getErrorMessage("startTime")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            End Time <span className="text-red-400">*</span>
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              getErrorMessage("endTime") ? "border-red-500" : "border-white/20"
            }`}
          />
          {getErrorMessage("endTime") && (
            <p className="text-red-400 text-sm mt-1">
              {getErrorMessage("endTime")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="homeScore"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Home Score
          </label>
          <input
            type="number"
            id="homeScore"
            name="homeScore"
            value={formData.homeScore}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="awayScore"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Away Score
          </label>
          <input
            type="number"
            id="awayScore"
            name="awayScore"
            value={formData.awayScore}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/50 hover:shadow-blue-700/60 hover:scale-105"
        >
          {isLoading ? "Creating..." : "Create Match"}
        </button>
      </div>
    </form>
  );
};
