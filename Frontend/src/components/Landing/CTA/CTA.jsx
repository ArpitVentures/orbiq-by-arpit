import React from "react";
import { Link } from "react-router-dom";
import "./CTA.css";

function CTA() {
    return (
        <section className="landing-cta-zone" id="cta">
            <div className="cta-container">

                <div className="cta-badge-wrapper">
                    <span className="cta-micro-badge">
                        🚀 Built for Developers • Students • Startups
                    </span>
                </div>

                <h2 className="cta-main-title">
                    Your Next Project <br className="cta-mobile-br" />
                    Deserves a Better Workspace.
                </h2>

                <p className="cta-subtitle">
                    Stop switching between multiple apps. Plan tasks, collaborate with your team,
                    track progress, and unlock AI-powered productivity — all inside one modern workspace.
                </p>

                <div className="cta-stats-row">
                    <div className="cta-stat-unit">
                        <h3>10K+</h3>
                        <p>Tasks Managed</p>
                    </div>

                    <div className="cta-stat-divider"></div>

                    <div className="cta-stat-unit">
                        <h3>99.9%</h3>
                        <p>Workspace Uptime</p>
                    </div>

                    <div className="cta-stat-divider"></div>

                    <div className="cta-stat-unit">
                        <h3>24×7</h3>
                        <p>Customer Support</p>
                    </div>
                </div>

                <div className="cta-btn-group">
                    <Link
                        to="/login?mode=signup"
                        state={{
                            cameFromLanding: true,
                            scrollTo: "cta"
                        }}
                        className="cta-action-primary"
                    >
                        Create Your Workspace →
                    </Link>

                    <Link to="/pricing" className="cta-action-secondary">
                        Explore Plans
                    </Link>
                </div>

            </div>
        </section>
    );
}

export default CTA;