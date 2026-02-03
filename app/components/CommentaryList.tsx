import type React from "react";
import type { Commentary } from "~/types";

interface CommentaryListProps {
  commentary: Commentary[];
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
}

export const CommentaryList: React.FC<CommentaryListProps> = ({
  commentary,
  isLoading = false,
  error = null,
  emptyMessage = "No commentary available yet.",
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm font-medium">
          Error loading commentary: {error.message}
        </p>
      </div>
    );
  }

  if (commentary.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {commentary.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              {item.minute !== null && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                  {item.minute}'
                </span>
              )}
              {item.period && (
                <span className="text-gray-600 text-sm">{item.period}</span>
              )}
            </div>
            <span className="text-gray-500 text-xs">
              {new Date(item.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {item.eventType && (
            <div className="mb-2">
              <span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                {item.eventType}
              </span>
              {item.team && (
                <span className="text-gray-700 text-sm font-medium">
                  {item.team}
                </span>
              )}
            </div>
          )}

          {item.actor && (
            <p className="text-gray-700 font-semibold mb-1">{item.actor}</p>
          )}

          <p className="text-gray-900 mb-3">{item.message}</p>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {item.metadata && Object.keys(item.metadata).length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
              {Object.entries(item.metadata).map(([key, value]) => (
                <p key={key}>
                  <span className="font-semibold">{key}:</span> {String(value)}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
