import "./Activity.css";
import { CheckCircle2, PlusCircle } from "lucide-react";

function Activity({ tasks = [] }) {
    if (!tasks || tasks.length === 0) {
        return (
            <section className="activity-card">
                <div className="activity-header">
                    <div>
                        <p className="activity-label">WORKSPACE</p>
                        <h2>Mission Log</h2>
                    </div>
                </div>

                <div className="empty-activity-log" style={{ padding: "24px 0", color: "#64748b", fontSize: "13px" }}>
                    🛰️ Mission log initialized. No active orbital history recorded yet.
                </div>
            </section>
        );
    }

    return (
        <section className="activity-card">
            <div className="activity-header">
                <div>
                    <p className="activity-label">WORKSPACE</p>
                    <h2>Mission Log</h2>
                </div>
            </div>

            <div className="activity-list">
                {tasks.slice(0, 5).map((task, index) => (
                    <div className="activity-item" key={task._id || index}>
                        <div
                            className="activity-icon"
                            style={{
                                background: task.status === "Completed" ? "rgba(34, 197, 94, 0.12)" : "rgba(56, 189, 248, 0.12)",
                                color: task.status === "Completed" ? "#22c55e" : "#38bdf8"
                            }}
                        >
                            {task.status === "Completed" ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
                        </div>

                        <div className="activity-content">
                            <h4>{task.title}</h4>
                            <span>{task.status || "Pending"}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Activity;