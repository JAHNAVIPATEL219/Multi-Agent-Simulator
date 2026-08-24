from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import tempfile
from schemas.next_round import NextRoundRequest
from schemas.simulation import SimulationRequest
from schemas.negotiation import NegotiationRequest
from backend.orchestrator import NegotiationOrchestrator

app = FastAPI(
    title="Multi-Agent Negotiation Simulator API",
    version="1.0.0"
)

orchestrator = NegotiationOrchestrator()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.get("/health")
def health():
    return {"status": "Healthy"}


@app.post("/start-negotiation")
def start_negotiation(request: NegotiationRequest):
    return orchestrator.start(request)

@app.post("/next-round")
def next_round(request: NextRoundRequest):
    return orchestrator.next_round(request)

@app.post("/simulate-negotiation")
def simulate_negotiation(request: SimulationRequest):
    return orchestrator.simulate_negotiation(request.session_id)

@app.post("/simulate-next-turn")
def simulate_next_turn(request: SimulationRequest):
    return orchestrator.simulate_next_turn(request.session_id)

@app.get("/negotiation/{session_id}")
def get_negotiation(session_id: str):

    session = orchestrator.session_manager.get_session(session_id)

    if session is None:
        return {"error": "Invalid session ID"}

    conversation = (
        orchestrator.conversation_manager.get_conversation(
            session_id
        )
    )

    status = session.get("status", "in_progress")

    # Count negotiation rounds
    speakers = [
        "Buyer",
        "Supplier",
        "Candidate",
        "HR Manager",
        "Budget Requester",
        "Budget Allocator"
    ]

    rounds = sum(
        1
        for message in conversation
        if message["speaker"] in speakers
    ) // 2

    # Find the next active agent
    active_agent = None

    if status == "in_progress":

        scenario = session["scenario"]

        if scenario == "Vendor Pricing Negotiation":
            active_agent = (
                "Buyer"
                if rounds % 2 == 0
                else "Supplier"
            )

        elif scenario == "Job Offer Negotiation":
            active_agent = (
                "Candidate"
                if rounds % 2 == 0
                else "HR Manager"
            )

        elif scenario == "Project Budget Allocation":
            active_agent = (
                "Budget Requester"
                if rounds % 2 == 0
                else "Budget Allocator"
            )

    return {
        "session_id": session_id,
        "scenario": session["scenario"],
        "mode": session["mode"],
        "status": status,
        "round": rounds,
        "max_rounds": session["max_rounds"],
        "active_agent": active_agent,
        "messages": conversation
    }

@app.get("/conversation/{session_id}")
def get_conversation(session_id: str):
    return orchestrator.conversation_manager.get_conversation(session_id)

@app.get("/report/{session_id}")
def get_report(session_id: str):
    return orchestrator.generate_report(session_id)

@app.get("/reports/history")
def get_reports_history():

    return orchestrator.session_manager.get_completed_sessions()


@app.get("/reports/pdf")
def export_reports_pdf():
    """Generate a PDF containing the completed negotiation history."""
    from utils.pdf_generator import generate_pdf_report

    history = orchestrator.session_manager.get_completed_sessions()
    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)

    generate_pdf_report(path, history)

    return FileResponse(
        path,
        media_type="application/pdf",
        filename="negotiation_report.pdf",
    )


@app.get("/report/{session_id}/pdf")
def export_session_pdf(session_id: str):
    """Generate a PDF report for one completed negotiation."""
    from utils.pdf_generator import generate_pdf_report

    session = orchestrator.session_manager.get_session(session_id)
    if session is None:
        return {"error": "Invalid session ID"}

    report = orchestrator.generate_report(session_id)
    history = [{
        "session_id": session_id,
        "scenario": session.get("scenario", "-"),
        "mode": session.get("mode", "-"),
        "rounds": session.get("rounds", 0),
        "negotiation_score": report.get("negotiation_score", 0),
        "score_breakdown": report.get("score_breakdown", {}),
        "status": session.get("status", "-"),
        "summary": report.get("summary", ""),
    }]

    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    generate_pdf_report(path, history)

    return FileResponse(
        path,
        media_type="application/pdf",
        filename=f"negotiation_{session_id[:8]}.pdf",
    )
