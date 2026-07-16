import { toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import {
    FaHome,
    FaTasks,
    FaCalendarAlt,
    FaChartBar,
    FaRobot,
    FaCog,
    FaUser,
    FaSignOutAlt,
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success(getRandomQuote(logoutQuotes));
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="logo">
                <h2>ORBIQ</h2>
            </div>

            <nav className="sidebar-menu">
                <NavLink to="/dashboard" className={({ isActive }) =>
                    isActive ? "active" : ""}>
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/tasks" className={({ isActive }) =>
                    isActive ? "active" : ""}>
                    <FaTasks />
                    <span>My Tasks</span>
                </NavLink>

                <NavLink to="/calendar" className={({ isActive }) =>
                    isActive ? "active" : ""}>
                    <FaCalendarAlt />
                    <span>Calendar</span>
                </NavLink>

                <NavLink to="/analytics" className={({ isActive }) =>
                    isActive ? "active" : ""}>
                    <FaChartBar />
                    <span>Analytics</span>
                </NavLink>

                <NavLink to="/ai" className={({ isActive }) =>
                    isActive ? "active" : ""}>
                    <FaRobot />
                    <span>AI Assistant</span>
                </NavLink>

                <NavLink to="/settings" className={({ isActive }) =>
                    isActive ? "active" : ""}>
                    <FaCog />
                    <span>Settings</span>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) =>
                    isActive ? "active" : ""}>
                    <FaUser />
                    <span>Profile</span>
                </NavLink>

                <a href="#logout" onClick={handleLogout} className="logout-item">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </a>
            </nav>
        </aside>
    );
}

export default Sidebar;