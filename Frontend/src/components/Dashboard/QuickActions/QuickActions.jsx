import "./QuickActions.css";
import {
    FaPlus,
    FaCalendarAlt,
    FaRobot,
    FaChartLine,
    FaArrowRight
} from "react-icons/fa";

function QuickActions({
                          openModal,
                          openCalendar,
                          openAnalytics,
                          openHorizon,
                          userData
                      }) {
    const userPlan = String(
        userData?.plan || userData?.tier || "Free"
    ).trim().toLowerCase();

    const hasApexAccess =
        userPlan === "gold" ||
        userPlan === "apex" ||
        userPlan === "pro";

    const isMacPlatform = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const taskShortcutLabel = isMacPlatform ? "⌥ T" : "Alt + T";

    const actions = [
        {
            icon: <FaPlus />,
            title: "Create Task",
            subtitle: "Start something new",
            action: openModal,
            type: "primary",
            shortcut: taskShortcutLabel
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
            subtitle: hasApexAccess
                ? "Open your intelligence workspace"
                : "Available with APEX",
            action: hasApexAccess ? openHorizon : undefined,
            disabled: !hasApexAccess,
            premium: true,
            tooltip: hasApexAccess
                ? "Open HORIZON Intelligence"
                : "Unlock HORIZON with an APEX membership."
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

                        {item.shortcut && (
                            <span className="qa-shortcut-badge">
        {item.shortcut}
    </span>
                        )}

                        {!item.premium && (
                            <FaArrowRight className="qa-arrow" />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default QuickActions;