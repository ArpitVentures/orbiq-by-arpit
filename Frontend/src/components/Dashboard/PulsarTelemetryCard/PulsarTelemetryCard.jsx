import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PulsarTelemetryCard.css";

const MODE_PRESETS = {
    FOCUS: [4, 10, 20, 26, 20, 12, 5],
    PLANNING: [3, 6, 12, 16, 12, 6, 3],
    RECOVERY: [2, 4, 6, 8, 6, 4, 2],
    EXECUTION: [8, 16, 28, 32, 26, 14, 8],
    OFFLINE: [2, 2, 2, 2, 2, 2, 2]
};

function PulsarTelemetryCard({ userState = "FOCUS", statsData }) {
    const [currentState, setCurrentState] = useState(userState);

    useEffect(() => {
        setCurrentState(userState);
    }, [userState]);

    const activeHeights = MODE_PRESETS[currentState] || MODE_PRESETS.FOCUS;

    const totalTasks = statsData?.totalTasks || 0;
    const completedTasks = statsData?.completedTasks || 0;
    const productivityPercentage = statsData?.productivity || "0%";
    const numericProgress = parseInt(productivityPercentage) || 0;

    const hasActiveTasks = totalTasks > 0;

    return (
        <div className="pulsar-telemetry-container">
            <AnimatePresence mode="wait">
                <motion.div
                    className="pulsar-card-content"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    key={currentState}
                >

                    <div className="ecg-banner">
                        <div className="ecg-line-wrapper">
                            <svg className="ecg-svg" viewBox="0 0 300 24" fill="none">
                                <path
                                    d="M0 12 L80 12 L85 4 L90 20 L96 2 L102 18 L106 12 L180 12 L185 4 L190 20 L196 2 L202 18 L206 12 L300 12"
                                    stroke="url(#ecg-gradient)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <defs>
                                    <linearGradient id="ecg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#22d3ee" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>

                    <div className="pulsar-card-header">
                        <div className="header-left">
                            <div className={`equalizer-wrapper ${!hasActiveTasks ? "offline" : ""}`}>
                                {activeHeights.map((targetHeight, i) => (
                                    <motion.div
                                        key={i}
                                        className="eq-bar"
                                        animate={
                                            !hasActiveTasks
                                                ? { height: 2 }
                                                : { height: [targetHeight, targetHeight * 0.4, targetHeight] }
                                        }
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            delay: i * 0.1,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>

                            <span className="telemetry-title">
                                SYSTEM TELEMETRY
                                <span className="sub-title">
                                    {hasActiveTasks ? "Powered by P.U.L.S.A.R." : "Telemetry Standby Mode"}
                                </span>
                            </span>
                        </div>

                        <div className="meteor-status-badge">
                            ☄️ <span className="meteor-title">Workspace Velocity</span>
                            <span className="meteor-val">{productivityPercentage}</span>
                        </div>
                    </div>

                    <div className="pulsar-metrics-grid">
                        <div className="telemetry-pill">
                            <div className="pill-top">
                                <span className="pill-key">Active Vectors</span>
                                <span className="pill-val">{statsData?.pendingTasks || 0} Tasks</span>
                            </div>
                            <div className="pill-gauge-bg">
                                <div className="pill-gauge-fill session" style={{ width: totalTasks > 0 ? `${((statsData?.pendingTasks || 0) / totalTasks) * 100}%` : "0%" }}></div>
                            </div>
                        </div>

                        <div className="telemetry-pill">
                            <div className="pill-top">
                                <span className="pill-key">Focus Score</span>
                                <span className="pill-val cyan">
                                    <span className="clean-line-prefix">|</span>{productivityPercentage}
                                </span>
                            </div>
                            <div className="pill-gauge-bg">
                                <div className="pill-gauge-fill focus" style={{ width: productivityPercentage }}></div>
                            </div>
                        </div>

                        <div className="telemetry-pill">
                            <div className="pill-top">
                                <span className="pill-key">Missions Done</span>
                                <span className="pill-val orange">{completedTasks} / {totalTasks}</span>
                            </div>
                            <div className="pill-gauge-bg">
                                <div className="pill-gauge-fill break" style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : "0%" }}></div>
                            </div>
                        </div>

                        <div className="telemetry-pill">
                            <div className="pill-top">
                                <span className="pill-key">Energy Level</span>
                                <span className="pill-val green">
                                    {numericProgress > 50 ? "OPTIMAL" : numericProgress > 0 ? "NOMINAL" : "STANDBY"}
                                </span>
                            </div>
                            <div className="pill-gauge-bg">
                                <div className="pill-gauge-fill energy" style={{ width: numericProgress > 0 ? `${numericProgress}%` : "5%" }}></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default PulsarTelemetryCard;