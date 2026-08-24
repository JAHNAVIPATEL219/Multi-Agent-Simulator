import {
  BarChart3,
  Bot,
  CheckCircle2,
  FileText,
  Handshake,
  MessageSquare,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { MetricCard, PageHeader, ScenarioCard, scenarioVisuals } from "../components/UI";

export default function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    api.getHistory().then(setHistory).catch(() => setHistory([]));
  }, []);

  const total = history.length;
  const agreements = history.filter((x) => x.status === "agreement_reached").length;
  const success = total ? ((agreements / total) * 100).toFixed(1) : "0.0";
  const avg = total
    ? (history.reduce((sum, x) => sum + Number(x.negotiation_score || 0), 0) / total).toFixed(1)
    : "0.0";

  return (
    <>
      <PageHeader
        eyebrow="DASHBOARD"
        title="Welcome to your negotiation hub"
        description="Run intelligent business negotiations, monitor agent activity and analyze outcomes."
        action={
          <button className="primary-btn compact" onClick={() => navigate("/new-negotiation")}>
            <Plus size={17} /> New Negotiation
          </button>
        }
      />

      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">AI NEGOTIATION WORKSPACE</div>
          <h2>Intelligent negotiation,<br /><span>powered by AI.</span></h2>
          <p>Configure realistic scenarios, let autonomous agents negotiate, and understand the decisions behind every outcome.</p>
          <div className="hero-tags">
            <span><Bot size={14} /> Multi-Agent AI</span>
            <span><MessageSquare size={14} /> Live Conversations</span>
            <span><BarChart3 size={14} /> Smart Analytics</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-ring ring-a" />
          <div className="hero-ring ring-b" />
          <div className="hero-center"><Handshake size={54} /></div>
          <div className="agent-chip chip-a"><span className="chip-dot purple" />Buyer</div>
          <div className="agent-chip chip-b"><span className="chip-dot orange" />Supplier</div>
        </div>
      </section>

      <div className="section-heading">
        <div><h2>Platform overview</h2><p>Your negotiation workspace at a glance.</p></div>
      </div>

      <div className="metric-grid">
        <MetricCard icon={<Handshake size={19} />} label="Negotiations" value={total} caption="Total sessions" tone="purple" />
        <MetricCard icon={<CheckCircle2 size={19} />} label="Agreements" value={agreements} caption="Successful outcomes" tone="green" />
        <MetricCard icon={<Bot size={19} />} label="AI Agents" value="2" caption="Participants per session" tone="blue" />
        <MetricCard icon={<BarChart3 size={19} />} label="Success rate" value={`${success}%`} caption={`Avg score ${avg}/100`} tone="orange" />
      </div>

      <div className="section-heading">
        <div><h2>Start with a scenario</h2><p>Choose a realistic business negotiation and configure the participants.</p></div>
      </div>

      <div className="scenario-grid">
        {Object.entries(scenarioVisuals).map(([key, item]) => (
          <ScenarioCard key={key} {...item} onClick={() => navigate(`/new-negotiation?scenario=${encodeURIComponent(key)}`)} />
        ))}
      </div>

      <div className="dashboard-lower">
        <div className="panel">
          <div className="panel-head">
            <div><h3>How it works</h3><p>Three steps from setup to insight.</p></div>
            <Sparkles size={20} />
          </div>
          <div className="steps">
            {[
              ["01", "Configure", "Choose a scenario, roles, strategies and boundaries."],
              ["02", "Negotiate", "Let AI agents negotiate autonomously or practice with AI."],
              ["03", "Analyze", "Review scores, outcomes and detailed negotiation reports."],
            ].map(([n, t, d]) => (
              <div className="step" key={n}>
                <div className="step-num">{n}</div>
                <div><strong>{t}</strong><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel accent-panel">
          <div className="panel-head">
            <div><h3>Workspace</h3><p>Jump into the most common actions.</p></div>
            <Users size={20} />
          </div>
          <button className="action-row" onClick={() => navigate("/new-negotiation")}><span><Plus size={18} /> New negotiation</span><span>→</span></button>
          <button className="action-row" onClick={() => navigate("/live")}><span><MessageSquare size={18} /> Live negotiation</span><span>→</span></button>
          <button className="action-row" onClick={() => navigate("/reports")}><span><FileText size={18} /> View reports</span><span>→</span></button>
        </div>
      </div>
    </>
  );
}
