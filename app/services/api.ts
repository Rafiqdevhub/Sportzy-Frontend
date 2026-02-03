import type {
  ApiError,
  ApiErrorResponse,
  CreateCommentaryRequest,
  CreateMatchRequest,
  Commentary,
  FetchOptions,
  Match,
  UpdateScoreRequest,
} from "~/types";
import { API_CONFIG, API_ENDPOINTS } from "~/utils/config";

class ApiServiceError extends Error implements ApiError {
  status: number;
  details?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;

  constructor(status: number, message: string, details?: ApiError["details"]) {
    super(message);
    this.name = "ApiServiceError";
    this.status = status;
    this.details = details;
  }
}

function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    typeof (response as Record<string, unknown>).error === "string"
  );
}

async function fetchWithTimeout(
  url: string,
  options: FetchOptions & { timeout: number },
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function retryFetch(
  url: string,
  options: FetchOptions,
): Promise<Response> {
  const maxRetries = options.retries ?? API_CONFIG.DEFAULT_RETRIES;
  const initialDelay = options.retryDelay ?? API_CONFIG.RETRY_DELAY;
  const timeout = options.timeout ?? API_CONFIG.DEFAULT_TIMEOUT;

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchWithTimeout(url, {
        ...options,
        timeout,
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on the last attempt
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

async function handleResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  let data: unknown;
  try {
    data = isJson ? await response.json() : await response.text();
  } catch {
    data = null;
  }

  // Handle successful responses
  if (response.ok) {
    return data;
  }

  // Handle error responses
  let errorMessage = `HTTP ${response.status}`;
  let errorDetails: ApiError["details"];

  if (isApiError(data)) {
    errorMessage = data.error;
    errorDetails = data.details;
  } else if (typeof data === "string") {
    errorMessage = data;
  }

  // Add custom messages for common errors
  if (response.status === 429) {
    errorMessage = "Too many requests. Please try again later.";
  } else if (response.status === 403) {
    errorMessage = "Access forbidden. Request was blocked by security.";
  } else if (response.status === 503) {
    errorMessage = "Service temporarily unavailable. Please try again later.";
  }

  throw new ApiServiceError(response.status, errorMessage, errorDetails);
}

async function makeRequest<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const response = await retryFetch(url, options);
  const data = await handleResponse(response);

  // Handle the API response structure: { data: T }
  // Extract T from the response
  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    !("error" in data)
  ) {
    return (data as { data: T }).data;
  }

  return data as T;
}

export async function getMatches(limit?: number): Promise<Match[]> {
  const searchParams = new URLSearchParams();
  if (limit) searchParams.append("limit", String(limit));

  const query = searchParams.toString();
  const endpoint = `${API_ENDPOINTS.MATCHES.BASE}${query ? `?${query}` : ""}`;

  return makeRequest<Match[]>(endpoint);
}

export async function getMatch(id: number): Promise<Match> {
  const endpoint = API_ENDPOINTS.MATCHES.DETAIL(id);
  return makeRequest<Match>(endpoint);
}

export async function createMatch(data: CreateMatchRequest): Promise<Match> {
  const endpoint = API_ENDPOINTS.MATCHES.BASE;
  return makeRequest<Match>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateScore(
  matchId: number,
  data: UpdateScoreRequest,
): Promise<Match> {
  const endpoint = API_ENDPOINTS.MATCHES.SCORE(matchId);
  return makeRequest<Match>(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getCommentary(
  matchId: number,
  limit?: number,
): Promise<Commentary[]> {
  const searchParams = new URLSearchParams();
  if (limit) searchParams.append("limit", String(limit));

  const query = searchParams.toString();
  const endpoint = `${API_ENDPOINTS.MATCHES.COMMENTARY(matchId)}${query ? `?${query}` : ""}`;

  return makeRequest<Commentary[]>(endpoint);
}

export async function createCommentary(
  matchId: number,
  data: CreateCommentaryRequest,
): Promise<Commentary> {
  const endpoint = API_ENDPOINTS.MATCHES.COMMENTARY(matchId);
  return makeRequest<Commentary>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// Export error class for use in error handling
export { ApiServiceError };
export type { ApiError };
