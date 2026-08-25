import { useEffect, useState } from "react";
import {
    Bell,
    ChevronDown,
    CircleUserRound,
    Sparkles,
    Activity
} from "lucide-react";
import "./ApexHeader.css";

function ApexHeader({ user }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    const storedUser =
        user || JSON.parse(sessionStorage.getItem("user") || "{}");

    const userName =
        storedUser?.name ||
        storedUser?.fullName ||
        storedUser?.username ||
        "Commander";

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const hour = currentTime.getHours();

    const greeting =
        hour < 5
            ? "Good Night"
            : hour < 12
                ? "Good Morning"
                : hour < 17
                    ? "Good Afternoon"
                    : hour < 21
                        ? "Good Evening"
                        : "Good Night";

    const formattedTime = currentTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    const formattedDate = currentTime.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    const userAvatar = storedUser?.avatar || storedUser?.profileImage || storedUser?.googleAvatar;

    return (
        <header className="apex-header">

            <div className="apex-header-intro">
                <div className="apex-greeting-row">
                    <Sparkles size={18} className="apex-greeting-icon" />

                    <span className="apex-greeting">
                        {greeting}, <strong>{userName}</strong>
                    </span>
                </div>

                <div className="apex-context-line">
                    <span>
                        Your workspace is ready. P.U.L.S.A.R. is monitoring
                        your active context.
                    </span>
                </div>
            </div>

            <div className="apex-system-status">
                <div className="apex-system-status-top">
                    <span className="apex-status-dot"></span>
                    <span>P.U.L.S.A.R. ONLINE</span>
                </div>

                <div className="apex-system-status-bottom">
                    <Activity size={13} />
                    <span>Context Engine Active</span>
                </div>
            </div>

            <div className="apex-header-right">
                <div className="apex-clock">
                    <span className="apex-time">{formattedTime}</span>
                    <span className="apex-date">{formattedDate}</span>
                </div>

                <button
                    className="apex-notification-btn"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    <span className="notification-indicator"></span>
                </button>

                <div className="apex-user-profile">
                    <div className="apex-avatar">
                        {userAvatar ? (
                            <img src={userAvatar} alt="User Avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        ) : initials ? (
                            <span style={{ fontWeight: "700", fontSize: "12px", color: "#fff" }}>{initials}</span>
                        ) : (
                            <CircleUserRound size={22} />
                        )}
                    </div>

                    <div className="apex-user-meta">
                        <span className="apex-user-name">{userName}</span>
                        <span className="apex-user-role">Workspace Member</span>
                    </div>

                    <ChevronDown size={16} className="apex-chevron" />
                </div>
            </div>
        </header>
    );
}

export default ApexHeader;