import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
    FaRobot,
    FaBrain,
    FaMagic,
    FaTerminal
} from "react-icons/fa";
import "../styles/AIAssistant.css";

function AIAssistant() {
    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main-content">
                <Topbar />

                <div className="ai-assistant-page">


                    <div className="ai-hero-section">
                        <div className="ai-icon-pulse">
                            <FaRobot />
                        </div>
                        <h1>AI Productivity Assistant</h1>
                        <p className="ai-tagline">
                            The next evolution of smart task execution is breathing.
                        </p>
                        <div className="badge-coming-soon">
                            Coming Soon in v2.0
                        </div>
                    </div>


                    <div className="ai-features-preview">

                        <div className="ai-preview-card">
                            <div className="card-icon cyan-glow">
                                <FaBrain />
                            </div>
                            <h3>Automated Scheduling</h3>
                            <p>
                                Let the AI analyze your patterns and automatically assign
                                priorities to pending backlogs.
                            </p>
                        </div>

                        <div className="ai-preview-card">
                            <div className="card-icon purple-glow">
                                <FaMagic />
                            </div>
                            <h3>Smart Breakdown</h3>
                            <p>
                                One large assignment module? Click once to slice it into
                                smaller digestible 30-min checkpoints.
                            </p>
                        </div>

                        <div className="ai-preview-card">
                            <div className="card-icon orange-glow">
                                <FaTerminal />
                            </div>
                            <h3>Natural Language Input</h3>
                            <p>
                                Type "Remind me to finish physics project tomorrow at 4 PM"
                                and let the engine extract metadata.
                            </p>
                        </div>

                    </div>


                    <p className="ai-footer-note">
                        Model Status : Offline |
                        AI Engine : Sleeping 😴 |
                        Expected Version : v2.0
                    </p>

                </div>
            </div>
        </div>
    );
}

export default AIAssistant;