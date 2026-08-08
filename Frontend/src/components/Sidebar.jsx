import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Activity,
    BookOpen,
    Settings,
    User,
    LogOut,
    Bot
} from "lucide-react";
import { toast } from "react-hot-toast";

import { logoutQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.clear();

            const randomLogoutQuote = getRandomQuote(logoutQuotes);
            toast.success(randomLogoutQuote, { duration: 4000 });

            navigate("/login", { state: { loggedOut: true } });
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
        <aside className="orbiq-sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">Q</div>
                <div className="brand-text">
                    <h1>ORBIQ</h1>
                    <span>PRODUCTIVITY OS</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div
                    onClick={() => navigate("/dashboard")}
                    className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
                >
                    <LayoutDashboard size={20} />
                    <span>Mission Control</span>
                </div>

                <div
                    onClick={() => navigate("/tasks")}
                    className={`nav-item ${location.pathname === "/tasks" ? "active" : ""}`}
                >
                    <BookOpen size={20} />
                    <span>Tasks</span>
                </div>

                <div
                    onClick={() => navigate("/calendar")}
                    className={`nav-item ${location.pathname === "/calendar" ? "active" : ""}`}
                >
                    <Calendar size={20} />
                    <span>Orbit</span>
                </div>

                <div
                    onClick={() => navigate("/analytics")}
                    className={`nav-item ${location.pathname === "/analytics" ? "active" : ""}`}
                >
                    <Activity size={20} />
                    <span>Telemetry</span>
                </div>

                <div
                    onClick={() => navigate("/Horizon")}
                    className={`nav-item ${location.pathname === "/Horizon" ? "active" : ""}`}
                >
                    <Bot size={20} className="horizon-bot-icon" />
                    <span className="horizon-text-node">HORIZON</span>
                    <span className="horizon-mini-capsule-badge">BETA</span>
                </div>
            </nav>

            <div className="sidebar-footer">
                <div
                    onClick={() => navigate("/profile")}
                    className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}
                >
                    <User size={20} />
                    <span>Profile</span>
                </div>

                <div
                    onClick={() => navigate("/settings")}
                    className={`nav-item ${location.pathname === "/settings" ? "active" : ""}`}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </div>

                <div
                    className="nav-item logout-action-trigger"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;