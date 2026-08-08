import "./Upcoming.css";
import { useState } from "react";
import {
    CalendarDays,
    AlertTriangle,
    Clock3,
    ArrowRight,
    X,
    Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function calculateRelativeTimeline(dueDateStr) {
    if (!dueDateStr) return { label: "No Due Date", isOverdue: false, urgencyTag: null };

    const due = new Date(dueDateStr);
    if (isNaN(due.getTime())) return { label: "Invalid Date", isOverdue: false, urgencyTag: null };

    const now = new Date();
    const diffMs = due - now;
    const diffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const isOverdue = diffMs < 0;

    const timeStr = due.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

    if (isOverdue) {
        let overdueText = "";
        if (diffMinutes < 60) {
            overdueText = `Overdue by ${diffMinutes}m`;
        } else if (diffHours < 24) {
            overdueText = `Overdue by ${diffHours}h`;
        } else {
            overdueText = `Overdue by ${diffDays}d`;
        }

        const dateStr = due.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        return {
            label: `${dateStr} • ${timeStr}`,
            isOverdue: true,
            urgencyTag: `🚨 ${overdueText}`
        };
    }

    if (diffMinutes <= 180) {
        const hrs = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        const countdownStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

        return {
            label: `Today • ${timeStr}`,
            isOverdue: false,
            urgencyTag: `⏳ Due in ${countdownStr}`
        };
    }

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const calendarDiffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

    if (calendarDiffDays === 0) {
        return { label: `Today • ${timeStr}`, isOverdue: false, urgencyTag: null };
    }

    if (calendarDiffDays === 1) {
        return { label: `Tomorrow • ${timeStr}`, isOverdue: false, urgencyTag: null };
    }

    if (calendarDiffDays > 1 && calendarDiffDays <= 6) {
        return { label: `In ${calendarDiffDays} days`, isOverdue: false, urgencyTag: null };
    }

    const dateStr = due.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    return { label: `${dateStr} • ${timeStr}`, isOverdue: false, urgencyTag: null };
}

function Upcoming({ tasks = [] }) {
    const navigate = useNavigate();
    const [showMiniCalendar, setShowMiniCalendar] = useState(false);

    const upcomingTasks = [...tasks]
        .filter((task) => task.status !== "Completed" && task.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    const now = new Date();
    const currentMonthName = now.toLocaleString("en-US", { month: "long", year: "numeric" });
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const deadlineDays = tasks
        .filter((task) => task.status !== "Completed" && task.dueDate)
        .map((task) => new Date(task.dueDate).getDate());

    return (
        <section className="upcoming-card">
            <div className="upcoming-header">
                <div>
                    <p>UPCOMING</p>
                    <h2>Orbit Timeline</h2>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMiniCalendar(!showMiniCalendar);
                    }}
                    className={`calendar-trigger-btn ${showMiniCalendar ? "active-glow" : ""}`}
                >
                    <CalendarDays size={22} />
                </button>
            </div>

            {showMiniCalendar ? (
                <div className="mini-calendar-wrapper">
                    <div className="mini-cal-header">
                        <span>{currentMonthName}</span>
                        <button
                            type="button"
                            className="close-mini-cal"
                            onClick={() => setShowMiniCalendar(false)}
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <div className="mini-cal-days-grid-labels">
                        <span>M</span><span>T</span><span>W</span><span>Th</span><span>F</span><span>Sat</span><span>S</span>
                    </div>
                    <div className="mini-cal-days-grid">
                        {currentDays.map((day) => {
                            const isToday = day === now.getDate();
                            const hasDeadline = deadlineDays.includes(day);

                            return (
                                <div
                                    key={day}
                                    className={`mini-day-cell 
                                        ${isToday ? "current-active-day" : ""} 
                                        ${hasDeadline ? "day-has-deadline-dot" : ""}
                                    `}
                                    onClick={() => {
                                        setShowMiniCalendar(false);
                                        navigate("/calendar");
                                    }}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        className="full-calendar-redirect-btn"
                        onClick={() => navigate("/calendar")}
                    >
                        Launch Orbit →
                    </button>
                </div>
            ) : (
                <div className="upcoming-list">
                    {upcomingTasks.length > 0 ? (
                        upcomingTasks.map((task) => {
                            const priorityClass = (task.priority || "medium").toLowerCase();
                            const { label, isOverdue, urgencyTag } = calculateRelativeTimeline(task.dueDate);

                            return (
                                <div
                                    className={`upcoming-item ${isOverdue ? "item-overdue" : ""}`}
                                    key={task._id || task.id}
                                >
                                    <div className="task-left">
                                        <div className={`priority-dot ${isOverdue ? "overdue-dot" : priorityClass}`} />
                                        <div className="task-text-container">
                                            <h3>{task.title}</h3>

                                            {task.description && (
                                                <p className="task-subtitle-preview">{task.description}</p>
                                            )}

                                            <div className="time-row-meta">
                                                <span className={isOverdue ? "time-overdue" : ""}>
                                                    <Clock3 size={13} />
                                                    {label}
                                                </span>

                                                {urgencyTag && (
                                                    <span className={`urgency-pill ${isOverdue ? "overdue-pill" : "countdown-pill"}`}>
                                                        {urgencyTag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`priority-badge ${isOverdue ? "overdue" : priorityClass}`}>
                                        <AlertTriangle size={13} />
                                        {isOverdue ? "OVERDUE" : (task.priority || "MEDIUM").toUpperCase()}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="upcoming-empty-state">
                            <Sparkles size={22} color="#22d3ee" />
                            <h4>All Clear in Orbit!</h4>
                            <p>No upcoming deadlines queued in your trajectory.</p>
                        </div>
                    )}
                </div>
            )}

            <button type="button" className="view-all-btn" onClick={() => navigate("/tasks")}>
                View All Tasks
                <ArrowRight size={17} />
            </button>
        </section>
    );
}

export default Upcoming;