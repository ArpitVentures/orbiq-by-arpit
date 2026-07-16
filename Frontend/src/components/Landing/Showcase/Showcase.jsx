import "./Showcase.css";

function Showcase() {
    return (
        <section className="product-showcase">

            <div className="section-heading">

                <span className="section-tag">
                    PRODUCT PREVIEW
                </span>

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

                    <span className="window-title">
                        ORBIQ Workspace
                    </span>

                </div>

                <div className="showcase-body">

                    <div className="mini-sidebar">

                        <div className="sidebar-logo">
                            OQ
                        </div>

                        <div className="sidebar-item active"></div>
                        <div className="sidebar-item"></div>
                        <div className="sidebar-item"></div>
                        <div className="sidebar-item"></div>

                    </div>

                    <div className="mini-dashboard">

                        <div className="mini-cards">

                            <div className="mini-card cyan">
                                <h3>24</h3>
                                <p>Tasks</p>
                            </div>

                            <div className="mini-card green">
                                <h3>18</h3>
                                <p>Completed</p>
                            </div>

                            <div className="mini-card purple">
                                <h3>75%</h3>
                                <p>Productivity</p>
                            </div>

                        </div>

                        <div className="mini-board">

                            <div className="column">

                                <h4>To Do</h4>

                                <div className="task"></div>
                                <div className="task"></div>

                            </div>

                            <div className="column">

                                <h4>Progress</h4>

                                <div className="task active-task"></div>

                            </div>

                            <div className="column">

                                <h4>Done</h4>

                                <div className="task done-task"></div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Showcase;