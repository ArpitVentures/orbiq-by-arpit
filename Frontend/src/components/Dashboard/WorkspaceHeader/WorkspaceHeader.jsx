import "./WorkspaceHeader.css";
import { useNavigate } from "react-router-dom";

function WorkspaceHeader({ userData }) {
    const navigate = useNavigate();

    const planName = userData?.plan || "Free";
    const isPremium = planName.toLowerCase() !== "free";

    const formattedExpiry = userData?.planExpiry
        ? new Date(userData.planExpiry).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        : "Lifetime";

    return (
        <section className="workspace-header">
            <div className="workspace-left">
                <div className="workspace-scope-tag"></div>
                <h1>Mission Control</h1>

                <p className="workspace-quote">
                    Coordinate projects, execute tasks, and monitor your workspace from a single command center.
                </p>
            </div>

            <div className="workspace-membership">
                <div className="membership-badge">
                    ORBIQ {planName.toUpperCase()}
                </div>
                <h3>{isPremium ? "Premium Workspace Active" : "Standard Workspace Active"}</h3>
                <p>
                    Valid until <strong>{formattedExpiry}</strong>
                </p>
                <button
                    className="workspace-manage-btn"
                    onClick={() => navigate("/pricing")}
                >
                    {isPremium ? "Manage Membership →" : "Upgrade Plan ↗"}
                </button>
            </div>
        </section>
    );
}

export default WorkspaceHeader;