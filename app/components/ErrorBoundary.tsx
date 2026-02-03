import type { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: FallbackProps) => ReactNode;
  onError?: (error: unknown, info: { componentStack: string }) => void;
}

function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-red-900 font-bold text-lg mb-2">
        Something went wrong
      </h3>
      <p className="text-red-800 text-sm mb-4">{String(error)}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export function ErrorBoundary({
  children,
  fallback,
  onError,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback || DefaultErrorFallback}
      onError={(error, info) => {
        console.error("Error caught by boundary:", error, info);
        if (onError) {
          onError(error, { componentStack: info.componentStack ?? "" });
        }
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
