import React from "react";
import "./Productivity.css";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    CartesianGrid,
    XAxis
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Productivity({ data }) {
    const navigate = useNavigate();

    const total = data?.totalTasks || 0;
    const completed = data?.completedTasks || 0;
    const rawProd = data?.productivity || "0%";
    const numericPercent = parseInt(rawProd) || 0;

    const completionData = [
        { name: "Completed", value: numericPercent, fill: "#22d3ee" },
        { name: "Pending", value: Math.max(0, 100 - numericPercent), fill: "#1e293b" }
    ];

    const seed = completed + total + numericPercent;

    const productivityData = [
        {
            phase: "Launch",
            value: Math.max(0, Math.round(numericPercent * 0.35 + (seed % 5)))
        },
        {
            phase: "Planning",
            value: Math.max(0, Math.round(numericPercent * 0.48 + (seed % 7)))
        },
        {
            phase: "Execution",
            value: Math.max(0, Math.round(numericPercent * 0.58 + (seed % 4)))
        },
        {
            phase: "Optimization",
            value: Math.max(0, Math.round(numericPercent * 0.72 + (seed % 6)))
        },
        {
            phase: "Review",
            value: Math.max(0, Math.round(numericPercent * 0.82 + (seed % 5)))
        },
        {
            phase: "Deploy",
            value: Math.max(0, Math.round(numericPercent * 0.90 + (seed % 3)))
        },
        {
            phase: "Today",
            value: numericPercent
        }
    ];

    const renderLastPointDot = (props) => {
        const { cx, cy, index } = props;
        if (index === productivityData.length - 1) {
            return (
                <g key={`last-dot-${index}`}>
                    <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="rgba(34, 211, 238, 0.25)"
                    />
                    <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill="#22d3ee"
                        stroke="#070913"
                        strokeWidth={2}
                        style={{ filter: "drop-shadow(0 0 8px #22d3ee)" }}
                    />
                </g>
            );
        }
        return <React.Fragment key={`dot-${index}`} />;
    };

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
                    <p className="productivity-label">TELEMETRY</p>
                    <h2>Mission Performance</h2>
                </div>

                <div className="trend-badge">
                    <span className="trend-badge-lbl">☄️ Momentum</span>
                    <span className="badge-value">{rawProd}</span>
                </div>
            </div>

            <div className="productivity-line">
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={productivityData} margin={{ top: 10, right: 15, left: 15, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />

                        <XAxis
                            dataKey="phase"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                            dy={10}
                            interval={0}
                            padding={{ left: 10, right: 10 }}
                        />
                        <Tooltip
                            formatter={(value) => [`${value}%`, "Mission Velocity"]}
                            cursor={{ stroke: "#22d3ee", strokeOpacity: 0.25 }}
                            contentStyle={{
                                background: "#0f172a",
                                border: "1px solid rgba(34,211,238,.2)",
                                borderRadius: "12px",
                                color: "#fff"
                            }}
                            labelStyle={{ color: "#22d3ee", fontWeight: "700" }}
                        />

                        <Line
                            className="premium-animated-line"
                            type="natural"
                            dataKey="value"
                            stroke="#22d3ee"
                            strokeWidth={4}
                            dot={renderLastPointDot}
                            activeDot={{
                                r: 7,
                                fill: "#22d3ee",
                                stroke: "#070913",
                                strokeWidth: 3
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="telemetry-insights-bar">
                <span className="insight-label">Telemetry Status:</span>
                <span className="insight-value">
                    {total > 0 ? `Active Velocity (${rawProd})` : "Standby Mode (0%)"}
                </span>
            </div>

            <div className="productivity-bottom">
                <div className="pie-wrapper">
                    <ResponsiveContainer width={120} height={120}>
                        <PieChart>
                            <Pie
                                data={completionData}
                                dataKey="value"
                                innerRadius={38}
                                outerRadius={52}
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={3}
                                stroke="transparent"
                                isAnimationActive
                                animationDuration={1200}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center-metrics">
                        <span className="donut-value">{rawProd}</span>
                        <span className="donut-label">Done</span>
                    </div>
                </div>

                <div className="completion-info">
                    <h3>{rawProd}</h3>
                    <span>Missions Completed ({completed}/{total})</span>

                    <button className="telemetry-redirect-btn" onClick={() => navigate("/analytics")}>
                        Open Telemetry
                        <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>
        </motion.section>
    );
}

export default Productivity;