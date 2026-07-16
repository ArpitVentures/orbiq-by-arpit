import { FaEdit, FaTrash } from "react-icons/fa";

function TaskItem({ task, openEditModal, removeTask }) {

    const formatTaskDueDate = (rawDate) => {
        if (!rawDate) return "No due date";

        const parsedDate = new Date(rawDate);

        if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() === 1970 || parsedDate.getFullYear() > 2100) {
            return "Invalid Date";
        }

        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const formatCreatedDate = (rawCreatedDate) => {
        if (!rawCreatedDate) return "";
        const dateObj = new Date(rawCreatedDate);
        if (isNaN(dateObj.getTime())) return "";

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    };

    return (
        <div className={`task-item priority-${task.priority?.toLowerCase()}`}
             style={{ position: "relative", padding: "16px", borderRadius: "12px" }}>

            <div className="task-due-date-top-right" style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "500"
            }}>
                Due: {formatTaskDueDate(task.dueDate)}
            </div>

            <div className="task-item-header" style={{ marginBottom: "12px" }}>
                <h4 style={{ margin: "0 0 8px 0", paddingRight: "100px", fontSize: "18px", fontWeight: "600" }}>
                    {task.title}</h4>

                <div style={{ display: "inline-block", marginTop: "2px" }}>
                    <span
                        className={`priority-badge ${task.priority?.toLowerCase()}`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px 16px",
                            borderRadius: "50px",
                            fontSize: "12px",
                            fontWeight: "600",
                            letterSpacing: "0.3px",
                            opacity: 0.85,
                            border: "1px solid rgba(245, 158, 11, 0.3)"
                        }}
                    >
                        {task.priority}
                    </span>
                </div>
            </div>

            {task.description && (
                <p className="task-description" style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 14px 0" }}>
                    {task.description}</p>
            )}

            <div className="task-item-footer" style={{ marginTop: "16px" }}>

                <div className="task-created-date-row" style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "#64748b",
                    opacity: 0.55,
                    marginBottom: "14px",
                    letterSpacing: "0.1px"
                }}>
                    Created date: {formatCreatedDate(task.createdAt || task.date || new Date())}
                </div>

                <div className="task-item-actions" style={{ display: "flex", gap: "10px" }}>
                    <button
                        className="edit-btn"
                        onClick={() => openEditModal(task)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                    >
                        <FaEdit style={{ fontSize: "12px" }} /> Edit
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => removeTask(task._id || task.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                    >
                        <FaTrash style={{ fontSize: "12px" }} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskItem;