import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BrainCircuit,
    Sparkles,
    Zap,
    Radar,
    Focus,
    Cpu,
    ChevronRight,
    ChevronLeft,
    Settings,
    UserRound,
    History,
    MessageSquare,
    Home
} from "lucide-react";

import "./ApexSidebar.css";

function ApexSidebar({
                         user,
                         activeSection = "horizon",
                         onSectionChange
                     }) {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(() => {
        try {
            return (
                localStorage.getItem(
                    "apex-sidebar-collapsed"
                ) === "true"
            );
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(
                "apex-sidebar-collapsed",
                String(collapsed)
            );
        } catch (error) {
            console.warn("Unable to persist sidebar state:", error);
        }
    }, [collapsed]);

    const navItems = [
        {
            id: "overview",
            title: "Mission Brief",
            icon: <LayoutDashboard size={19} />
        },
        {
            id: "horizon",
            title: "HORIZON",
            icon: <Sparkles size={19} />
        },
        {
            id: "planner",
            title: "Strategic Planner",
            icon: <BrainCircuit size={19} />
        },
        {
            id: "automation",
            title: "Execution Engine",
            icon: <Zap size={19} />
        },
        {
            id: "activity",
            title: "Intelligence Feed",
            icon: <Radar size={19} />
        },
        {
            id: "insights",
            title: "Deep Focus",
            icon: <Focus size={19} />
        }
    ];

    const displayName =
        user?.name ||
        user?.fullName ||
        user?.username ||
        "Commander";

    const handleNavigation = (sectionId) => {
        if (onSectionChange) {
            onSectionChange(sectionId);
        }
    };

    return (
        <aside
            className={`apex-sidebar ${
                collapsed
                    ? "apex-sidebar-collapsed"
                    : ""
            }`}
        >
            <div className="apex-brand">
                <div className="pulse-orb">
                    <div className="pulse-core" />
                </div>

                {!collapsed && (
                    <>
                        <h1>HORIZON</h1>

                        <p>
                            Adaptive Intelligence Workspace
                        </p>

                        <div className="powered-by">
                            <span className="powered-label">
                                Powered by
                            </span>

                            <h3>P.U.L.S.A.R.</h3>
                        </div>
                    </>
                )}
            </div>

            <button
                type="button"
                className="apex-home-btn"
                onClick={() => navigate("/dashboard")}
                title={collapsed ? "ORBIQ Home" : undefined}
            >
                <Home size={17} />
                {!collapsed && <span>ORBIQ Home</span>}
            </button>

            <button
                type="button"
                className="apex-sidebar-toggle"
                onClick={() =>
                    setCollapsed((prev) => !prev)
                }
                aria-label={
                    collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                }
                title={
                    collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                }
            >
                {collapsed ? (
                    <ChevronRight size={17} />
                ) : (
                    <ChevronLeft size={17} />
                )}
            </button>

            <nav className="apex-navigation">
                {navItems.map((item) => {
                    const active =
                        activeSection === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                                handleNavigation(
                                    item.id
                                )
                            }
                            className={`apex-nav-item ${
                                active
                                    ? "active"
                                    : ""
                            }`}
                            title={
                                collapsed
                                    ? item.title
                                    : undefined
                            }
                        >
                            <div className="nav-left">
                                <div className="nav-icon">
                                    {item.icon}
                                </div>

                                {!collapsed && (
                                    <span>
                                        {item.title}
                                    </span>
                                )}
                            </div>

                            {!collapsed && (
                                <ChevronRight size={15} />
                            )}
                        </button>
                    );
                })}
            </nav>

            {!collapsed && (
                <div className="apex-history">
                    <div className="apex-history-header">
                        <div>
                            <span className="history-label">
                                RECENT
                            </span>

                            <span className="history-title">
                                HORIZON Sessions
                            </span>
                        </div>

                        <History size={15} />
                    </div>

                    <button
                        type="button"
                        className="history-item active-history"
                    >
                        <MessageSquare size={14} />
                        <span>Current session</span>
                    </button>

                    <button
                        type="button"
                        className="history-item"
                    >
                        <MessageSquare size={14} />
                        <span>ORBIQ workspace</span>
                    </button>
                </div>
            )}

            {!collapsed && (
                <div className="pulsar-card">
                    <div className="status-row">
                        <span className="status-dot" />

                        <span className="status-text">
                            Context Engine Online
                        </span>
                    </div>

                    <div className="engine-title">
                        <Cpu size={18} />

                        <span>P.U.L.S.A.R.</span>
                    </div>

                    <p className="engine-description">
                        Productive Unified Logic &
                        <br />
                        Smart Adaptive Response
                    </p>

                    <div className="engine-footer">
                        <span>Central Intelligence Engine</span>
                        <span>v1.0</span>
                    </div>
                </div>
            )}

            <div className="apex-sidebar-footer">
                <button
                    type="button"
                    className="apex-account"
                    title={collapsed ? "Account" : undefined}
                >
                    <div className="apex-account-avatar">
                        {user?.avatar || user?.profileImage ? (
                            <img
                                src={
                                    user.avatar ||
                                    user.profileImage
                                }
                                alt=""
                            />
                        ) : (
                            <UserRound size={18} />
                        )}
                    </div>

                    {!collapsed && (
                        <div className="apex-account-info">
                            <strong>{displayName}</strong>
                            <span>Workspace Member</span>
                        </div>
                    )}
                </button>

                <button
                    type="button"
                    className="apex-settings-btn"
                    title="Workspace Settings"
                    aria-label="Workspace Settings"
                    onClick={() => navigate("/settings")}
                >
                    <Settings size={18} />
                </button>
            </div>
        </aside>
    );
}

export default ApexSidebar;