import streamlit as st
from textwrap import dedent


# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="Multi-Agent Negotiation Simulator",
    page_icon="🤝",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ============================================================
# LOGIN CHECK
# ============================================================

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if not st.session_state.logged_in:
    st.switch_page("pages/Login.py")


# ============================================================
# IMPORTS
# ============================================================

from components.styles import load_css
from components.navbar import show_navbar


# ============================================================
# LOAD THEME
# ============================================================

load_css()


# ============================================================
# NAVBAR
# ============================================================

show_navbar()


# ============================================================
# HERO SECTION
# ============================================================

hero_html = dedent("""
<div class="hero-card">

    <div class="hero-content">

        <div class="hero-eyebrow">
            AI NEGOTIATION WORKSPACE
        </div>

        <div class="hero-title">
            Intelligent Negotiation,
            <span>Powered by AI</span>
        </div>

        <div class="hero-description">
            Simulate realistic business negotiations using
            autonomous AI agents. Configure scenarios,
            observe negotiation strategies, and analyze
            the final outcomes from one workspace.
        </div>

        <div class="hero-actions">
            <div class="hero-badge">
                🤖 Multi-Agent AI
            </div>

            <div class="hero-badge">
                ⚡ Real-Time Simulation
            </div>

            <div class="hero-badge">
                📊 Smart Analytics
            </div>
        </div>

    </div>

    <div class="hero-visual">

        <div class="hero-visual-icon">
            🤝
        </div>

        <div class="hero-visual-text">
            <strong>AI Negotiation</strong>
            <span>Workspace</span>
        </div>

    </div>

</div>
""")

st.markdown(
    hero_html,
    unsafe_allow_html=True
)


# ============================================================
# QUICK START
# ============================================================

st.markdown(
    '<div class="section-title">Quick Start</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="section-description">'
    'Choose how you want to use the negotiation simulator.'
    '</div>',
    unsafe_allow_html=True
)


quick1, quick2 = st.columns(2, gap="large")


# ============================================================
# START NEGOTIATION
# ============================================================

with quick1:

    card = dedent("""
    <div class="dashboard-card large-card">

        <div class="mode-icon mode-icon-purple">
            ＋
        </div>

        <div class="dashboard-card-title">
            Start a Negotiation
        </div>

        <div class="dashboard-card-subtitle">
            Create a new negotiation scenario and configure
            your AI agents, strategies, rounds, and agreement
            thresholds.
        </div>

        <div class="card-feature-list">
            <span>✓ AI vs AI</span>
            <span>✓ Human vs AI</span>
            <span>✓ Multiple scenarios</span>
        </div>

    </div>
    """)

    st.markdown(
        card,
        unsafe_allow_html=True
    )

    if st.button(
        "🚀 Start Negotiation",
        width="stretch",
        key="start_negotiation"
    ):
        st.switch_page(
            "pages/Home.py"
        )


# ============================================================
# SUPPORTED SCENARIOS
# ============================================================

with quick2:

    card = dedent("""
    <div class="dashboard-card large-card">

        <div class="mode-icon mode-icon-blue">
            ◈
        </div>

        <div class="dashboard-card-title">
            Supported Scenarios
        </div>

        <div class="dashboard-card-subtitle">
            Explore realistic negotiation situations
            designed for different business environments.
        </div>

        <div class="scenario-list">

            <div>
                <span>🛒</span>
                Buyer vs Supplier
            </div>

            <div>
                <span>💼</span>
                HR vs Candidate
            </div>

            <div>
                <span>💰</span>
                Project Budget Allocation
            </div>

            <div>
                <span>⚙️</span>
                Custom Negotiation
            </div>

        </div>

    </div>
    """)

    st.markdown(
        card,
        unsafe_allow_html=True
    )


# ============================================================
# PLATFORM OVERVIEW
# ============================================================

st.markdown(
    '<div class="section-title">Platform Overview</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="section-description">'
    'Your AI-powered negotiation environment at a glance.'
    '</div>',
    unsafe_allow_html=True
)


c1, c2, c3, c4 = st.columns(
    4,
    gap="medium"
)


# ============================================================
# METRIC 1
# ============================================================

with c1:

    st.markdown(
        dedent("""
        <div class="metric-card">

            <div class="metric-icon purple">
                🤝
            </div>

            <div class="metric-label">
                Negotiations
            </div>

            <div class="metric-value">
                0
            </div>

            <div class="metric-caption">
                Total sessions
            </div>

        </div>
        """),
        unsafe_allow_html=True
    )


# ============================================================
# METRIC 2
# ============================================================

with c2:

    st.markdown(
        dedent("""
        <div class="metric-card">

            <div class="metric-icon green">
                ✓
            </div>

            <div class="metric-label">
                Agreements
            </div>

            <div class="metric-value">
                0
            </div>

            <div class="metric-caption">
                Successful outcomes
            </div>

        </div>
        """),
        unsafe_allow_html=True
    )


# ============================================================
# METRIC 3
# ============================================================

with c3:

    st.markdown(
        dedent("""
        <div class="metric-card">

            <div class="metric-icon blue">
                🤖
            </div>

            <div class="metric-label">
                AI Agents
            </div>

            <div class="metric-value">
                0
            </div>

            <div class="metric-caption">
                Active participants
            </div>

        </div>
        """),
        unsafe_allow_html=True
    )


# ============================================================
# METRIC 4
# ============================================================

with c4:

    st.markdown(
        dedent("""
        <div class="metric-card">

            <div class="metric-icon orange">
                📄
            </div>

            <div class="metric-label">
                Reports
            </div>

            <div class="metric-value">
                0
            </div>

            <div class="metric-caption">
                Generated reports
            </div>

        </div>
        """),
        unsafe_allow_html=True
    )


# ============================================================
# HOW IT WORKS
# ============================================================

st.markdown(
    '<div class="section-title">How It Works</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="section-description">'
    'A simple workflow from scenario selection to negotiation analysis.'
    '</div>',
    unsafe_allow_html=True
)


h1, h2, h3 = st.columns(
    3,
    gap="medium"
)


with h1:

    st.markdown(
        dedent("""
        <div class="dashboard-card">

            <div class="step-number">
                01
            </div>

            <div class="dashboard-card-title">
                Configure
            </div>

            <div class="dashboard-card-subtitle">
                Select a scenario, negotiation mode,
                agent roles, strategies, and negotiation
                parameters.
            </div>

        </div>
        """),
        unsafe_allow_html=True
    )


with h2:

    st.markdown(
        dedent("""
        <div class="dashboard-card">

            <div class="step-number">
                02
            </div>

            <div class="dashboard-card-title">
                Negotiate
            </div>

            <div class="dashboard-card-subtitle">
                Let AI agents negotiate autonomously or
                participate directly in a human-versus-AI
                negotiation.
            </div>

        </div>
        """),
        unsafe_allow_html=True
    )


with h3:

    st.markdown(
        dedent("""
        <div class="dashboard-card">

            <div class="step-number">
                03
            </div>

            <div class="dashboard-card-title">
                Analyze
            </div>

            <div class="dashboard-card-subtitle">
                Review negotiation outcomes, scores,
                performance metrics, and generate detailed
                reports.
            </div>

        </div>
        """),
        unsafe_allow_html=True
    )


# ============================================================
# ABOUT
# ============================================================

st.markdown(
    '<div class="section-title">About the Platform</div>',
    unsafe_allow_html=True
)


about = dedent("""
<div class="about-card">

    <div class="about-icon">
        ✦
    </div>

    <div>

        <div class="about-title">
            Multi-Agent Negotiation Simulator
        </div>

        <div class="about-description">
            An AI-powered platform that enables multiple
            intelligent agents to negotiate under realistic
            business scenarios.
        </div>

        <div class="tech-stack">

            <span>Streamlit Frontend</span>
            <span>FastAPI Backend</span>
            <span>AI Agents</span>
            <span>Gemini LLM</span>
            <span>Database</span>

        </div>

    </div>

</div>
""")

st.markdown(
    about,
    unsafe_allow_html=True
)


# ============================================================
# FOOTER
# ============================================================

st.markdown(
    dedent("""
    <div class="footer">

        © 2026 Multi-Agent Negotiation Simulator
        <span>•</span>
        AI-powered negotiation platform

    </div>
    """),
    unsafe_allow_html=True
)