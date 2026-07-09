import { useEffect, useState } from "react";
import { getAnalyticsStats } from "../services/taskService";
import "./../styles/Analytics.css";

import {
    FaFire,
    FaCheckCircle,
    FaClock,
    FaChartLine
} from "react-icons/fa";

import ProductivityChart from "../components/ProductivityChart";

function Analytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = async () => {
        try {
            const response = await getAnalyticsStats();
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load analytics data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    if (loading) return <div className="analytics-page"><h1>Loading Analytics...</h1></div>;

    return (
        <div className="analytics-page">
            <h1>Analytics</h1>

            <div className="analytics-cards">
                <div className="analytics-card">
                    <FaFire className="analytics-icon fire"/>
                    <h2>{stats?.currentStreak || 0} Days</h2>
                    <p>Current Streak</p>
                </div>

                <div className="analytics-card">
                    <FaCheckCircle className="analytics-icon completed"/>
                    <h2>{stats?.completedTasks || 0}</h2>
                    <p>Completed Tasks</p>
                </div>

                <div className="analytics-card">
                    <FaClock className="analytics-icon pending"/>
                    <h2>{stats?.pendingTasks || 0}</h2>
                    <p>Pending Tasks</p>
                </div>

                <div className="analytics-card">
                    <FaChartLine className="analytics-icon productivity"/>
                    <h2>{stats?.productivity || 0}%</h2>
                    <p>Productivity</p>
                </div>
            </div>

            <div className="chart-container">
                <ProductivityChart tasks={stats?.tasks || []} />
            </div>
        </div>
    );
}

export default Analytics;