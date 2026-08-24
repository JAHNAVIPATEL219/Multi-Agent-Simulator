import { useEffect, useRef, useState } from "react";
import { Bot, CheckCircle2, Pause, Play, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { api, NegotiationState } from "../services/api";
import { PageHeader, StatusPill } from "../components/UI";

export default function Simulation() {
  const sessionId = localStorage.getItem("session_id") || "";
  const [state, setState] = useState<NegotiationState | null>(null);
  const [running, setRunning] = useState(true);
  const [thinking, setThinking] = useState(false);
  const timer = useRef<number | null>(null);

  const refresh = async () => {
    if (!sessionId) return;
    try { setState(await api.getNegotiation(sessionId)); } catch {}
  };

  useEffect(() => {
    refresh();
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [sessionId]);

  useEffect(() => {
    if (!running || !state || state.status !== "in_progress" || thinking) return;
    timer.current = window.setTimeout(async () => {
      setThinking(true);
      try {
        await api.simulateNextTurn(sessionId);
        await refresh();
      } finally {
        setThinking(false);
      }
    }, 1800);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [state, running, thinking, sessionId]);

  if (!state) return <div className="empty-state">No active simulation found.</div>;

  return (
    <>
      <PageHeader
        eyebrow="AI VS AI"
        title="Autonomous negotiation"
        description={state.scenario}
        action={
          <button className="secondary-btn" onClick={() => setRunning(!running)}>
            {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Resume</>}
          </button>
        }
      />

      <div className="simulation-top">
        <div className="simulation-agent">
          <div className="agent-avatar purple">B</div>
          <div><strong>{state.scenario === "Vendor Pricing Negotiation" ? "Buyer" : state.scenario === "Job Offer Negotiation" ? "Candidate" : "Department Representative"}</strong><span>AI Agent</span></div>
        </div>
        <div className="simulation-middle">
          <div className="simulation-status">{thinking ? <><span className="typing-dot" /> Agent is thinking...</> : <StatusPill status={state.status} />}</div>
          <div className="progress-track"><div style={{ width: `${Math.min(100, (state.round / state.max_rounds) * 100)}%` }} /></div>
          <span>Round {state.round} / {state.max_rounds}</span>
        </div>
        <div className="simulation-agent right">
          <div className="agent-avatar orange">S</div>
          <div><strong>{state.scenario === "Vendor Pricing Negotiation" ? "Supplier" : state.scenario === "Job Offer Negotiation" ? "HR Manager" : "Budget Manager"}</strong><span>AI Agent</span></div>
        </div>
      </div>

      <div className="simulation-chat panel">
        <div className="conversation-head"><div><h3>Live AI conversation</h3><p>Agents automatically take turns. The thinking delay is intentional.</p></div><Sparkles size={20} /></div>
        <div className="chat-window simulation-window">
          {state.messages.filter(m => m.speaker !== "System").map((m, i) => (
            <div className={`message-row ${i % 2 ? "right-msg" : ""}`} key={`${m.speaker}-${i}`}>
              <div className={`message-avatar ${i % 2 ? "orange" : "purple"}`}><Bot size={16} /></div>
              <div className="message-bubble"><div className="message-name">{m.speaker}</div><div>{m.message}</div></div>
            </div>
          ))}
          {thinking && <div className="thinking-card"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /> Thinking through the next offer...</div>}
        </div>
        {state.status !== "in_progress" && (
          <div className={`outcome ${state.status === "agreement_reached" ? "success" : "danger"}`}>
            {state.status === "agreement_reached" ? <CheckCircle2 /> : <XCircle />}
            <strong>{state.status.replaceAll("_", " ")}</strong>
          </div>
        )}
      </div>
    </>
  );
}
