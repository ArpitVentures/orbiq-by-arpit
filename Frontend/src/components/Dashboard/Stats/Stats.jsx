import {
    FaTasks,
    FaCalendarDay,
    FaChartLine,
    FaFire
} from "react-icons/fa";

import StatCard from "./StatCard";
import "./Stats.css";

function Stats() {

    const stats = [
        {
            icon: <FaTasks />,
            title: "Total Tasks",
            value: "126",
            subtitle: "Across all projects",
            accentClass: "cyan-card"
        },

        {
            icon: <FaCalendarDay />,
            title: "Due Today",
            value: "4",
            subtitle: "Stay focused",
            accentClass: "orange-card"
        },

        {
            icon: <FaChartLine />,
            title: "Completion",
            value: "84%",
            subtitle: "Excellent consistency",
            accentClass: "green-card"
        },

        {
            icon: <FaFire />,
            title: "Current Streak",
            value: "12 Days",
            subtitle: "Keep it alive 🔥",
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