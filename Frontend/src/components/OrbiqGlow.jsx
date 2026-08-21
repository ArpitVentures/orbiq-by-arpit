import { useEffect, useState } from "react";
import "./OrbiqGlow.css";

const GLOW_TYPES = {
    MISSION_COMPLETE: { class: "mission-complete", duration: 1600 },
    HORIZON_INSIGHT: { class: "horizon-insight", duration: 3000 },
    WORKSPACE_EVENT: { class: "workspace-event", duration: 2200 },
    CRITICAL_ALERT: { class: "critical-alert", duration: 1900 },
    TARGET_FOCUS: { class: "target-focus", duration: 1500 }
};

function OrbiqGlow({
                       type = "MISSION_COMPLETE",
                       active = false,
                       targetRef = null
                   }) {
    const [visible, setVisible] = useState(false);
    const [bounds, setBounds] = useState(null);

    const currentConfig = GLOW_TYPES[type] || GLOW_TYPES.MISSION_COMPLETE;

    useEffect(() => {
        if (!active) {
            requestAnimationFrame(() => setVisible(false));
            return;
        }

        if (type === "TARGET_FOCUS" && targetRef?.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setBounds({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
        }

        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
        }, currentConfig.duration);

        return () => clearTimeout(timer);
    }, [active, currentConfig.duration, targetRef, type]);

    if (!visible) return null;

    const isLocalized = type === "TARGET_FOCUS" && bounds;

    const style = isLocalized
        ? {
            position: "fixed",
            top: `${bounds.top}px`,
            left: `${bounds.left}px`,
            width: `${bounds.width}px`,
            height: `${bounds.height}px`,
            inset: "auto",
            borderRadius: "16px",
            pointerEvents: "none",
            zIndex: 9999
        }
        : {};

    return (
        <div
            className={`orbiq-glow ${currentConfig.class} ${isLocalized ? "localized-glow" : ""}`}
            style={style}
            aria-hidden="true"
        >
            <span className="glow-edge glow-top"></span>
            <span className="glow-edge glow-right"></span>
            <span className="glow-edge glow-bottom"></span>
            <span className="glow-edge glow-left"></span>
        </div>
    );
}

export default OrbiqGlow;