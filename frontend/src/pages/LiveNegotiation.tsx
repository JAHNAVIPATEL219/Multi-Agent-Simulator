import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Bot,
  CheckCircle2,
  Send,
  TrendingDown,
  User,
  XCircle,
} from "lucide-react";

import {
  api,
  NegotiationState,
} from "../services/api";

import {
  PageHeader,
  StatusPill,
} from "../components/UI";


/* ============================================================
   HELPERS
============================================================ */

function getAgentConfig(
  state: NegotiationState,
  agentNumber: 1 | 2
): any {

  const data = state as any;

  return (
    data[`agent${agentNumber}`] ||
    data[`agent${agentNumber}_config`] ||
    {}
  );
}


function getStartingTarget(
  state: NegotiationState,
  agentNumber: 1 | 2
): number | null {

  const agent =
    getAgentConfig(
      state,
      agentNumber
    );

  const value =
    agent.starting_target ??
    agent.startingTarget ??
    agent.starting_price ??
    agent.startingPrice;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numberValue =
    Number(value);

  return Number.isFinite(
    numberValue
  )
    ? numberValue
    : null;
}


function getReservationPrice(
  state: NegotiationState,
  agentNumber: 1 | 2
): number | null {

  const agent =
    getAgentConfig(
      state,
      agentNumber
    );

  const value =
    agent.reservation_price ??
    agent.reservationPrice ??
    agent.walk_away_price ??
    agent.walkAwayPrice;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numberValue =
    Number(value);

  return Number.isFinite(
    numberValue
  )
    ? numberValue
    : null;
}


function formatValue(
  value: number | null
): string {

  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}


/* ============================================================
   COMPONENT
============================================================ */

export default function LiveNegotiation() {

  const sessionId =
    localStorage.getItem(
      "session_id"
    ) || "";


  const [state, setState] =
    useState<NegotiationState | null>(
      null
    );


  const [message, setMessage] =
    useState("");


  const [sending, setSending] =
    useState(false);


  /* ============================================================
     LOAD
  ============================================================ */

  const load = async () => {

    if (!sessionId) {
      return;
    }

    try {

      const data =
        await api.getNegotiation(
          sessionId
        );

      setState(data);

    } catch {

      setState(null);

    }
  };


  useEffect(() => {

    load();

  }, [sessionId]);


  /* ============================================================
     SEND MESSAGE
  ============================================================ */

  const send = async (
    e: FormEvent
  ) => {

    e.preventDefault();


    if (
      !message.trim() ||
      !state ||
      state.status !==
        "in_progress"
    ) {
      return;
    }


    setSending(true);


    try {

      const speaker =
        localStorage.getItem(
          "human_role"
        ) ||
        (
          state.scenario ===
          "Vendor Pricing Negotiation"
            ? "Buyer"
            : state.scenario ===
                "Job Offer Negotiation"
              ? "Candidate"
              : "Department Representative"
        );


      await api.nextRound(
        sessionId,
        speaker,
        message.trim()
      );


      setMessage("");

      await load();

    } finally {

      setSending(false);

    }
  };


  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (!state) {

    return (
      <div className="empty-state">
        No active negotiation found.
        Start a new negotiation first.
      </div>
    );

  }


  /* ============================================================
     USER ROLE
  ============================================================ */

  const userRole =
    localStorage.getItem(
      "human_role"
    ) ||
    (
      state.scenario ===
      "Vendor Pricing Negotiation"
        ? "Buyer"
        : state.scenario ===
            "Job Offer Negotiation"
          ? "Candidate"
          : "Department Representative"
    );


  /* ============================================================
     AGENT NAMES
  ============================================================ */

  const agent1Name =
    state.scenario ===
    "Vendor Pricing Negotiation"
      ? "Buyer"
      : state.scenario ===
          "Job Offer Negotiation"
        ? "Candidate"
        : "Department Representative";


  const agent2Name =
    state.scenario ===
    "Vendor Pricing Negotiation"
      ? "Supplier"
      : state.scenario ===
          "Job Offer Negotiation"
        ? "HR Manager"
        : "Budget Manager";


  /* ============================================================
     DETERMINE HUMAN / AI AGENTS
  ============================================================ */

  const humanIsAgent1 =
    userRole === agent1Name;


  const humanAgentNumber:
    1 | 2 =
    humanIsAgent1
      ? 1
      : 2;


  const aiAgentNumber:
    1 | 2 =
    humanIsAgent1
      ? 2
      : 1;


  /* ============================================================
     PRICE INFORMATION
  ============================================================ */

  const humanStarting =
    getStartingTarget(
      state,
      humanAgentNumber
    );


  const humanWalkAway =
    getReservationPrice(
      state,
      humanAgentNumber
    );


  const aiStarting =
    getStartingTarget(
      state,
      aiAgentNumber
    );


  const aiWalkAway =
    getReservationPrice(
      state,
      aiAgentNumber
    );


  const humanDifference =
    humanStarting !== null &&
    humanWalkAway !== null
      ? Math.abs(
          humanStarting -
          humanWalkAway
        )
      : null;


  const aiDifference =
    aiStarting !== null &&
    aiWalkAway !== null
      ? Math.abs(
          aiStarting -
          aiWalkAway
        )
      : null;


  /* ============================================================
     UI
  ============================================================ */

  return (
    <>

      <PageHeader
        eyebrow="LIVE NEGOTIATION"
        title={state.scenario}
        description="Interact with the AI opponent and guide the conversation toward an agreement."
        action={
          <StatusPill
            status={state.status}
          />
        }
      />


      <div className="live-layout">


        {/* ====================================================
            CONVERSATION
        ==================================================== */}

        <section className="conversation-panel panel">

          <div className="conversation-head">

            <div>

              <h3>
                Negotiation conversation
              </h3>

              <p>
                Round {state.round} of{" "}
                {state.max_rounds}
              </p>

            </div>


            <div className="round-pill">
              R{state.round}
            </div>

          </div>


          {/* CHAT */}

          <div className="chat-window">

            {state.messages
              .filter(
                (m) =>
                  m.speaker !==
                  "System"
              )
              .map((m, i) => (

                <div
                  className={`message-row ${
                    m.speaker ===
                    userRole
                      ? "mine"
                      : ""
                  }`}
                  key={`${m.speaker}-${i}`}
                >

                  <div
                    className={`message-avatar ${
                      m.speaker ===
                      userRole
                        ? "purple"
                        : "orange"
                    }`}
                  >

                    {m.speaker ===
                    userRole ? (
                      <User size={16} />
                    ) : (
                      <Bot size={16} />
                    )}

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


            {!state.messages.length && (

              <div className="empty-chat">
                The negotiation will appear
                here.
              </div>

            )}

          </div>


          {/* ==================================================
              MESSAGE COMPOSER
          ================================================== */}

          {state.status ===
          "in_progress" ? (

            <form
              className="composer"
              onSubmit={send}
            >

              <input
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder={`Write your ${userRole.toLowerCase()} response...`}
              />


              <button
                className="send-btn"
                type="submit"
                disabled={
                  sending ||
                  !message.trim()
                }
              >

                <Send size={18} />

              </button>

            </form>

          ) : (

            <>

              {/* =================================================
                  OUTCOME
              ================================================= */}

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


              {/* =================================================
                  NEGOTIATION SUMMARY
              ================================================= */}

              <div className="negotiation-summary">

                <div className="summary-heading">

                  <div>

                    <h3>
                      Negotiation Summary
                    </h3>

                    <p>
                      Starting price versus
                      walk-away price
                    </p>

                  </div>

                  <TrendingDown
                    size={20}
                  />

                </div>


                <div className="summary-agents">


                  {/* =============================================
                      HUMAN
                  ============================================= */}

                  <div className="price-card">

                    <div className="price-card-header">

                      <div className="agent-avatar purple">

                        <User
                          size={17}
                        />

                      </div>

                      <strong>
                        {userRole}
                      </strong>

                    </div>


                    <div className="price-row">

                      <span>
                        Starting Price
                      </span>

                      <strong>
                        {formatValue(
                          humanStarting
                        )}
                      </strong>

                    </div>


                    <div className="price-row">

                      <span>
                        Walk Away Price
                      </span>

                      <strong>
                        {formatValue(
                          humanWalkAway
                        )}
                      </strong>

                    </div>


                    <div className="price-difference">

                      <span>
                        Difference
                      </span>

                      <strong>
                        {formatValue(
                          humanDifference
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* =============================================
                      AI
                  ============================================= */}

                  <div className="price-card">

                    <div className="price-card-header">

                      <div className="agent-avatar orange">

                        <Bot
                          size={17}
                        />

                      </div>

                      <strong>
                        {humanIsAgent1
                          ? agent2Name
                          : agent1Name}
                      </strong>

                    </div>


                    <div className="price-row">

                      <span>
                        Starting Price
                      </span>

                      <strong>
                        {formatValue(
                          aiStarting
                        )}
                      </strong>

                    </div>


                    <div className="price-row">

                      <span>
                        Walk Away Price
                      </span>

                      <strong>
                        {formatValue(
                          aiWalkAway
                        )}
                      </strong>

                    </div>


                    <div className="price-difference">

                      <span>
                        Difference
                      </span>

                      <strong>
                        {formatValue(
                          aiDifference
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </>

          )}

        </section>


        {/* ====================================================
            RIGHT SIDE
        ==================================================== */}

        <aside className="live-side">

          <div className="panel">

            <div className="panel-head">

              <div>

                <h3>
                  Negotiation status
                </h3>

                <p>
                  Live session details.
                </p>

              </div>

            </div>


            <div className="detail-list">

              <div>

                <span>
                  Session
                </span>

                <strong>
                  {sessionId.slice(
                    0,
                    10
                  )}
                  ...
                </strong>

              </div>


              <div>

                <span>
                  Mode
                </span>

                <strong>
                  {state.mode}
                </strong>

              </div>


              <div>

                <span>
                  Round
                </span>

                <strong>
                  {state.round} /{" "}
                  {state.max_rounds}
                </strong>

              </div>


              <div>

                <span>
                  Next active agent
                </span>

                <strong>
                  {state.active_agent ||
                    "—"}
                </strong>

              </div>

            </div>

          </div>

        </aside>

      </div>

    </>
  );
}