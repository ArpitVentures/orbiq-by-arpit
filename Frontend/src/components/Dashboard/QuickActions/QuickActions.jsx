import "./QuickActions.css";
import {
    FaPlus,
    FaCalendarAlt,
    FaRobot,
    FaChartLine,
    FaArrowRight
} from "react-icons/fa";

function QuickActions({ openModal, openCalendar, openAnalytics }) {

    const actions = [
        {
            icon: <FaPlus />,
            title: "Create Task",
            subtitle: "Start something new",
            action: openModal,
            type: "primary"
        },
        {
            icon: <FaCalendarAlt />,
            title: "Orbit",
            subtitle: "View schedule",
            action: openCalendar
        },
        {
            icon: <FaChartLine />,
            title: "Telemetry",
            subtitle: "Analyze workspace performance",
            action: openAnalytics
        },
        {
            icon: <FaRobot />,
            title: "Horizon",
            subtitle: "Coming Soon",
            disabled: true,
            premium: true,
            tooltip: "Unlock Horizon with ORBIQ Silver or Gold."
        }
    ];

    return (
        <section className="qa-wrapper">
            <div className="qa-header">
                <div>
                    <h2>Quick Actions</h2>
                    <p>Everything important, one click away.</p>
                </div>
            </div>

            <div className="qa-grid">
                {actions.map((item, index) => (
                    <button
                        key={index}
                        className={`qa-card 
                        ${item.type === "primary" ? "primary" : ""}
                        ${item.premium ? "premium" : ""}
                        `}
                        onClick={item.action}
                        disabled={item.disabled}
                        title={item.tooltip || ""}
                    >
                        <div className="qa-icon">
                            {item.icon}
                        </div>

                        <div className="qa-content">
                            <div className="qa-title-row">
                                <h4>{item.title}</h4>
                                {item.premium && (
                                    <span className="beta-pill-inline">BETA</span>
                                )}
                            </div>
                            <span>{item.subtitle}</span>
                        </div>

                        {!item.premium && (
                            <FaArrowRight className="qa-arrow"/>
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default QuickActions;