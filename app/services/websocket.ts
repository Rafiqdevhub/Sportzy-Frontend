import type { WebSocketMessage } from "~/types";
import { API_CONFIG } from "~/utils/config";

export type WebSocketEventListener<T = unknown> = (data: T) => void;

interface SubscriptionData {
  matchId: number;
  callback: (message: WebSocketMessage) => void;
}

interface WebSocketState {
  ws: WebSocket | null;
  url: string;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  isIntentionallyClosed: boolean;
  subscriptions: Map<number, SubscriptionData>;
  listeners: Map<string, Set<WebSocketEventListener>>;
  messageQueue: WebSocketMessage[];
  connectPromise: Promise<void> | null;
  connectResolve: (() => void) | null;
}

const state: WebSocketState = {
  ws: null,
  url: `${API_CONFIG.WS_URL}/ws`,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  isIntentionallyClosed: false,
  subscriptions: new Map(),
  listeners: new Map(),
  messageQueue: [],
  connectPromise: null,
  connectResolve: null,
};

function _emitEvent<T = unknown>(event: string, data: T): void {
  const listeners = state.listeners.get(event);
  if (listeners) {
    listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error(
          `[WebSocket] Error in listener for event "${event}":`,
          error,
        );
      }
    });
  }
}

function _sendMessage(message: WebSocketMessage): void {
  if (state.ws?.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify(message));
  } else {
    state.messageQueue.push(message);
  }
}

function _processMessageQueue(): void {
  while (
    state.messageQueue.length > 0 &&
    state.ws?.readyState === WebSocket.OPEN
  ) {
    const message = state.messageQueue.shift();
    if (message) {
      state.ws.send(JSON.stringify(message));
    }
  }
}

function _handleMessage(message: WebSocketMessage): void {
  switch (message.type) {
    case "welcome":
      _emitEvent("welcome", message);
      break;

    case "subscribed":
      console.log(`[WebSocket] Subscribed to match ${message.matchId}`);
      _emitEvent(`subscribed:${message.matchId}`, message);
      break;

    case "unsubscribed":
      console.log(`[WebSocket] Unsubscribed from match ${message.matchId}`);
      _emitEvent(`unsubscribed:${message.matchId}`, message);
      break;

    case "match_created":
      _emitEvent("match_created", message.data);
      break;

    case "commentary":
      if (
        message.data &&
        typeof message.data === "object" &&
        "matchId" in message.data
      ) {
        const matchId = (message.data as { matchId: number }).matchId;
        _emitEvent(`match:${matchId}`, message.data);
      }
      break;

    case "error":
      console.error("[WebSocket] Error message:", message.message);
      _emitEvent("error", message.message);
      break;

    default:
      console.warn("[WebSocket] Unknown message type:", message.type);
  }
}

function _resubscribeAll(): void {
  for (const { matchId } of state.subscriptions.values()) {
    _sendMessage({
      type: "subscribe",
      matchId,
    });
  }
}

function _attemptReconnect(): void {
  if (state.reconnectAttempts >= state.maxReconnectAttempts) {
    console.error("[WebSocket] Max reconnect attempts reached");
    state.connectResolve?.();
    state.connectPromise = null;
    state.connectResolve = null;
    return;
  }

  state.reconnectAttempts++;
  const delay = state.reconnectDelay * Math.pow(2, state.reconnectAttempts - 1);

  console.log(
    `[WebSocket] Reconnecting in ${delay}ms (attempt ${state.reconnectAttempts})`,
  );

  setTimeout(() => {
    _createConnection();
  }, delay);
}

function _createConnection(): void {
  try {
    state.ws = new WebSocket(state.url);

    state.ws.onopen = () => {
      console.log("[WebSocket] Connected");
      state.reconnectAttempts = 0;
      state.connectResolve?.();
      state.connectPromise = null;
      state.connectResolve = null;

      // Resubscribe to all matches after reconnection
      _resubscribeAll();

      // Process any queued messages
      _processMessageQueue();
    };

    state.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        _handleMessage(message);
      } catch (error) {
        console.error("[WebSocket] Failed to parse message:", error);
      }
    };

    state.ws.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
      _emitEvent("error", error);
    };

    state.ws.onclose = () => {
      console.log("[WebSocket] Disconnected");
      state.ws = null;

      if (!state.isIntentionallyClosed) {
        _attemptReconnect();
      }
    };
  } catch (error) {
    console.error("[WebSocket] Failed to create connection:", error);
    if (!state.isIntentionallyClosed) {
      _attemptReconnect();
    }
  }
}

export async function connect(): Promise<void> {
  if (state.ws?.readyState === WebSocket.OPEN) {
    return; // Already connected
  }

  if (state.connectPromise) {
    return state.connectPromise; // Already connecting
  }

  state.isIntentionallyClosed = false;
  state.reconnectAttempts = 0;

  state.connectPromise = new Promise((resolve) => {
    state.connectResolve = resolve;
    _createConnection();
  });

  return state.connectPromise;
}

export function disconnect(): void {
  state.isIntentionallyClosed = true;
  state.reconnectAttempts = 0;
  state.connectPromise = null;
  state.connectResolve = null;

  if (state.ws) {
    state.ws.close();
    state.ws = null;
  }

  state.subscriptions.clear();
  state.messageQueue = [];
}

export function subscribe(matchId: number): void {
  if (state.subscriptions.has(matchId)) {
    return; // Already subscribed
  }

  const callback = (message: WebSocketMessage) => {
    _emitEvent(`match:${matchId}`, message);
  };

  state.subscriptions.set(matchId, { matchId, callback });

  if (state.ws?.readyState === WebSocket.OPEN) {
    _sendMessage({
      type: "subscribe",
      matchId,
    });
  }
}

export function unsubscribe(matchId: number): void {
  if (!state.subscriptions.has(matchId)) {
    return;
  }

  state.subscriptions.delete(matchId);

  if (state.ws?.readyState === WebSocket.OPEN) {
    _sendMessage({
      type: "unsubscribe",
      matchId,
    });
  }
}

export function on<T = unknown>(
  event: string,
  listener: WebSocketEventListener<T>,
): void {
  if (!state.listeners.has(event)) {
    state.listeners.set(event, new Set());
  }
  state.listeners.get(event)!.add(listener as WebSocketEventListener);
}

export function off(event: string, listener: WebSocketEventListener): void {
  state.listeners.get(event)?.delete(listener);
}

export function isConnected(): boolean {
  return state.ws?.readyState === WebSocket.OPEN;
}

export const wsService = {
  connect,
  disconnect,
  subscribe,
  unsubscribe,
  on,
  off,
  isConnected,
};
