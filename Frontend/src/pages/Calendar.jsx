import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { getTasks } from "../services/taskService";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";

function CalendarPage() {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const response = await getTasks();
                setTasks(response.data.tasks);
            } catch (error) {
                console.error("Calendar task fetching failed:", error);
            }
        };
        fetchAllTasks();
    }, []);

    const renderTileContent = ({ date, view }) => {
        if (view === "month") {
            const localDateStr = date.toLocaleDateString('en-CA');
            const dayTasks = tasks.filter(task => {
                if (!task.dueDate) return false;
                return new Date(task.dueDate).toLocaleDateString('en-CA') === localDateStr;
            });

            if (dayTasks.length > 0) {
                return (
                    <div className="calendar-dots-container">
                        {dayTasks.slice(0, 3).map((task, index) => {
                            let priorityClass = "dot-low";
                            if (task.priority === "High") priorityClass = "dot-high";
                            else if (task.priority === "Medium") priorityClass = "dot-medium";
                            if (task.status === "Completed") priorityClass = "dot-completed";

                            return (
                                <span
                                    key={index}
                                    className={`calendar-dot ${priorityClass}`}
                                    title={task.title}
                                />
                            );
                        })}
                    </div>
                );
            }
        }
        return null;
    };

    const selectedDateStr = date.toLocaleDateString('en-CA');
    const selectedDayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;


        const dateMatch = new Date(task.dueDate).toLocaleDateString('en-CA') === selectedDateStr;
        const searchMatch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());

        return dateMatch && searchMatch;
    });

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main-content">
                <Topbar onSearchChange={(query) => setSearchQuery(query)} />

                <div className="calendar-page" style={{ padding: "0 8px 32px 8px" }}>

                    <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "24px", color: "#fff" }}>
                        🗓️ Task Calendar
                    </h1>

                    <div className="calendar-container-grid">
                        <div className="calendar-wrapper">
                            <Calendar
                                onChange={setDate}
                                value={date}
                                tileContent={renderTileContent}
                            />
                        </div>

                        <div className="calendar-side-panel">
                            <h3>Tasks for {date.toLocaleDateString('en-UK',
                                { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })}
                            </h3>

                            {selectedDayTasks.length === 0 ? (
                                <div className="empty-day-container">
                                    <p className="no-tasks-text">No tasks scheduled today.</p>
                                    <p className="enjoy-text">Enjoy your day! 🎉</p>
                                </div>
                            ) : (
                                <div className="calendar-task-list">
                                    {selectedDayTasks.map(task => {
                                        const taskTime = task.dueDate
                                            ? new Date(task.dueDate).toLocaleTimeString('en-US',
                                                { hour: '2-digit', minute: '2-digit' })
                                            : "All Day";

                                        return (
                                            <div key={task._id} className={`calendar-task-card priority-${task.priority?.toLowerCase()}`}>
                                                <div className="task-header">
                                                    <h4>{task.title}</h4>
                                                    <span className={`status-pill ${task.status?.toLowerCase().replace(" ", "-")}`}>
                                                        {task.status}
                                                    </span>
                                                </div>

                                                <div className="task-details">
                                                    <span className="task-time">🕒 {taskTime}</span>
                                                    <span className="task-priority-label">
                                                        {task.priority === "High" ? "🔥 High Priority" :
                                                            task.priority === "Medium" ? "⚡ Medium" : "💤 Low"}
                                                    </span>
                                                </div>

                                                {task.description && <p className="task-desc">{task.description}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;