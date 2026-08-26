import "../styles/Topbar.css";
import { FaBell, FaSearch } from "react-icons/fa";
import { Sparkles, Radio, CheckCheck, Trash2, Command } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

import GlobalSearchModal, { getDevicePlatform } from "./Dashboard/Search/GlobalSearchModal.jsx";
import { getNotifications, formatTimeAgo } from "../utils/beaconEngine.js";

function Topbar({ onSearchChange, tasks = [], dashboardData, currentGreeting, onCreateTask }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const cachedProfile = sessionStorage.getItem("orbiq_user_profile");
        const loggedInUser = sessionStorage.getItem("user");
        if (cachedProfile) return JSON.parse(cachedProfile);
        if (loggedInUser) return JSON.parse(loggedInUser);
        return null;
    });

    const [isOpen, setIsOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const [notifications, setNotifications] = useState(() => {
        return dashboardData ? getNotifications(dashboardData) : [];
    });
    const dropdownRef = useRef(null);

    const { isMac } = getDevicePlatform();
    const cmdSymbol = isMac ? "⌘" : "Ctrl";

    useEffect(() => {
        if (dashboardData) {
            Promise.resolve().then(() => {
                setNotifications(getNotifications(dashboardData));
            });
        }
    }, [dashboardData]);

    const updateNotifsStorage = (updatedList) => {
        setNotifications(updatedList);
        localStorage.setItem("orbiq_notifications", JSON.stringify(updatedList));
    };

    useEffect(() => {
        if (!isOpen) return;

        const autoDismissTimer = setTimeout(() => {
            setIsOpen(false);
        }, 5000);

        return () => clearTimeout(autoDismissTimer);
    }, [isOpen]);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {

            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsSearchModalOpen(true);
                return;
            }

            if (e.altKey && e.key.toLowerCase() === "t") {
                e.preventDefault();

                setIsSearchModalOpen(false);

                setTimeout(() => {
                    onCreateTask?.();
                }, 120);
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);

        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
        };
    }, [onCreateTask]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (token) {
                    const response = await api.get("/auth/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                    sessionStorage.setItem("orbiq_user_profile", JSON.stringify(response.data));
                    sessionStorage.setItem("user", JSON.stringify(response.data));
                }
            } catch (error) {
                console.error("Topbar user fetch error", error);
            }
        };

        void fetchUserData();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAllAsRead = () => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        updateNotifsStorage(updated);
    };

    const handleClearAll = () => {
        updateNotifsStorage([]);
    };

    const handleSingleNotificationClick = (id) => {
        const updated = notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        );
        updateNotifsStorage(updated);
    };

    const userName = user?.name || "Orbiq Crew";
    const userNameParts = userName.trim().split(/\s+/).filter(Boolean);

    let userInitial = "O";
    if (userNameParts.length === 1) {
        userInitial = userNameParts[0].charAt(0).toUpperCase();
    } else if (userNameParts.length > 1) {
        userInitial = (
            userNameParts[0].charAt(0) +
            userNameParts[userNameParts.length - 1].charAt(0)
        ).toUpperCase();
    }

    const getLocalFallbackAvatar = (nameInitials) => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#7c3aed" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="80" font-weight="700">${nameInitials}</text>
    </svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    };

    const topbarFallback = getLocalFallbackAvatar(userInitial);
    const resolvedTopbarAvatar = (!user?.useGooglePhoto && user?.avatar)
        ? user.avatar
        : (user?.googleAvatar || user?.avatar || topbarFallback);

    const getSystemStatus = () => {
        if (!dashboardData) return "All Systems Operational";
        const pending = dashboardData.pendingTasks || dashboardData.pendingCount || 0;
        const completed = dashboardData.completedTasks || dashboardData.completedCount || 0;

        if (pending > 0) return `${pending} Tasks Pending`;
        if (completed > 0) return `${completed} Missions Completed Today`;
        return "Workspace Synced";
    };

    return (
        <>
            <header className="topbar">
                <div
                    className="search-box"
                    onClick={() => setIsSearchModalOpen(true)}
                    title={`Press ${cmdSymbol} + K to Search`}
                >
                    <FaSearch />
                    <div className="search-live-dot"></div>
                    <input
                        type="text"
                        placeholder={`Search tasks, vectors or execute commands... (${cmdSymbol}K)`}
                        readOnly
                        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    />
                    <div className="cmd-k-badge">
                        {isMac ? <Command size={10} /> : <span style={{ fontSize: "10px", fontWeight: "bold" }}>Ctrl</span>} K
                    </div>
                </div>

                <div className="topbar-right">
                    <div className="user-info">
                        <h4>{currentGreeting || "Welcome back"}</h4>
                        <span className="topbar-status">
                            ● {getSystemStatus()}
                        </span>
                    </div>

                    <div className="notification-dropdown-container" ref={dropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`notification ${isOpen ? "active-bell" : ""}`}
                            onClick={() => setIsOpen(!isOpen)}
                            title="Beacon Signal Notifications"
                        >
                            <FaBell />
                            {unreadCount > 0 && (
                                <span className="notification-badge-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    className="custom-noti-dropdown"
                                    initial={{ opacity: 0, scale: 0.92, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <div className="dropdown-header">
                                        <div className="beacon-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div className="title-left" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Radio size={14} className="beacon-icon" />
                                                <span style={{ fontWeight: "700", fontSize: "14px", color: "#f8fafc" }}>Beacon Signal</span>
                                            </div>

                                            {unreadCount > 0 && (
                                                <button
                                                    className="action-link-btn"
                                                    onClick={handleMarkAllAsRead}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "#06b6d4",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px"
                                                    }}
                                                >
                                                    <CheckCheck size={14} /> Read All
                                                </button>
                                            )}
                                        </div>

                                        <p className="dropdown-subtitle" style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                            {unreadCount > 0
                                                ? `${unreadCount} unread telemetry alerts`
                                                : "Active orbital telemetry & alerts"}
                                        </p>
                                    </div>

                                    <div className="dropdown-body">
                                        {notifications.length === 0 ? (
                                            <div className="empty-notification-state" style={{ padding: "32px 16px", textAlign: "center" }}>
                                                <motion.div
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                                    style={{ color: "#06b6d4", marginBottom: "12px" }}
                                                >
                                                    <Sparkles size={28} />
                                                </motion.div>

                                                <h4 style={{ color: "#f8fafc", fontSize: "15px", fontWeight: "600", margin: "0 0 4px 0" }}>
                                                    📡 Beacon Signal Clear
                                                </h4>
                                                <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
                                                    No new telemetry alerts.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="noti-list-wrapper">
                                                {notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={`notification-item-box p-${n.priority || "info"} ${!n.read ? "unread-notif" : ""}`}
                                                        onClick={() => handleSingleNotificationClick(n.id)}
                                                    >
                                                        <span className="notif-type-icon">{n.icon || "📡"}</span>
                                                        <div className="notif-content-zone">
                                                            <div className="notif-title">{n.title}</div>
                                                            <p className="notif-desc">{n.description || n.message}</p>
                                                            <span className="notif-time-tag">{formatTimeAgo(n.time)}</span>
                                                        </div>
                                                        {!n.read && <div className="unread-dot-indicator" />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {notifications.length > 0 && (
                                        <div className="dropdown-footer">
                                            <button className="clear-all-notifs-btn" onClick={handleClearAll}>
                                                <Trash2 size={12} /> Clear Notifications
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="avatar"
                        onClick={() => navigate("/profile")}
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#0f172a",
                            border: "2px solid rgba(6, 182, 212, 0.4)",
                            boxShadow: "0 0 12px rgba(6, 182, 212, 0.3)",
                            position: "relative"
                        }}
                    >
                        <img
                            src={resolvedTopbarAvatar}
                            alt={userName}
                            referrerPolicy="no-referrer"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = topbarFallback;
                            }}
                        />
                    </motion.div>

                </div>
            </header>

            <GlobalSearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                tasks={tasks}
                onCreateTask={onCreateTask}
            />
        </>
    );
}

export default Topbar;