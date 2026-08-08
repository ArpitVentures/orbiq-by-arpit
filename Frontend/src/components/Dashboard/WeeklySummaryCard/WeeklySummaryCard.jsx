import React from "react";
import { Sparkles, CheckCircle2, Clock, Rocket, Radio, ShieldCheck, Activity, Cpu } from "lucide-react";

function WeeklySummaryCard({ statsData }) {
    const created = statsData?.totalTasks || 0;
    const completed = statsData?.completedTasks || 0;
    const pending = statsData?.pendingTasks || 0;
    const rate = statsData?.productivity || "0%";

    const quadrantData = [
        {
            label: "Missions Created",
            value: created,
            icon: <Rocket size={16} color="#38bdf8" />,
            accentColor: "#38bdf8",
            bgColor: "rgba(56, 189, 248, 0.06)",
            borderColor: "rgba(56, 189, 248, 0.15)"
        },
        {
            label: "Missions Completed",
            value: completed,
            icon: <CheckCircle2 size={16} color="#4ade80" />,
            accentColor: "#4ade80",
            bgColor: "rgba(74, 222, 128, 0.06)",
            borderColor: "rgba(74, 222, 128, 0.15)"
        },
        {
            label: "Awaiting Execution",
            value: pending,
            icon: <Clock size={16} color="#fbbf24" />,
            accentColor: "#fbbf24",
            bgColor: "rgba(251, 191, 36, 0.06)",
            borderColor: "rgba(251, 191, 36, 0.15)"
        },
        {
            label: "Success Rate",
            value: rate,
            icon: <Sparkles size={16} color="#22d3ee" />,
            accentColor: "#22d3ee",
            bgColor: "rgba(34, 211, 238, 0.08)",
            borderColor: "rgba(34, 211, 238, 0.25)"
        }
    ];

    return (
        <div style={{
            background: "#0b0f19",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            gap: "22px"
        }}>

            <div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px"
                }}>
                    <span style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#94a3b8",
                        letterSpacing: "1px",
                        textTransform: "uppercase"
                    }}>
                        📊 Weekly Summary
                    </span>
                    <span style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#06b6d4",
                        background: "rgba(6, 182, 212, 0.1)",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        border: "1px solid rgba(6, 182, 212, 0.2)"
                    }}>
                        THIS WEEK
                    </span>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px"
                }}>
                    {quadrantData.map((item) => (
                        <div
                            key={item.label}
                            style={{
                                background: item.bgColor,
                                border: `1px solid ${item.borderColor}`,
                                borderRadius: "14px",
                                padding: "12px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "6px"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {item.icon}
                                <span style={{
                                    fontSize: "17px",
                                    fontWeight: "800",
                                    color: item.accentColor
                                }}>
                                    {item.value}
                                </span>
                            </div>

                            <span style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                color: "#cbd5e1",
                                lineHeight: "1.2"
                            }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                height: "1px",
                width: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
            }} />

            <div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px"
                }}>
                    <span style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#94a3b8",
                        letterSpacing: "1px",
                        textTransform: "uppercase"
                    }}>
                        📡 Workspace Status
                    </span>
                    <span style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#22c55e",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}>
                        <span style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#22c55e",
                            boxShadow: "0 0 8px #22c55e"
                        }} />
                        LIVE SYNC
                    </span>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    background: "rgba(255, 255, 255, 0.015)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                    borderRadius: "14px",
                    padding: "16px 16px"
                }}>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                        <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Cpu size={14} color="#06b6d4" /> Mission Control
                        </span>
                        <span style={{ color: "#4ade80", fontWeight: "600", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                            ● Online
                        </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                        <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Radio size={14} color="#a855f7" /> Beacon Signal
                        </span>
                        <span style={{ color: "#4ade80", fontWeight: "600", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                            ● Active
                        </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                        <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Activity size={14} color="#22d3ee" /> Telemetry Relay
                        </span>
                        <span style={{ color: "#4ade80", fontWeight: "600", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                            ● Synced
                        </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                        <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px" }}>
                            <ShieldCheck size={14} color="#f59e0b" /> Horizon AI
                        </span>
                        <span style={{ color: "#f59e0b", fontWeight: "600", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                            ○ Standby
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeeklySummaryCard;