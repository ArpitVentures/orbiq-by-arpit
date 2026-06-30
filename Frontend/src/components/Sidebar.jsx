import { Link } from "react-router-dom";
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
    return (
        <aside className="sidebar">

            <div className="logo">
                <h2>TaskFlow</h2>
            </div>

            <nav className="sidebar-menu">

                <Link to="/dashboard">
                    <FaHome />
                    <span>Dashboard</span>
                </Link>

                <Link to="/tasks">
                    <FaTasks />
                    <span>My Tasks</span>
                </Link>

                <Link to="/calendar">
                    <FaCalendarAlt />
                    <span>Calendar</span>
                </Link>

                <Link to="/analytics">
                    <FaChartBar />
                    <span>Analytics</span>
                </Link>

                <Link to="#">
                    <FaRobot />
                    <span>AI Assistant</span>
                </Link>

                <Link to="/settings">
                    <FaCog />
                    <span>Settings</span>
                </Link>

                <Link to="/profile">
                    <FaUser />
                    <span>Profile</span>
                </Link>

                <Link to="/logout">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </Link>

            </nav>

        </aside>
    );
}

export default Sidebar;