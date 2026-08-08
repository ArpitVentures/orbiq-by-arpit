import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
    Sparkles,
    Rocket,
    Satellite,
    Clock3
} from "lucide-react";

import { holidays } from "../constants/Holidays";

import "../styles/Orbit.css";

function Orbit() {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [allTasks, setAllTasks] = useState([]);

    const currentYear = selectedDate.getFullYear();
    const currentHolidays = useMemo(() => {
        return holidays[currentYear] || [];
    }, [currentYear]);

    const holidayMap = useMemo(() => {
        const map = {};
        currentHolidays.forEach((holiday) => {
            map[holiday.date] = holiday;
        });
        return map;
    }, [currentHolidays]);

    useEffect(() => {
        setAllTasks([]);
    }, []);

    const formatDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getHoliday = (date) => {
        return holidayMap[formatDateKey(date)];
    };

    const getTasksForDate = (date) => {
        const key = formatDateKey(date);
        return allTasks.filter(task => task.date === key);
    };

    const selectedTasks = useMemo(() => {
        return getTasksForDate(selectedDate);
    }, [selectedDate, allTasks]);

    const selectedHoliday = getHoliday(selectedDate);

    const tileContent = ({ date, view }) => {
        if (view !== "month") return null;

        const holiday = getHoliday(date);
        const tasks = getTasksForDate(date);

        return (
            <div className="tile-dynamic-overlay">
                {holiday && (
                    <span className="tile-holiday-indicator">
                        {holiday.emoji}
                    </span>
                )}

                {tasks.length > 0 && (
                    <div className="calendar-dots-container">
                        {tasks.slice(0, 3).map((task, index) => (
                            <span
                                key={index}
                                className={`calendar-dot dot-${task.priority || "low"}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const tileClassName = ({ date, view }) => {
        if (view !== "month") return "";

        const classes = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentTileDate = new Date(date);
        currentTileDate.setHours(0, 0, 0, 0);

        const holiday = getHoliday(date);
        if (holiday) {
            classes.push("holiday-tile");

            switch (holiday.type) {
                case "National":
                    classes.push("orbit-national-day");
                    break;
                case "Festival":
                    classes.push("orbit-festival-day");
                    break;
                default:
                    classes.push("orbit-holiday-day");
                    break;
            }
        }

        if (date.toDateString() === new Date().toDateString()) {
            classes.push("today-tile");
        }

        if (currentTileDate < today) {
            classes.push("past-day");
        }

        return classes.join(" ");
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main-content">
                <Topbar />

                <section className="orbit-planner-container">
                    <div className="orbit-space-matrix" />

                    <div className="planner-header-row">
                        <span className="orbit-cycle-lbl">
                            ORBIT PLANNER
                        </span>
                        <h1>
                            <Satellite size={28} style={{ display: "inline", marginRight: "10px", verticalAlign: "middle" }} />
                            Mission Calendar
                        </h1>
                        <p>
                            Coordinate missions, monitor national holidays and prepare every launch with precision.
                        </p>
                    </div>

                    <div className="orbit-grid-layout">

                        <div className="planner-left-sector">
                            <div className="mission-planner-card calendar-hero-block">
                                <span className="orbit-cycle-lbl">
                                    ORBIT CYCLE • {selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}
                                </span>

                                <Calendar
                                    value={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    calendarType="gregory"
                                    tileContent={tileContent}
                                    tileClassName={tileClassName}
                                />
                            </div>

                            <div className="mission-planner-card">
                                <h3>
                                    <Rocket size={18} />
                                    Orbit Activity Heatmap
                                </h3>
                                <div className="heatmap-grid-layout">
                                    {Array.from({ length: 70 }).map((_, index) => {
                                        let className = "node-empty";
                                        if (index % 11 === 0) className = "node-purple";
                                        else if (index % 7 === 0) className = "node-green";
                                        else if (index % 5 === 0) className = "node-cyan-high";
                                        else if (index % 3 === 0) className = "node-cyan-low";

                                        return (
                                            <div
                                                key={index}
                                                className={`heatmap-node ${className}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="planner-right-sector">
                            <div className="mission-planner-card">
                                <h3>
                                    <Clock3 size={18} />
                                    Selected Mission Window
                                </h3>

                                <div className="metrics-box-grid">
                                    <div className="metric-element">
                                        <span className="lbl-gray">
                                            Selected Date
                                        </span>
                                        <span className="val-cyan">
                                            {selectedDate.toLocaleDateString("en-IN", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long"
                                            })}
                                        </span>
                                    </div>

                                    <div className="metric-element">
                                        <span className="lbl-gray">
                                            Mission Status
                                        </span>
                                        <span className="val-orange">
                                            {selectedHoliday ? selectedHoliday.name : "Operational"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mission-planner-card">
                                <h3>
                                    <Rocket size={18} />
                                    Mission Timeline
                                </h3>

                                {selectedTasks.length > 0 ? (
                                    <div className="orbit-custom-timeline-stack">
                                        {selectedTasks.map((task) => (
                                            <div
                                                key={task._id || task.id}
                                                className={`timeline-launch-node priority-${task.priority}`}
                                            >
                                                <div className="timeline-time-stamp">
                                                    {task.time || "--:--"}
                                                </div>
                                                <div className="timeline-node-details">
                                                    <h4>{task.title}</h4>
                                                    <span className="node-context-tag">
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-launch-state">
                                        <span className="empty-rocket-ico">🚀</span>
                                        <h4>No missions scheduled</h4>
                                        <p>Deploy a mission to begin today's orbit.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mission-planner-card">
                                <h3>
                                    <Sparkles size={18} />
                                    HORIZON Recommendation
                                </h3>

                                <div className="intelligence-suggestion-body">
                                    <Sparkles
                                        size={18}
                                        className="sparkle-ico-glowing"
                                    />
                                    <p>
                                        {selectedHoliday?.horizonGreeting
                                            ? `Happy ${selectedHoliday.name}! HORIZON recommends switching to ${selectedHoliday.workMode} mode and enjoying the celebration.`
                                            : "Mission density is currently normal. Recommended focus session: 90 minutes with a short recharge interval."
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="mission-planner-card">
                                <h3>
                                    🇮🇳 National Calendar
                                </h3>

                                <div className="holidays-vertical-list">
                                    {currentHolidays.map((holiday) => (
                                        <div
                                            key={holiday.date}
                                            className="holiday-row-item"
                                        >
                                            <span>
                                                {holiday.emoji} {holiday.name}
                                            </span>
                                            <span className="holiday-date-pill">
                                                {new Date(holiday.date).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short"
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Orbit;