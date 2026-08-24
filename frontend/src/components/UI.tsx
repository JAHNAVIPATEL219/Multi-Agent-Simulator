import type { ReactNode } from "react";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Handshake,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  caption,
  tone = "purple",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  caption: string;
  tone?: string;
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-caption">{caption}</div>
    </div>
  );
}

export function ScenarioCard({
  title,
  description,
  icon,
  tone,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  tone: string;
  onClick: () => void;
}) {
  return (
    <button className="scenario-card" onClick={onClick}>
      <div className={`scenario-icon ${tone}`}>{icon}</div>
      <div className="scenario-content">
        <div className="scenario-title">{title}</div>
        <div className="scenario-description">{description}</div>
        <div className="scenario-link">
          Configure scenario <ArrowRight size={16} />
        </div>
      </div>
    </button>
  );
}

export const scenarioVisuals = {
  "Vendor Pricing Negotiation": {
    icon: <ShoppingCart size={22} />,
    tone: "purple",
    title: "Buyer vs Supplier",
    description:
      "Negotiate pricing, quantity, delivery schedules, warranty and business terms.",
  },
  "Job Offer Negotiation": {
    icon: <BriefcaseBusiness size={22} />,
    tone: "blue",
    title: "HR vs Candidate",
    description:
      "Negotiate salary, benefits, joining date and employment conditions.",
  },
  "Project Budget Allocation": {
    icon: <CircleDollarSign size={22} />,
    tone: "green",
    title: "Budget Allocation",
    description:
      "Balance departmental priorities and reach a fair project budget allocation.",
  },
} as const;

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Sparkles size={22} /></div>
      <strong>{text}</strong>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const cls =
    normalized.includes("agreement") || normalized === "success"
      ? "success"
      : normalized.includes("deadlock") || normalized.includes("quota")
        ? "danger"
        : normalized.includes("max")
          ? "warning"
          : "info";
  return <span className={`status-pill ${cls}`}>{status.replaceAll("_", " ")}</span>;
}
