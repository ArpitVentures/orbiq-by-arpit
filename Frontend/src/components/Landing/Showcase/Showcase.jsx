import React from "react";
import { Home, ListTodo, BarChart3, Settings, User } from "lucide-react";
import "./Showcase.css";

function Showcase() {
    return (
        <section className="product-showcase">
            <div className="section-heading">
                <span className="section-tag">PRODUCT PREVIEW</span>
                <h2>
                    Everything You Need.
                    <br />
                    One Beautiful Workspace.
                </h2>
                <p>
                    Designed for students, developers and growing teams.
                    Manage tasks, deadlines, analytics and productivity from
                    one elegant dashboard.
                </p>
            </div>

            <div className="showcase-window">
                <div className="window-top">
                    <div className="window-dots">
                        <span className="red"></span>
                        <span className="yellow"></span>
                        <span className="green"></span>
                    </div>

                    <span className="window-title">ORBIQ Workspace</span>
                </div>

                <div className="showcase-body">

                    <div className="mini-sidebar">
                        <div className="sidebar-top-group">
                            <div className="sidebar-logo">OQ</div>
                            <div className="sidebar-item active">
                                <Home size={20} />
                            </div>
                            <div className="sidebar-item">
                                <ListTodo size={20} />
                            </div>
                            <div className="sidebar-item">
                                <BarChart3 size={20} />
                            </div>
                            <div className="sidebar-item">
                                <Settings size={20} />
                            </div>
                        </div>

                        <div className="sidebar-profile-node">
                            <User size={18} />
                        </div>
                    </div>

                    <div className="mini-dashboard">

                        <div className="mini-cards">
                            <div className="mini-card cyan">
                                <div className="card-header-row">
                                    <h3>24</h3>
                                    <span className="trend-badge cyan-trend">↑ +6 today</span>
                                </div>
                                <p>Tasks Active</p>
                            </div>
                            <div className="mini-card green">
                                <div className="card-header-row">
                                    <h3>18</h3>
                                    <span className="trend-badge green-trend">↑ 28%</span>
                                </div>
                                <p>Done This Week</p>
                            </div>
                            <div className="mini-card purple">
                                <div className="card-header-row">
                                    <h3>99.9%</h3>
                                    <span className="trend-badge pulse-trend"><span className="dot-live"></span> Live</span>
                                </div>
                                <p>Uptime Matrix</p>
                            </div>
                        </div>

                        <div className="mini-board">
                            <div className="column">
                                <h4>To Do</h4>
                                <div className="task h-small">
                                    <span>Landing Page</span>
                                </div>
                                <div className="task h-large">
                                    <span>UI Polish & Layout Adjustments</span>
                                </div>
                            </div>

                            <div className="column">
                                <h4>Progress</h4>
                                <div className="task active-task h-medium">
                                    <span>API Integration</span>
                                </div>
                                <div className="task active-task h-small">
                                    <span>Dashboard Sync</span>
                                </div>
                            </div>

                            <div className="column">
                                <h4>Done</h4>
                                <div className="task done-task h-small">
                                    <span className="check-mark-success">✔</span>
                                    <span>Authentication</span>
                                </div>
                                <div className="task done-task h-medium">
                                    <span className="check-mark-success">✔</span>
                                    <span>Payment Gateway Link</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Showcase;