const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export type AgentConfig = {
  name: string;
  role: string;
  strategy: string;
  starting_target: number;
  reservation_price: number;
  instructions?: string;
};

export type NegotiationPayload = {
  scenario: string;
  mode: "AI vs AI" | "Human vs AI";
  max_rounds: number;
  project_total_budget?: number | null;
  agent1_config?: AgentConfig;
  agent2_config?: AgentConfig;
};

export type NegotiationState = {
  session_id: string;
  scenario: string;
  mode: string;
  status: string;
  round: number;
  max_rounds: number;
  active_agent?: string | null;
  messages: { speaker: string; message: string }[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const text = await response.text();
  let data: unknown = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  startNegotiation: (payload: NegotiationPayload) =>
    request<{ session_id: string; status: string; message: string }>(
      "/start-negotiation",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  getNegotiation: (sessionId: string) =>
    request<NegotiationState>(`/negotiation/${sessionId}`),

  nextRound: (sessionId: string, speaker: string, message: string) =>
    request<{
      session_id: string;
      status: string;
      speaker?: string;
      message?: string;
      round?: number;
      max_rounds?: number;
    }>("/next-round", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId, speaker, message }),
    }),

  simulateNextTurn: (sessionId: string) =>
    request<{
      status: string;
      speaker?: string;
      message?: string;
      round?: number;
      max_rounds?: number;
      conversation?: { speaker: string; message: string }[];
    }>("/simulate-next-turn", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    }),

  getHistory: () =>
    request<Record<string, unknown>[]>("/reports/history"),

  getReport: (sessionId: string) =>
    request<Record<string, any>>(`/report/${sessionId}`),

  getPdfUrl: (sessionId?: string) =>
    sessionId
      ? `${API_URL}/report/${sessionId}/pdf`
      : `${API_URL}/reports/pdf`,

  health: () => request<{ status: string }>("/health"),
};
