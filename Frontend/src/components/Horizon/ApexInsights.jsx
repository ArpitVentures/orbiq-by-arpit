import React from "react";
import {
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    BrainCircuit,
    ArrowUpRight
} from "lucide-react";
import "./ApexInsights.css";

function ApexInsights({ insights = [] }) {

    const defaultInsights = [
        {
            type: "pattern",
            title: "Workspace Pattern",
            text: "P.U.L.S.A.R. is waiting for more activity before identifying a reliable execution pattern.",
            icon: <BrainCircuit size={18} />
        },
        {
            type: "signal",
            title: "Productivity Signal",
            text: "Your current workspace does not contain enough historical activity to establish a strong trend.",
            icon: <TrendingUp size={18} />
        },
        {
            type: "attention",
            title: "Attention Required",
            text: "Create and interact with missions to give P.U.L.S.A.R. meaningful context.",
            icon: <AlertTriangle size={18} />
        }
    ];

    const activeInsights =
        Array.isArray(insights) && insights.length > 0
            ? insights
            : defaultInsights;

    return (
        <section className="apex-insights">

            <div className="apex-insights-header">

                <div className="insights-title-group">

                    <div className="insights-icon">
                        <Lightbulb size={21} />
                    </div>

                    <div>
                        <span className="apex-insights-eyebrow">
                            P.U.L.S.A.R. INTERPRETATION
                        </span>

                        <h2>Workspace Insights</h2>

                        <p>
                            Signals interpreted from your workspace activity.
                        </p>
                    </div>

                </div>

                <span className="insights-status">
                    <span></span>
                    LIVE ANALYSIS
                </span>

            </div>

            <div className="insights-grid">

                {activeInsights.map((insight, index) => (

                    <article
                        className={`insight-item insight-${insight.type || "pattern"}`}
                        key={insight.id || index}
                    >

                        <div className="insight-item-icon">
                            {insight.icon || <Lightbulb size={17} />}
                        </div>

                        <div className="insight-item-content">

                            <span className="insight-type">
                                {insight.type === "attention"
                                    ? "ATTENTION SIGNAL"
                                    : insight.type === "signal"
                                        ? "BEHAVIORAL SIGNAL"
                                        : "WORKSPACE PATTERN"}
                            </span>

                            <h3>{insight.title}</h3>

                            <p>{insight.text}</p>

                        </div>

                        <ArrowUpRight
                            className="insight-arrow"
                            size={16}
                        />

                    </article>

                ))}

            </div>

            <div className="insights-footer">
                <span className="insight-pulse"></span>

                <span>
                    Insights evolve as P.U.L.S.A.R. receives new workspace signals.
                </span>

                <span className="insight-engine">
                    CONTEXT AWARE
                </span>
            </div>

        </section>
    );
}

export default ApexInsights;