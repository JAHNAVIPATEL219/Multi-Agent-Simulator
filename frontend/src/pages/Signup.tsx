import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Bot,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check whether this email already has an account
    const existingUser = localStorage.getItem("user_account");

    if (existingUser) {
      const user = JSON.parse(existingUser);

      if (user.email.toLowerCase() === email.trim().toLowerCase()) {
        setError("An account with this email already exists.");
        return;
      }
    }

    // Save account locally
    const userAccount = {
      name: name.trim(),
      email: email.trim(),
      password: password,
    };

    localStorage.setItem("user_account", JSON.stringify(userAccount));

    // Store signup information
    localStorage.setItem("user_name", name.trim());
    localStorage.setItem("user_email", email.trim());

    // Go back to login
    navigate("/login");
  };

  return (
    <div className="login-page">
      {/* LEFT PANEL */}
      <div className="login-panel">
        <div className="login-brand">
          <div className="brand-mark large">
            <Sparkles size={24} />
          </div>
          <span>Negotiate AI</span>
        </div>

        <div className="login-illustration">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="login-bot">
            <Bot size={48} />
          </div>
        </div>

        <div className="login-copy">
          <div className="eyebrow">GET STARTED</div>

          <h1>
            Negotiate smarter.
            <br />
            <span>Decide better.</span>
          </h1>

          <p>
            Create your workspace and start running realistic multi-agent
            negotiations from one intelligent dashboard.
          </p>
        </div>

        <form onSubmit={submit} className="login-form">
          {/* NAME */}
          <label>
            Full Name

            <div className="input-wrap">
              <User size={17} />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </label>

          {/* EMAIL */}
          <label>
            Email

            <div className="input-wrap">
              <Mail size={17} />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>
          </label>

          {/* CONFIRM PASSWORD */}
          <label>
            Confirm Password

            <div className="input-wrap">
              <LockKeyhole size={17} />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="primary-btn" type="submit">
            Create Account
            <ArrowRight size={17} />
          </button>
        </form>

        {/* LOGIN LINK */}
        <div className="signup-section">
          <span>Already have an account?</span>

          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/login")}
          >
            Sign in
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="login-foot">
          AI-powered negotiation platform · 2026
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-side">
        <div className="login-side-card">
          <div className="side-glow" />

          <div className="side-badge">
            <Bot size={16} />
            Autonomous AI
          </div>

          <h2>
            Where agents
            <br />
            <span>meet to negotiate.</span>
          </h2>

          <p>
            Configure roles, strategies and boundaries. Watch intelligent
            agents reason, respond and reach agreements.
          </p>

          <div className="floating-deal">
            <div className="floating-avatar purple">B</div>

            <div>
              <strong>Buyer</strong>
              <span>Negotiating...</span>
            </div>

            <div className="deal-line" />

            <div className="floating-avatar orange">S</div>

            <div>
              <strong>Supplier</strong>
              <span>Thinking...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}