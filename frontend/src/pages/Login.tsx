import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Bot,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // -----------------------------
    // GET REGISTERED ACCOUNT
    // -----------------------------

    const storedAccount = localStorage.getItem("user_account");

    if (!storedAccount) {
      setError("No account found. Please create an account first.");
      return;
    }

    // -----------------------------
    // CHECK LOGIN DETAILS
    // -----------------------------

    try {
      const account = JSON.parse(storedAccount);

      const emailMatches =
        account.email?.toLowerCase() === email.trim().toLowerCase();

      const passwordMatches =
        account.password === password;

      if (!emailMatches || !passwordMatches) {
        setError("Invalid email or password.");
        return;
      }

      // -----------------------------
      // LOGIN SUCCESS
      // -----------------------------

      localStorage.setItem("logged_in", "true");
      localStorage.setItem("user_email", account.email);
      localStorage.setItem("user_name", account.name || "");

      // Go to dashboard
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to read account information.");
    }
  };

  return (
    <div className="login-page">

      {/* =====================================================
          LEFT PANEL
      ===================================================== */}

      <div className="login-panel">

        {/* BRAND */}
        <div className="login-brand">
          <div className="brand-mark large">
            <Sparkles size={24} />
          </div>

          <span>Negotiate AI</span>
        </div>

        {/* ILLUSTRATION */}
        <div className="login-illustration">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="login-bot">
            <Bot size={48} />
          </div>
        </div>

        {/* LOGIN COPY */}
        <div className="login-copy">

          <div className="eyebrow">
            WELCOME BACK
          </div>

          <h1>
            Negotiate smarter.
            <br />
            <span>Decide better.</span>
          </h1>

          <p>
            Enter your workspace and run realistic multi-agent
            negotiations from one intelligent dashboard.
          </p>

        </div>

        {/* =====================================================
            LOGIN FORM
        ===================================================== */}

        <form
          onSubmit={submit}
          className="login-form"
        >

          {/* EMAIL */}

          <label>
            Email

            <div className="input-wrap">

              <Mail size={17} />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
              />

            </div>

          </label>

          {/* PASSWORD */}

          <label>
            Password

            <div className="input-wrap">

              <LockKeyhole size={17} />

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

            </div>

          </label>

          {/* ERROR */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            className="primary-btn"
            type="submit"
          >
            <span>Enter workspace</span>
            <ArrowRight size={17} />
          </button>

        </form>

        {/* =====================================================
            SIGNUP
        ===================================================== */}

        <div className="signup-section">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            Create Account
            <ArrowRight size={15} />
          </button>

        </div>

        {/* FOOTER */}

        <div className="login-foot">
          AI-powered negotiation platform · 2026
        </div>

      </div>

      {/* =====================================================
          RIGHT PANEL
      ===================================================== */}

      <div className="login-side">

        <div className="login-side-card">

          <div className="side-glow" />

          {/* BADGE */}

          <div className="side-badge">
            <Bot size={16} />
            Autonomous AI
          </div>

          {/* HEADING */}

          <h2>
            Where agents
            <br />
            <span>meet to negotiate.</span>
          </h2>

          {/* DESCRIPTION */}

          <p>
            Configure roles, strategies and boundaries.
            Watch intelligent agents reason, respond and
            reach agreements.
          </p>

          {/* FLOATING NEGOTIATION CARD */}

          <div className="floating-deal">

            {/* BUYER */}

            <div className="floating-avatar purple">
              B
            </div>

            <div>
              <strong>
                Buyer
              </strong>

              <span>
                Negotiating...
              </span>
            </div>

            {/* CONNECTION */}

            <div className="deal-line" />

            {/* SUPPLIER */}

            <div className="floating-avatar orange">
              S
            </div>

            <div>
              <strong>
                Supplier
              </strong>

              <span>
                Thinking...
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}