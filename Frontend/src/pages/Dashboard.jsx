import { motion, AnimatePresence } from "framer-motion";
import {
    createTask,
    getTasks,
    deleteTask
} from "../services/taskService";
import {
    dashboardEmpty,
    deleteQuotes,
    peakProductivityQuotes,
    deleteSuccessQuotes,
    morningDashboardQuotes,
    afternoonDashboardQuotes,
    nightDashboardQuotes,
    getRandomQuote
} from "../utils/funnyQuotes.js";

import WorkspaceHeader from "../components/Dashboard/WorkspaceHeader/WorkspaceHeader";
import MembershipCard from "../components/Dashboard/MembershipCard/MembershipCard";
import StatsGrid from "../components/Dashboard/Stats/Stats";
import Today from "../components/Dashboard/Today/Today.jsx";
import Upcoming from "../components/Dashboard/Upcoming/Upcoming.jsx";
import Activity from "../components/Dashboard/Activity/Activity.jsx";
import Productivity from "../components/Dashboard/Productivity/Productivity.jsx";
import QuickActions from "../components/Dashboard/QuickActions/QuickActions";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import TaskBoard from "../components/TaskBoard";
import { useState, useEffect } from "react";
import TaskModal from "../components/TaskModal.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    FaTasks,
    FaClock,
    FaCheckCircle,
    FaChartLine,
    FaTrashAlt
} from "react-icons/fa";

import "../styles/Dashboard.css";

function Dashboard() {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [dashSubtitle, setDashSubtitle] = useState("");
    const navigate = useNavigate();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [activeDeleteQuote, setActiveDeleteQuote] = useState("");

    const loadTasks = async () => {
        try {
            const response = await getTasks();
            const allTasks = response.data.tasks;
            setTasks(allTasks);

            if (allTasks.length === 0) {
                setDashSubtitle(getRandomQuote(dashboardEmpty));
            } else {
                const hour = new Date().getHours();
                if (hour < 12) {
                    setDashSubtitle(getRandomQuote(morningDashboardQuotes));
                } else if (hour < 17) {
                    setDashSubtitle(getRandomQuote(afternoonDashboardQuotes));
                } else {
                    setDashSubtitle(getRandomQuote(nightDashboardQuotes));
                }

                const completedCount = allTasks.filter(t => t.status === "Completed").length;
                const totalCount = allTasks.length;

                if (totalCount > 0 && completedCount === totalCount) {
                    const randomPeak = getRandomQuote(peakProductivityQuotes);
                    setTimeout(() => {
                        toast.success(randomPeak, {
                            icon: '🧙‍♂️',
                            duration: 4000
                        });
                    }, 500);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const addTask = async (task) => {
        try {
            await createTask(task);
            await loadTasks();
            setShowModal(false);
            toast.success("Task created successfully! 🎉");
        } catch (error) {
            console.error(error);
            toast.error("Unable to create task. ❌");
        }
    };

    const triggerDeleteModal = (id) => {
        setTaskToDelete(id);
        setActiveDeleteQuote(getRandomQuote(deleteQuotes));
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await deleteTask(taskToDelete);
            await loadTasks();
            toast.success(getRandomQuote(deleteSuccessQuotes));
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete task. ❌");
        } finally {
            setDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedTask(null);
        setShowEditModal(false);
    };

    const filteredTasks = tasks.filter(task =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main-content">
                <Topbar onSearchChange={(query) => setSearchQuery(query)} />

                <motion.div
                    className="dashboard-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="welcome-header-zone" style={{ marginBottom: "24px" }}>
                        <h1 style={{ fontSize: "42px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                            Welcome Back,{" "}
                            <span style={{
                                background: "linear-gradient(to right, #06b6d4, #7c3aed)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                display: "inline-block"
                            }}>
                                {(() => {
                                    try {
                                        const localUser = localStorage.getItem("user");
                                        if (localUser) {
                                            const parsed = JSON.parse(localUser);
                                            const nameToExtract = parsed.name || parsed.user?.name;
                                            if (nameToExtract) return nameToExtract.split(" ")[0];
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                    return "Arpit";
                                })()}
                            </span>{" "}
                            👋🏻
                        </h1>
                        <p className="dashboard-subtitle-text" style={{
                            fontSize: "15px",
                            color: "#94a3b8",
                            marginTop: "6px",
                            fontFamily: "monospace",
                            letterSpacing: "0.2px"
                        }}>
                            {location.pathname === "/tasks"
                                ? "Pipeline optimization mode active. Track your loops."
                                : ` ${dashSubtitle}`}
                        </p>
                    </div>

                    {location.pathname !== "/tasks" && (
                        <div className="stats-grid" style={{ marginBottom: "24px" }}>
                            <div onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>
                                <StatCard title="Total Tasks" value={tasks.length} icon={<FaTasks />} color="#2563eb" />
                            </div>
                            <div onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>
                                <StatCard title="Pending" value={tasks.filter(t => t.status !== "Completed").length} icon={<FaClock />} color="#f59e0b" />
                            </div>
                            <div onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>
                                <StatCard title="Completed" value={tasks.filter(t => t.status === "Completed").length} icon={<FaCheckCircle />} color="#22c55e" />
                            </div>
                            <div onClick={() => navigate("/analytics")} style={{ cursor: "pointer" }}>
                                <StatCard title="Productivity" value={tasks.length === 0 ? "0%" : `${Math.round((tasks.filter(t => t.status === "Completed").length / tasks.length) * 100)}%`} icon={<FaChartLine />} color="#7c3aed" />
                            </div>
                        </div>
                    )}

                    <div className="dashboard-layout-container" style={{ width: "100%" }}>
                        {location.pathname !== "/tasks" ? (
                            <div className="dashboard-v2-layout">
                                <WorkspaceHeader />
                                <StatsGrid />

                                <div className="dashboard-content-grid">

                                    <div className="dashboard-left-column">

                                        <Today openModal={() => setShowModal(true)} />

                                        <Activity />

                                        <Productivity />

                                        <Upcoming />

                                    </div>

                                    <div className="dashboard-right-column">

                                        <QuickActions />

                                        <MembershipCard />

                                    </div>

                                </div>

                            </div>
                        ) : (
                            <div className="tasks-only-layout-view">
                                <TaskBoard
                                    tasks={filteredTasks}
                                    openEditModal={openEditModal}
                                    removeTask={triggerDeleteModal}
                                />
                            </div>
                        )}
                    </div>
                </motion.div>

                {showModal && <TaskModal mode="create" closeModal={() =>
                    setShowModal(false)} addTask={addTask} refreshTasks={loadTasks} />}
                {showEditModal && <TaskModal mode="edit" task={selectedTask} closeModal={closeEditModal} refreshTasks={loadTasks} />}

                <AnimatePresence>
                    {deleteModalOpen && (
                        <div className="custom-modal-overlay">
                            <motion.div
                                className="custom-delete-modal"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", duration: 0.4 }}
                            >
                                <div className="delete-modal-icon-zone">
                                    <FaTrashAlt className="animated-trash-icon" />
                                </div>
                                <h3>Delete Task?</h3>
                                <p className="delete-modal-quote-text">{activeDeleteQuote}</p>
                                <div className="delete-modal-action-buttons">
                                    <button className="btn-cancel-gray" onClick={() =>
                                        setDeleteModalOpen(false)}>Cancel</button>
                                    <button className="btn-delete-red" onClick={handleConfirmDelete}> Delete</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Dashboard;