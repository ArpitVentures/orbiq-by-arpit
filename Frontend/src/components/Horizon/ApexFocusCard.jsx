import React from "react";
import {
    BrainCircuit,
    Flag,
    Clock3,
    ArrowRight,
    Target,
    CheckCircle2
} from "lucide-react";
import "./ApexFocusCard.css";

function ApexFocusCard({ task = null, onBegin }) {

    const hasTask = Boolean(task);

    const currentTask = {
        title: task?.title || "Define your next mission",
        description:
            task?.description ||
            "Create a mission so P.U.L.S.A.R. can establish a focused execution path.",
        priority: String(task?.priority || "HIGH").toUpperCase(),
        estimate: task?.estimatedTime || task?.duration || "—",
        progress: Number(task?.progress) || 0,
        reason:
            task?.reason ||
            "P.U.L.S.A.R. needs an active mission to determine your most valuable next action."
    };

    const handleBegin = () => {
        if (onBegin && hasTask) {
            onBegin(currentTask);
        }
    };

    return (
        <section className="apex-focus-card">

            <div className="focus-card-main">

                <div className="focus-card-icon">
                    <Target size={22} />
                </div>

                <div className="focus-card-content">

                    <div className="focus-card-label">
                        <BrainCircuit size={14} />
                        P.U.L.S.A.R. RECOMMENDED FOCUS
                    </div>

                    <h3>{currentTask.title}</h3>

                    <p className="focus-description">
                        {currentTask.description}
                    </p>

                    <div className="focus-meta">

                        <span className={`focus-priority priority-${currentTask.priority.toLowerCase()}`}>
                            <Flag size={12} />
                            {currentTask.priority}
                        </span>

                        <span>
                            <Clock3 size={13} />
                            {currentTask.estimate}
                        </span>

                        <span>
                            <CheckCircle2 size={13} />
                            {currentTask.progress}% complete
                        </span>

                    </div>

                </div>

                <div className="focus-action">

                    <span className="focus-reason">
                        {currentTask.reason}
                    </span>

                    <button
                        type="button"
                        className="begin-mission-btn"
                        onClick={handleBegin}
                        disabled={!hasTask}
                    >
                        {hasTask ? "Begin Mission" : "Awaiting Mission"}
                        <ArrowRight size={16} />
                    </button>

                </div>

            </div>

            <div className="focus-progress-track">
                <div
                    className="focus-progress-fill"
                    style={{
                        width: `${Math.min(
                            Math.max(currentTask.progress, 0),
                            100
                        )}%`
                    }}
                />
            </div>

        </section>
    );
}

export default ApexFocusCard;