import React from "react";
import "./MembershipCard.css";
import {
    Layers3,
    Lock,
    Unlock,
    BarChart3,
    ArrowUpRight,
    Crown,
    Sparkles,
    Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function MembershipCard({ userData }) {
    const navigate = useNavigate();

    const activePlan = userData?.plan || "Free";
    const planLower = activePlan.toLowerCase();
    const isPremium = planLower !== "free";

    const getWorkspaceName = () => {
        if (planLower === "gold") return "Apex Workspace";
        if (planLower === "silver") return "Pro Workspace";
        return "Core Workspace";
    };

    return (
        <section className={`membership-card status-tier-${planLower}`}>
            <div className="membership-glow"></div>

            <div className="membership-header">
                <div className="membership-header-left">
                    <div className={`membership-icon icon-tier-${planLower}`}>
                        <Layers3 size={22} />
                    </div>

                    <div className="title-stack">
                        <p className="membership-label">
                            WORKSPACE COMMAND
                        </p>
                        <h2>
                            {getWorkspaceName()}
                        </h2>
                    </div>
                </div>

                {planLower === "gold" && (
                    <div className="header-live-badge live-gold">
                        <span className="live-dot green"></span>
                        LIVE
                    </div>
                )}
                {planLower === "silver" && (
                    <div className="header-live-badge online-silver">
                        <span className="live-dot cyan"></span>
                        ONLINE
                    </div>
                )}
            </div>

            <div className="system-status-strip">
                <div className="status-led-item">
                    <span className="led-dot active"></span>
                    <span>Telemetry</span>
                </div>
                <div className="status-led-item">
                    <span className={`led-dot ${isPremium ? "active" : "disabled"}`}></span>
                    <span>Horizon</span>
                </div>
                <div className="status-led-item">
                    <span className="led-dot active"></span>
                    <span>Sync</span>
                </div>
                <div className="status-led-item">
                    <span className="led-dot active"></span>
                    <span>Security</span>
                </div>
            </div>

            <div
                className={`membership-badge ${
                    isPremium ? "badge-premium" : "badge-locked"
                }`}
            >
                {isPremium ? <Unlock size={16} /> : <Lock size={16} />}

                <span className="badge-text-content">
                    {planLower === "gold" && (
                        <>
                            <Crown size={15} color="#fbbf24" />
                            <span>ORBIQ Gold</span>
                        </>
                    )}
                    {planLower === "silver" && (
                        <>
                            <Sparkles size={15} color="#38bdf8" />
                            <span>ORBIQ Silver</span>
                        </>
                    )}
                    {planLower === "free" && (
                        <>
                            <Shield size={15} color="#94a3b8" />
                            <span>ORBIQ Free</span>
                        </>
                    )}
                </span>
            </div>

            <div className="membership-details">
                <div className="membership-row">
                    <span>Status</span>
                    <strong
                        className={
                            userData?.planStatus === "Active"
                                ? "active-status"
                                : "locked-status"
                        }
                    >
                        {userData?.planStatus || "Inactive"}
                    </strong>
                </div>

                <div className="membership-row">
                    <span>Valid Until</span>
                    <strong className="membership-valid">
                        {userData?.planExpiry
                            ? new Date(userData.planExpiry).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }
                            )
                            : "Lifetime"}
                    </strong>
                </div>

                <div className="membership-row">
                    <span>Workspace Limit</span>
                    <strong>
                        {isPremium ? "Unlimited Capacity" : "3 Active Tasks"}
                    </strong>
                </div>

                <div className="membership-row">
                    <span>Telemetry Engine</span>
                    <strong className={isPremium ? "active-status" : ""}>
                        {planLower === "gold" && "Quantum Telemetry"}
                        {planLower === "silver" && "Advanced Telemetry"}
                        {planLower === "free" && "Core Telemetry"}
                    </strong>
                </div>

                <div className="membership-row">
                    <span>Horizon Access</span>
                    <strong
                        className={
                            isPremium ? "active-status" : "locked-status"
                        }
                    >
                        {planLower === "gold" && "Full AI Access"}
                        {planLower === "silver" && "Smart Assist"}
                        {planLower === "free" && "Locked"}
                    </strong>
                </div>
            </div>

            <div className="membership-footer">
                <BarChart3 size={18} />
                <span>
                    {planLower === "gold" &&
                        "All workspace intelligence modules are online."}
                    {planLower === "silver" &&
                        "Advanced automation systems are active."}
                    {planLower === "free" &&
                        "Unlock Horizon AI and premium automation."}
                </span>
            </div>

            {planLower === "gold" ? (
                <div className="membership-status-live">
                    <span className="live-dot green"></span>
                    Elite Workspace Online
                </div>
            ) : (
                <button
                    className="membership-btn"
                    onClick={() => navigate("/pricing")}
                >
                    {planLower === "silver"
                        ? "Upgrade to Gold 👑"
                        : "Upgrade Plan"}
                    <ArrowUpRight size={18} />
                </button>
            )}
        </section>
    );
}

export default MembershipCard;