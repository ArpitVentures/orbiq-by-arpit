import "./WorkspaceHeader.css";

function WorkspaceHeader() {

    return (

        <section className="workspace-header">

            <div className="workspace-left">

                <p className="workspace-greeting">
                    Good Afternoon ☀️
                </p>

                <h1>
                    Welcome back,
                    <span> Arpit 👋</span>
                </h1>

                <p className="workspace-quote">
                    "Consistency beats intensity. Keep building."
                </p>

            </div>


            <div className="workspace-membership">

                <div className="membership-badge">
                    SILVER WORKSPACE
                </div>

                <h3>Unlimited Boards Enabled</h3>

                <p>
                    Active until
                    <strong> 12 Aug 2026</strong>
                </p>

                <button>
                    Manage Plan →
                </button>

            </div>

        </section>

    );

}

export default WorkspaceHeader;