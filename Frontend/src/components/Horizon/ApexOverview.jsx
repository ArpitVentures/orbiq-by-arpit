import React, { useMemo } from "react";
import {
    Brain,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Flag,
    Lightbulb,
    Sparkles,
    Target,
    TrendingUp,
    Zap
} from "lucide-react";
import "./ApexOverview.css";

function ApexOverview({ user, statsData }) {
    const storedUser = useMemo(() => {
        try {
            return JSON.parse(sessionStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    }, []);

    const currentUser = user || storedUser;

    const userName =
        currentUser?.name ||
        currentUser?.fullName ||
        currentUser?.username ||
        "Commander";

    const totalTasks = Number(statsData?.totalTasks || 0);
    const completedTasks = Number(statsData?.completedTasks || 0);
    const pendingTasks = Number(statsData?.pendingTasks || 0);

    const productivity = parseInt(
        statsData?.productivity || "0",
        10
    ) || 0;

    const completionRate =
        totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

    const greetingContext =
        pendingTasks === 0
            ? "All active missions are currently clear."
            : pendingTasks === 1
                ? "One active mission requires your attention."
                : `${pendingTasks} active missions are currently competing for your attention.`;

    const intelligenceMessage =
        productivity >= 80
            ? "Your workspace velocity is strong. P.U.L.S.A.R. recommends maintaining the current execution rhythm."
            : productivity >= 50
                ? "Your execution rhythm is stable. Prioritize the highest-impact pending mission before starting new work."
                : pendingTasks > 0
                    ? "Your current workload needs attention. P.U.L.S.A.R. recommends reducing pending missions before expanding your workload."
                    : "Workspace telemetry is still gathering enough context to generate a stronger recommendation.";

    return (
        <section className="apex-overview">

            <div className="apex-mission-brief">
                <div className="mission-brief-glow"></div>

                <div className="mission-brief-content">
                    <div className="section-eyebrow pulsar-brand">
                        <Sparkles size={14} />
                        P.U.L.S.A.R. INTELLIGENCE BRIEF
                    </div>

                    <h1>
                        Your workspace,
                        <span> understood.</span>
                    </h1>

                    <p>
                        Good evening, {userName}. {greetingContext}
                        {" "}P.U.L.S.A.R. is continuously interpreting
                        your workspace signals to help you decide what
                        deserves attention next.
                    </p>
                </div>

                <div className="mission-brief-status">
                    <div className="brief-status-dot"></div>

                    <div>
                        <span>CONTEXT STATUS</span>
                        <strong>ACTIVE</strong>
                    </div>
                </div>
            </div>

            <div className="apex-section-heading">
                <div>
                    <span className="section-eyebrow">
                        <Brain size={14} />
                        INTELLIGENCE SNAPSHOT
                    </span>

                    <h2>Workspace Signals</h2>
                </div>

                <span className="live-context">
                    <span></span>
                    LIVE CONTEXT
                </span>
            </div>

            <div className="apex-signal-grid">
                <div className="apex-signal-card signal-primary">
                    <div className="signal-icon">
                        <Target size={20} />
                    </div>

                    <div className="signal-content">
                        <span className="signal-label">Active Missions</span>
                        <strong>{pendingTasks}</strong>
                        <small>Pending execution</small>
                    </div>

                    <div className="signal-decoration">
                        <Target size={52} />
                    </div>
                </div>

                <div className="apex-signal-card">
                    <div className="signal-icon cyan">
                        <CheckCircle2 size={20} />
                    </div>

                    <div className="signal-content">
                        <span className="signal-label">Mission Completion</span>
                        <strong>{completionRate}%</strong>
                        <small>{completedTasks} of {totalTasks} completed</small>
                    </div>
                </div>

                <div className="apex-signal-card">
                    <div className="signal-icon purple">
                        <TrendingUp size={20} />
                    </div>

                    <div className="signal-content">
                        <span className="signal-label">Workspace Velocity</span>
                        <strong>{productivity}%</strong>
                        <small>Current productivity signal</small>
                    </div>
                </div>

                <div className="apex-signal-card">
                    <div className="signal-icon orange">
                        <Clock3 size={20} />
                    </div>

                    <div className="signal-content">
                        <span className="signal-label">Execution State</span>
                        <strong>{pendingTasks > 0 ? "ACTIVE" : "CLEAR"}</strong>
                        <small>Current workspace state</small>
                    </div>
                </div>
            </div>

            <div className="apex-intelligence-panel">
                <div className="intelligence-panel-header">
                    <div className="intelligence-title pulsar-brand">
                        <div className="intelligence-icon">
                            <Brain size={21} />
                        </div>

                        <div>
                            <span>P.U.L.S.A.R.</span>
                            <h3>Current Recommendation</h3>
                        </div>
                    </div>

                    <div className="intelligence-live">
                        <span></span>
                        ANALYZING
                    </div>
                </div>

                <div className="intelligence-body">
                    <div className="recommendation-symbol">
                        <Lightbulb size={25} />
                    </div>

                    <div className="recommendation-content">
                        <span className="recommendation-label">WORKSPACE INSIGHT</span>
                        <p>{intelligenceMessage}</p>
                    </div>
                </div>
            </div>

            <div className="apex-section-heading mission-heading">
                <div>
                    <span className="section-eyebrow">
                        <Flag size={14} />
                        MISSION VECTOR
                    </span>

                    <h2>Today's Focus</h2>
                </div>

                <button className="apex-secondary-action">
                    <CalendarDays size={15} />
                    View Schedule
                </button>
            </div>

            <div className="apex-focus-panel">
                <div className="focus-main">
                    <div className="focus-icon">
                        <Zap size={22} />
                    </div>

                    <div>
                        <span className="focus-label">RECOMMENDED NEXT ACTION</span>

                        <h3>
                            {pendingTasks > 0
                                ? "Focus on your highest-priority pending mission."
                                : "Define your next mission to give P.U.L.S.A.R. more context."
                            }
                        </h3>

                        <p>
                            HORIZON will use your task activity, completion
                            patterns and workspace signals to continuously
                            refine this recommendation.
                        </p>
                    </div>
                </div>

                <div className="focus-score">
                    <span>EXECUTION</span>
                    <strong>{completionRate}%</strong>

                    <div className="focus-progress">
                        <div style={{ width: `${completionRate}%` }} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ApexOverview;