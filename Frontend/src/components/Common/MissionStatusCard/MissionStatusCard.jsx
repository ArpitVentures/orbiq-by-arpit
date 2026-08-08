import React, { useState, useEffect, memo } from "react";
import { Clock3, Activity, Sparkles, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./MissionStatusCard.css";

const FlipDigit = memo(({ digit, colorClass = "" }) => {
    return (
        <div className="flip-digit-container">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={digit}
                    initial={{ rotateX: -75, opacity: 0, y: -4 }}
                    animate={{ rotateX: 0, opacity: 1, y: 0 }}
                    exit={{ rotateX: 75, opacity: 0, y: 4 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className={`time-unit ${colorClass}`}
                >
                    {digit}
                </motion.span>
            </AnimatePresence>
        </div>
    );
});

FlipDigit.displayName = "FlipDigit";

function MissionStatusCard() {
    const [time, setTime] = useState(new Date());
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isNewDay, setIsNewDay] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        let interval;
        let timeout;

        const syncClock = () => {
            const now = new Date();
            setTime(now);

            if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
                setIsNewDay(true);
                setTimeout(() => setIsNewDay(false), 5000);
            }

            const delay = 1000 - (Date.now() % 1000);

            timeout = setTimeout(() => {
                setTime(new Date());
                interval = setInterval(() => {
                    const current = new Date();
                    setTime(current);

                    if (current.getHours() === 0 && current.getMinutes() === 0 && current.getSeconds() === 0) {
                        setIsNewDay(true);
                        setTimeout(() => setIsNewDay(false), 5000);
                    }
                }, 1000);
            }, delay);
        };

        syncClock();

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();

    const hoursStr = String(h).padStart(2, "0");
    const minutesStr = String(m).padStart(2, "0");
    const secondsStr = String(s).padStart(2, "0");

    const formattedDate = time.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const getMissionDetails = () => {
        const currentMins = h * 60 + m;

        let label = "Recovery Mode";
        let color = "night";
        let nextTitle = "Planning Cycle";
        let targetMins = 300;

        if (currentMins >= 300 && currentMins < 540) {
            label = "Planning Cycle";
            color = "planning";
            nextTitle = "Execution Cycle";
            targetMins = 540;
        } else if (currentMins >= 540 && currentMins < 780) {
            label = "Execution Cycle";
            color = "execution";
            nextTitle = "Recovery Cycle";
            targetMins = 780;
        } else if (currentMins >= 780 && currentMins < 900) {
            label = "Recovery Cycle";
            color = "recovery";
            nextTitle = "Focus Cycle";
            targetMins = 900;
        } else if (currentMins >= 900 && currentMins < 1260) {
            label = "Focus Cycle";
            color = "focus";
            nextTitle = "Recovery Mode";
            targetMins = 1260;
        } else if (currentMins >= 1260) {
            targetMins = 300 + 1440;
        }

        const diffMins = targetMins - currentMins;
        const diffHours = Math.floor(diffMins / 60);
        const remMins = diffMins % 60;

        let timeRemainingStr = "";
        if (diffHours > 0) {
            timeRemainingStr = `${diffHours}h ${remMins}m`;
        } else {
            timeRemainingStr = `${remMins}m`;
        }

        return {
            label,
            color,
            insightText: `${nextTitle} begins in `,
            remaining: timeRemainingStr
        };
    };

    const mission = getMissionDetails();

    return (
        <div className={`mission-status-card ${isNewDay ? "midnight-celebration" : ""}`}>
            <div className="mission-status-header">
                <div className="clock-title">
                    <Clock3 size={15} />
                    <span>CHRONO CORE</span>
                </div>

                <div className={`clock-live ${isOnline ? "online" : "offline"}`}>
                    <span className="live-dot"></span>
                    <span>{isOnline ? "SYNCED" : "OFFLINE"}</span>
                </div>
            </div>

            <div className="mission-status-time">
                <div className="time-group hours-group">
                    <FlipDigit digit={hoursStr[0]} colorClass="hours" />
                    <FlipDigit digit={hoursStr[1]} colorClass="hours" />
                </div>

                <span className="time-colon">:</span>

                <div className="time-group minutes-group">
                    <FlipDigit digit={minutesStr[0]} colorClass="minutes" />
                    <FlipDigit digit={minutesStr[1]} colorClass="minutes" />
                </div>

                <span className="time-colon seconds-colon">:</span>

                <div className="time-group seconds-group">
                    <FlipDigit digit={secondsStr[0]} colorClass="seconds" />
                    <FlipDigit digit={secondsStr[1]} colorClass="seconds" />
                </div>
            </div>

            <div className="mission-status-date">
                {isNewDay ? (
                    <span className="new-day-banner">✨ NEW DAY INITIATED • {formattedDate}</span>
                ) : (
                    formattedDate
                )}
            </div>

            <div className="clock-divider"></div>

            <div className="mission-status-footer">
                <div className="timezone-node">
                    IST • UTC+5:30
                </div>
                <div className={`mission-status-tag ${mission.color}`}>
                    <Activity size={13} />
                    <span>{mission.label}</span>
                </div>
            </div>

            <div className="horizon-session-suggestion">
                <Sparkles size={13} className="sparkle-ico-glow" />
                <div className="insight-content">
                    <span className="insight-title">HORIZON Insight</span>
                    <span className="insight-body">
                        {mission.insightText}<strong>{mission.remaining}</strong>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MissionStatusCard;