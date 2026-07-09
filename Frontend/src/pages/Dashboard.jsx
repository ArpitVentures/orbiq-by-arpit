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
import { useState, useEffect } from "react";
import TaskModal from "../components/TaskModal.jsx";
import { useNavigate, useLocation } from "react-router-dom";
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
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [dashSubtitle, setDashSubtitle] = useState("");

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

                const completedCount = allTasks.filter(
                    t => t.status === "Completed"
                ).length;
                const totalCount = allTasks.length;

                if (totalCount > 0 && completedCount === totalCount) {
                    const randomPeak = getRandomQuote(
                        peakProductivityQuotes
                    );

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
        task.title?.toLowerCase().includes(
            searchQuery.toLowerCase()
        )
    );

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main-content">
                <Topbar
                    onSearchChange={(query) => setSearchQuery(query)}
                />

                <motion.div
                    className="dashboard-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >

                    <div className="welcome-header-zone" style={{ marginBottom: "30px" }}>
                        <h1 style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                            Welcome Back, {" "}
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
                                : ` ${dashSubtitle}`
                            }
                        </p>
                    </div>

                    {location.pathname !== "/tasks" && (
                        <div className="stats-grid">
                            <StatCard title="Total Tasks" value={tasks.length} icon =
                                {<FaTasks />} color="#2563eb" />

                            <StatCard title="Pending" value
                                = {tasks.filter(t => t.status !== "Completed").length} icon =
                                          {<FaClock />} color="#f59e0b" />

                            <StatCard title="Completed" value =
                                {tasks.filter(t => t.status === "Completed").length} icon =
                                          {<FaCheckCircle />} color="#22c55e" />

                            <StatCard title="Productivity" value={tasks.length === 0 ? "0%" :
                                `${Math.round((tasks.filter(t =>
                                    t.status === "Completed").length / tasks.length) * 100)}%`} icon =
                                          {<FaChartLine />} color="#7c3aed" />
                        </div>
                    )}

                    <div className={location.pathname === "/tasks" ? "tasks-only-layout" : "dashboard-grid"}>
                        {location.pathname !== "/tasks" ? (
                            <>
                                <RecentTasks tasks={filteredTasks} />
                                <ProductivityChart tasks={tasks} />
                                <TodayTasks tasks={filteredTasks} />
                                <QuickActions
                                    openModal={() => setShowModal(true)}
                                    openCalendar={() => navigate("/calendar")}
                                    openAnalytics={() => navigate("/analytics")}
                                />
                                <ActivityTimeline />
                                <UpcomingDeadlines tasks={filteredTasks} />
                                <TaskBoard
                                    tasks={filteredTasks}
                                    openEditModal={openEditModal}
                                    removeTask={triggerDeleteModal}
                                />
                            </>
                        ) : (
                            <TaskBoard
                                tasks={filteredTasks}
                                openEditModal={openEditModal}
                                removeTask={triggerDeleteModal}
                            />
                        )}
                    </div>
                </motion.div>

                {showModal && <TaskModal mode="create" closeModal={() =>
                    setShowModal(false)} addTask={addTask} refreshTasks={loadTasks} />}
                {showEditModal && <TaskModal mode="edit" task={selectedTask} closeModal =
                    {closeEditModal} refreshTasks={loadTasks} />}

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
                                    <button className="btn-delete-red" onClick =
                                        {handleConfirmDelete}>Delete</button>
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