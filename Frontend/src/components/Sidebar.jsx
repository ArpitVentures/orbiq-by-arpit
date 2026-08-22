import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Activity,
    BookOpen,
    Settings,
    User,
    LogOut,
    Bot,
    Globe2
} from "lucide-react";
import { toast } from "react-hot-toast";

import { logoutQuotes, logoutConfirmationQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [logoutQuote, setLogoutQuote] = useState("");

    const handleNavigation = (path, stateObj = {}) => {
        if (location.pathname === path) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        navigate(path, stateObj);
    };

    const handleLogout = () => {
        setLogoutQuote(getRandomQuote(logoutConfirmationQuotes));
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        try {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("real_valid_token_backup");

            const randomLogoutQuote = getRandomQuote(logoutQuotes);

            toast.success(randomLogoutQuote, {
                duration: 4000
            });

            setShowLogoutConfirm(false);

            navigate("/login", {
                state: {
                    loggedOut: true
                }
            });
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <>
            <aside className="orbiq-sidebar">
                <div
                    className="sidebar-brand"
                    onClick={() => handleNavigation("/dashboard")}
                    style={{ cursor: "pointer" }}
                    title="ORBIQ"
                >
                    <div className="brand-logo">Q</div>
                    <div className="brand-text">
                        <h1>ORBIQ</h1>
                        <span>PRODUCTIVITY OS</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div
                        onClick={() => handleNavigation("/dashboard")}
                        className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Mission Control</span>
                    </div>

                    <div
                        onClick={() => handleNavigation("/tasks")}
                        className={`nav-item ${location.pathname === "/tasks" ? "active" : ""}`}
                    >
                        <BookOpen size={20} />
                        <span>Tasks</span>
                    </div>

                    <div
                        onClick={() => handleNavigation("/calendar")}
                        className={`nav-item ${location.pathname === "/calendar" ? "active" : ""}`}
                    >
                        <Calendar size={20} />
                        <span>Orbit</span>
                    </div>

                    <div
                        onClick={() => handleNavigation("/analytics")}
                        className={`nav-item ${location.pathname === "/analytics" ? "active" : ""}`}
                    >
                        <Activity size={20} />
                        <span>Telemetry</span>
                    </div>

                    <div
                        onClick={() => handleNavigation("/horizon/workspace", { state: { horizonLaunch: true } })}
                        className={`nav-item ${location.pathname.startsWith("/horizon") ? "active" : ""}`}
                    >
                        <Bot size={20} className="horizon-bot-icon" />
                        <span className="horizon-text-node">HORIZON</span>
                        <span className="horizon-mini-capsule-badge">BETA</span>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div
                        onClick={() => handleNavigation("/profile")}
                        className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </div>

                    <div
                        onClick={() => handleNavigation("/settings")}
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

            {showLogoutConfirm && (
                <div className="logout-confirm-overlay">
                    <div className="logout-confirm-modal">
                        <div className="logout-confirm-icon">
                            <Globe2 size={42} />
                        </div>

                        <h2>Leave the Universe?</h2>

                        <p>
                            "{logoutQuote}"
                        </p>

                        <div className="logout-confirm-actions">
                            <button
                                type="button"
                                className="stay-orbit-btn"
                                onClick={cancelLogout}
                            >
                                <span className="stay-orbit-icon">🗺️️</span>
                                Continue Mission
                            </button>

                            <button
                                type="button"
                                className="explore-multiverse-btn"
                                onClick={confirmLogout}
                            >
                                <span className="multiverse-icon">🌌</span>
                                Explore the Multiverse
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;