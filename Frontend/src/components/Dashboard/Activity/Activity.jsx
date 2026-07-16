import "./Activity.css";
import {
    CheckCircle2,
    PlusCircle,
    CalendarClock,
    Sparkles,
    Crown
} from "lucide-react";

function Activity() {

    const activities = [
        {
            icon: <CheckCircle2 size={18} />,
            title: "Dashboard UI completed",
            time: "2 min ago",
            color: "#22c55e"
        },
        {
            icon: <PlusCircle size={18} />,
            title: "New task created",
            time: "12 min ago",
            color: "#38bdf8"
        },
        {
            icon: <CalendarClock size={18} />,
            title: "Deadline tomorrow",
            time: "Today",
            color: "#f59e0b"
        },
        {
            icon: <Sparkles size={18} />,
            title: "AI suggested task priority",
            time: "Coming Soon",
            color: "#8b5cf6"
        },
        {
            icon: <Crown size={18} />,
            title: "Silver Workspace activated",
            time: "Yesterday",
            color: "#22d3ee"
        }
    ];

    return (

        <section className="activity-card">

            <div className="activity-header">

                <div>

                    <p className="activity-label">
                        WORKSPACE
                    </p>

                    <h2>
                        Recent Activity
                    </h2>

                </div>

            </div>


            <div className="activity-list">

                {
                    activities.map((item, index) => (

                        <div
                            className="activity-item"
                            key={index}
                        >

                            <div
                                className="activity-icon"
                                style={{
                                    background: `${item.color}20`,
                                    color: item.color
                                }}
                            >
                                {item.icon}
                            </div>

                            <div className="activity-content">

                                <h4>
                                    {item.title}
                                </h4>

                                <span>
                                    {item.time}
                                </span>

                            </div>

                        </div>

                    ))
                }

            </div>

        </section>

    );
}

export default Activity;