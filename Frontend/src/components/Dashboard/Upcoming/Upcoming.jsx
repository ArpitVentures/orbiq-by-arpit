import "./Upcoming.css";
import { useState } from "react";
import {
    CalendarDays,
    AlertTriangle,
    Clock3,
    ArrowRight,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const upcomingTasks = [
    { title: "Complete ORBIQ Dashboard", due: "Today • 8:00 PM", priority: "HIGH" },
    { title: "Prepare W3Villa Report", due: "Tomorrow • 10:00 AM", priority: "MEDIUM" },
    { title: "Review Backend APIs", due: "16 Jul • 6:30 PM", priority: "LOW" }
];

function Upcoming() {
    const navigate = useNavigate();
    const [showMiniCalendar, setShowMiniCalendar] = useState(false);
    const currentDays = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <section className="upcoming-card">
            <div className="upcoming-header">
                <div>
                    <p>UPCOMING</p>
                    <h2>Deadlines</h2>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMiniCalendar(!showMiniCalendar);
                    }}
                    className={`calendar-trigger-btn ${showMiniCalendar ? 'active-glow' : ''}`}
                >
                    <CalendarDays size={22} />
                </button>
            </div>

            {showMiniCalendar ? (
                <div className="mini-calendar-wrapper">
                    <div className="mini-cal-header">
                        <span>July 2026</span>
                        <button type="button" className="close-mini-cal" onClick={() =>
                            setShowMiniCalendar(false)}>
                            <X size={14} />
                        </button>
                    </div>
                    <div className="mini-cal-days-grid-labels">
                        <span>M</span><span>T</span><span>W</span><span>Th</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div className="mini-cal-days-grid">
                        {currentDays.map((day) => {
                            const isToday = day === 14;
                            const hasDeadline = day === 14 || day === 15 || day === 16;

                            return (
                                <div
                                    key={day}
                                    className={`mini-day-cell 
                                        ${isToday ? 'current-active-day' : ''} 
                                        ${hasDeadline ? 'day-has-deadline-dot' : ''}
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
                    <button type="button" className="full-calendar-redirect-btn" onClick={() =>
                        navigate("/calendar")}>
                        Go to Full Screen Calendar View →
                    </button>
                </div>
            ) : (
                <div className="upcoming-list">
                    {upcomingTasks.map((task, index) => (
                        <div className="upcoming-item" key={index}>
                            <div className="task-left">
                                <div className={`priority-dot ${task.priority.toLowerCase()}`} />
                                <div>
                                    <h3>{task.title}</h3>
                                    <span>
                                        <Clock3 size={14} />
                                        {task.due}
                                    </span>
                                </div>
                            </div>
                            <div className={`priority-badge ${task.priority.toLowerCase()}`}>
                                <AlertTriangle size={14} />
                                {task.priority}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button type="button" className="view-all-btn" onClick={() => navigate("/tasks")}>
                View All
                <ArrowRight size={17} />
            </button>
        </section>
    );
}

export default Upcoming;