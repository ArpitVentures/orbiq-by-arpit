import { useState } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { settingsQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/Settings.css";

const GlassTimePicker = ({ value, onChange }) => {
    const [selectedHour, selectedMinute] = (value || "06:30").split(":");

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

    return (
        <div className="glass-time-selector">
            <select
                value={selectedHour}
                onChange={(e) => onChange(`${e.target.value}:${selectedMinute || "00"}`)}
                className="time-segment-select"
            >
                {hours.map((h) => (
                    <option key={h} value={h}>
                        {h}
                    </option>
                ))}
            </select>

            <span className="time-colon">:</span>

            <select
                value={selectedMinute || "00"}
                onChange={(e) => onChange(`${selectedHour || "00"}:${e.target.value}`)}
                className="time-segment-select"
            >
                {minutes.map((m) => (
                    <option key={m} value={m}>
                        {m}
                    </option>
                ))}
            </select>
        </div>
    );
};

function Settings() {
    const [reminders, setReminders] = useState(() => {
        const val = localStorage.getItem("orbiq_reminders");
        return val !== null ? val === "true" : true;
    });

    const [summary, setSummary] = useState(() => {
        const val = localStorage.getItem("orbiq_summary");
        return val !== null ? val === "true" : false;
    });

    const [morningTime, setMorningTime] = useState(
        () => localStorage.getItem("orbiq_morning_time") || "06:30"
    );
    const [nightTime, setNightTime] = useState(
        () => localStorage.getItem("orbiq_night_time") || "22:00"
    );
    const [weekStart, setWeekStart] = useState(
        () => localStorage.getItem("orbiq_week_start") || "Monday"
    );

    const [greetingStyle, setGreetingStyle] = useState(
        () => localStorage.getItem("orbiq_greeting_style") || "default"
    );

    const [spaceRank, setSpaceRank] = useState(
        () => localStorage.getItem("orbiq_space_rank") || "Commander"
    );

    const [savedSettings, setSavedSettings] = useState(() => ({
        reminders: localStorage.getItem("orbiq_reminders") !== null ? localStorage.getItem("orbiq_reminders") === "true" : true,
        summary: localStorage.getItem("orbiq_summary") !== null ? localStorage.getItem("orbiq_summary") === "true" : false,
        morningTime: localStorage.getItem("orbiq_morning_time") || "06:30",
        nightTime: localStorage.getItem("orbiq_night_time") || "22:00",
        weekStart: localStorage.getItem("orbiq_week_start") || "Monday",
        greetingStyle: localStorage.getItem("orbiq_greeting_style") || "default",
        spaceRank: localStorage.getItem("orbiq_space_rank") || "Commander"
    }));

    const currentSettings = {
        reminders,
        summary,
        morningTime,
        nightTime,
        weekStart,
        greetingStyle,
        spaceRank
    };

    const hasChanges =
        savedSettings !== null &&
        JSON.stringify(currentSettings) !== JSON.stringify(savedSettings);

    const handleSaveSettings = (e) => {
        e.preventDefault();

        localStorage.setItem("orbiq_morning_time", morningTime);
        localStorage.setItem("orbiq_night_time", nightTime);
        localStorage.setItem("orbiq_week_start", weekStart);
        localStorage.setItem("orbiq_greeting_style", greetingStyle);
        localStorage.setItem("orbiq_space_rank", spaceRank);
        localStorage.setItem("orbiq_reminders", String(reminders));
        localStorage.setItem("orbiq_summary", String(summary));

        setSavedSettings(currentSettings);

        const randomQuote = getRandomQuote(settingsQuotes);
        toast.success(randomQuote, { duration: 4000 });
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="main-content">
                <Topbar />

                <div className="settings-page">
                    <div className="command-header-zone">
                        <span className="command-subtitle-tag">WORKSPACE CONFIGURATION</span>
                        <h1 className="command-title">🛸 Command Center</h1>
                    </div>

                    <div className="settings-card">
                        <h2>Orbit Cycle Preferences</h2>
                        <p className="meta-text" style={{ marginBottom: "16px" }}>
                            Configure your day/night thresholds to align logical timelines and greetings with your personal schedule.
                        </p>

                        <div className="setting-item">
                            <span>Mission Day Starts At</span>
                            <GlassTimePicker
                                value={morningTime}
                                onChange={setMorningTime}
                            />
                        </div>

                        <div className="setting-item">
                            <span>Night Cycle Starts At</span>
                            <GlassTimePicker
                                value={nightTime}
                                onChange={setNightTime}
                            />
                        </div>

                        <div className="setting-item">
                            <span>Mission Week Starts On</span>
                            <select
                                value={weekStart}
                                onChange={(e) => setWeekStart(e.target.value)}
                                className="command-select-input"
                            >
                                <option value="Monday">Monday (Standard)</option>
                                <option value="Sunday">Sunday (Calendar Orbit)</option>
                            </select>
                        </div>
                    </div>

                    <div className="settings-card">
                        <h2>Personality & Greeting Mode</h2>
                        <p className="meta-text" style={{ marginBottom: "16px" }}>
                            Choose how Mission Control speaks to you when you enter the workspace.
                        </p>

                        <div className="greeting-radio-grid">
                            <label className={`personality-option-card ${greetingStyle === "default" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="greetingStyle"
                                    value="default"
                                    checked={greetingStyle === "default"}
                                    onChange={(e) => setGreetingStyle(e.target.value)}
                                />
                                <div>
                                    <div className="p-title">Default</div>
                                    <div className="p-preview">Standard time-of-day greetings ("Good Morning 🌅")</div>
                                </div>
                            </label>

                            <label className={`personality-option-card ${greetingStyle === "professional" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="greetingStyle"
                                    value="professional"
                                    checked={greetingStyle === "professional"}
                                    onChange={(e) => setGreetingStyle(e.target.value)}
                                />
                                <div>
                                    <div className="p-title">Professional</div>
                                    <div className="p-preview">Formal & clean ("Good Afternoon, Arpit.")</div>
                                </div>
                            </label>

                            <label className={`personality-option-card ${greetingStyle === "friendly" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="greetingStyle"
                                    value="friendly"
                                    checked={greetingStyle === "friendly"}
                                    onChange={(e) => setGreetingStyle(e.target.value)}
                                />
                                <div>
                                    <div className="p-title">Friendly</div>
                                    <div className="p-preview">Casual & warm ("Morning Arpit! ☕")</div>
                                </div>
                            </label>

                            <label className={`personality-option-card ${greetingStyle === "space_commander" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="greetingStyle"
                                    value="space_commander"
                                    checked={greetingStyle === "space_commander"}
                                    onChange={(e) => setGreetingStyle(e.target.value)}
                                />
                                <div>
                                    <div className="p-title">Space Ops HUD</div>
                                    <div className="p-preview">Sci-fi Mission Control ("🚀 Mission Control Online, Commander.")</div>
                                </div>
                            </label>
                        </div>

                        {greetingStyle === "space_commander" && (
                            <div className="setting-item" style={{ marginTop: "20px", borderTop: "1px dashed rgba(255,255,255,0.08)", paddingTop: "16px", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                    <span>Astronaut Designation / Callsign</span>
                                    <select
                                        value={spaceRank}
                                        onChange={(e) => setSpaceRank(e.target.value)}
                                        className="command-select-input"
                                    >
                                        <option value="Commander">Commander (CDR)</option>
                                        <option value="Flight Director">Flight Director (FD)</option>
                                        <option value="Mission Specialist">Mission Specialist (MS)</option>
                                        <option value="Pilot">Pilot (PLT)</option>
                                        <option value="Payload Specialist">Payload Specialist (PS)</option>
                                        <option value="Systems Engineer">Systems Engineer (SE)</option>
                                    </select>
                                </div>
                                <p className="meta-text" style={{ fontSize: "12px", margin: "4px 0 0 0", color: "#64748b" }}>
                                    💡 Personal workspace callsign. In Organization/B2B workspaces, ranks are governed by admin permissions.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="settings-card">
                        <h2>Beacon & System Alerts</h2>

                        <div className="setting-item">
                            <span>Beacon Preferences</span>
                            <input
                                type="checkbox"
                                checked={reminders}
                                onChange={(e) => setReminders(e.target.checked)}
                            />
                        </div>

                        <div className="setting-item">
                            <span>Daily Summary Alerts</span>
                            <input
                                type="checkbox"
                                checked={summary}
                                onChange={(e) => setSummary(e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="settings-card">
                        <h2>About ORBIQ</h2>
                        <p>
                            ORBIQ is a smart productivity platform for organizing work, managing pipelines, and shipping faster.
                        </p>

                        <p className="meta-text">ORBIQ OS v1.0.0 • Command Center</p>
                        <p className="meta-text">Production Build</p>
                        <p className="meta-text">Built with ☕ by Arpit Srivastava</p>
                        <p className="meta-text">Made with Love in India 🇮🇳</p>
                    </div>

                    <div className="settings-actions">
                        <button
                            className="btn-save-settings"
                            onClick={handleSaveSettings}
                            disabled={!hasChanges}
                        >
                            Save Command Center Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;