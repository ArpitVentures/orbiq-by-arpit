import { motion } from 'framer-motion';
import {
    FaTasks,
    FaUsers,
    FaBolt,
    FaShieldAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/LandingBackup.css";
import Pricing from "../components/Landing/Pricing/Pricing.jsx";
import Footer from "../components/Landing/Footer/Footer";

function Home() {
    return (
        <div className="home">

            <nav className="navbar">
                <h2>ORBIQ</h2>
                <div className="nav-links">
                    <Link to="/login">Login</Link>
                    <Link className="signup-btn" to="/signup">
                        Sign Up
                    </Link>
                </div>
            </nav>

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
                            🚀 Built for Developers • Students • Startups
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Organize Your
                            <span> Work.</span>
                            <br/>
                            Finish More Tasks.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            ORBIQ helps developers, students and teams manage
                            projects, organize deadlines and boost productivity
                            using one elegant workspace.
                        </motion.p>

                        <motion.div
                            className="hero-buttons"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Link to="/signup" className="primary-btn">
                                Get Started Free →
                            </Link>

                            <a href="#features" className="secondary-btn">
                                Explore Platform
                            </a>
                        </motion.div>

                        <div className="hero-trust">
                            ⭐⭐⭐⭐⭐
                            <span>
                                Trusted by <strong>10,000+</strong> Developers & Teams
                            </span>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="dashboard-preview">
                            <div className="dashboard-header">
                                <div className="window-buttons">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <small>ORBIQ Dashboard</small>
                            </div>

                            <div className="dashboard-body">
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

            <section className="trusted-section">
                <p className="trusted-label">
                    Trusted by developers, students and growing teams
                </p>
                <div className="trusted-logos">
                    <div>Google</div>
                    <div>Samsung</div>
                    <div>GitHub</div>
                    <div>MongoDB</div>
                    <div>React</div>
                    <div>Node.js</div>
                </div>
            </section>

            <section className="features" id="features">
                <h2>Why Choose ORBIQ?</h2>
                <p className="feature-subtitle">
                    Everything you need to manage your work efficiently.
                </p>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="icon"><FaTasks/></div>
                        <h3>Smart Task Management</h3>
                        <p>Create, organize and track your daily tasks with ease.</p>
                    </div>

                    <div className="feature-card">
                        <div className="icon"><FaUsers/></div>
                        <h3>Team Collaboration</h3>
                        <p>Collaborate with teammates and stay in sync in real time.</p>
                    </div>

                    <div className="feature-card">
                        <div className="icon"><FaBolt/></div>
                        <h3>Lightning Fast</h3>
                        <p>Optimized for speed so you can focus on getting work done.</p>
                    </div>

                    <div className="feature-card">
                        <div className="icon"><FaShieldAlt/></div>
                        <h3>Secure Storage</h3>
                        <p>Your tasks and personal information stay protected.</p>
                    </div>
                </div>
            </section>

            <section className="stats">
                <div className="stat-box">
                    <h2>10K+</h2>
                    <p>Tasks Managed</p>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-box">
                    <h2>99.9%</h2>
                    <p>Workspace Uptime</p>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-box">
                    <h2>24×7</h2>
                    <p>Customer Support</p>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How ORBIQ Works</h2>
                <p className="how-subtitle">
                    Get started in just four simple steps.
                </p>

                <div className="steps">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <div className="step-icon">👤</div>
                        <h3>Create Account</h3>
                        <p>Sign up and create your personal workspace in seconds.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <div className="step-icon">📝</div>
                        <h3>Add Tasks</h3>
                        <p>Create tasks, set priorities and organize your work.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <div className="step-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>Monitor completed and pending tasks with ease.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <div className="step-icon">🎯</div>
                        <h3>Achieve Goals</h3>
                        <p>Stay productive every day and accomplish more.</p>
                    </div>
                </div>
            </section>

            <Pricing />

            <section className="faq">
                <h2>Frequently Asked Questions</h2>
                <p className="faq-subtitle">
                    Everything you need to know before getting started.
                </p>

                <div className="faq-container">
                    <div className="faq-item">
                        <h3>Is ORBIQ free to use?</h3>
                        <p>Yes. You can start with our Free plan and upgrade anytime.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Can I collaborate with my team?</h3>
                        <p>Absolutely! Team collaboration is available in Pro and Enterprise plans.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Is my data secure?</h3>
                        <p>Yes. We use encrypted storage and secure authentication to protect your data.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Will AI help manage my tasks?</h3>
                        <p>AI features are coming soon to help prioritize work, generate schedules, and boost productivity.</p>
                    </div>
                </div>
            </section>

            <section className="cta">
                <h2>Ready to Organize Your Work?</h2>
                <p>
                    Join thousands of users managing their projects smarter and faster with ORBIQ.
                </p>
                <div className="cta-buttons">
                    <Link className="primary-btn" to="/signup">
                        Get Started Free
                    </Link>

                    <Link className="secondary-btn" to="/pricing">
                        Explore Plans
                    </Link>
                </div>
            </section>

            <section className="testimonials">
                <h2>What Our Users Say</h2>
                <p className="testimonial-subtitle">
                    Thousands of users trust ORBIQ to organize their work every day.
                </p>

                <div className="testimonial-grid">
                    <div className="testimonial-card">
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p>"ORBIQ completely changed the way I manage my college assignments.
                            It's simple, fast and beautiful."</p>
                        <h3>Rahul Sharma</h3>
                        <span>Computer Science Student</span>
                    </div>

                    <div className="testimonial-card">
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p>"Our startup team became much more organized after switching to ORBIQ.
                            Collaboration has never been easier."</p>
                        <h3>Priya Mehta</h3>
                        <span>Startup Founder</span>
                    </div>

                    <div className="testimonial-card">
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <p>"The interface is clean and incredibly easy to use.
                            Looking forward to the upcoming AI Assistant."</p>
                        <h3>Aman Verma</h3>
                        <span>Product Manager</span>
                    </div>
                </div>
            </section>

            <Footer />

        </div>
    );
}

export default Home;