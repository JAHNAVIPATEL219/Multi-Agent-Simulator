import { FormEvent, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bot,
  Gamepad2,
  Rocket,
  Settings2,
  Users,
} from "lucide-react";

import { api, AgentConfig } from "../services/api";
import {
  PageHeader,
  scenarioVisuals,
} from "../components/UI";


// ============================================================
// DEFAULT SCENARIO VALUES
// ============================================================

const defaults: Record<
  string,
  {
    a1: [number, number];
    a2: [number, number];
    names: [string, string];
    roles: [string, string];
  }
> = {
  "Vendor Pricing Negotiation": {
    a1: [7000, 9000],
    a2: [11000, 8500],
    names: ["Buyer", "Supplier"],
    roles: ["Buyer", "Supplier"],
  },

  "Job Offer Negotiation": {
    a1: [8, 6],
    a2: [5.5, 7],
    names: ["Candidate", "HR Manager"],
    roles: ["Candidate", "HR Manager"],
  },

  "Project Budget Allocation": {
    a1: [1000000, 700000],
    a2: [800000, 500000],
    names: [
      "Department Representative",
      "Budget Manager",
    ],
    roles: [
      "Department Representative",
      "Budget Manager",
    ],
  },
};


// ============================================================
// STRATEGIES
// ============================================================

const strategies = [
  "Collaborative",
  "Assertive",
  "Competitive",
  "Accommodating",
  "Compromising",
];


// ============================================================
// AGENT EDITOR
// ============================================================

function AgentEditor({
  title,
  data,
  setData,
  scenario,
  index,
}: {
  title: string;
  data: AgentConfig;
  setData: (x: AgentConfig) => void;
  scenario: string;
  index: number;
}) {
  const salary =
    scenario === "Job Offer Negotiation";

  const update = (
    key: keyof AgentConfig,
    value: string | number
  ) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  return (
    <div className="agent-card">

      <div className="agent-head">

        <div
          className={`agent-badge ${
            index === 1 ? "purple" : "orange"
          }`}
        >
          <Bot size={19} />
        </div>

        <div>
          <h3>{title}</h3>
          <p>{data.role}</p>
        </div>

      </div>


      <div className="form-grid">

        <label>
          Agent name

          <input
            value={data.name}
            onChange={(e) =>
              update("name", e.target.value)
            }
          />
        </label>


        <label>
          Role

          <input
            value={data.role}
            onChange={(e) =>
              update("role", e.target.value)
            }
          />
        </label>

      </div>


      <label>
        Negotiation strategy

        <select
          value={data.strategy}
          onChange={(e) =>
            update("strategy", e.target.value)
          }
        >
          {strategies.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>


      <div className="form-grid">

        <label>
          {salary
            ? "Starting Salary (LPA)"
            : "Starting Target"}

          <input
            type="number"
            value={data.starting_target}
            step={salary ? "0.5" : "100"}
            onChange={(e) =>
              update(
                "starting_target",
                Number(e.target.value)
              )
            }
          />
        </label>


        <label>
          {salary
            ? "Minimum / Maximum Acceptable (LPA)"
            : "Reservation Price / Walk Away"}

          <input
            type="number"
            value={data.reservation_price}
            step={salary ? "0.5" : "100"}
            onChange={(e) =>
              update(
                "reservation_price",
                Number(e.target.value)
              )
            }
          />
        </label>

      </div>


      <label>
        Custom instructions

        <textarea
          value={data.instructions || ""}
          onChange={(e) =>
            update(
              "instructions",
              e.target.value
            )
          }
          placeholder="Optional instructions for this agent..."
        />
      </label>

    </div>
  );
}


// ============================================================
// NEW NEGOTIATION
// ============================================================

export default function NewNegotiation() {

  const location = useLocation();

  const navigate = useNavigate();


  // ==========================================================
  // INITIAL VALUES
  // ==========================================================

  const params =
    new URLSearchParams(location.search);

  const initialScenario =
    params.get("scenario") ||
    "Vendor Pricing Negotiation";


  const [scenario, setScenario] =
    useState(initialScenario);


  const [mode, setMode] =
    useState<"AI vs AI" | "Human vs AI">(
      "AI vs AI"
    );


  const [humanRole, setHumanRole] =
    useState("Buyer");


  const [maxRounds, setMaxRounds] =
    useState(10);


  const [budget, setBudget] =
    useState(5000000);


  const initial =
    defaults[initialScenario] ||
    defaults["Vendor Pricing Negotiation"];


  // ==========================================================
  // AGENT 1
  // ==========================================================

  const [agent1, setAgent1] =
    useState<AgentConfig>({
      name: initial.names[0],
      role: initial.roles[0],
      strategy: "Collaborative",
      starting_target: initial.a1[0],
      reservation_price: initial.a1[1],
      instructions: "",
    });


  // ==========================================================
  // AGENT 2
  // ==========================================================

  const [agent2, setAgent2] =
    useState<AgentConfig>({
      name: initial.names[1],
      role: initial.roles[1],
      strategy: "Assertive",
      starting_target: initial.a2[0],
      reservation_price: initial.a2[1],
      instructions: "",
    });


  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================================
  // SCENARIO VISUAL
  // ==========================================================

  const scenarioInfo = useMemo(
    () =>
      scenarioVisuals[
        scenario as keyof typeof scenarioVisuals
      ],
    [scenario]
  );


  // ==========================================================
  // ROLES
  // ==========================================================

  const rolesForScenario =
    scenario ===
    "Vendor Pricing Negotiation"
      ? ["Buyer", "Supplier"]
      : scenario ===
        "Job Offer Negotiation"
      ? ["Candidate", "HR Manager"]
      : ["Department Representative"];


  // ==========================================================
  // CHANGE SCENARIO
  // ==========================================================

  const changeScenario = (
    value: string
  ) => {

    setScenario(value);

    const d = defaults[value];

    setAgent1({
      name: d.names[0],
      role: d.roles[0],
      strategy: "Collaborative",
      starting_target: d.a1[0],
      reservation_price: d.a1[1],
      instructions: "",
    });


    setAgent2({
      name: d.names[1],
      role: d.roles[1],
      strategy: "Assertive",
      starting_target: d.a2[0],
      reservation_price: d.a2[1],
      instructions: "",
    });


    setHumanRole(
      value === "Vendor Pricing Negotiation"
        ? "Buyer"
        : value === "Job Offer Negotiation"
        ? "Candidate"
        : "Department Representative"
    );
  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const submit = async (
    e: FormEvent
  ) => {

    e.preventDefault();

    setError("");


    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (
      agent1.starting_target <= 0 ||
      agent2.starting_target <= 0
    ) {
      setError(
        "Starting targets must be greater than 0."
      );

      return;
    }


    // ========================================================
    // VENDOR VALIDATION
    // ========================================================

    if (
      scenario ===
      "Vendor Pricing Negotiation" &&
      (
        agent1.starting_target >=
          agent1.reservation_price ||
        agent2.starting_target <=
          agent2.reservation_price
      )
    ) {

      setError(
        "For vendor pricing, Buyer target must be below walk-away and Supplier target must be above walk-away."
      );

      return;
    }


    // ========================================================
    // OTHER SCENARIO VALIDATION
    // ========================================================

    if (
      scenario !==
        "Vendor Pricing Negotiation" &&
      agent1.starting_target <
        agent1.reservation_price
    ) {

      setError(
        "Agent 1 starting value must meet its acceptable boundary."
      );

      return;
    }


    // ========================================================
    // START
    // ========================================================

    setLoading(true);


    try {

      // ======================================================
      // SEND EXISTING BACKEND PAYLOAD
      // ======================================================

      const result =
        await api.startNegotiation({

          scenario,

          mode,

          max_rounds: maxRounds,

          project_total_budget:
            scenario ===
            "Project Budget Allocation"
              ? budget
              : null,

          agent1_config: agent1,

          agent2_config: agent2,
        });


      // ======================================================
      // SAVE SESSION
      // ======================================================

      localStorage.setItem(
        "session_id",
        result.session_id
      );


      // ======================================================
      // SAVE HUMAN ROLE
      // ======================================================

      localStorage.setItem(
        "human_role",
        humanRole
      );


      // ======================================================
      // IMPORTANT:
      // SAVE AGENT 1 CONFIGURATION
      // ======================================================

      localStorage.setItem(
        "agent1_config",
        JSON.stringify({
          name: agent1.name,
          role: agent1.role,
          strategy: agent1.strategy,

          // KEEP BACKEND FIELD NAMES EXACTLY
          starting_target:
            Number(
              agent1.starting_target
            ),

          reservation_price:
            Number(
              agent1.reservation_price
            ),

          instructions:
            agent1.instructions || "",
        })
      );


      // ======================================================
      // IMPORTANT:
      // SAVE AGENT 2 CONFIGURATION
      // ======================================================

      localStorage.setItem(
        "agent2_config",
        JSON.stringify({
          name: agent2.name,
          role: agent2.role,
          strategy: agent2.strategy,

          // KEEP BACKEND FIELD NAMES EXACTLY
          starting_target:
            Number(
              agent2.starting_target
            ),

          reservation_price:
            Number(
              agent2.reservation_price
            ),

          instructions:
            agent2.instructions || "",
        })
      );


      // ======================================================
      // ALSO SAVE SCENARIO + MODE
      // ======================================================

      localStorage.setItem(
        "negotiation_scenario",
        scenario
      );


      localStorage.setItem(
        "negotiation_mode",
        mode
      );


      // ======================================================
      // DEBUG LOG
      // ======================================================

      console.log(
        "Negotiation started successfully"
      );

      console.log(
        "Agent 1:",
        agent1
      );

      console.log(
        "Agent 2:",
        agent2
      );


      // ======================================================
      // NAVIGATION
      // ======================================================

      if (mode === "AI vs AI") {

        navigate("/simulation");

      } else {

        navigate("/live");

      }

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start negotiation."
      );

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      <PageHeader
        eyebrow="NEW NEGOTIATION"
        title="Create a negotiation"
        description="Configure the scenario, mode, participants and boundaries before starting."
      />


      <form onSubmit={submit}>


        {/* ====================================================
            SCENARIO
        ==================================================== */}

        <div className="panel">

          <div className="panel-head">

            <div>

              <h3>
                01 · Scenario
              </h3>

              <p>
                Choose the business situation.
              </p>

            </div>

            <Settings2 size={20} />

          </div>


          <div className="scenario-selector">

            {Object.entries(
              scenarioVisuals
            ).map(([key, item]) => (

              <button
                type="button"
                key={key}
                className={`scenario-option ${
                  scenario === key
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  changeScenario(key)
                }
              >

                <div
                  className={`scenario-icon ${item.tone}`}
                >
                  {item.icon}
                </div>

                <div>

                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.description}
                  </span>

                </div>

              </button>

            ))}

          </div>


          {scenario ===
            "Project Budget Allocation" && (

            <label className="budget-field">

              Total project budget

              <input
                type="number"
                value={budget}
                step="100000"
                onChange={(e) =>
                  setBudget(
                    Number(e.target.value)
                  )
                }
              />

            </label>

          )}

        </div>


        {/* ====================================================
            NEGOTIATION MODE
        ==================================================== */}

        <div className="panel">

          <div className="panel-head">

            <div>

              <h3>
                02 · Negotiation mode
              </h3>

              <p>
                Choose who participates.
              </p>

            </div>

            <Users size={20} />

          </div>


          <div className="mode-grid">

            <button
              type="button"
              className={`mode-card ${
                mode === "AI vs AI"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setMode("AI vs AI")
              }
            >

              <Bot size={24} />

              <strong>
                AI vs AI
              </strong>

              <span>
                Two autonomous agents
                negotiate automatically.
              </span>

            </button>


            <button
              type="button"
              className={`mode-card ${
                mode === "Human vs AI"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setMode("Human vs AI")
              }
            >

              <Gamepad2 size={24} />

              <strong>
                Human vs AI
              </strong>

              <span>
                Practice a negotiation
                with an AI opponent.
              </span>

            </button>

          </div>

        </div>


        {/* ====================================================
            HUMAN ROLE
        ==================================================== */}

        {mode === "Human vs AI" && (

          <div className="panel">

            <div className="panel-head">

              <div>

                <h3>
                  Your role
                </h3>

                <p>
                  Choose which participant
                  you will play.
                </p>

              </div>

              <Users size={20} />

            </div>


            <div className="role-picker">

              {rolesForScenario.map(
                (role) => (

                  <button
                    type="button"
                    key={role}
                    className={
                      humanRole === role
                        ? "role-option selected"
                        : "role-option"
                    }
                    onClick={() =>
                      setHumanRole(role)
                    }
                  >
                    {role}
                  </button>

                )
              )}

            </div>

          </div>

        )}


        {/* ====================================================
            AGENTS
        ==================================================== */}

        <div className="agent-grid">

          <AgentEditor
            title="Agent 1"
            data={agent1}
            setData={setAgent1}
            scenario={scenario}
            index={1}
          />


          <AgentEditor
            title="Agent 2"
            data={agent2}
            setData={setAgent2}
            scenario={scenario}
            index={2}
          />

        </div>


        {/* ====================================================
            CONFIGURATION
        ==================================================== */}

        <div className="panel compact-panel">

          <div className="panel-head">

            <div>

              <h3>
                03 · Configuration
              </h3>

              <p>
                Set the negotiation limits.
              </p>

            </div>

          </div>


          <div className="range-row">

            <label>

              Maximum rounds

              <strong>
                {maxRounds}
              </strong>

              <input
                type="range"
                min="5"
                max="20"
                value={maxRounds}
                onChange={(e) =>
                  setMaxRounds(
                    Number(e.target.value)
                  )
                }
              />

            </label>

          </div>

        </div>


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="form-error large">
            {error}
          </div>

        )}


        {/* ====================================================
            START
        ==================================================== */}

        <div className="start-bar">

          <div>

            <strong>
              Ready to negotiate?
            </strong>

            <span>
              {scenario} · {mode} · up to{" "}
              {maxRounds} rounds
            </span>

          </div>


          <button
            className="primary-btn"
            disabled={loading}
          >

            {loading ? (
              "Starting..."
            ) : (
              <>
                <Rocket size={18} />
                Start Negotiation
              </>
            )}

          </button>

        </div>

      </form>
    </>
  );
}