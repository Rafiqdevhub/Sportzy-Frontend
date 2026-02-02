/**
 * Zustand Store
 * Global state management for Sportzy application
 */

import { create } from "zustand";
import type { Commentary, Match } from "~/types";

// ============================================================================
// State Types
// ============================================================================

interface MatchesState {
  matches: Match[];
  selectedMatch: Match | null;
  isLoadingMatches: boolean;
  matchesError: Error | null;

  setMatches: (matches: Match[]) => void;
  setSelectedMatch: (match: Match | null) => void;
  setLoadingMatches: (loading: boolean) => void;
  setMatchesError: (error: Error | null) => void;
  updateMatch: (id: number, updates: Partial<Match>) => void;
  addMatch: (match: Match) => void;
}

interface CommentaryState {
  commentary: Map<number, Commentary[]>;
  isLoadingCommentary: Map<number, boolean>;
  commentaryError: Map<number, Error | null>;

  getCommentaryForMatch: (matchId: number) => Commentary[];
  setCommentaryForMatch: (matchId: number, commentary: Commentary[]) => void;
  addCommentaryToMatch: (matchId: number, comment: Commentary) => void;
  setLoadingCommentary: (matchId: number, loading: boolean) => void;
  setCommentaryError: (matchId: number, error: Error | null) => void;
  clearCommentaryForMatch: (matchId: number) => void;
}

interface WebSocketState {
  isConnected: boolean;
  subscriptions: Set<number>;
  wsError: Error | null;

  setConnected: (connected: boolean) => void;
  addSubscription: (matchId: number) => void;
  removeSubscription: (matchId: number) => void;
  isSubscribed: (matchId: number) => boolean;
  setWsError: (error: Error | null) => void;
  clearSubscriptions: () => void;
}

export type AppState = MatchesState & CommentaryState & WebSocketState;

// ============================================================================
// Store Creation
// ============================================================================

export const useAppStore = create<AppState>((set, get) => ({
  // ========================================================================
  // Matches State
  // ========================================================================
  matches: [],
  selectedMatch: null,
  isLoadingMatches: false,
  matchesError: null,

  setMatches: (matches) => set({ matches }),

  setSelectedMatch: (match) => set({ selectedMatch: match }),

  setLoadingMatches: (loading) => set({ isLoadingMatches: loading }),

  setMatchesError: (error) => set({ matchesError: error }),

  updateMatch: (id, updates) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === id ? { ...m, ...updates } : m,
      ),
      selectedMatch:
        state.selectedMatch?.id === id
          ? { ...state.selectedMatch, ...updates }
          : state.selectedMatch,
    })),

  addMatch: (match) =>
    set((state) => ({
      matches: [match, ...state.matches],
    })),

  // ========================================================================
  // Commentary State
  // ========================================================================
  commentary: new Map(),
  isLoadingCommentary: new Map(),
  commentaryError: new Map(),

  getCommentaryForMatch: (matchId) => {
    const state = get();
    return state.commentary.get(matchId) || [];
  },

  setCommentaryForMatch: (matchId, commentary) =>
    set((state) => {
      const newCommentary = new Map(state.commentary);
      newCommentary.set(matchId, commentary);
      return { commentary: newCommentary };
    }),

  addCommentaryToMatch: (matchId, comment) =>
    set((state) => {
      const newCommentary = new Map(state.commentary);
      const existing = newCommentary.get(matchId) || [];
      newCommentary.set(matchId, [comment, ...existing]);
      return { commentary: newCommentary };
    }),

  setLoadingCommentary: (matchId, loading) =>
    set((state) => {
      const newLoading = new Map(state.isLoadingCommentary);
      newLoading.set(matchId, loading);
      return { isLoadingCommentary: newLoading };
    }),

  setCommentaryError: (matchId, error) =>
    set((state) => {
      const newErrors = new Map(state.commentaryError);
      newErrors.set(matchId, error);
      return { commentaryError: newErrors };
    }),

  clearCommentaryForMatch: (matchId) =>
    set((state) => {
      const newCommentary = new Map(state.commentary);
      const newLoading = new Map(state.isLoadingCommentary);
      const newErrors = new Map(state.commentaryError);

      newCommentary.delete(matchId);
      newLoading.delete(matchId);
      newErrors.delete(matchId);

      return {
        commentary: newCommentary,
        isLoadingCommentary: newLoading,
        commentaryError: newErrors,
      };
    }),

  // ========================================================================
  // WebSocket State
  // ========================================================================
  isConnected: false,
  subscriptions: new Set(),
  wsError: null,

  setConnected: (connected) => set({ isConnected: connected }),

  addSubscription: (matchId) =>
    set((state) => {
      const newSubscriptions = new Set(state.subscriptions);
      newSubscriptions.add(matchId);
      return { subscriptions: newSubscriptions };
    }),

  removeSubscription: (matchId) =>
    set((state) => {
      const newSubscriptions = new Set(state.subscriptions);
      newSubscriptions.delete(matchId);
      return { subscriptions: newSubscriptions };
    }),

  isSubscribed: (matchId) => {
    return get().subscriptions.has(matchId);
  },

  setWsError: (error) => set({ wsError: error }),

  clearSubscriptions: () =>
    set({
      subscriptions: new Set(),
      isConnected: false,
      wsError: null,
    }),
}));
