export type MatchStatus = "scheduled" | "live" | "finished";

export interface Match {
  id: number;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  status: MatchStatus;
  startTime: string; // ISO 8601 datetime
  endTime: string; // ISO 8601 datetime
  homeScore: number;
  awayScore: number;
  createdAt: string; // ISO 8601 datetime
}

export interface CreateMatchRequest {
  sport: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  endTime: string;
  homeScore?: number;
  awayScore?: number;
}

export interface UpdateScoreRequest {
  homeScore: number;
  awayScore: number;
}

export interface Commentary {
  id: number;
  matchId: number;
  minute: number | null;
  sequence: number;
  period: string | null;
  eventType: string;
  actor: string | null;
  team: string | null;
  message: string;
  metadata: Record<string, unknown> | null;
  tags: string[] | null;
  createdAt: string; // ISO 8601 datetime
}

export interface CreateCommentaryRequest {
  minute: number;
  sequence?: number;
  period?: string;
  eventType?: string;
  actor?: string;
  team?: string;
  message: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
  details?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

export interface ApiListResponse<T> {
  data: T[];
}

export type WebSocketMessageType =
  | "welcome"
  | "subscribe"
  | "subscribed"
  | "unsubscribe"
  | "unsubscribed"
  | "match_created"
  | "commentary"
  | "score_update"
  | "error";

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  data?: T;
  matchId?: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}
