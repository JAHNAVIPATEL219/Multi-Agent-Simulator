import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Pause,
  Play,
  Sparkles,
  XCircle,
} from "lucide-react";

import { api, NegotiationState } from "../services/api";
import { PageHeader, StatusPill } from "../components/UI";


// ============================================================
// HELPERS
// ============================================================

type AgentConfig = {
  name?: string;
  role?: string;
  strategy?: string;
  starting_target?: number;
  reservation_price?: number;
  instructions?: string;
};


function getAgentConfig(key: string): AgentConfig | null {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return null;
  }
}


function formatPrice(value: number | undefined): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
}


// ============================================================
// COMPONENT
// ============================================================

export default function Simulation() {
  const sessionId =
    localStorage.getItem("session_id") || "";

  const [state, setState] =
    useState<NegotiationState | null>(null);

  const [running, setRunning] =
    useState(true);

  const [thinking, setThinking] =
    useState(false);

  const timer =
    useRef<number | null>(null);


  // ==========================================================
  // LOAD NEGOTIATION
  // ==========================================================

  const refresh = async () => {
    if (!sessionId) return;

    try {
      const data =
        await api.getNegotiation(sessionId);

      setState(data);
    } catch (error) {
      console.error(
        "Unable to load negotiation:",
        error
      );
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    refresh();

    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, [sessionId]);


  // ==========================================================
  // AUTOMATIC AI NEGOTIATION
  // ==========================================================

  useEffect(() => {
    if (
      !running ||
      !state ||
      state.status !== "in_progress" ||
      thinking
    ) {
      return;
    }

    timer.current = window.setTimeout(
      async () => {
        setThinking(true);

        try {
          await api.simulateNextTurn(sessionId);

          await refresh();
        } catch (error) {
          console.error(
            "Simulation turn failed:",
            error
          );
        } finally {
          setThinking(false);
        }
      },
      1800
    );

    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, [
    state,
    running,
    thinking,
    sessionId,
  ]);


  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (!state) {
    return (
      <div className="empty-state">
        No active simulation found.
      </div>
    );
  }


  // ==========================================================
  // AGENT CONFIGURATION
  // ==========================================================

  const agent1Config =
    getAgentConfig("agent1_config");

  const agent2Config =
    getAgentConfig("agent2_config");


  // ==========================================================
  // AGENT 1 VALUES
  // ==========================================================

  const agent1Starting =
    Number(
      agent1Config?.starting_target
    );

  const agent1WalkAway =
    Number(
      agent1Config?.reservation_price
    );

  const agent1Difference =
    Math.abs(
      agent1Starting -
      agent1WalkAway
    );


  // ==========================================================
  // AGENT 2 VALUES
  // ==========================================================

  const agent2Starting =
    Number(
      agent2Config?.starting_target
    );

  const agent2WalkAway =
    Number(
      agent2Config?.reservation_price
    );

  const agent2Difference =
    Math.abs(
      agent2Starting -
      agent2WalkAway
    );


  // ==========================================================
  // AGENT NAMES
  // ==========================================================

  const agent1Name =
    agent1Config?.name ||
    (
      state.scenario ===
      "Vendor Pricing Negotiation"
        ? "Buyer"
        : state.scenario ===
          "Job Offer Negotiation"
        ? "Candidate"
        : "Department Representative"
    );


  const agent2Name =
    agent2Config?.name ||
    (
      state.scenario ===
      "Vendor Pricing Negotiation"
        ? "Supplier"
        : state.scenario ===
          "Job Offer Negotiation"
        ? "HR Manager"
        : "Budget Manager"
    );


  // ==========================================================
  // AGENT INITIALS
  // ==========================================================

  const agent1Initial =
    agent1Name.charAt(0).toUpperCase();

  const agent2Initial =
    agent2Name.charAt(0).toUpperCase();


  return (
    <>
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        eyebrow="AI VS AI"
        title="Autonomous negotiation"
        description={state.scenario}
        action={
          <button
            className="secondary-btn"
            onClick={() =>
              setRunning(!running)
            }
          >
            {running ? (
              <>
                <Pause size={16} />
                Pause
              </>
            ) : (
              <>
                <Play size={16} />
                Resume
              </>
            )}
          </button>
        }
      />


      {/* ======================================================
          AGENTS HEADER
      ====================================================== */}

      <div className="simulation-top">

        {/* AGENT 1 */}

        <div className="simulation-agent">

          <div className="agent-avatar purple">
            {agent1Initial}
          </div>

          <div>
            <strong>
              {agent1Name}
            </strong>

            <span>
              AI Agent
            </span>
          </div>

        </div>


        {/* MIDDLE */}

        <div className="simulation-middle">

          <div className="simulation-status">

            {thinking ? (
              <>
                <span className="typing-dot" />
                Agent is thinking...
              </>
            ) : (
              <StatusPill
                status={state.status}
              />
            )}

          </div>


          <div className="progress-track">

            <div
              style={{
                width: `${Math.min(
                  100,
                  (state.round /
                    state.max_rounds) *
                    100
                )}%`,
              }}
            />

          </div>

          <span>
            Round {state.round} /{" "}
            {state.max_rounds}
          </span>

        </div>


        {/* AGENT 2 */}

        <div className="simulation-agent right">

          <div className="agent-avatar orange">
            {agent2Initial}
          </div>

          <div>
            <strong>
              {agent2Name}
            </strong>

            <span>
              AI Agent
            </span>
          </div>

        </div>

      </div>


      {/* ======================================================
          CONVERSATION
      ====================================================== */}

      <div className="simulation-chat panel">

        <div className="conversation-head">

          <div>
            <h3>
              Live AI conversation
            </h3>

            <p>
              Agents automatically take turns.
              The thinking delay is intentional.
            </p>
          </div>

          <Sparkles size={20} />

        </div>


        <div className="chat-window simulation-window">

          {state.messages
            .filter(
              (m) =>
                m.speaker !== "System"
            )
            .map((m, i) => (

              <div
                className={`message-row ${
                  i % 2
                    ? "right-msg"
                    : ""
                }`}
                key={`${m.speaker}-${i}`}
              >

                <div
                  className={`message-avatar ${
                    i % 2
                      ? "orange"
                      : "purple"
                  }`}
                >
                  <Bot size={16} />
                </div>


                <div className="message-bubble">

                  <div className="message-name">
                    {m.speaker}
                  </div>

                  <div>
                    {m.message}
                  </div>

                </div>

              </div>

            ))}


          {thinking && (

            <div className="thinking-card">

              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />

              Thinking through the next offer...

            </div>

          )}

        </div>


        {/* OUTCOME */}

        {state.status !== "in_progress" && (

          <div
            className={`outcome ${
              state.status ===
              "agreement_reached"
                ? "success"
                : "danger"
            }`}
          >

            {state.status ===
            "agreement_reached" ? (
              <CheckCircle2 />
            ) : (
              <XCircle />
            )}

            <strong>
              {state.status.replaceAll(
                "_",
                " "
              )}
            </strong>

          </div>

        )}

      </div>


      {/* ======================================================
          NEGOTIATION SUMMARY
      ====================================================== */}

      <div className="negotiation-summary panel">

        <div className="conversation-head">

          <div>

            <h3>
              Negotiation Summary
            </h3>

            <p>
              Starting price versus walk-away price
            </p>

          </div>

        </div>


        <div className="summary-agents">


          {/* ==================================================
              AGENT 1 SUMMARY
          ================================================== */}

          <div className="summary-agent-card">

            <div className="summary-agent-header">

              <div className="agent-avatar purple">
                {agent1Initial}
              </div>

              <div>

                <strong>
                  {agent1Name}
                </strong>

                <span>
                  {agent1Config?.role ||
                    "AI Agent"}
                </span>

              </div>

            </div>


            <div className="summary-row">

              <span>
                Starting Price
              </span>

              <strong>
                {formatPrice(
                  agent1Starting
                )}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Walk Away Price
              </span>

              <strong>
                {formatPrice(
                  agent1WalkAway
                )}
              </strong>

            </div>


            <div className="summary-difference">

              <span>
                Difference
              </span>

              <strong>
                {agent1Starting > 0 &&
                agent1WalkAway > 0
                  ? formatPrice(
                      agent1Difference
                    )
                  : "—"}
              </strong>

            </div>

          </div>


          {/* ==================================================
              AGENT 2 SUMMARY
          ================================================== */}

          <div className="summary-agent-card">

            <div className="summary-agent-header">

              <div className="agent-avatar orange">
                {agent2Initial}
              </div>

              <div>

                <strong>
                  {agent2Name}
                </strong>

                <span>
                  {agent2Config?.role ||
                    "AI Agent"}
                </span>

              </div>

            </div>


            <div className="summary-row">

              <span>
                Starting Price
              </span>

              <strong>
                {formatPrice(
                  agent2Starting
                )}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Walk Away Price
              </span>

              <strong>
                {formatPrice(
                  agent2WalkAway
                )}
              </strong>

            </div>


            <div className="summary-difference">

              <span>
                Difference
              </span>

              <strong>
                {agent2Starting > 0 &&
                agent2WalkAway > 0
                  ? formatPrice(
                      agent2Difference
                    )
                  : "—"}
              </strong>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}