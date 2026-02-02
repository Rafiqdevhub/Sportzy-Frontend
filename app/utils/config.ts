export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  WS_URL: import.meta.env.VITE_WS_URL || "ws://localhost:8000",
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  DEFAULT_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  RATE_LIMIT_DELAY: 1000, // 1 second delay when rate limited
};

export const API_ENDPOINTS = {
  MATCHES: {
    BASE: "/matches",
    DETAIL: (id: number) => `/matches/${id}`,
    SCORE: (id: number) => `/matches/${id}/score`,
    COMMENTARY: (id: number) => `/matches/${id}/commentary`,
  },
};

export const WS_ENDPOINT = "/ws";
