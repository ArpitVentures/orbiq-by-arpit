import React, { useMemo } from "react";
import {
    BrainCircuit,
    CalendarClock,
    CheckCircle2,
    Clock3,
    Flag,
    ArrowRight,
    Sparkles,
    Zap
} from "lucide-react";
import "./ApexPlanner.css";

function ApexPlanner({ tasks = [] }) {

    const plannerTasks = useMemo(() => {
        if (!Array.isArray(tasks) || tasks.length === 0) {
            return [
                {
                    id: "placeholder-1",
                    title: "No active missions detected",
                    priority: "LOW",
                    status: "WAITING",
                    estimate: "—",
                    description: "Create a task to let P.U.L.S.A.R. build an execution sequence."
                }
            ];
        }

        return tasks.slice(0, 5).map((task, index) => ({
            id: task._id || task.id || index,
            title: task.title || task.name || "Untitled Mission",
            priority: String(task.priority || "MEDIUM").toUpperCase(),
            status: String(task.status || "PENDING").toUpperCase(),
            estimate: task.estimatedTime || task.duration || "—",
            description:
                task.description ||
                "P.U.L.S.A.R. will evaluate this mission against your current workspace context."
        }));
    }, [tasks]);

    const activeTasks = plannerTasks.filter(
        (task) => task.status !== "COMPLETED"
    );

    return (
        <section className="apex-planner">

            {/* Header */}
            <div className="apex-planner-header">
                <div className="apex-planner-title-group">
                    <div className="apex-planner-icon">
                        <BrainCircuit size={22} />
                    </div>

                    <div>
                        <span className="apex-section-eyebrow">
                            P.U.L.S.A.R. PLANNING LAYER
                        </span>

                        <h2>Strategic Planner</h2>

                        <p>
                            Turn workspace context into a clear execution sequence.
                        </p>
                    </div>
                </div>

                <div className="apex-planner-status">
                    <span className="apex-status-dot"></span>
                    CONTEXT READY
                </div>
            </div>

            {/* Intelligence Summary */}
            <div className="apex-planner-summary">

                <div className="planner-summary-card">
                    <Sparkles size={18} />
                    <div>
                        <span>PLANNING MODE</span>
                        <strong>Adaptive</strong>
                    </div>
                </div>

                <div className="planner-summary-card">
                    <CalendarClock size={18} />
                    <div>
                        <span>ACTIVE MISSIONS</span>
                        <strong>{activeTasks.length}</strong>
                    </div>
                </div>

                <div className="planner-summary-card">
                    <Zap size={18} />
                    <div>
                        <span>RECOMMENDATION</span>
                        <strong>Priority First</strong>
                    </div>
                </div>

            </div>

            {/* AI Recommendation */}
            <div className="apex-planner-recommendation">

                <div className="recommendation-icon">
                    <BrainCircuit size={20} />
                </div>

                <div className="recommendation-content">
                    <span className="recommendation-label">
                        P.U.L.S.A.R. RECOMMENDATION
                    </span>

                    <h3>
                        Start with the mission carrying the highest urgency.
                    </h3>

                    <p>
                        Your execution sequence will continuously adapt as task
                        activity, deadlines and workspace signals change.
                    </p>
                </div>

                <div className="recommendation-badge">
                    ADAPTIVE
                </div>

            </div>

            {/* Execution Sequence */}
            <div className="apex-sequence-header">
                <div>
                    <span className="apex-section-eyebrow">
                        EXECUTION VECTOR
                    </span>

                    <h3>Recommended Sequence</h3>
                </div>

                <span className="sequence-count">
                    {activeTasks.length} MISSIONS
                </span>
            </div>

            <div className="apex-task-sequence">

                {plannerTasks.map((task, index) => {

                    const isPlaceholder = task.id === "placeholder-1";

                    return (
                        <div
                            className={`planner-task ${isPlaceholder ? "placeholder-task" : ""}`}
                            key={task.id}
                        >

                            <div className="task-order">
                                <span>{String(index + 1).padStart(2, "0")}</span>
                            </div>

                            <div className="task-main">

                                <div className="task-title-row">
                                    <h4>{task.title}</h4>

                                    <span
                                        className={`priority-badge priority-${task.priority.toLowerCase()}`}
                                    >
                                        <Flag size={12} />
                                        {task.priority}
                                    </span>
                                </div>

                                <p>{task.description}</p>

                                <div className="task-meta">

                                    <span>
                                        <Clock3 size={13} />
                                        {task.estimate}
                                    </span>

                                    <span>
                                        <CheckCircle2 size={13} />
                                        {task.status}
                                    </span>

                                </div>
                            </div>

                            {!isPlaceholder && (
                                <button
                                    className="planner-action"
                                    type="button"
                                    aria-label={`Open ${task.title}`}
                                >
                                    <ArrowRight size={17} />
                                </button>
                            )}

                        </div>
                    );
                })}

            </div>

            {/* Footer */}
            <div className="apex-planner-footer">
                <div>
                    <span className="footer-pulse"></span>
                    P.U.L.S.A.R. will refine this plan from live workspace signals.
                </div>

                <span className="footer-engine">
                    INTELLIGENCE ENGINE ACTIVE
                </span>
            </div>

        </section>
    );
}

export default ApexPlanner;