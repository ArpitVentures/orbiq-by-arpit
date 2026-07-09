import "./../styles/QuickActions.css";
import {
    FaPlus,
    FaCalendarAlt,
    FaRobot,
    FaChartLine,
} from "react-icons/fa";


function QuickActions({ openModal, openCalendar, openAnalytics }) {

    return (
        <div className="quick-actions">
            <h2>Quick Actions</h2>

            <div className="action-grid">

                <button
                    className="action-btn"
                    onClick={openModal}
                >
                    <FaPlus />
                    <span>New Task</span>
                </button>


                <button
                    className="action-btn"
                    onClick={openCalendar}
                >
                    <FaCalendarAlt />
                    <span>Calendar</span>
                </button>


                <button className="action-btn premium">
                    <FaRobot />
                    <span>AI Assistant</span>
                    <small>Coming Soon</small>
                </button>


                <button
                    className="action-btn"
                    onClick={openAnalytics}
                >
                    <FaChartLine />
                    <span>Analytics</span>
                </button>
            </div>
        </div>
    );
}

export default QuickActions;