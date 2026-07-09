import "./../styles/ProductivityChart.css";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

function ProductivityChart({ tasks = [] }) {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (!tasks || tasks.length === 0) {
        return (
            <div className="productivity-chart clean-empty-state" style={{
                padding: "60px 20px",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.01)",
                border: "1px dashed rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                color: "#94a3b8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "320px"
            }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📈</div>
                <h3 style={{ color: "#f59e0b", fontSize: "16px", fontWeight: "600", margin: "0 0 6px 0" }}>
                    No productivity metrics available yet!
                </h3>
                <p style={{ fontSize: "13px", opacity: 0.7, margin: 0, maxWidth: "280px", lineHeight: "1.4" }}>
                    Create and complete tasks to start mapping your weekly engine performance.
                </p>
            </div>
        );
    }

    const data = weekDays.map((day) => ({
        day,
        tasks: tasks.filter((task) => {
            const date = new Date(task.createdAt);
            return weekDays[date.getDay()] === day;
        }).length
    }));

    return (
        <div className="productivity-chart">
            <h2>Weekly Productivity</h2>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 10,
                        left: -20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                    />

                    <XAxis
                        dataKey="day"
                        stroke="#94a3b8"
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                    />

                    <YAxis
                        stroke="#94a3b8"
                    />

                    <Tooltip />

                    <Bar
                        dataKey="tasks"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1200}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ProductivityChart;