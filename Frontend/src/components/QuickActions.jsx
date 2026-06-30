import "./../styles/QuickActions.css";
import {
    FaPlus,
    FaCalendarAlt,
    FaRobot,
    FaChartLine,
} from "react-icons/fa";

function QuickActions() {
    return (
        <div className="quick-actions">

            <h2>Quick Actions</h2>

            <div className="action-grid">

                <button className="action-btn">
                    <FaPlus />
                    <span>New Task</span>
                </button>

                <button className="action-btn">
                    <FaCalendarAlt />
                    <span>Calendar</span>
                </button>

                <button className="action-btn premium">
                    <FaRobot />
                    <span>AI Assistant</span>
                    <small>Coming Soon</small>
                </button>

                <button className="action-btn">
                    <FaChartLine />
                    <span>Analytics</span>
                </button>

            </div>

        </div>
    );
}

export default QuickActions;