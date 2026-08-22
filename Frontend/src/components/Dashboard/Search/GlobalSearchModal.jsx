import { useState, useEffect } from "react";
import {
    Search, X, CheckSquare, Calendar, Cpu, Settings,
    ArrowRight, Activity, User, PlusCircle, LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./GlobalSearchModal.css";

export function getDevicePlatform() {
    if (typeof window === "undefined") return { isMac: false, osName: "Desktop" };

    const ua = navigator.userAgent || navigator.platform || "";
    const isMac = /Mac|iPhone|iPod|iPad/i.test(ua);
    const isIOS = /iPhone|iPod|iPad/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isWindows = /Win/i.test(ua);

    let osName = "Windows";
    if (isMac) osName = "macOS";
    if (isIOS) osName = "iOS";
    if (isAndroid) osName = "Android";
    if (isWindows) osName = "Windows";

    return { isMac, osName, isMobile: isIOS || isAndroid };
}

function GlobalSearchModal({ isOpen, onClose, tasks = [], onCreateTask }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const { isMac } = getDevicePlatform();
    const cmdSymbol = isMac ? "⌘" : "Ctrl";

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    const matchingTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes(query.toLowerCase()) ||
        t.description?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const commandsMatrix = [
        { name: "🛰 Mission Control", path: "/dashboard", icon: <LayoutDashboard size={14} /> },
        { name: "📅 Orbit Timeline", path: "/calendar", icon: <Calendar size={14} /> },
        { name: "🤖 Horizon AI", path: "/horizon", icon: <Cpu size={14} /> },
        { name: "📊 Analytics & Telemetry", path: "/analytics", icon: <Activity size={14} /> },
        { name: "⚙ Workspace Configuration", path: "/settings", icon: <Settings size={14} /> },
        { name: "👤 Crew Profile", path: "/profile", icon: <User size={14} /> }
    ].filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

    const quickActions = [
        {
            label: "+ New Task",
            action: () => {
                onClose();
                if (onCreateTask) onCreateTask();
            }
        },
        { label: "+ Open Horizon", path: "/horizon" },
        { label: "+ View Analytics", path: "/analytics" },
        { label: "+ Pricing & Tiers", path: "/pricing" }
    ];

    const handleSelect = (actionObj) => {
        onClose();
        if (actionObj.action) {
            actionObj.action();
        } else if (actionObj.path) {
            navigate(actionObj.path);
        }
    };

    return (
        <div className="global-search-overlay" onClick={onClose}>
            <div className="global-search-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="search-input-header">
                    <Search size={18} className="search-icon-cyan" />
                    <input
                        type="text"
                        placeholder="Type task name, workspace route or execute commands..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <button className="close-search-btn" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <div className="search-results-body">
                    {query.trim() === "" ? (
                        <div className="os-launcher-view">
                            <div className="search-group">
                                <span className="search-group-title">QUICK ACTIONS</span>
                                <div className="quick-actions-grid">
                                    {quickActions.map((action, idx) => (
                                        <div
                                            key={idx}
                                            className="quick-action-pill"
                                            onClick={() => handleSelect(action)}
                                        >
                                            <PlusCircle size={12} color="#22d3ee" />
                                            <span>{action.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="search-group" style={{ marginTop: "20px" }}>
                                <span className="search-group-title">GLOBAL COMMAND MATRIX</span>
                                {commandsMatrix.map((cmd, idx) => (
                                    <div
                                        key={idx}
                                        className="search-result-item"
                                        onClick={() => handleSelect(cmd)}
                                    >
                                        <div className="item-left">
                                            {cmd.icon}
                                            <span className="item-title">{cmd.name}</span>
                                        </div>
                                        <ArrowRight size={13} className="muted-arrow" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="active-search-view">
                            {matchingTasks.length > 0 && (
                                <div className="search-group">
                                    <span className="search-group-title">MATCHING TASKS ({matchingTasks.length})</span>
                                    {matchingTasks.map((task) => (
                                        <div
                                            key={task._id || task.id}
                                            className="search-result-item"
                                            onClick={() => handleSelect({ path: "/dashboard" })}
                                        >
                                            <div className="item-left">
                                                <CheckSquare size={14} className="cyan-text" />
                                                <span className="item-title">{task.title}</span>
                                            </div>
                                            <span className={`item-badge priority-${(task.priority || "medium").toLowerCase()}`}>
                                                {task.priority || "Normal"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {commandsMatrix.length > 0 && (
                                <div className="search-group">
                                    <span className="search-group-title">GLOBAL COMMAND MATRIX</span>
                                    {commandsMatrix.map((cmd, idx) => (
                                        <div
                                            key={idx}
                                            className="search-result-item"
                                            onClick={() => handleSelect(cmd)}
                                        >
                                            <div className="item-left">
                                                {cmd.icon}
                                                <span className="item-title">{cmd.name}</span>
                                            </div>
                                            <ArrowRight size={13} className="muted-arrow" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {matchingTasks.length === 0 && commandsMatrix.length === 0 && (
                                <div className="search-empty-state">
                                    <p>No matching tasks or vectors found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="search-modal-footer" style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b" }}>
                    <span>Navigation: <kbd>{cmdSymbol}</kbd> + <kbd>K</kbd> | Close: <kbd>ESC</kbd></span>
                    <span>ORBIQ Global Command OS</span>
                </div>
            </div>
        </div>
    );
}

export default GlobalSearchModal;