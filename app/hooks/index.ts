import { useEffect, useState } from "react";
import * as ApiService from "~/services/api";
import { ApiServiceError } from "~/services/api";
import type {
  ApiError,
  Commentary,
  CreateCommentaryRequest,
  CreateMatchRequest,
  Match,
  UpdateScoreRequest,
} from "~/types";
import { useAppStore } from "~/store";
import { connect, subscribe, unsubscribe, on, off } from "~/services/websocket";

export const useMatches = (limit?: number) => {
  const {
    matches,
    isLoadingMatches,
    matchesError,
    setMatches,
    setLoadingMatches,
    setMatchesError,
  } = useAppStore();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoadingMatches(true);
      try {
        const data = await ApiService.getMatches(limit);
        setMatches(data);
        setMatchesError(null);
      } catch (error) {
        const apiError =
          error instanceof ApiServiceError ? error : new Error(String(error));
        setMatchesError(apiError);
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [limit, setMatches, setLoadingMatches, setMatchesError]);

  return {
    matches,
    isLoading: isLoadingMatches,
    error: matchesError,
  };
};

export const useMatch = (matchId: number | null) => {
  const { selectedMatch, setSelectedMatch } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!matchId) {
      setSelectedMatch(null);
      return;
    }

    const fetchMatch = async () => {
      setIsLoading(true);
      try {
        const match = await ApiService.getMatch(matchId);
        setSelectedMatch(match);
        setError(null);
      } catch (err) {
        const apiError =
          err instanceof ApiServiceError
            ? {
                status: err.status,
                message: err.message,
                details: err.details,
              }
            : { status: 500, message: String(err) };
        setError(apiError);
        console.error("Failed to fetch match:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatch();
  }, [matchId, setSelectedMatch]);

  return {
    match: selectedMatch,
    isLoading,
    error,
  };
};

export const useCreateMatch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { addMatch } = useAppStore();

  const createMatch = async (
    data: CreateMatchRequest,
  ): Promise<Match | null> => {
    setIsLoading(true);
    try {
      const newMatch = await ApiService.createMatch(data);
      addMatch(newMatch);
      setError(null);
      return newMatch;
    } catch (err) {
      const apiError =
        err instanceof ApiServiceError
          ? {
              status: err.status,
              message: err.message,
              details: err.details,
            }
          : { status: 500, message: String(err) };
      setError(apiError);
      console.error("Failed to create match:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMatch,
    isLoading,
    error,
  };
};

export const useUpdateScore = (matchId: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { updateMatch } = useAppStore();

  const updateScore = async (
    data: UpdateScoreRequest,
  ): Promise<Match | null> => {
    setIsLoading(true);
    try {
      const updated = await ApiService.updateScore(matchId, data);
      updateMatch(matchId, {
        homeScore: updated.homeScore,
        awayScore: updated.awayScore,
        status: updated.status,
      });
      setError(null);
      return updated;
    } catch (err) {
      const apiError =
        err instanceof ApiServiceError
          ? {
              status: err.status,
              message: err.message,
              details: err.details,
            }
          : { status: 500, message: String(err) };
      setError(apiError);
      console.error("Failed to update score:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateScore,
    isLoading,
    error,
  };
};

export const useCommentary = (matchId: number, limit?: number) => {
  const {
    getCommentaryForMatch,
    setCommentaryForMatch,
    setLoadingCommentary,
    setCommentaryError,
  } = useAppStore();

  const commentary = getCommentaryForMatch(matchId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchCommentary = async () => {
      setIsLoading(true);
      setLoadingCommentary(matchId, true);
      try {
        const data = await ApiService.getCommentary(matchId, limit);
        setCommentaryForMatch(matchId, data);
        setError(null);
        setCommentaryError(matchId, null);
      } catch (err) {
        const apiError =
          err instanceof ApiServiceError
            ? {
                status: err.status,
                message: err.message,
                details: err.details,
              }
            : { status: 500, message: String(err) };
        setError(apiError);
        setCommentaryError(matchId, apiError as unknown as Error);
        console.error("Failed to fetch commentary:", err);
      } finally {
        setIsLoading(false);
        setLoadingCommentary(matchId, false);
      }
    };

    fetchCommentary();
  }, [
    matchId,
    limit,
    setCommentaryForMatch,
    setLoadingCommentary,
    setCommentaryError,
  ]);

  return {
    commentary,
    isLoading,
    error,
  };
};

export const useCreateCommentary = (matchId: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { addCommentaryToMatch } = useAppStore();

  const createCommentary = async (
    data: CreateCommentaryRequest,
  ): Promise<Commentary | null> => {
    setIsLoading(true);
    try {
      const newCommentary = await ApiService.createCommentary(matchId, data);
      addCommentaryToMatch(matchId, newCommentary);
      setError(null);
      return newCommentary;
    } catch (err) {
      const apiError =
        err instanceof ApiServiceError
          ? {
              status: err.status,
              message: err.message,
              details: err.details,
            }
          : { status: 500, message: String(err) };
      setError(apiError);
      console.error("Failed to create commentary:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCommentary,
    isLoading,
    error,
  };
};

export const useWebSocket = () => {
  const {
    isConnected,
    setConnected,
    setWsError,
    addSubscription,
    removeSubscription,
  } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const connectWs = async () => {
      setIsConnecting(true);
      try {
        await connect();
        setConnected(true);
        setWsError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setWsError(error);
        console.error("Failed to connect WebSocket:", err);
      } finally {
        setIsConnecting(false);
      }
    };

    connectWs();

    // Setup error listener
    const handleError = (error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error));
      setWsError(err);
    };

    on("error", handleError);

    return () => {
      off("error", handleError);
    };
  }, [setConnected, setWsError]);

  return {
    isConnected,
    isConnecting,
  };
};

export const useSubscribeToMatch = (matchId: number) => {
  const {
    addSubscription,
    removeSubscription,
    addCommentaryToMatch,
    updateMatch,
  } = useAppStore();

  useEffect(() => {
    // Subscribe to match
    subscribe(matchId);
    addSubscription(matchId);

    // Setup listener for new commentary
    const handleCommentary = (data: unknown) => {
      if (data && typeof data === "object" && "id" in data) {
        addCommentaryToMatch(matchId, data as Commentary);
      }
    };

    // Setup listener for score updates
    const handleScoreUpdate = (data: unknown) => {
      if (
        data &&
        typeof data === "object" &&
        "homeScore" in data &&
        "awayScore" in data
      ) {
        const scoreData = data as { homeScore: number; awayScore: number };
        updateMatch(matchId, {
          homeScore: scoreData.homeScore,
          awayScore: scoreData.awayScore,
        });
      }
    };

    on(`match:${matchId}:commentary`, handleCommentary);
    on(`match:${matchId}:score_update`, handleScoreUpdate);

    // Cleanup
    return () => {
      unsubscribe(matchId);
      removeSubscription(matchId);
      off(`match:${matchId}:commentary`, handleCommentary);
      off(`match:${matchId}:score_update`, handleScoreUpdate);
    };
  }, [
    matchId,
    addSubscription,
    removeSubscription,
    addCommentaryToMatch,
    updateMatch,
  ]);
};

export const useOnNewMatch = (callback?: (match: Match) => void) => {
  const { addMatch } = useAppStore();

  useEffect(() => {
    const handleNewMatch = (data: unknown) => {
      if (data && typeof data === "object" && "id" in data) {
        const match = data as Match;
        addMatch(match);
        callback?.(match);
      }
    };

    on("match_created", handleNewMatch);

    return () => {
      off("match_created", handleNewMatch);
    };
  }, [addMatch, callback]);
};
