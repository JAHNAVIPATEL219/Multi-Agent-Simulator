import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/new-negotiation", label: "New Negotiation", icon: Plus },
  { to: "/live", label: "Live Negotiation", icon: MessageSquare },
  { to: "/simulation", label: "AI Simulation", icon: Bot },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("logged_in");
    localStorage.removeItem("user_email");
    localStorage.removeItem("session_id");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={19} />
          </div>
          <div>
            <div className="brand-name">Negotiate AI</div>
            <div className="brand-sub">Negotiation workspace</div>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="nav-list">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-mini-card">
            <div className="ai-mini-icon"><Bot size={18} /></div>
            <div>
              <strong>AI Assistant</strong>
              <span>Ready to negotiate</span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <section className="main-shell">
        <header className="topbar">
          <div>
            <div className="topbar-kicker">AI-POWERED WORKSPACE</div>
            <div className="topbar-title">Multi-Agent Negotiation Simulator</div>
          </div>
          <div className="topbar-user">
            <div className="status-dot" />
            <span>{localStorage.getItem("user_email") || "Workspace User"}</span>
            <div className="avatar">N</div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </section>
    </div>
  );
}
