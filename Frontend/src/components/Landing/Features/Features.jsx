import React from "react";
import {
    Zap,
    Users,
    BarChart3,
    ShieldCheck,
    Bell,
    BrainCircuit
} from "lucide-react";

import "./Features.css";
import FeatureCard from "./FeatureCard";

function Features() {

    const features = [
        {
            icon: Zap,
            title: "Smart Workspace",
            description: "Plan, organize and prioritize work from one beautiful workspace.",
            accent: "cyan",
            link: "/features/workspace"
        },
        {
            icon: Users,
            title: "Real-time Collaboration",
            description: "Work together with teammates using shared workspaces and live updates.",
            accent: "purple",
            link: "/features/collaboration"
        },
        {
            icon: BarChart3,
            title: "Analytics Dashboard",
            description: "Track productivity, deadlines and team performance with real-time analytics.",
            accent: "cyan",
            link: "/features/analytics"
        },
        {
            icon: ShieldCheck,
            title: "Enterprise Security",
            description: "Secure authentication, encrypted storage and enterprise-grade infrastructure.",
            accent: "purple",
            link: "/features/security"
        },
        {
            icon: Bell,
            title: "Beacon",
            description: "Never miss deadlines with intelligent reminders and real-time alerts.",
            accent: "cyan",
            link: "/features/notifications"
        },
        {
            icon: BrainCircuit,
            title: "AI Automation",
            description: "Let agent models prioritize your tasks, draft logs, and auto-assign tasks securely.",
            accent: "purple",
            featured: true,
            link: "/features/ai"
        }
    ];

    return (
        <section className="features" id="features">
            <div className="features-header">
                <span className="section-tag">FEATURES</span>
                <h2>
                    Built for the way
                    <br />
                    modern teams work.
                </h2>
                <p>
                    Everything you need to plan, collaborate,
                    automate and deliver exceptional work
                    with ORBIQ.
                </p>
            </div>

            <div className="features-grid">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.title}
                        {...feature}
                    />
                ))}
            </div>
        </section>
    );
}

export default Features;