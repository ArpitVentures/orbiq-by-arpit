import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./../styles/TaskBoard.css";

function TaskBoard({ tasks, openEditModal, removeTask }) {
    const columns = ["To Do", "In Progress", "Completed"];

    const computeDueDateMeta = (dueDateString, taskStatus) => {
        if (!dueDateString) return { text: "No Due Date", color: "#64748b" };
        if (taskStatus === "Completed") return { text: "Completed ✓", color: "#22c55e" };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(dueDateString);
        taskDate.setHours(0, 0, 0, 0);

        if (taskDate.getTime() === today.getTime()) {
            return { text: "Today 🟠", color: "#f97316" };
        } else if (taskDate < today) {
            return { text: "Overdue 🔴", color: "#ef4444" };
        } else {
            const formatted = new Date(dueDateString).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short"
            });
            return { text: `${formatted} 🟢`, color: "#22c55e" };
        }
    };

    const getPriorityStyles = (priority) => {
        const p = String(priority).toLowerCase();
        if (p === "high") {
            return { backgroundColor: "rgba(255, 70, 70, 0.15)", borderColor: "#ff5a5a", color: "#ff5a5a" };
        }
        if (p === "low") {
            return { backgroundColor: "rgba(34, 197, 94, 0.15)", borderColor: "#22c55e", color: "#22c55e" };
        }
        return { backgroundColor: "rgba(245, 158, 11, 0.15)", borderColor: "#f59e0b", color: "#f59e0b" };
    };

    return (
        <div className="task-board-wrapper" style={{ padding: "8px 0" }}>

            <div className="board-header-row" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "28px", fontWeight: "800", margin: 0 }}>Task Board</h2>
                <span className="global-counter-pill" style={{ background: "#1e293b", padding: "4px 12px", borderRadius: "999px", fontSize: "14px", color: "#94a3b8", fontWeight: "600" }}>
                    {tasks.length} Active Tasks
                </span>

                <span className="scroll-hint-label" style={{ marginLeft: "auto", fontSize: "12px", color: "#475569" }}>
                    {window.innerWidth <= 768 ? "← Scroll horizontally to view columns →" : ""}
                </span>
            </div>

            <div className="kanban-grid-container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                {columns.map((col) => {
                    const columnTasks = tasks.filter((t) => t.status === col);

                    return (
                        <div key={col} className={`kanban-column column-tier-${col.toLowerCase().replace(" ", "-")}`} style={{ background: "#0b0f19", borderRadius: "18px", padding: "18px", minHeight: "550px", border: "1px solid rgba(255,255,255,0.02)" }}>

                            <div className="column-title-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: 0 }}>{col}</h3>
                                <span style={{ background: "rgba(255,255,255,0.06)", padding: "2px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>{columnTasks.length}</span>
                            </div>

                            <div className="tasks-card-vertical-stack" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                {columnTasks.length > 0 ? (
                                    columnTasks.map((task) => {
                                        const dueMeta = computeDueDateMeta(task.dueDate, task.status);
                                        const priStyles = getPriorityStyles(task.priority);

                                        return (
                                            <div key={task._id} className="kanban-task-card" style={{
                                                background: "#121826",
                                                border: "1px solid rgba(255, 255, 255, 0.04)",
                                                borderRadius: "14px",
                                                padding: "16px",
                                                minHeight: "135px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between"
                                            }}>
                                                <div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                                                        <h4 style={{ color: "#fff", fontSize: "15px", fontWeight: "600", margin: 0, lineHeight: "1.4" }}>{task.title}</h4>
                                                    </div>

                                                    <p style={{
                                                        fontSize: "13px",
                                                        color: "#64748b",
                                                        margin: "8px 0 0 0",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        lineHeight: "1.5"
                                                    }}>
                                                        {task.description || "No supplemental details provided."}
                                                    </p>
                                                </div>

                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
                                                    <span style={{
                                                        fontSize: "11px",
                                                        fontWeight: "700",
                                                        padding: "3px 8px",
                                                        borderRadius: "6px",
                                                        border: "1px solid",
                                                        ...priStyles
                                                    }}>
                                                        {task.priority}
                                                    </span>

                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        <span style={{ fontSize: "12px", color: dueMeta.color, fontWeight: "600" }}>
                                                            {dueMeta.text}
                                                        </span>
                                                        <div style={{ display: "flex", gap: "8px", borderLeft: "1px solid #1e293b", paddingLeft: "8px" }}>
                                                            <button onClick={() => openEditModal(task)} style={{ background: "none", border: "none", color: "#06b6d4", cursor: "pointer", padding: "2px" }}><FaEdit size={14} /></button>
                                                            <button onClick={() => removeTask(task._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px" }}><FaTrash size={14} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (

                                    <div className="empty-column-placeholder" style={{
                                        border: "2px dashed rgba(255, 255, 255, 0.03)",
                                        borderRadius: "14px",
                                        padding: "40px 16px",
                                        textAlign: "center",
                                        color: "#475569"
                                    }}>
                                        <p style={{ fontSize: "13px", margin: 0, fontWeight: "500", letterSpacing: "0.1px" }}>
                                            {col === "Completed" ? "Drop completed tasks here 🎉" : `No tasks in ${col} yet`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TaskBoard;