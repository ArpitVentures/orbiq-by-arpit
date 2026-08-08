import React from "react";
import {
    Zap,
    Clock3,
    CheckCircle2,
    PauseCircle,
    Plus,
    ArrowUpRight,
    Sparkles
} from "lucide-react";
import "./ApexAutomation.css";

function ApexAutomation({ statsData }) {
    const totalTasks = statsData?.totalTasks || 0;
    const pendingTasks = statsData?.pendingTasks || 0;

    const automations = [
        {
            icon: Clock3,
            title: "Deadline Watch",
            description:
                "P.U.L.S.A.R. can monitor approaching deadlines and surface missions that need attention.",
            status: "READY",
            tone: "cyan"
        },
        {
            icon: Zap,
            title: "Priority Shift",
            description:
                "Automatically re-evaluate task priority when workload, urgency or workspace signals change.",
            status: "SUGGESTED",
            tone: "purple"
        },
        {
            icon: CheckCircle2,
            title: "Completion Flow",
            description:
                "Use completed missions as signals to continuously refine your recommended execution sequence.",
            status: "CONTEXTUAL",
            tone: "green"
        }
    ];

    return (
        <section className="apex-automation">

            <div className="automation-header">
                <div className="automation-title-group">
                    <div className="automation-icon">
                        <Zap size={22} />
                    </div>

                    <div>
                        <span className="automation-eyebrow">
                            P.U.L.S.A.R. AUTOMATION
                        </span>

                        <h2>Workflow Automation</h2>

                        <p>
                            Turn workspace signals into intelligent actions.
                        </p>
                    </div>
                </div>

                <div className="automation-status">
                    <span className="status-dot"></span>
                    ENGINE READY
                </div>
            </div>

            <div className="automation-summary">

                <div className="automation-summary-item">
                    <span>ACTIVE MISSIONS</span>
                    <strong>{pendingTasks}</strong>
                </div>

                <div className="automation-summary-item">
                    <span>WORKSPACE TASKS</span>
                    <strong>{totalTasks}</strong>
                </div>

                <div className="automation-summary-item highlight">
                    <span>AUTOMATION STATE</span>
                    <strong>READY</strong>
                </div>

            </div>

            <div className="automation-section-label">
                <Sparkles size={15} />
                INTELLIGENT WORKFLOWS
            </div>

            <div className="automation-list">

                {automations.map((automation, index) => {
                    const Icon = automation.icon;

                    return (
                        <div
                            className={`automation-card ${automation.tone}`}
                            key={index}
                        >
                            <div className="automation-card-icon">
                                <Icon size={19} />
                            </div>

                            <div className="automation-card-content">
                                <div className="automation-card-top">
                                    <h3>{automation.title}</h3>

                                    <span className="automation-badge">
                                        {automation.status}
                                    </span>
                                </div>

                                <p>{automation.description}</p>
                            </div>

                            <button
                                className="automation-action"
                                type="button"
                                title="Configure automation"
                            >
                                <ArrowUpRight size={17} />
                            </button>
                        </div>
                    );
                })}

            </div>

            <div className="automation-footer">

                <div className="automation-footer-copy">
                    <span className="footer-indicator">
                        <PauseCircle size={15} />
                    </span>

                    <div>
                        <strong>Automation awaits your workspace signals.</strong>
                        <p>
                            P.U.L.S.A.R. will become more precise as your
                            workspace develops a stronger context history.
                        </p>
                    </div>
                </div>

                <button
                    className="create-automation-btn"
                    type="button"
                >
                    <Plus size={16} />
                    Create Automation
                </button>

            </div>

        </section>
    );
}

export default ApexAutomation;