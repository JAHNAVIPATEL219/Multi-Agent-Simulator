import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Download, FileText, Target, XCircle } from "lucide-react";
import { api } from "../services/api";
import { EmptyState, MetricCard, PageHeader, StatusPill } from "../components/UI";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";

export default function Reports() {
  const [history, setHistory] = useState<Record<string, any>[]>([]);
  const [selected, setSelected] = useState<Record<string, any> | null>(null);
  const [report, setReport] = useState<Record<string, any> | null>(null);

  useEffect(() => { api.getHistory().then(setHistory).catch(() => setHistory([])); }, []);
  useEffect(() => {
    if (!selected?.session_id) return;
    api.getReport(selected.session_id).then(setReport).catch(() => setReport(null));
  }, [selected]);

  const agreements = history.filter(x => x.status === "agreement_reached").length;
  const deadlocks = history.filter(x => x.status === "deadlock").length;
  const maxRounds = history.filter(x => x.status === "max_rounds_reached").length;
  const success = history.length ? agreements / history.length * 100 : 0;
  const avg = history.length ? history.reduce((s, x) => s + Number(x.negotiation_score || 0), 0) / history.length : 0;

  const trend = history.map((x, i) => ({
    n: i + 1,
    success: history.slice(0, i + 1).filter(y => y.status === "agreement_reached").length / (i + 1) * 100
  }));
  const scenarios = Object.entries(history.reduce((a, x) => ({ ...a, [x.scenario || "Unknown"]: (a[x.scenario || "Unknown"] || 0) + 1 }), {} as Record<string, number>)).map(([name, count]) => ({ name, count }));

  return (
    <>
      <PageHeader eyebrow="ANALYTICS" title="Reports & performance" description="Review completed negotiations, scores and outcomes." action={
        <a className="secondary-btn link-btn" href={api.getPdfUrl()} target="_blank" rel="noreferrer"><Download size={16} /> Export report</a>
      } />

      <div className="metric-grid">
        <MetricCard icon={<FileText size={19} />} label="Total negotiations" value={history.length} caption="Completed sessions" tone="purple" />
        <MetricCard icon={<CheckCircle2 size={19} />} label="Agreements" value={agreements} caption="Successful outcomes" tone="green" />
        <MetricCard icon={<XCircle size={19} />} label="Deadlocks" value={deadlocks} caption={`${maxRounds} max-round endings`} tone="orange" />
        <MetricCard icon={<Target size={19} />} label="Success rate" value={`${success.toFixed(1)}%`} caption={`Average score ${avg.toFixed(1)}`} tone="blue" />
      </div>

      <div className="chart-grid">
        <div className="panel chart-panel">
          <div className="panel-head"><div><h3>Success trend</h3><p>Cumulative agreement rate.</p></div><BarChart3 size={20} /></div>
          {trend.length ? <ResponsiveContainer width="100%" height={260}><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeaf5" /><XAxis dataKey="n" /><YAxis domain={[0,100]} /><Tooltip /><Line type="monotone" dataKey="success" stroke="#7957d5" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer> : <EmptyState text="Complete negotiations to see the trend." />}
        </div>
        <div className="panel chart-panel">
          <div className="panel-head"><div><h3>Scenario distribution</h3><p>Negotiations by scenario.</p></div><BarChart3 size={20} /></div>
          {scenarios.length ? <ResponsiveContainer width="100%" height={260}><BarChart data={scenarios}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeaf5" /><XAxis dataKey="name" tick={{fontSize:11}} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#a888e9" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer> : <EmptyState text="No completed negotiations yet." />}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><div><h3>Negotiation history</h3><p>Select a session to inspect its score.</p></div></div>
        {history.length ? (
          <div className="table-wrap"><table><thead><tr><th>Session</th><th>Scenario</th><th>Mode</th><th>Rounds</th><th>Score</th><th>Status</th></tr></thead>
            <tbody>{history.map((x, i) => <tr key={x.session_id || i} onClick={() => setSelected(x)} className={selected?.session_id === x.session_id ? "row-selected" : ""}><td>{String(x.session_id || "-").slice(0, 10)}...</td><td>{x.scenario || "-"}</td><td>{x.mode || "-"}</td><td>{x.rounds ?? "-"}</td><td><strong>{x.negotiation_score ?? "-"}</strong></td><td><StatusPill status={x.status || "-"} /></td></tr>)}</tbody>
          </table></div>
        ) : <EmptyState text="No completed negotiations available." />}
      </div>

      {selected && (
        <div className="panel">
          <div className="panel-head"><div><h3>Score breakdown</h3><p>{selected.scenario} · {selected.session_id}</p></div></div>
          {report?.score_breakdown ? (
            <div className="score-grid">
              {Object.entries(report.score_breakdown).filter(([k]) => k !== "total").map(([key, val]) => {
                const score = Number(val);
                return <div className="score-item" key={key}><div><span>{key.replaceAll("_", " ")}</span><strong>{score}</strong></div><div className="progress-track"><div style={{ width: `${Math.min(100, score / ({outcome:30,deal_quality:25,strategy_adherence:20,concession_efficiency:15,boundary_management:10} as any)[key] * 100)}%` }} /></div></div>;
              })}
            </div>
          ) : <EmptyState text="Score breakdown is not available." />}
          {report?.summary && <div className="report-summary">{report.summary}</div>}
        </div>
      )}
    </>
  );
}
