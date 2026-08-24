import { FormEvent, useState } from "react";
import { ArrowRight, Bot, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Please enter your email.");
    if (!password) return setError("Please enter your password.");
    localStorage.setItem("logged_in", "true");
    localStorage.setItem("user_email", email);
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-brand">
          <div className="brand-mark large"><Sparkles size={24} /></div>
          <span>Negotiate AI</span>
        </div>

        <div className="login-illustration">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="login-bot"><Bot size={48} /></div>
        </div>

        <div className="login-copy">
          <div className="eyebrow">WELCOME BACK</div>
          <h1>Negotiate smarter.<br /><span>Decide better.</span></h1>
          <p>Enter your workspace and run realistic multi-agent negotiations from one intelligent dashboard.</p>
        </div>

        <form onSubmit={submit} className="login-form">
          <label>
            Email
            <div className="input-wrap">
              <Mail size={17} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </label>

          <label>
            Password
            <div className="input-wrap">
              <LockKeyhole size={17} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="primary-btn" type="submit">
            Enter workspace <ArrowRight size={17} />
          </button>
        </form>

        <div className="login-foot">AI-powered negotiation platform · 2026</div>
      </div>

      <div className="login-side">
        <div className="login-side-card">
          <div className="side-glow" />
          <div className="side-badge"><Bot size={16} /> Autonomous AI</div>
          <h2>Where agents<br /><span>meet to negotiate.</span></h2>
          <p>Configure roles, strategies and boundaries. Watch intelligent agents reason, respond and reach agreements.</p>
          <div className="floating-deal">
            <div className="floating-avatar purple">B</div>
            <div><strong>Buyer</strong><span>Negotiating...</span></div>
            <div className="deal-line" />
            <div className="floating-avatar orange">S</div>
            <div><strong>Supplier</strong><span>Thinking...</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
