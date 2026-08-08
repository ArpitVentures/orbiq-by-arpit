import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Sparkles, Brain, Cpu, LineChart, Zap, CheckCircle2 } from "lucide-react";
import SpaceBackgroundCanvas from "../components/SpaceBackgroundCanvas";
import "../styles/Horizon.css";

function HorizonAccess({ user }) {
    const navigate = useNavigate();

    const storedUser = user || JSON.parse(localStorage.getItem("user") || "{}");

    const userPlan = String(
        storedUser?.plan || storedUser?.tier || "Free"
    ).trim().toLowerCase();

    const isGoldUser = userPlan === "gold" || userPlan === "pro";

    const goldFeatures = [
        {
            icon: <Brain size={20} color="#fbbf24" />,
            title: "AI Mission Planner",
            desc: "Automatically builds an optimized execution plan for your day."
        },
        {
            icon: <Cpu size={20} color="#22d3ee" />,
            title: "Priority Intelligence",
            desc: "Continuously prioritizes tasks based on deadlines and workload."
        },
        {
            icon: <LineChart size={20} color="#a855f7" />,
            title: "Predictive Insights",
            desc: "Predicts project progress and delivery timelines."
        },
        {
            icon: <Zap size={20} color="#f43f5e" />,
            title: "Workflow Automation",
            desc: "Automates repetitive workflows and task dependencies."
        }
    ];

    return (
        <div className="horizon-page-container">
            <SpaceBackgroundCanvas />
            <div className="horizon-ambient-glow left-glow" />
            <div className="horizon-ambient-glow right-purple-glow" />
            <div className="horizon-bottom-wave-grid" />

            <div className="horizon-top-bar">
                <button className="horizon-back-btn" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={16} /> Return to Dashboard
                </button>
                <div className="horizon-brand-wrapper">
                    <div className="horizon-brand-tag">
                        <Sparkles size={13} color="#fbbf24" /> APEX Intelligence Layer
                    </div>
                    <span className="horizon-build-tag">Powered by HORIZON Intelligence Engine</span>
                </div>
            </div>

            <div className="horizon-split-layout">
                <div className="horizon-left-pane">
                    <div className="gold-clearance-pill">
                        <Lock size={12} color="#fbbf24" />
                        <span>APEX • GOLD MEMBERS</span>
                    </div>

                    <h1 className="horizon-hero-title">
                        Meet APEX. <br />
                        <span className="gold-text-gradient">Your Intelligent Workspace.</span>
                    </h1>

                    <p className="horizon-hero-desc">
                        APEX is ORBIQ's intelligent workspace layer that plans, prioritizes
                        and automates your work in real time—powered by the HORIZON
                        Intelligence Engine.
                    </p>

                    <div className="features-preview-grid">
                        {goldFeatures.map((feat, idx) => (
                            <div key={idx} className="feature-preview-card">
                                <div className="feature-icon-wrapper">
                                    {feat.icon}
                                </div>
                                <div>
                                    <h4>{feat.title}</h4>
                                    <p>{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="horizon-right-pane">
                    <div className="horizon-access-card">
                        <div className="enterprise-online-badge">
                            <span className="live-status-dot"></span>
                            <span>● SYSTEM ONLINE</span>
                        </div>

                        {isGoldUser ? (
                            <>
                                <div className="card-lock-badge" style={{ background: "rgba(34, 197, 94, 0.1)", borderColor: "rgba(34, 197, 94, 0.3)" }}>
                                    <CheckCircle2 size={28} color="#22c55e" />
                                </div>

                                <span className="card-clearance-label" style={{ color: "#22c55e", background: "rgba(34, 197, 94, 0.1)" }}>
                                    Gold Membership Verified
                                </span>

                                <h2>Welcome to APEX</h2>
                                <p className="member-tagline">
                                    Gold Membership Verified
                                </p>

                                <p className="card-subtitle">
                                    Your Gold Tier clearance level is active. Initializing HORIZON AI Workspace engine...
                                </p>

                                <div className="rank-status-box">
                                    <span className="clearance-key">CLEARANCE LEVEL</span>
                                    <span className="rank-badge-free" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", borderColor: "rgba(34, 197, 94, 0.3)" }}>
                                        GOLD TIER
                                    </span>
                                </div>

                                <button className="upgrade-gold-btn" onClick={() => navigate("/horizon/workspace")}>
                                    Launch APEX →
                                </button>

                                <p className="tiny-disclaimer">
                                    Powered by HORIZON Intelligence Engine
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="card-lock-badge">
                                    <Lock size={26} color="#ef4444" />
                                </div>

                                <span className="card-clearance-label">CLEARANCE REQUIRED</span>

                                <h2>Upgrade Required</h2>

                                <p className="card-subtitle">
                                    APEX is currently available exclusively for Gold members.
                                    Upgrade your workspace to unlock intelligent planning,
                                    workflow automation and predictive insights.
                                </p>

                                <div className="rank-status-box">
                                    <span className="clearance-key">CLEARANCE LEVEL</span>
                                    <span className="rank-badge-free">FREE</span>
                                </div>

                                <button className="upgrade-gold-btn" onClick={() => navigate("/pricing")}>
                                    Unlock APEX →
                                </button>

                                <p className="tiny-disclaimer">
                                    Unlock AI-powered planning, predictive telemetry and autonomous workflows.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HorizonAccess;