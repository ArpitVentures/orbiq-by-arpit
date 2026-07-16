import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ProductivityChart from "../components/ProductivityChart";
import { getTasks } from "../services/taskService";

import { FaFire, FaCheckCircle, FaClock, FaChartLine } from "react-icons/fa";

function AnalyticsPage() {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getTasks();
                setTasks(response.data.tasks);
            } catch (error) {
                console.error("Analytics fetch crash:", error);
            }
        };
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const completedTasks = filteredTasks.filter(t => t.status === "Completed");
    const pendingTasks = filteredTasks.filter(t => t.status !== "Completed");
    const productivityRate = filteredTasks.length === 0 ? "0%" :
        `${Math.round((completedTasks.length / filteredTasks.length) * 100)}%`;

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main-content">

                <Topbar onSearchChange={(query) => setSearchQuery(query)} />

                <div className="analytics-container-fluid" style={{ padding: "32px", width: "100%", boxSizing: "border-box" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "24px", color: "#fff" }}>
                        Analytics Dashboard
                    </h1>

                    <div className="stats-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "20px",
                        marginBottom: "32px",
                        width: "100%"
                    }}>
                        <StatCard title="Current Streak" value="0 Days" icon={<FaFire />} color="#f97316" />
                        <StatCard title="Completed Tasks" value={completedTasks.length} icon={<FaCheckCircle />} color="#22c55e" />
                        <StatCard title="Pending Tasks" value={pendingTasks.length} icon={<FaClock />} color="#eab308" />
                        <StatCard title="Productivity" value={productivityRate} icon={<FaChartLine />} color="#a855f7" />
                    </div>

                    <div className="chart-card-wrapper" style={{
                        background: "rgba(15, 23, 42, 0.4)",
                        padding: "24px",
                        borderRadius: "16px",
                        border: "1px solid var(--card-border)"
                    }}>
                        <ProductivityChart tasks={filteredTasks} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;