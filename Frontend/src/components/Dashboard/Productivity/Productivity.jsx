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

    const phaseColors = [
        "#a855f7",
        "#8b5cf6",
        "#3b82f6",
        "#22d3ee",
        "#06b6d4",
        "#f59e0b",
        "#10b981"
    ];

    const productivityData = [
        { phase: "Launch", value: Math.round(numericPercent * 0.45) },
        { phase: "Planning", value: Math.round(numericPercent * 0.55) },
        { phase: "Execution", value: Math.round(numericPercent * 0.65) },
        { phase: "Optimization", value: Math.round(numericPercent * 0.75) },
        { phase: "Review", value: Math.round(numericPercent * 0.85) },
        { phase: "Deploy", value: Math.round(numericPercent * 0.95) },
        { phase: "Today", value: numericPercent }
    ];

    const renderStatusDots = (props) => {
        const { cx, cy, index } = props;
        const color = numericPercent > 0 ? phaseColors[index % phaseColors.length] : "#475569";
        const isLast = index === productivityData.length - 1;

        if (isLast && numericPercent > 0) {
            return (
                <g key={`last-dot-${index}`}>
                    <circle cx={cx} cy={cy} r={9} fill={`${color}33`} />
                    <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill={color}
                        stroke="#070913"
                        strokeWidth={2}
                        style={{ filter: `drop-shadow(0 0 10px ${color})` }}
                    />
                </g>
            );
        }

        return (
            <circle
                key={`dot-${index}`}
                cx={cx}
                cy={cy}
                r={4}
                fill={color}
                stroke="#070913"
                strokeWidth={1.5}
                style={{ filter: numericPercent > 0 ? `drop-shadow(0 0 5px ${color})` : "none" }}
            />
        );
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
                    <LineChart data={productivityData} margin={{ top: 12, right: 15, left: 15, bottom: 5 }}>
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
                            type="monotone"
                            dataKey="value"
                            stroke="#22d3ee"
                            strokeWidth={3.5}
                            dot={renderStatusDots}
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