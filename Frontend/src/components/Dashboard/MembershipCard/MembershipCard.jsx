import "./MembershipCard.css";
import {
    Layers3,
    Lock,
    BarChart3,
    ArrowUpRight,
    ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Membership() {
    const navigate = useNavigate();

    return (
        <section className="membership-card">
            <div className="membership-glow"></div>

            <div className="membership-header">
                <div className="membership-icon">
                    <Layers3 size={22} />
                </div>
                <div>
                    <p className="membership-label">WORKSPACE</p>
                    <h2>Free Workspace</h2>
                </div>
            </div>

            <div className="membership-badge">
                <Lock size={17} />
                <span>AI Assistant Locked</span>
            </div>

            <div className="membership-details">
                <div className="membership-row">
                    <span>Status</span>
                    <strong className="active-status">Active</strong>
                </div>
                <div className="membership-row">
                    <span>Projects</span>
                    <strong>3 / 3</strong>
                </div>
                <div className="membership-row">
                    <span>Analytics</span>
                    <strong>Basic</strong>
                </div>
                <div className="membership-row">
                    <span>AI Workspace</span>
                    <strong className="locked-status">Locked</strong>
                </div>
            </div>

            <div className="membership-footer">
                <BarChart3 size={18} />
                <span>Upgrade anytime to unlock premium features</span>
            </div>

            <button className="membership-btn" onClick={() => navigate("/pricing")}>
                Upgrade Plan
                <ArrowUpRight size={18} />
            </button>
        </section>
    );
}

export default Membership;