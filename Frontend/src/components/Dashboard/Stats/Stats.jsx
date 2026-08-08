import {
    FaTasks,
    FaCalendarDay,
    FaChartLine,
    FaFire
} from "react-icons/fa";

import StatCard from "./StatCard";
import "./Stats.css";

function Stats({ statsData }) {
    const total = statsData?.totalTasks || 0;
    const pending = statsData?.pendingTasks || 0;
    const productivity = statsData?.productivity || "0%";

    const stats = [
        {
            icon: <FaTasks />,
            title: "Workspace Tasks",
            value: total.toString(),
            subtitle: "Across your workspace",
            accentClass: "cyan-card"
        },
        {
            icon: <FaCalendarDay />,
            title: "Today's Priorities",
            value: pending.toString(),
            subtitle: "Ready to execute",
            accentClass: "orange-card"
        },
        {
            icon: <FaChartLine />,
            title: "Workspace Progress",
            value: productivity,
            subtitle: total > 0 ? "Live momentum" : "Awaiting vectors",
            accentClass: "green-card"
        },
        {
            icon: <FaFire />,
            title: "Mission Streak",
            value: total > 0 ? "1 Day" : "0 Days",
            subtitle: "Maintain your momentum 🚀",
            accentClass: "purple-card"
        }
    ];

    return (
        <section className="stats-grid">
            {stats.map((stat) => (
                <StatCard
                    key={stat.title}
                    {...stat}
                />
            ))}
        </section>
    );
}

export default Stats;