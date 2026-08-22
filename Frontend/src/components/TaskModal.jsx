import { useState } from "react";
import { updateTask } from "../services/taskService";
import { toast } from "react-hot-toast";
import { Sparkles, Rocket } from "lucide-react";
import { completedQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/TaskModal.css";

const MAX_TITLE_LENGTH = 80;

function TaskModal({
                       mode,
                       task,
                       closeModal,
                       addTask,
                       refreshTasks,
                       onError,
                       showCompletionMessage = false
                   }) {

    const [formData, setFormData] = useState(() => ({
        title: task?.title || "",
        description: task?.description || "",
        priority: task?.priority || "Medium",
        status: task?.status || "To Do",
        dueDate: task?.dueDate
            ? task.dueDate.substring(0, 10)
            : ""
    }));

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePrioritySelect = (selectedPriority) => {
        setFormData(prev => ({
            ...prev,
            priority: selectedPriority
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error(
                "A task needs a name! " +
                "Don't leave it blank like your mind in viva. 🤯"
            );
            return;
        }

        if (formData.title.trim().length > MAX_TITLE_LENGTH) {
            toast.error(
                `Task title cannot exceed ${MAX_TITLE_LENGTH} characters. 😬`
            );
            return;
        }

        try {
            if (mode === "create") {
                await addTask(formData);
            } else {
                await updateTask(task._id, formData);
                await refreshTasks(formData.status);

                if (formData.status === "Completed") {
                    if (showCompletionMessage) {
                        toast.success(getRandomQuote(completedQuotes));
                    }
                } else {
                    toast.success("Task updated successfully! ✨");
                }
            }
            closeModal();
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || error.message;

            if (onError) {
                onError();
            }

            toast.error(`Error: ${errMsg} ❌`);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header-zone">
                    <div className="header-badge">
                        <Sparkles size={11} />
                        <span>ORBITAL TRAJECTORY</span>
                    </div>
                    <h2>
                        <Rocket size={22} className="header-rocket-icon" />
                        {mode === "create" ? "Deploy New Mission" : "Update Mission Coordinates"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>🔖 Mission Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g., Calibrate telemetry nodes..."
                            value={formData.title}
                            onChange={handleChange}
                            maxLength={MAX_TITLE_LENGTH}
                            required
                        />

                        <div className="task-title-meta">
                            <span>Keep it concise for a clean mission board.</span>
                            <span className={formData.title.length === MAX_TITLE_LENGTH ? "title-limit-reached" : ""}>
                                {formData.title.length}/{MAX_TITLE_LENGTH}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>📝 Briefing Notes (Optional)</label>
                        <textarea
                            name="description"
                            placeholder="Enter task description or operational context..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>

                    <div className="form-group">
                        <label>🎯 Trajectory Priority</label>
                        <div className="priority-pill-selector">
                            {["Low", "Medium", "High"].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`priority-pill pill-${p.toLowerCase()} ${formData.priority === p ? "active" : ""}`}
                                    onClick={() => handlePrioritySelect(p)}
                                >
                                    <span className="dot" />
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-dual-row">
                        <div className="form-group">
                            <label>📌 Mission State</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>📅 Deadline Vector</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-buttons">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            {mode === "create" ? "Deploy Task" : "Update Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;