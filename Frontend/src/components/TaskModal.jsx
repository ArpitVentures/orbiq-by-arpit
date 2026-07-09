import { useState, useEffect } from "react";
import { updateTask } from "../services/taskService";
import { toast } from "react-hot-toast";
import { completedQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/TaskModal.css";

function TaskModal({
                       mode,
                       task,
                       closeModal,
                       addTask,
                       refreshTasks
                   }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Medium",
        status: "To Do",
        dueDate: ""
    });

    useEffect(() => {
        if (mode === "edit" && task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                priority: task.priority || "Medium",
                status: task.status || "To Do",
                dueDate: task.dueDate
                    ? task.dueDate.substring(0, 10)
                    : ""
            });
        }
    }, [mode, task]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

        try {
            if (mode === "create") {
                await addTask(formData);
            } else {
                await updateTask(task._id, formData);
                await refreshTasks();

                if (formData.status === "Completed") {

                    toast.success(getRandomQuote(completedQuotes));
                } else {
                    toast.success("Task updated successfully! ✨");
                }
            }
            closeModal();
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || error.message;
            toast.error(`Error: ${errMsg} ❌`);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>
                    {mode === "create"
                        ? "Create New Task"
                        : "Edit Task"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <label>Task Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter task title..."
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Description (Optional)</label>
                    <textarea
                        name="description"
                        placeholder="Enter task description..."
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <label>Priority</label>

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <label>Status</label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <label>Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />


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
                            {mode === "create"
                                ? "Add Task"
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;