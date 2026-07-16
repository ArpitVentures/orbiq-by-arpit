import "../styles/Topbar.css";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";

function Topbar({ onSearchChange }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [notifications, _setNotifications] = useState([]);

    const hour = new Date().getHours();
    let greeting = "Good Evening 🌙";
    if (hour < 12) greeting = "Good Morning 🌅";
    else if (hour < 18) greeting = "Good Afternoon ☀️";

    useEffect(() => {
        if (isOpen && notifications.length === 0) {
            const timer = setTimeout(() => {
                setIsOpen(false);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [isOpen, notifications]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await api.get("/auth/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Topbar user fetch error", error);
            }
        };

        fetchUserData();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <header className="topbar">
            <div className="search-box">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search by title, category..."
                    onChange={(e) =>
                        onSearchChange && onSearchChange(e.target.value)}
                />
            </div>

            <div className="topbar-right">
                <div className="user-info">
                    <h4>{greeting}</h4>
                </div>

                <div className="notification-dropdown-container" ref={dropdownRef}>
                    <button
                        className={`notification ${isOpen ? 'active-bell' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <FaBell />
                        {notifications.length > 0 && <span className="notification-badge" />}
                    </button>

                    {isOpen && (
                        <div className="custom-noti-dropdown">
                            <div className="dropdown-header">
                                <span>Notifications</span>
                            </div>
                            <div className="dropdown-body">
                                {notifications.length === 0 ? (
                                    <div className="empty-noti-state">
                                        <p className="emoji">🎉</p>
                                        <p className="text">No new notifications. Enjoy your day!</p>
                                    </div>
                                ) : (
                                    <div className="noti-list-wrapper">
                                        {notifications.map((n, i) => (
                                            <div key={i} className="noti-item-box">
                                                {n.message}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="avatar" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                    {userInitial}
                </div>
            </div>
        </header>
    );
}

export default Topbar;