import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
    return (
        <motion.section
            className="hero"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="hero-container">

                <div className="hero-left">
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        🚀 Production Ready • Version 1.0
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Organize Your
                        <span> Work.</span>
                        <br />
                        Finish More Tasks.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        ORBIQ helps developers, students and modern teams
                        plan projects, organize work and boost productivity
                        through one intelligent workspace.
                    </motion.p>

                    <motion.div
                        className="hero-buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link
                            to="/login?mode=signup"
                            state={{
                                cameFromLanding: true,
                                scrollTo: "hero"
                            }}
                            className="primary-btn"
                        >
                            Get Started Free →
                        </Link>

                        <a href="#features" className="secondary-btn">
                            Explore Platform
                        </a>
                    </motion.div>

                    <div className="hero-trust">
                        ⭐⭐⭐⭐⭐
                        <span>
                            Trusted by <strong> 10K+ </strong> productive users
                        </span>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="dashboard-preview">

                        <div className="floating-toast">
                            ✅ Landing Page completed
                        </div>

                        <div className="dashboard-header">
                            <div className="window-buttons">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <small>ORBIQ Workspace</small>
                        </div>

                        <div className="dashboard-body">

                            <div className="workspace-status">
                                <span className="status-dot"></span>
                                Live Workspace
                            </div>

                            <div className="preview-top">
                                <div className="preview-card">
                                    <h4>24</h4>
                                    <span>Total Tasks</span>
                                </div>
                                <div className="preview-card success">
                                    <h4>18</h4>
                                    <span>Completed</span>
                                </div>
                            </div>

                            <div className="preview-progress">
                                <div className="progress-text">
                                    <span>Productivity</span>
                                    <strong>75%</strong>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill"></div>
                                </div>
                            </div>

                            <div className="workspace-team">
                                <div className="team-users">
                                    <span>A</span>
                                    <span>R</span>
                                    <span>S</span>
                                </div>
                                <small>+12 collaborators online</small>
                            </div>

                            <div className="mini-board">
                                <div className="mini-column">
                                    <h5>To Do</h5>
                                    <div className="mini-task low">Landing Page</div>
                                    <div className="mini-task medium">API Integration</div>
                                </div>
                                <div className="mini-column">
                                    <h5>Done</h5>
                                    <div className="mini-task high">Dashboard</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </motion.section>
    );
}

export default Hero;