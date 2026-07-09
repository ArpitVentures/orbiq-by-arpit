import { FaFlag, FaEdit, FaTrash } from "react-icons/fa";

function TaskItem({ task, openEditModal, removeTask }) {

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        const taskId = task._id || task.id;
        removeTask(taskId);
    };

    const formatCreatedDate = () => {
        if (!task.createdAt) return "Added recently";

        const dateObj = new Date(task.createdAt);
        return dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className={`task-item ${task.priority?.toLowerCase() || 'medium'}`}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>

            <div className="task-footer" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

                <div style={{ display: "flex", justifyContent: "space-between",
                              alignItems: "center", width: "100%" }}>
                    <span>
                        <FaFlag /> {task.priority}
                    </span>


                    <small style={{ color: task.dueDate ? "var(--text-secondary)" : "#64748b" }}>
                        {task.dueDate
                            ? `Due: ${new Date(task.dueDate).toLocaleDateString("en-GB")}`
                            : "No Due Date 🏳️"}
                    </small>
                </div>


                <div style={{ fontSize: "11px", color: "#4b5563", fontStyle: "italic", textAlign: "left" }}>
                    🕒 Created: {formatCreatedDate()}
                </div>

            </div>

            <div className="task-actions">
                <button
                    className="edit-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(task);
                    }}
                >
                    <FaEdit /> Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={handleDeleteClick}
                >
                    <FaTrash /> Delete
                </button>
            </div>
        </div>
    );
}

export default TaskItem;