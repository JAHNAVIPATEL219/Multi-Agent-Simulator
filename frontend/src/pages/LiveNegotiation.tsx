import { FormEvent, useEffect, useState } from "react";
import { Bot, CheckCircle2, Send, User, XCircle } from "lucide-react";
import { api, NegotiationState } from "../services/api";
import { PageHeader, StatusPill } from "../components/UI";

export default function LiveNegotiation() {
  const sessionId = localStorage.getItem("session_id") || "";
  const [state, setState] = useState<NegotiationState | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const load = () => sessionId && api.getNegotiation(sessionId).then(setState).catch(() => setState(null));

  useEffect(() => { load(); }, [sessionId]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !state || state.status !== "in_progress") return;
    setSending(true);
    try {
      const speaker = localStorage.getItem("human_role")
        || (state.scenario === "Vendor Pricing Negotiation" ? "Buyer"
        : state.scenario === "Job Offer Negotiation" ? "Candidate"
        : "Department Representative");
      await api.nextRound(sessionId, speaker, message.trim());
      setMessage("");
      await load();
    } finally { setSending(false); }
  };

  if (!state) return <div className="empty-state">No active negotiation found. Start a new negotiation first.</div>;

  const userRole = localStorage.getItem("human_role")
    || (state.scenario === "Vendor Pricing Negotiation"
      ? "Buyer"
      : state.scenario === "Job Offer Negotiation"
        ? "Candidate"
        : "Department Representative");

  return (
    <>
      <PageHeader eyebrow="LIVE NEGOTIATION" title={state.scenario} description="Interact with the AI opponent and guide the conversation toward an agreement." action={<StatusPill status={state.status} />} />
      <div className="live-layout">
        <section className="conversation-panel panel">
          <div className="conversation-head"><div><h3>Negotiation conversation</h3><p>Round {state.round} of {state.max_rounds}</p></div><div className="round-pill">R{state.round}</div></div>
          <div className="chat-window">
            {state.messages.filter(m => m.speaker !== "System").map((m, i) => (
              <div className={`message-row ${m.speaker === userRole ? "mine" : ""}`} key={`${m.speaker}-${i}`}>
                <div className={`message-avatar ${m.speaker === userRole ? "purple" : "orange"}`}>{m.speaker === userRole ? <User size={16} /> : <Bot size={16} />}</div>
                <div className="message-bubble"><div className="message-name">{m.speaker}</div><div>{m.message}</div></div>
              </div>
            ))}
            {!state.messages.length && <div className="empty-chat">The negotiation will appear here.</div>}
          </div>
          {state.status === "in_progress" ? (
            <form className="composer" onSubmit={send}>
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Write your ${userRole.toLowerCase()} response...`} />
              <button className="send-btn" disabled={sending}><Send size={18} /></button>
            </form>
          ) : (
            <div className={`outcome ${state.status === "agreement_reached" ? "success" : "danger"}`}>
              {state.status === "agreement_reached" ? <CheckCircle2 /> : <XCircle />}
              <strong>{state.status.replaceAll("_", " ")}</strong>
            </div>
          )}
        </section>

        <aside className="live-side">
          <div className="panel">
            <div className="panel-head"><div><h3>Negotiation status</h3><p>Live session details.</p></div></div>
            <div className="detail-list">
              <div><span>Session</span><strong>{sessionId.slice(0, 10)}...</strong></div>
              <div><span>Mode</span><strong>{state.mode}</strong></div>
              <div><span>Round</span><strong>{state.round} / {state.max_rounds}</strong></div>
              <div><span>Next active agent</span><strong>{state.active_agent || "—"}</strong></div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
