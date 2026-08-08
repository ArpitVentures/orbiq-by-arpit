import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Zap, Users, BarChart3, ShieldCheck, Bell, BrainCircuit } from "lucide-react";
import "./Features.css";

const featureDataConfig = {
    workspace: {
        title: "Smart Workspace",
        tagline: "Plan, organize and prioritize work from one unified interface.",
        icon: Zap,
        accent: "cyan",
        bullets: [
            "Advanced Kanban Boards with inline custom tracking fields.",
            "Unified Calendar View to visualize task drops across timelines.",
            "Dynamic Tagging & Custom Filter parameters setup.",
            "Fluid Drag & Drop workflow engine built on smooth execution physics.",
            "Intelligent Priority Sort options optimized to reduce layout fatigue."
        ],
        mockupText: "Task Engine Block / Sprint Active",
        ctaText: "Start Building Free"
    },
    collaboration: {
        title: "Real-time Collaboration",
        tagline: "Work together with teammates using live updates and zero sync delay.",
        icon: Users,
        accent: "purple",
        bullets: [
            "Multiplayer Cursor positioning metrics synced instantly.",
            "In-context Task Comments with rich markdown text styling engine.",
            "Granular Activity Logs logging workspace trace transformations.",
            "Instant Push Feed channels syncing active teammate updates.",
            "Shared Project Workspaces providing frictionless onboarding zones."
        ],
        mockupText: "Teammates Grid View / 12 Active Members",
        ctaText: "Invite Your Team Free"
    },
    analytics: {
        title: "Analytics Dashboard",
        tagline: "Track productivity bottlenecks and team velocity in absolute real-time.",
        icon: BarChart3,
        accent: "cyan",
        bullets: [
            "Burn-down charts compiling cumulative production sprints.",
            "Individual performance indices calculating velocity ratios.",
            "Time-tracking metrics providing clear audit compliance frames.",
            "Custom export parameters exporting data sheets instantly.",
            "Automated weekly summaries delivered straight to target nodes."
        ],
        mockupText: "Metric Grid / 75% Average Velocity Reached",
        ctaText: "Unlock Performance Metrics"
    },
    security: {
        title: "Enterprise Security",
        tagline: "Protecting code assets and user nodes with industry standard models.",
        icon: ShieldCheck,
        accent: "purple",
        bullets: [
            "Strict JSON Web Token authentication keeping user sessions distinct.",
            "AES-256 data layer block parameters encryptions active.",
            "Granular RBAC profile permissions protecting dashboard views.",
            "Automated threat vectors evaluation tracking unauthorized requests.",
            "Secure session tokens invalidation working cleanly on logout rules."
        ],
        mockupText: "Secured Nodes / Access Gateway Enforced",
        ctaText: "Deploy Secure Workspace"
    },
    notifications: {
        title: "Smart Beacon",
        tagline: "Never miss critical drops with intelligent real-time alerts.",
        icon: Bell,
        accent: "cyan",
        bullets: [
            "Granular subscription filters grouping individual activity tags.",
            "Real-time reactive notification center updating layout layers.",
            "Configurable email digest thresholds adjusting pipeline feeds.",
            "Urgent task tracking escalations alerting key team nodes.",
            "Do-Not-Disturb state management parameters persistence frames."
        ],
        mockupText: "Alert Feed Pipeline / Zero Latency Channels",
        ctaText: "Optimize Notification Alerts"
    },
    ai: {
        title: "AI Automation",
        tagline: "Let intelligent agent nodes offload your repetitive engineering logs.",
        icon: BrainCircuit,
        accent: "purple",
        bullets: [
            "Automated user story compilation from bare tracking notes.",
            "Predictive bug severity vector checking inside input blocks.",
            "Auto-assignment pipelines assigning tasks to low-bandwidth nodes.",
            "Natural language workspace interaction commands interpreters.",
            "Clean context extraction summaries mapping project progress state."
        ],
        mockupText: "ORBIQ AI Co-pilot Node / Automation Systems Active",
        ctaText: "Initialize AI Co-pilot"
    }
};

function FeatureDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const currentFeature = featureDataConfig[slug];

    if (!currentFeature) {
        return (
            <div className="feature-not-found">
                <h2>Feature Node Not Found ❌</h2>
                <button onClick={() => navigate("/")}>Return to Base Workspace</button>
            </div>
        );
    }

    const IconComponent = currentFeature.icon;

    return (
        <div className="feature-detail-root">

            <div className="detail-nav-area">
                <button onClick={() => navigate(-1)} className="detail-back-btn">
                    <ArrowLeft size={16} />
                    <span>Back to Platform</span>
                </button>
            </div>

            <div className="detail-content-container">

                <div className="detail-info-block">
                    <div className={`detail-icon-wrap ${currentFeature.accent}`}>
                        <IconComponent size={32} strokeWidth={2.2} />
                    </div>

                    <h1 className="detail-title">{currentFeature.title}</h1>
                    <p className="detail-tagline">{currentFeature.tagline}</p>

                    <div className="detail-bullets-matrix">
                        {currentFeature.bullets.map((bullet, index) => (
                            <div key={index} className="detail-bullet-row">
                                <CheckCircle2 size={18} className="bullet-check-icon" />
                                <span className="bullet-text">{bullet}</span>
                            </div>
                        ))}
                    </div>

                    <Link to="/login?mode=signup" className="detail-cta-trigger">
                        {currentFeature.ctaText}
                    </Link>
                </div>

                <div className="detail-preview-block">
                    <div className="mockup-window-frame">
                        <div className="mockup-header">
                            <div className="mockup-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="mockup-title-bar">orbiq.io/features/{slug}</div>
                        </div>

                        <div className="mockup-body-display">

                            <div className="mockup-inner-grid">
                                <div className="inner-sidebar-skeleton"></div>
                                <div className="inner-main-skeleton">
                                    <div className="skeleton-navbar">
                                        <div className="skeleton-pill"></div>
                                    </div>
                                    <div className="skeleton-card-large">
                                        <span className="pulse-text">{currentFeature.mockupText}</span>
                                        <div className="skeleton-line-row"></div>
                                        <div className="skeleton-line-row half"></div>
                                    </div>
                                    <div className="skeleton-sub-grid">
                                        <div className="skeleton-small-box"></div>
                                        <div className="skeleton-small-box"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <footer className="detail-footer-tag">Powered by ORBIQ Engine Architecture</footer>
        </div>
    );
}

export default FeatureDetail;