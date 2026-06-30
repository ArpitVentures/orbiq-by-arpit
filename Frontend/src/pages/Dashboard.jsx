import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import RecentTasks from "../components/RecentTasks";
import ProductivityChart from "../components/ProductivityChart";
import TodayTasks from "../components/TodayTasks";
import QuickActions from "../components/QuickActions";
import ActivityTimeline from "../components/ActivityTimeline";
import UpcomingDeadlines from "../components/UpcomingDeadlines";
import TaskBoard from "../components/TaskBoard";

import {
    FaTasks,
    FaClock,
    FaCheckCircle,
    FaChartLine
} from "react-icons/fa";

import "../styles/Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard">

            <Sidebar />

            <div className="main-content">

                <Topbar />

                <motion.div
                    className="dashboard-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >

                    <h1>Welcome Back, Arpit 👋🏻</h1>

                    <p>
                        Here's an overview of your productivity today.
                    </p>

                    {/* Stats Cards */}

                    <motion.div
                        className="stats-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            staggerChildren: 0.15
                        }}
                    >

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, scale: 1.03 }}
                        >
                            <StatCard
                                title="Total Tasks"
                                value="120"
                                icon={<FaTasks />}
                                color="#2563eb"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, scale: 1.03 }}
                        >
                            <StatCard
                                title="Pending"
                                value="18"
                                icon={<FaClock />}
                                color="#f59e0b"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, scale: 1.03 }}
                        >
                            <StatCard
                                title="Completed"
                                value="102"
                                icon={<FaCheckCircle />}
                                color="#22c55e"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, scale: 1.03 }}
                        >
                            <StatCard
                                title="Productivity"
                                value="85%"
                                icon={<FaChartLine />}
                                color="#7c3aed"
                            />
                        </motion.div>

                    </motion.div>

                    {/* Dashboard Widgets */}

                    <motion.div
                        className="dashboard-grid"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.12
                                }
                            }
                        }}
                    >

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <RecentTasks />
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <ProductivityChart />
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <TodayTasks />
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <QuickActions />
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <ActivityTimeline />
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <UpcomingDeadlines />
                        </motion.div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <TaskBoard />
                        </motion.div>

                    </motion.div>

                </motion.div>

            </div>

        </div>
    );
}

export default Dashboard;