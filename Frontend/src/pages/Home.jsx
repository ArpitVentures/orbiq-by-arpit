import { motion } from 'framer-motion';

import{
    FaTasks,
    FaUsers,
    FaBolt,
    FaShieldAlt
} from "react-icons/fa";

import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home">


            <nav className="navbar">

                <h2>TaskFlow</h2>

                <div className="nav-links">

                    <Link to="/login">Login</Link>

                    <Link className="signup-btn" to="/signup">
                        Sign Up
                    </Link>

                </div>

            </nav>


            <motion.section
                className="hero"
                initial={{ opacity: 0, y:60}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >

                <div className="hero-bg">
                    <div className="blob blob1"></div>
                    <div className="blob blob2"></div>
                    <div className="blob blob3"></div>
                </div>


                <motion.h1
                    initial={{ opacity: 0, y:40}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8
                    }}>

                    Organize Your Work.
                    <br />
                    Finish More Tasks.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    transition={{
                        delay: 0.6,
                        duration: 0.8
                    }}>

                    Manage tasks, collaborate with your team,
                    and stay productive from anywhere.
                </motion.p>

                <motion.div className="hero-buttons"
                            initial={{ opacity: 0, y:30}}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.9,
                                duration: 0.8
                            }}>

                    <Link className="primary-btn" to="/signup">
                        Get Started
                    </Link>

                    <Link className="secondary-btn" to="/login">
                        Login
                    </Link>

                </motion.div>

            </motion.section>


            <section className="features">

                <h2>Why Choose TaskFlow?</h2>

                <p className="feature-subtitle">
                    Everything you need to manage your work efficiently.
                </p>

                <div className="feature-grid">

                    <div className="feature-card">
                        <div className="icon">
                            <FaTasks/>
                        </div>

                        <h3>Smart Task Management</h3>

                        <p>
                            Create, organize and track your daily tasks with ease.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="icon">
                            <FaUsers/>
                        </div>

                        <h3>Team Collaboration</h3>

                        <p>
                            Collaborate with teammates and stay in sync in real time.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="icon">
                            <FaBolt/>
                        </div>

                        <h3>Lightning Fast</h3>

                        <p>
                            Optimized for speed so you can focus on getting work done.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="icon">
                            <FaShieldAlt/>
                        </div>

                        <h3>Secure Storage</h3>

                        <p>
                            Your tasks and personal information stay protected.
                        </p>
                    </div>

                </div>

            </section>


            <section className="stats">

                <div className="stat-box">
                    <h2>10K+</h2>
                    <p>Active Users</p>
                </div>

                <div className="stat-box">
                    <h2>50K+</h2>
                    <p>Tasks Completed</p>
                </div>

                <div className="stat-box">
                    <h2>99.9%</h2>
                    <p>Uptime</p>
                </div>

                <div className="stat-box">
                    <h2>24/7</h2>
                    <p>Support</p>
                </div>

            </section>

            <section className="how-it-works">

                <h2>How TaskFlow Works</h2>

                <p className="how-subtitle">
                    Get started in just four simple steps.
                </p>

                <div className="steps">

                    <div className="step-card">
                        <div className="step-number">1</div>
                        <div className="step-icon">👤</div>
                        <h3>Create Account</h3>
                        <p>
                            Sign up and create your personal workspace in seconds.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <div className="step-icon">📝</div>
                        <h3>Add Tasks</h3>
                        <p>
                            Create tasks, set priorities and organize your work.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <div className="step-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>
                            Monitor completed and pending tasks with ease.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <div className="step-icon">🎯</div>
                        <h3>Achieve Goals</h3>
                        <p>
                            Stay productive every day and accomplish more.
                        </p>
                    </div>

                </div>

            </section>

            <section className="pricing-preview">

                <h2>Choose Your Perfect Plan</h2>

                <p className="pricing-subtitle">
                    Flexible pricing for students, professionals and teams.
                </p>

                <div className="pricing-grid">

                    <div className="plan-card">

                        <h3>Free</h3>

                        <h1>₹0</h1>

                        <p>Forever Free</p>

                        <ul>
                            <li>✔ Unlimited Personal Tasks</li>
                            <li>✔ Basic Dashboard</li>
                            <li>✔ Community Support</li>
                        </ul>

                        <Link className="plan-btn" to="/signup">
                            Start Free
                        </Link>

                    </div>

                    <div className="plan-card popular">

                        <span className="badge">Most Popular</span>

                        <h3>Silver</h3>

                        <h1>₹199</h1>

                        <p>per month</p>

                        <ul>
                            <li>✔ Team Collaboration</li>
                            <li>✔ Unlimited Projects</li>
                            <li>✔ Priority Support</li>
                        </ul>

                        <Link className="plan-btn" to="/pricing">
                            Choose Silver
                        </Link>

                    </div>

                    <div className="plan-card">

                        <h3>Gold 👑</h3>

                        <h1>₹499</h1>

                        <p>per month</p>

                        <ul>
                            <li>✔ Everything in Silver</li>
                            <li>✔ AI Assistant <strong>(Coming Soon)</strong></li>
                            <li>✔ Advanced Analytics</li>
                        </ul>

                        <Link className="plan-btn" to="/pricing">
                            Choose Gold
                        </Link>

                    </div>

                </div>

            </section>

            <section className="faq">

                <h2>Frequently Asked Questions</h2>

                <p className="faq-subtitle">
                    Everything you need to know before getting started.
                </p>

                <div className="faq-container">

                    <div className="faq-item">
                        <h3>Is TaskFlow free to use?</h3>
                        <p>
                            Yes. You can start with our Free plan and upgrade anytime.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>Can I collaborate with my team?</h3>
                        <p>
                            Absolutely! Team collaboration is available in Pro and Enterprise plans.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>Is my data secure?</h3>
                        <p>
                            Yes. We use encrypted storage and secure authentication to protect your data.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>Will AI help manage my tasks?</h3>
                        <p>
                            AI features are coming soon to help prioritize work, generate schedules, and boost productivity.
                        </p>
                    </div>

                </div>

            </section>

            <section className="cta">

                <h2>Ready to Organize Your Work?</h2>

                <p>
                    Join thousands of users managing their projects
                    smarter and faster with TaskFlow.
                </p>

                <div className="cta-buttons">

                    <Link className="primary-btn" to="/signup">
                        Get Started Free
                    </Link>

                    <Link className="secondary-btn" to="/pricing">
                        View Plans
                    </Link>

                </div>

            </section>


            <footer className="footer">

                <div className="footer-grid">

                    <div>
                        <h2>TaskFlow</h2>
                        <p>
                            Manage your work smarter with powerful task management,
                            collaboration and AI-driven productivity.
                        </p>
                    </div>

                    <div>
                        <h3>Product</h3>
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">AI Assistant (Coming Soon)</a>
                    </div>

                    <div>
                        <h3>Company</h3>
                        <a href="#">About</a>
                        <a href="#">Careers</a>
                        <a href="#">Contact</a>
                    </div>

                    <div>
                        <h3>Resources</h3>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Help Center</a>
                    </div>

                </div>

                <hr />

                <p className="copyright">
                    © 2026 TaskFlow. Built with ❤️ using React & Node.js
                </p>

            </footer>

            <section className="testimonials">

                <h2>What Our Users Say</h2>

                <p className="testimonial-subtitle">
                    Thousands of users trust TaskFlow to organize their work every day.
                </p>

                <div className="testimonial-grid">

                    <div className="testimonial-card">

                        <div className="stars">⭐⭐⭐⭐⭐</div>

                        <p>
                            "TaskFlow completely changed the way I manage my college assignments. It's simple, fast and beautiful."
                        </p>

                        <h3>Rahul Sharma</h3>

                        <span>Computer Science Student</span>

                    </div>

                    <div className="testimonial-card">

                        <div className="stars">⭐⭐⭐⭐⭐</div>

                        <p>
                            "Our startup team became much more organized after switching to TaskFlow. Collaboration has never been easier."
                        </p>

                        <h3>Priya Mehta</h3>

                        <span>Startup Founder</span>

                    </div>

                    <div className="testimonial-card">

                        <div className="stars">⭐⭐⭐⭐⭐</div>

                        <p>
                            "The interface is clean and incredibly easy to use. Looking forward to the upcoming AI Assistant."
                        </p>

                        <h3>Aman Verma</h3>

                        <span>Product Manager</span>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;