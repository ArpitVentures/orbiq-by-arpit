import React, { useState } from "react";
import { SquarePlus, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Today.css";

const ParticleSnap = () => {
    const particles = Array.from({ length: 48 });

    return (
        <div className="snap-particles-container">
            {particles.map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 40 + Math.random() * 80;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const size = 2 + Math.random() * 6;

                const colors = [
                    "#22d3ee",
                    "#a855f7",
                    "#ffffff",
                    "#06b6d4",
                    "#c084fc",
                    "#fde68a"
                ];

                const color = colors[Math.floor(Math.random() * colors.length)];

                return (
                    <motion.span
                        key={i}
                        className="dust-particle"
                        style={{
                            width: size,
                            height: size,
                            background: color,
                            boxShadow: `0 0 12px ${color}`
                        }}
                        initial={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            rotate: 0
                        }}
                        animate={{
                            opacity: 0,
                            x,
                            y,
                            rotate: Math.random() * 540,
                            scale: 0,
                            filter: "blur(5px)"
                        }}
                        transition={{
                            duration: .7 + Math.random() * .5,
                            ease: "easeOut"
                        }}
                    />
                );
            })}
        </div>
    );
};

function Today({ openModal, tasks = [], onCompleteTask }) {
    const [snapIds, setSnapIds] = useState([]);

    const todayFormatted = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const todayStr = new Date().toISOString().split("T")[0];

    const activeTasks = tasks.filter(task => {
        if (task.status === "Completed") return false;

        const isToday = task.dueDate && task.dueDate.substring(0, 10) <= todayStr;
        const isInProgress = task.status === "In Progress";

        return isInProgress || isToday;
    });

    const fallbackTasks = tasks
        .filter(task => task.status !== "Completed")
        .sort((a, b) => {
            const weights = { "High": 3, "Medium": 2, "Low": 1 };
            return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        })
        .slice(0, 3);

    const displayTasks = [...activeTasks];

    fallbackTasks.forEach(task => {
        const exists = displayTasks.some(t => t._id === task._id);
        if (!exists && displayTasks.length < 3) {
            displayTasks.push(task);
        }
    });

    const visibleTasks = displayTasks.filter(
        task => !snapIds.includes(task._id)
    );

    const handleSnapComplete = (taskId) => {
        setSnapIds(prev => [...prev, taskId]);

        setTimeout(() => {
            if (onCompleteTask) {
                onCompleteTask(taskId);
            }
        }, 600);
    };

    return (
        <div className="today-focus-card-box">
            <div className="today-header-row">
                <div className="today-header-left">
                    <span className="today-sub-tag">
                        TODAY'S MISSIONS
                    </span>

                    <h2 className="today-date-heading">
                        {todayFormatted}
                    </h2>

                    <div className="today-stats-row">
                        <div className="today-mini-chip active">
                            <span className="chip-dot"></span>
                            {displayTasks.length} Active
                        </div>

                        <div className="today-mini-chip completed">
                            ✓ {tasks.filter(t => t.status === "Completed").length} Completed
                        </div>
                    </div>
                </div>

                <button
                    onClick={openModal}
                    className="today-calendar-btn"
                    title="Deploy New Mission Task"
                >
                    <SquarePlus size={18} />
                </button>
            </div>

            <div className="today-tasks-sub-stack">
                <AnimatePresence mode="popLayout">
                    {visibleTasks.length > 0 ? (
                        visibleTasks.map(task => {
                            const isSnapping = snapIds.includes(task._id);

                            return (
                                <motion.div
                                    layout
                                    key={task._id}
                                    className={`today-interactive-item-row ${isSnapping ? "snapping" : ""}`}
                                    initial={{
                                        opacity: 0,
                                        y: 12,
                                        scale: .98
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        filter: "none",
                                        transition: {
                                            duration: 0.35
                                        }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: .75,
                                        y: -8,
                                        rotate: -1.5,
                                        filter: "blur(12px)",
                                        clipPath: "inset(0 100% 0 0)",
                                        transition: {
                                            duration: .72,
                                            ease: "easeOut"
                                        }
                                    }}
                                    transition={{
                                        layout: {
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 18,
                                            mass: 0.8
                                        },
                                        opacity: {
                                            duration: 0.25
                                        },
                                        scale: {
                                            duration: 0.35
                                        }
                                    }}
                                >
                                    <div className="mission-row-left">
                                        <div className="task-action-wrapper">
                                            <button
                                                className="task-circle-btn"
                                                onClick={() => handleSnapComplete(task._id)}
                                            >
                                                <Circle
                                                    size={18}
                                                    color={isSnapping ? "#64748b" : "#22d3ee"}
                                                    strokeWidth={2.5}
                                                    className="circle-hover"
                                                />
                                            </button>

                                            {isSnapping && <ParticleSnap />}
                                        </div>

                                        <div className="mission-info">
                                            <div className={`today-task-title ${isSnapping ? "snapped-text" : ""}`}>
                                                {task.title}
                                            </div>

                                            <div className="mission-mini-subtitle">
                                                Ready for deployment
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mission-row-right">
                                        <span className={`priority-mini-pill ${task.priority?.toLowerCase()}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className="no-tasks-text">All missions nominal for today. 🌌</p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Today;