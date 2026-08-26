import { motion, AnimatePresence } from "framer-motion";
import { createTask, deleteTask } from "../services/taskService";
import "../styles/Dashboard.css";
import api from "../services/api";

import {
    dashboardEmpty,
    deleteQuotes,
    deleteSuccessQuotes,
    completedQuotes,
    morningDashboardQuotes,
    afternoonDashboardQuotes,
    eveningDashboardQuotes,
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
import PulsarTelemetryCard from "../components/Dashboard/PulsarTelemetryCard/PulsarTelemetryCard.jsx";
import AmbientParticles from "../components/Ambient/AmbientParticles";
import SkeletonLoader from "../components/Dashboard/SkeletonLoader/SkeletonLoader";
import MissionStatusCard from "../components/Common/MissionStatusCard/MissionStatusCard.jsx";
import WeeklySummaryCard from "../components/Dashboard/WeeklySummaryCard/WeeklySummaryCard.jsx";
import OrbiqLexicon from "../components/Dashboard/OrbiqLexicon/OrbiqLexicon";

import Sidebar from "../components/Sidebar";
import OrbiqGlow from "../components/OrbiqGlow";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import TaskBoard from "../components/TaskBoard";
import { useState, useEffect, useCallback, useRef } from "react";
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

import {
    RefreshCw,
    CheckCircle2,
    Radio,
    Globe,
    ShieldAlert
} from "lucide-react";

const timeToMinutes = (timeStr) => {
    if (!timeStr) return 390;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
};

const getSmartGreeting = (userName = "Crew Member") => {
    const style = localStorage.getItem("orbiq_greeting_style") || "default";
    const rank = localStorage.getItem("orbiq_space_rank") || "Commander";
    const morningStr = localStorage.getItem("orbiq_morning_time") || "06:30";
    const nightStr = localStorage.getItem("orbiq_night_time") || "22:00";

    const morningMin = timeToMinutes(morningStr);
    const nightMin = timeToMinutes(nightStr);

    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    let timeOfDay;
    if (currentMin >= morningMin && currentMin < 12 * 60) {
        timeOfDay = "morning";
    } else if (currentMin >= 12 * 60 && currentMin < 17 * 60) {
        timeOfDay = "afternoon";
    } else if (currentMin >= 17 * 60 && currentMin < nightMin) {
        timeOfDay = "evening";
    } else {
        timeOfDay = "night";
    }

    const firstName = userName.split(" ")[0];

    switch (style) {
        case "professional":
            if (timeOfDay === "morning") return `Good Morning, ${firstName}.`;
            if (timeOfDay === "afternoon") return `Good Afternoon, ${firstName}.`;
            if (timeOfDay === "evening") return `Good Evening, ${firstName}.`;
            return `Good Night, ${firstName}.`;

        case "friendly":
            if (timeOfDay === "morning") return `Morning ${firstName}! ☕`;
            if (timeOfDay === "afternoon") return `Hey ${firstName}, hope your day's going great! ☀️`;
            if (timeOfDay === "evening") return `Evening ${firstName}! Wrapping up for the day? 🌆`;
            return `Late night hustle, ${firstName}? 🌙`;

        case "space_commander":
            if (timeOfDay === "morning") return `🚀 Mission Control Online, ${rank} ${firstName}.`;
            if (timeOfDay === "afternoon") return `🛰️ Orbital Alignment Optimal, ${rank}.`;
            if (timeOfDay === "evening") return `🌌 Telemetry Stable, ${rank} ${firstName}. Preparing Horizon Shift.`;
            return `🌙 Stealth Night Recon active, ${rank}.`;

        case "default":
        default:
            if (timeOfDay === "morning") return "Good Morning 🌅";
            if (timeOfDay === "afternoon") return "Good Afternoon ☀️";
            if (timeOfDay === "evening") return "Good Evening 🌆";
            return "Good Night 🌙";
    }
};

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showWorkspaceLimitModal, setShowWorkspaceLimitModal] = useState(
        () => sessionStorage.getItem("reopenLimitModal") === "true"
    );
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [activeDeleteQuote, setActiveDeleteQuote] = useState("");

    const [missionGlow, setMissionGlow] = useState(false);
    const [workspaceGlow, setWorkspaceGlow] = useState(false);
    const [criticalGlow, setCriticalGlow] = useState(0);

    const [dashboardData, setDashboardData] = useState(() => {
        const cached = sessionStorage.getItem("orbiq_dashboard_cache");
        return cached ? JSON.parse(cached) : null;
    });

    const [isLoading, setIsLoading] = useState(!dashboardData);
    const hasLoadedDashboard = useRef(!!dashboardData);

    const [isError, setIsError] = useState(false);
    const [dashSubtitle, setDashSubtitle] = useState("");

    const [isRetryingSync, setIsRetryingSync] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);
    const [dots, setDots] = useState("");
    const [countdown, setCountdown] = useState(5);

    const isDev = import.meta.env.DEV;
    const offlineSubtitleText = isDev
        ? "Unable to establish encrypted communication with ORBIQ infrastructure. Check WebStorm terminal or local ecosystem servers."
        : "ORBIQ services are temporarily unavailable. We're automatically searching for a secure relay.";

    useEffect(() => {
        sessionStorage.removeItem("reopenLimitModal");
    }, []);

    useEffect(() => {
        if (!isError) return;
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 450);
        return () => clearInterval(interval);
    }, [isError]);

    const computeTemporalSubtitle = useCallback((totalTasksCount) => {
        if (totalTasksCount === 0) {
            setDashSubtitle(getRandomQuote(dashboardEmpty));
            return;
        }

        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setDashSubtitle(getRandomQuote(morningDashboardQuotes));
        } else if (hour >= 12 && hour < 17) {
            setDashSubtitle(getRandomQuote(afternoonDashboardQuotes));
        } else if (hour >= 17 && hour < 21) {
            setDashSubtitle(getRandomQuote(eveningDashboardQuotes));
        } else {
            setDashSubtitle(getRandomQuote(nightDashboardQuotes));
        }
    }, []);

    const loadDashboardSummary = useCallback(async () => {
        try {
            const response = await api.get("/tasks/dashboard-summary");

            if (response.data && response.data.success) {
                const payload = response.data;

                setDashboardData(payload);
                sessionStorage.setItem("orbiq_dashboard_cache", JSON.stringify(payload));

                hasLoadedDashboard.current = true;
                sessionStorage.setItem("orbiq_dashboard_loaded", "true");

                computeTemporalSubtitle(payload.stats.totalTasks);

                return true;
            }

            return false;
        } catch (error) {
            console.error("Dashboard fetch error tracking:", error);

            if (!hasLoadedDashboard.current) {
                setIsError(true);
            }

            return false;
        } finally {
            setIsLoading(false);
        }
    }, [computeTemporalSubtitle]);

    useEffect(() => {
        const timer = setTimeout(() => {
            void loadDashboardSummary();
        }, 0);

        return () => clearTimeout(timer);
    }, [location.pathname, loadDashboardSummary]);

    const handleRetryUplink = useCallback(async () => {
        setIsRetryingSync(true);
        setIsLoading(true);
        setIsError(false);

        const success = await loadDashboardSummary();

        if (success) {
            setSyncSuccess(true);
            setTimeout(() => {
                setIsError(false);
                setSyncSuccess(false);
                setIsRetryingSync(false);
                toast.success("Uplink Established! 🚀");
            }, 1200);
        } else {
            setTimeout(() => {
                setIsRetryingSync(false);
                toast.error("Retry failed. Check backend server.");
            }, 1000);
        }
    }, [loadDashboardSummary]);

    useEffect(() => {
        if (!isError || syncSuccess) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    void handleRetryUplink();
                    return 5;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isError, syncSuccess, handleRetryUplink]);

    const addTask = async (task) => {
        try {
            await createTask(task);

            await loadDashboardSummary();

            setShowModal(false);

            setWorkspaceGlow(false);
            requestAnimationFrame(() => setWorkspaceGlow(true));

            toast.success("Task created successfully! 🎉");
        } catch (error) {
            console.error("Create task error:", error);

            const status = error.response?.status;
            const message =
                error.response?.data?.message ||
                error.message ||
                "";

            const isWorkspaceLimitError =
                status === 403 ||
                /limit|active tasks|free workspace|maximum.*task|task limit/i.test(
                    message
                );

            if (isWorkspaceLimitError) {
                setShowModal(false);
                setShowWorkspaceLimitModal(true);

                setCriticalGlow(0);
                setTimeout(() => {
                    setCriticalGlow(Date.now());
                }, 20);
                return;
            }

            setCriticalGlow(0);
            setTimeout(() => {
                setCriticalGlow(Date.now());
            }, 20);

            toast.error(`Unable to create task. ${message || "Please try again."} ❌`);
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
            await loadDashboardSummary();

            setWorkspaceGlow(false);
            requestAnimationFrame(() => setWorkspaceGlow(true));

            toast.success(getRandomQuote(deleteSuccessQuotes));
        } catch (error) {
            console.error(error);

            setCriticalGlow(0);
            setTimeout(() => setCriticalGlow(Date.now()), 20);

            toast.error("Unable to delete task. ❌");
        } finally {
            setDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await api.put(`/tasks/${taskId}`, {
                status: "Completed"
            });

            await loadDashboardSummary();

            toast.success(getRandomQuote(completedQuotes));

            setMissionGlow(false);
            requestAnimationFrame(() => setMissionGlow(true));

        } catch (err) {
            console.error(err);

            setCriticalGlow(0);
            setTimeout(() => setCriticalGlow(Date.now()), 20);

            toast.error("Unable to complete mission.");
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

    const recentTasksList = dashboardData?.recentTasks || [];
    const fullWorkspaceTasks = dashboardData?.allTasks || [];

    const filteredTasks = fullWorkspaceTasks.filter(task =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentGreeting = getSmartGreeting(
        dashboardData?.user?.name || "Crew Member"
    );


    if (isError) {
        return (
            <div className="uplink-screen-container">
                <div className="nebula-glow-center"></div>

                <div className="uplink-layout-card">
                    <div className="uplink-left-pane">
                        <div className="brand-header">
                            <div className="brand-badge-logo">Q</div>
                            <span className="brand-title">ORBIQ</span>
                            <span className="system-pill-version">v1.0.0 OS</span>
                        </div>

                        <div className="uplink-status-content">
                            {syncSuccess ? (
                                <div className="success-banner animate-pop">
                                    <CheckCircle2 size={32} color="#22c55e" />
                                    <div>
                                        <h2 className="success-text">✓ UPLINK ESTABLISHED</h2>
                                        <p>Secure uplink established. Redirecting to Dashboard...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="status-indicator-tag">
                                        <ShieldAlert size={16} />
                                        <span>AWAITING MISSION CONTROL</span>
                                    </div>

                                    <h1>Mission Control is waiting for a secure uplink.</h1>
                                    <p className="uplink-subtitle">{offlineSubtitleText}</p>
                                </>
                            )}
                        </div>

                        <div className="progress-section">
                            <div className="progress-label">
                                <span>
                                    {isRetryingSync
                                        ? `Connecting${dots}`
                                        : `Auto-retrying in ${countdown}s...`}
                                </span>
                                <span className="mono-code">ERR_SOCKET_OFFLINE</span>
                            </div>
                            <div className="progress-bar-track">
                                <div className="progress-bar-fill active-scanning"></div>
                            </div>
                        </div>

                        <div className="matrix-nodes-row">
                            <div className="matrix-node">
                                <span className="node-dot offline"></span>
                                <span>Connection</span>
                            </div>
                            <div className="matrix-node">
                                <span className="node-dot offline"></span>
                                <span>Telemetry</span>
                            </div>
                            <div className="matrix-node">
                                <span className="node-dot warning"></span>
                                <span>Horizon</span>
                            </div>
                            <div className="matrix-node">
                                <span className="node-dot offline"></span>
                                <span>Workspace</span>
                            </div>
                        </div>

                        {!syncSuccess && (
                            <button
                                className={`glass-retry-btn ${isRetryingSync ? "loading" : ""}`}
                                onClick={() => {
                                    setCountdown(5);
                                    void handleRetryUplink();
                                }}
                                disabled={isRetryingSync}
                            >
                                <RefreshCw size={18} className="retry-icon-spin" />
                                <span>
                                    {isRetryingSync
                                        ? "Establishing Handshake..."
                                        : `Retry Synchronization (${countdown}s)`}
                                </span>
                            </button>
                        )}
                    </div>

                    <div className="uplink-right-pane">
                        <div className="orbital-system-viewport">
                            <div className="orbit-ring counter-rotate">
                                <div className="orbiting-satellite">
                                    <Radio size={18} className="satellite-icon wifi-pulse" />
                                </div>
                            </div>

                            <div className={`hologram-earth globe-rotate ${syncSuccess ? "connected-glow" : ""}`}>
                                <Globe size={110} strokeWidth={1} />
                                <div className="earth-atmosphere-glow"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading && !dashboardData) {
        return <SkeletonLoader />;
    }

    return (
        <div className="dashboard">

            <OrbiqGlow type="MISSION_COMPLETE" active={missionGlow} />
            <OrbiqGlow type="WORKSPACE_EVENT" active={workspaceGlow} />
            <OrbiqGlow
                key={criticalGlow}
                type="CRITICAL_ALERT"
                active={criticalGlow > 0}
            />

            <AmbientParticles />
            <Sidebar />

            <div className="main-content">
                <Topbar
                    tasks={fullWorkspaceTasks}
                    onSearchChange={(query) => setSearchQuery(query)}
                    onCreateTask={() => setShowModal(true)}
                    dashboardData={dashboardData}
                />

                <motion.div
                    className="dashboard-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="welcome-header-zone">
                        <div className="greeting-text-container">
                            <h1 className="greeting-title">
                                {currentGreeting} 👋🏻
                            </h1>

                            <p className="dashboard-subtitle-text">
                                {location.pathname === "/tasks"
                                    ? "Keep your focus sharp. One task at a time."
                                    : `${dashSubtitle}`}
                            </p>

                            <PulsarTelemetryCard
                                userState={dashboardData?.stats?.totalTasks > 0 ? "FOCUS" : "OFFLINE"}
                                statsData={dashboardData?.stats}
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "12px"
                        }}>

                            <MissionStatusCard />
                        </div>
                    </div>

                    {location.pathname !== "/tasks" && (
                        <div className="stats-grid" style={{ marginBottom: "24px" }}>
                            <div onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>
                                <StatCard title="Total Tasks" value={dashboardData?.stats?.totalTasks || 0} icon={<FaTasks />} color="#2563eb" />
                            </div>

                            <div onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>
                                <StatCard title="Pending" value={dashboardData?.stats?.pendingTasks || 0} icon={<FaClock />} color="#f59e0b" />
                            </div>

                            <div onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>
                                <StatCard title="Completed" value={dashboardData?.stats?.completedTasks || 0} icon={<FaCheckCircle />} color="#22c55e" />
                            </div>

                            <div onClick={() => navigate("/analytics")} style={{ cursor: "pointer" }}>
                                <StatCard title="Workspace Progress" value={dashboardData?.stats?.productivity || "0%"} icon={<FaChartLine />} color="#7c3aed" />
                            </div>
                        </div>
                    )}

                    <div className="dashboard-layout-container" style={{ width: "100%" }}>
                        {location.pathname !== "/tasks" ? (
                            <div className="dashboard-v2-layout">
                                <WorkspaceHeader userData={dashboardData?.user} />
                                <StatsGrid statsData={dashboardData?.stats} />

                                <div className="dashboard-content-grid">
                                    <div className="dashboard-left-column">
                                        <div className="dashboard-focus-zone" style={{
                                            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.03) 0%, rgba(124, 58, 237, 0.03) 100%)",
                                            backgroundColor: "#0b0f19",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                            borderRadius: "20px",
                                            padding: "24px",
                                            marginBottom: "24px",
                                            position: "relative",
                                            overflow: "hidden"
                                        }}>
                                            <div style={{
                                                position: "absolute",
                                                top: "-50px",
                                                right: "-50px",
                                                width: "150px",
                                                height: "150px",
                                                background: "radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)",
                                                pointerEvents: "none"
                                            }}></div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#22d3ee", textTransform: "uppercase", letterSpacing: "1px" }}>
                                                    🎯 Today's Focus
                                                </span>
                                                {dashboardData?.todayFocus?.dueDate && (
                                                    <span style={{ fontSize: "12px", background: "rgba(244, 63, 94, 0.1)", color: "#fb7185", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
                                                        Deadline Looming ⏳
                                                    </span>
                                                )}
                                            </div>

                                            {dashboardData?.todayFocus ? (
                                                <div>
                                                    <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>
                                                        {dashboardData.todayFocus.title}
                                                    </h2>
                                                    <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "18px" }}>
                                                        {dashboardData.todayFocus.description || "Your highest upcoming priority item. Keep the momentum going!"}
                                                    </p>

                                                    <div style={{ marginBottom: "20px" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                                                            <span>Workspace Progress</span>
                                                            <span>{dashboardData?.stats?.productivity || "0%"}</span>
                                                        </div>
                                                        <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.04)", borderRadius: "999px", overflow: "hidden" }}>
                                                            <div style={{
                                                                width: dashboardData?.stats?.productivity || "0%",
                                                                height: "100%",
                                                                background: "linear-gradient(90deg, #22d3ee, #6366f1)",
                                                                transition: "width 0.5s ease"
                                                            }}></div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => navigate("/tasks")}
                                                        className="focus-continue-btn"
                                                        style={{
                                                            background: "rgba(255, 255, 255, 0.03)",
                                                            border: "1px solid rgba(255, 255, 255, 0.08)",
                                                            color: "#fff",
                                                            padding: "10px 20px",
                                                            borderRadius: "10px",
                                                            fontSize: "13px",
                                                            fontWeight: "600",
                                                            cursor: "pointer",
                                                            transition: "all 0.2s"
                                                        }}
                                                    >
                                                        Resume Mission →
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ padding: "10px 0" }}>
                                                    <h4 style={{ color: "#cbd5e1", fontSize: "16px", margin: "0 0 4px 0" }}>All Caught Up! 🎉</h4>
                                                    <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>No pending tasks found. Enjoy your clear dashboard slate or add new vectors.</p>
                                                </div>
                                            )}
                                        </div>

                                        <Today
                                            openModal={() => setShowModal(true)}
                                            tasks={fullWorkspaceTasks}
                                            onCompleteTask={handleCompleteTask}
                                        />
                                        <Activity tasks={recentTasksList} />
                                        <Productivity data={dashboardData?.stats} />
                                        <Upcoming tasks={recentTasksList} />
                                    </div>

                                    <div className="dashboard-right-column">
                                        <QuickActions
                                            openModal={() => setShowModal(true)}
                                            openCalendar={() => navigate("/calendar")}
                                            openAnalytics={() => navigate("/analytics")}
                                            openHorizon={() =>
                                                navigate("/horizon/workspace", {
                                                    state: { horizonLaunch: true }
                                                })
                                            }
                                            userData={dashboardData?.user}
                                        />
                                        <MembershipCard userData={dashboardData?.user} />
                                        <WeeklySummaryCard statsData={dashboardData?.stats} />
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

                {showModal && (
                    <TaskModal
                        mode="create"
                        closeModal={() => setShowModal(false)}
                        addTask={addTask}
                        onError={() => {
                            setCriticalGlow(0);
                            setTimeout(() => setCriticalGlow(Date.now()), 20);
                        }}
                        refreshTasks={() => void loadDashboardSummary()}
                    />
                )}

                {showEditModal && (
                    <TaskModal
                        key={selectedTask?._id}
                        mode="edit"
                        task={selectedTask}
                        closeModal={closeEditModal}
                        showCompletionMessage={location.pathname === "/tasks"}
                        onError={() => {
                            setCriticalGlow(0);
                            setTimeout(() => setCriticalGlow(Date.now()), 20);
                        }}
                        refreshTasks={async (updatedStatus) => {
                            await loadDashboardSummary();

                            if (updatedStatus === "Completed") {
                                setMissionGlow(false);
                                requestAnimationFrame(() => {
                                    setMissionGlow(true);
                                });
                            } else if (updatedStatus) {
                                setWorkspaceGlow(false);
                                requestAnimationFrame(() => {
                                    setWorkspaceGlow(true);
                                });
                            }
                        }}
                    />
                )}

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

                                <h3>⚠️ Abort Mission?</h3>

                                <p className="delete-modal-quote-text" style={{ color: "#94a3b8", margin: "12px 0 20px" }}>
                                    {activeDeleteQuote || "This task will be permanently removed from Mission Control."}
                                </p>

                                <div className="delete-modal-action-buttons">
                                    <button
                                        className="btn-cancel-gray"
                                        onClick={() => setDeleteModalOpen(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn-delete-red"
                                        onClick={() => void handleConfirmDelete()}
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showWorkspaceLimitModal && (
                        <motion.div
                            className="workspace-limit-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="workspace-limit-modal-card"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", duration: 0.4 }}
                            >
                                <div className="workspace-limit-icon-wrapper">
                                    <span className="workspace-limit-icon">✦</span>
                                </div>

                                <h2>Active Task Capacity Reached</h2>

                                <p className="workspace-limit-subtitle">
                                    Your Core Workspace supports up to 3 active tasks at a time.
                                    Complete an existing task to free a slot for a new one,
                                    or upgrade to unlock unlimited active tasks.
                                </p>

                                <div className="workspace-limit-why-title">
                                    Why upgrade?
                                </div>

                                <div className="workspace-limit-benefits">
                                    <div className="workspace-limit-benefit">
                                        <div className="workspace-limit-benefit-icon">
                                            ∞
                                        </div>
                                        <span>
                                            Unlimited
                                            <br />
                                            Active Tasks
                                        </span>
                                    </div>

                                    <div className="workspace-limit-benefit">
                                        <div className="workspace-limit-benefit-icon">
                                            ↗
                                        </div>
                                        <span>
                                            Advanced
                                            <br />
                                            Telemetry
                                        </span>
                                    </div>

                                    <div className="workspace-limit-benefit">
                                        <div className="workspace-limit-benefit-icon">
                                            ✦
                                        </div>
                                        <span>
                                            Premium
                                            <br />
                                            Workspaces
                                        </span>
                                    </div>

                                    <div className="workspace-limit-benefit">
                                        <div className="workspace-limit-benefit-icon">
                                            ◈
                                        </div>
                                        <span>
                                            Priority
                                            <br />
                                            Support
                                        </span>
                                    </div>
                                </div>

                                <div className="workspace-limit-actions">
                                    <button
                                        className="workspace-limit-continue-btn"
                                        onClick={() => {
                                            sessionStorage.removeItem("reopenLimitModal");
                                            setShowWorkspaceLimitModal(false);
                                        }}
                                    >
                                        Continue with Free (Core)
                                    </button>

                                    <button
                                        className="workspace-limit-upgrade-btn"
                                        onClick={() => {
                                            sessionStorage.setItem("reopenLimitModal", "true");
                                            setShowWorkspaceLimitModal(false);
                                            navigate("/pricing");
                                        }}
                                    >
                                        Upgrade Now
                                    </button>
                                </div>

                                <div className="workspace-limit-safe-text">
                                    🔒 Your workspace data remains safe and secure.
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="orbiq-lexicon-placement">
                    <OrbiqLexicon />
                </div>

            </div>
        </div>
    );
}

export default Dashboard;