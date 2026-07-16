import "./Productivity.css";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    CartesianGrid,
    XAxis
} from "recharts";
import {
    TrendingUp,
    ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const productivityData = [
    { day: "Mon", value: 38 },
    { day: "Tue", value: 46 },
    { day: "Wed", value: 58 },
    { day: "Thu", value: 56 },
    { day: "Fri", value: 74 },
    { day: "Sat", value: 69 },
    { day: "Sun", value: 82 }
];

const completionData = [
    { name: "Completed", value: 72 },
    { name: "Pending", value: 28 }
];

const COLORS = [
    "#22d3ee",
    "#1e293b"
];

const userSession = JSON.parse(localStorage.getItem("user")) || { industry: "student" };

const getIndustryHighlight = () => {
    switch (userSession.industry) {
        case "healthcare":
            return { label: "Peak OPD", day: "Monday", metric: "180+" };
        case "professional":
        case "startup_founder":
            return { label: "Peak Performance", day: "Friday", metric: "94%" };
        default:
            return { label: "Best Study Day", day: "Sunday", metric: "92%" };
    }
};

const insights = getIndustryHighlight();

function Productivity() {
    const navigate = useNavigate();

    return (

        <motion.section
            className="productivity-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="productivity-header">
                <div>
                    <p className="productivity-label">ANALYTICS</p>
                    <h2>Weekly Productivity</h2>
                </div>

                <div className="trend-badge">
                    <span className="trend-badge-lbl">Weekly Growth</span>
                    <span className="badge-value">
                        <TrendingUp size={14} style={{ display: "inline", marginRight: "4px", transform: "translateY(-1px)" }} />
                        ↗ +12%
                    </span>
                </div>
            </div>

            <div className="productivity-line">
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={productivityData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                            dy={10}
                            interval={0}
                            padding={{ left: 10, right: 10 }}
                        />
                        <Tooltip
                            contentStyle={{ background: "#0f1222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                            labelStyle={{ color: "#ffffff" }}
                        />

                        <Line
                            className="premium-animated-line"
                            type="monotone"
                            dataKey="value"
                            stroke="#22d3ee"
                            strokeWidth={4}
                            dot={false}
                            activeDot={{ r: 6, fill: "#22d3ee", stroke: "#070913", strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="analytics-insights-bar">
                <span className="insight-label">{insights.label}:</span>
                <span className="insight-value">{insights.day} ({insights.metric})</span>
            </div>

            <div className="productivity-bottom">
                <div className="pie-wrapper">
                    <ResponsiveContainer width={120} height={120}>
                        <PieChart>
                            <Pie
                                data={completionData}
                                dataKey="value"
                                innerRadius={36}
                                outerRadius={50}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {completionData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center-metrics">
                        <span className="donut-value">72%</span>
                        <span className="donut-label">Done</span>
                    </div>
                </div>

                <div className="completion-info">
                    <h3>72%</h3>
                    <span>Tasks Completed</span>
                    <button className="analytics-redirect-btn" onClick={() => navigate("/analytics")}>
                        Open Analytics
                        <ArrowUpRight size={17} />
                    </button>
                </div>
            </div>
        </motion.section>
    );
}

export default Productivity;