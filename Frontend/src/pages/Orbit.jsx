import { useEffect, useMemo, useState, useCallback } from "react";
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

import { holidays } from "../Constants/Holidays";
import api from "../services/api";
import "../styles/Orbit.css";

function Orbit() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [allTasks, setAllTasks] = useState([]);
    const [heatmapData, setHeatmapData] = useState({});

    const [activeStartDate, setActiveStartDate] = useState(new Date());

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

    const formatDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getHoliday = useCallback((date) => {
        return holidayMap[formatDateKey(date)];
    }, [holidayMap]);

    const getTasksForDate = useCallback((date) => {
        const key = formatDateKey(date);
        return allTasks.filter(task => {
            if (!task.dueDate) return false;
            return task.dueDate.substring(0, 10) === key;
        });
    }, [allTasks]);

    useEffect(() => {
        const fetchTasksAndHeatmap = async () => {
            try {
                const response = await api.get("/tasks");
                const tasks = response.data.tasks || [];
                setAllTasks(tasks);

                const frequencyMap = {};
                tasks.forEach(task => {
                    if (task.status === "Completed" && task.completedAt) {
                        const dateKey = task.completedAt.substring(0, 10);
                        frequencyMap[dateKey] = (frequencyMap[dateKey] || 0) + 1;
                    }
                });
                setHeatmapData(frequencyMap);
            } catch (err) {
                console.error("Orbit tasks load error:", err);
            }
        };

        void fetchTasksAndHeatmap();
    }, []);

    const selectedTasks = useMemo(() => {
        return getTasksForDate(selectedDate);
    }, [selectedDate, getTasksForDate]);

    const selectedHoliday = getHoliday(selectedDate);

    const heatmapNodes = useMemo(() => {
        const nodes = [];
        const today = new Date();

        for (let i = 69; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = formatDateKey(d);
            const count = heatmapData[key] || 0;

            let nodeClass = "node-empty";
            if (count >= 3) nodeClass = "node-cyan-high";
            else if (count === 2) nodeClass = "node-green";
            else if (count === 1) nodeClass = "node-purple";

            nodes.push({ date: d, key, count, nodeClass });
        }
        return nodes;
    }, [heatmapData]);

    const handleHeatmapNodeClick = (nodeDate) => {
        setSelectedDate(nodeDate);
        setActiveStartDate(nodeDate);
    };

    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today);
        setActiveStartDate(today);
    };

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
                                <div className="calendar-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <span className="orbit-cycle-lbl" style={{ margin: 0 }}>
                                        ORBIT CYCLE • {selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}
                                    </span>

                                    <button
                                        type="button"
                                        className="today-calendar-btn"
                                        onClick={handleTodayClick}
                                        style={{
                                            background: "rgba(34, 211, 238, 0.1)",
                                            border: "1px solid rgba(34, 211, 238, 0.3)",
                                            color: "#22d3ee",
                                            padding: "4px 12px",
                                            borderRadius: "6px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        Today
                                    </button>
                                </div>

                                <Calendar
                                    value={selectedDate}
                                    activeStartDate={activeStartDate}
                                    onActiveStartDateChange={({ activeStartDate: newDate }) => {
                                        if (newDate) setActiveStartDate(newDate);
                                    }}
                                    onChange={(value) => {
                                        if (value instanceof Date) {
                                            setSelectedDate(value);
                                        }
                                    }}
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
                                    {heatmapNodes.map((node) => (
                                        <div
                                            key={node.key}
                                            className={`heatmap-node ${node.nodeClass}`}
                                            title={`${node.key}: ${node.count} Missions Completed`}
                                            onClick={() => handleHeatmapNodeClick(node.date)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    ))}
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
                                                    {task.dueDate ? task.dueDate.substring(11, 16) : "--:--"}
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
                                            onClick={() => handleHeatmapNodeClick(new Date(holiday.date))}
                                            style={{ cursor: "pointer" }}
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