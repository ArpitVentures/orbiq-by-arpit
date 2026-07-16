import "./Today.css";
import { useState } from "react";
import { Clock3, Plus, CalendarDays, ListTodo } from "lucide-react";

const todaysAgenda = [
    { time: "10:00 AM", event: "Daily Standup Meeting" },
    { time: "12:30 PM", event: "UI Design Review (ORBIQ)" },
    { time: "04:00 PM", event: "Backend API Integration" }
];

function Today({ openModal }) {

    const [showSchedule, setShowSchedule] = useState(false);

    return (
        <section className="today-card">
            <div className="today-header">
                <div>
                    <p className="today-label">TODAY</p>
                    <h2>Wednesday, 15 July</h2>
                </div>

                <button
                    className={`today-icon ${showSchedule ? 'agenda-active' : ''}`}
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowSchedule(!showSchedule);
                    }}
                    title={showSchedule ? "Show Tasks" : "Show Today's Schedule"}
                >
                    {showSchedule ? <ListTodo size={20} /> : <CalendarDays size={20} />}
                </button>
            </div>

            <div className="today-focus">
                <div className="focus-title">
                    🎯 <span>Today's Focus</span>
                </div>
                <h3>Complete ORBIQ Dashboard</h3>
            </div>

            <div className="today-progress-zone">
                <div className="progress-meta">
                    <span>{showSchedule ? "Schedule Progress" : "Daily Progress"}</span>
                    <strong>65%</strong>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: "65%" }} />
                </div>
            </div>

            {showSchedule ? (

                <div className="today-agenda-list">
                    {todaysAgenda.map((item, index) => (
                        <div className="agenda-item" key={index}>
                            <span className="agenda-time">{item.time}</span>
                            <div className="agenda-timeline-dot"></div>
                            <span className="agenda-event">{item.event}</span>
                        </div>
                    ))}
                </div>
            ) : (

                <div className="today-tasks-list">
                    <div className="today-task-item completed">
                        <input type="checkbox" checked readOnly className="task-checkbox" />
                        <span className="task-text">Finish Dashboard UI</span>
                    </div>

                    <div className="today-task-item">
                        <input type="checkbox" className="task-checkbox" />
                        <span className="task-text">Implement AI Workspace</span>
                    </div>

                    <div className="today-task-item">
                        <input type="checkbox" className="task-checkbox" />
                        <span className="task-text">Optimize Analytics</span>
                    </div>
                </div>
            )}

            <div className="today-footer-meta">
                <div className="deep-work-timer">
                    <Clock3 size={16} />
                    <span>Deep Work Target</span>
                    <strong>5h 30m</strong>
                </div>
            </div>

            <button className="add-today-task-btn" onClick={openModal}>
                <Plus size={18} />
                Add Today's Task
            </button>
        </section>
    );
}

export default Today;