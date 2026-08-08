import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";

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
    const [activeSection, setActiveSection] = useState("horizon");

    const horizonRef = useRef(null);
    const overviewRef = useRef(null);
    const plannerRef = useRef(null);
    const automationRef = useRef(null);
    const activityRef = useRef(null);
    const insightsRef = useRef(null);

    const storedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
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
        <div className="apex-workspace">
            <ApexSidebar
                user={currentUser}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />

            <main className="apex-main">
                <ApexHeader user={currentUser} />

                <section className="apex-content">
                    {/* 🚀 Priority #1: HORIZON AI Intelligence Interface */}
                    <div ref={horizonRef} id="horizon-section">
                        <HorizonPanel user={currentUser} />
                    </div>

                    <div ref={overviewRef} id="overview-section">
                        <ApexOverview user={currentUser} statsData={null} />
                    </div>

                    <div ref={automationRef} id="automation-section">
                        <ApexAutomation statsData={null} />
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
    );
}

export default ApexWorkspace;