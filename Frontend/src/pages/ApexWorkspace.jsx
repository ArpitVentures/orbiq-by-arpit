import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../services/api";

import ApexSidebar from "../components/Horizon/ApexSidebar";
import ApexHeader from "../components/Horizon/ApexHeader";
import ApexOverview from "../components/Horizon/ApexOverview";
import ApexActivity from "../components/Horizon/ApexActivity";
import ApexPlanner from "../components/Horizon/ApexPlanner";
import ApexFocusCard from "../components/Horizon/ApexFocusCard";
import ApexInsights from "../components/Horizon/ApexInsights";
import ApexAutomation from "../components/Horizon/ApexAutomation";
import HorizonPanel from "../components/Horizon/HorizonPanel";

import "./ApexWorkspace.css";

function ApexWorkspace({ user }) {
    const location = useLocation();
    const [isLaunching, setIsLaunching] = useState(
        location.state?.horizonLaunch === true
    );
    const [activeSection, setActiveSection] = useState("horizon");
    const [dashboardData, setDashboardData] = useState(null);

    const horizonRef = useRef(null);
    const overviewRef = useRef(null);
    const plannerRef = useRef(null);
    const automationRef = useRef(null);
    const activityRef = useRef(null);
    const insightsRef = useRef(null);

    useEffect(() => {
        if (!location.state?.horizonLaunch) return;

        const timer = setTimeout(() => {
            setIsLaunching(false);
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 2200);

        return () => clearTimeout(timer);
    }, [location.state]);

    useEffect(() => {
        const loadWorkspaceContext = async () => {
            try {
                const response = await api.get("/tasks/dashboard-summary");

                if (response.data?.success) {
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error("APEX workspace context error:", error);
            }
        };

        void loadWorkspaceContext();
    }, []);

    const storedUser = (() => {
        try {
            return JSON.parse(sessionStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    })();

    const currentUser = user || storedUser;

    const userPlan = String(
        currentUser?.plan || currentUser?.tier || ""
    ).trim().toLowerCase();

    const hasApexAccess =
        userPlan === "gold" || userPlan === "apex" || userPlan === "pro";

    if (!hasApexAccess) {
        return <Navigate to="/horizon" replace />;
    }

    const stats = dashboardData?.stats;

    const workspaceContext = {
        pendingCount: stats?.pendingTasks ?? null,
        completedCount: stats?.completedTasks ?? null
    };

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);

        const sectionMap = {
            horizon: horizonRef,
            overview: overviewRef,
            planner: plannerRef,
            automation: automationRef,
            activity: activityRef,
            insights: insightsRef,
        };

        const targetRef = sectionMap[sectionId];
        if (targetRef && targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            {isLaunching && (
                <div className="apex-launch-overlay">
                    <div className="apex-launch-grid" />

                    <div className="apex-launch-content">
                        <div className="apex-launch-orb">
                            <div className="apex-launch-orb-core">
                                ✦
                            </div>
                        </div>

                        <div className="apex-launch-eyebrow">
                            P.U.L.S.A.R. INTELLIGENCE
                        </div>

                        <h1>
                            HORIZON
                            <span>INTELLIGENCE ENGINE</span>
                        </h1>

                        <div className="apex-launch-status">
                            <span className="apex-launch-status-dot" />
                            <span>ESTABLISHING SECURE HANDSHAKE</span>
                        </div>

                        <div className="apex-launch-progress">
                            <div className="apex-launch-progress-fill" />
                        </div>

                        <div className="apex-launch-sequence">
                            <span>✓ Identity verified</span>
                            <span>✓ Gold clearance verified</span>
                            <span>✓ P.U.L.S.A.R. online</span>
                            <span>→ Initializing APEX workspace</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="apex-workspace">
                <ApexSidebar
                    user={currentUser}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />

                <main className="apex-main">
                    <ApexHeader user={currentUser} />

                    <section className="apex-content">
                        <div ref={horizonRef} id="horizon-section">
                            <HorizonPanel
                                user={currentUser}
                                workspaceContext={workspaceContext}
                            />
                        </div>

                        <div ref={overviewRef} id="overview-section">
                            <ApexOverview
                                user={currentUser}
                                statsData={stats}
                            />
                        </div>

                        <div ref={automationRef} id="automation-section">
                            <ApexAutomation statsData={stats} />
                        </div>

                        <div ref={activityRef} id="activity-section">
                            <ApexActivity messages={[]} />
                        </div>

                        <div ref={plannerRef} id="planner-section">
                            <ApexPlanner tasks={[]} />
                        </div>

                        <div ref={insightsRef} id="insights-section">
                            <ApexFocusCard task={null} />
                            <ApexInsights />
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default ApexWorkspace;