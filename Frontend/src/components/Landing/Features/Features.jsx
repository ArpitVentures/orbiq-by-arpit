import {
    Zap,
    BrainCircuit,
    Users,
    BarChart3,
    ShieldCheck
} from "lucide-react";

import "./Features.css";
import FeatureCard from "./FeatureCard";

function Features() {
    const features = [
        {
            icon: Zap,
            title: "Smart Workspace",
            description: "Plan, organize and prioritize work from one beautiful workspace.",
            accent: "cyan"
        },
        {
            icon: BrainCircuit,
            title: "AI Intelligence",
            description: "Automate repetitive tasks and receive intelligent productivity insights.",
            accent: "purple",
            featured: true
        },
        {
            icon: Users,
            title: "Real-time Collaboration",
            description: "Work together with teammates using shared workspaces and live updates.",
            accent: "cyan"
        },
        {
            icon: BarChart3,
            title: "Analytics Dashboard",
            description: "Track productivity, deadlines and team performance with real-time analytics.",
            accent: "purple"
        },
        {
            icon: ShieldCheck,
            title: "Enterprise Security",
            description: "JWT authentication, encrypted storage and secure cloud infrastructure.",
            accent: "cyan"
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