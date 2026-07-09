import { useState } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { settingsQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/Settings.css";

function Settings() {

    const [reminders, setReminders] = useState(true);
    const [summary, setSummary] = useState(false);

    const handleSaveSettings = (e) => {
        e.preventDefault();

        const randomQuote = getRandomQuote(settingsQuotes);
        toast.success(`${randomQuote} ⚙️✨`, {
            duration: 4000
        });
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main-content">
                <Topbar />

                <div className="settings-page">
                    <h1>⚙️ Settings</h1>

                    {/* Preferences Area */}
                    <div className="settings-card">
                        <h2>System Preferences</h2>

                        <div className="setting-item">
                            <span>Task Flow Notifications</span>
                            <input
                                type="checkbox"
                                checked={reminders}
                                onChange={(e) =>
                                    setReminders(e.target.checked)}
                            />
                        </div>

                        <div className="setting-item">
                            <span>Daily Summary Alerts</span>
                            <input
                                type="checkbox"
                                checked={summary}
                                onChange={(e) =>
                                    setSummary(e.target.checked)}
                            />
                        </div>
                    </div>

                    {/* About Card */}
                    <div className="settings-card">
                        <h2>About TaskFlow</h2>
                        <p>TaskFlow is a premium, smart productivity platform built to help developers
                            and professionals organize pipelines and smash deadlines without crashing.</p>
                        <p className="meta-text">TaskFlow v1.0.0</p>
                        <p className="meta-text">Production Build</p>
                        <p className="meta-text">Built with ☕  by Arpit Srivastava</p>
                        <p className="meta-text">Made with Love in India </p>
                    </div>


                    <div className="settings-actions">
                        <button className="btn-save-settings" onClick={handleSaveSettings}>
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;