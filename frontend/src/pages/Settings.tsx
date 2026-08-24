import { useEffect, useState } from "react";
import { CheckCircle2, Server, SlidersHorizontal } from "lucide-react";
import { api } from "../services/api";
import { PageHeader } from "../components/UI";

export default function Settings() {
  const [health, setHealth] = useState("Checking...");
  const [compact, setCompact] = useState(localStorage.getItem("compact_ui") === "true");
  useEffect(() => { api.health().then(() => setHealth("Connected")).catch(() => setHealth("Offline")); }, []);
  const toggle = (v: boolean) => { setCompact(v); localStorage.setItem("compact_ui", String(v)); };
  return (
    <>
      <PageHeader eyebrow="SETTINGS" title="Workspace settings" description="Manage frontend preferences and connection status." />
      <div className="settings-grid">
        <div className="panel">
          <div className="panel-head"><div><h3>Backend connection</h3><p>Your React frontend connects to the existing FastAPI service.</p></div><Server size={20} /></div>
          <div className="connection-row"><span>API status</span><strong className={health === "Connected" ? "text-green" : "text-red"}>{health === "Connected" && <CheckCircle2 size={16} />} {health}</strong></div>
          <div className="connection-row"><span>API URL</span><code>{import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}</code></div>
        </div>
        <div className="panel">
          <div className="panel-head"><div><h3>Interface</h3><p>Personalize your workspace.</p></div><SlidersHorizontal size={20} /></div>
          <label className="switch-row"><span>Compact spacing</span><input type="checkbox" checked={compact} onChange={(e) => toggle(e.target.checked)} /></label>
          <p className="muted">The negotiation logic and backend configuration are not changed by these preferences.</p>
        </div>
      </div>
    </>
  );
}
