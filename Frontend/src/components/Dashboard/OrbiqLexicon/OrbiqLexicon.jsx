import { useState } from "react";
import {
    X,
    BookOpenText,
    Rocket,
    Radio,
    Activity,
    CalendarDays,
    Bot,
    Zap,
    Target,
    Orbit,
    ShieldCheck
} from "lucide-react";
import "../../../styles/OrbiqLexicon.css";

const glossary = [
    {
        term: "Mission Control",
        meaning: "Your central dashboard — the command center for your ORBIQ workspace.",
        icon: BookOpenText
    },
    {
        term: "Missions",
        meaning: "Your tasks, objectives, and pieces of work that need to be completed.",
        icon: Rocket
    },
    {
        term: "Vectors",
        meaning: "Active tasks or objectives moving toward completion.",
        icon: Target
    },
    {
        term: "Orbit",
        meaning: "Your calendar and scheduled activities — everything moving through your timeline.",
        icon: CalendarDays
    },
    {
        term: "Telemetry",
        meaning: "Productivity signals, analytics, and performance data from your workspace.",
        icon: Activity
    },
    {
        term: "Beacon",
        meaning: "Important notifications and system signals that need your attention.",
        icon: Radio
    },
    {
        term: "HORIZON",
        meaning: "ORBIQ's AI intelligence layer for assistance, insights, and workspace interaction.",
        icon: Bot
    },
    {
        term: "System Velocity",
        meaning: "A snapshot of how quickly your active work is progressing toward completion.",
        icon: Zap
    },
    {
        term: "Orbital Grid",
        meaning: "Your connected productivity environment where tasks, schedules, analytics, and intelligence converge.",
        icon: Orbit
    },
    {
        term: "Commander",
        meaning: "You — the operator and decision-maker of your ORBIQ workspace.",
        icon: ShieldCheck
    }
];

function OrbiqLexicon() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                className="orbiq-lexicon-trigger"
                onClick={() => setIsOpen(true)}
                aria-label="Open ORBIQ Lexicon"
            >
                <BookOpenText size={17} />
                <span>ORBIQ LEXICON</span>
            </button>

            {isOpen && (
                <div
                    className="orbiq-lexicon-overlay"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="orbiq-lexicon-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="orbiq-lexicon-header">
                            <div className="orbiq-lexicon-title">
                                <div className="orbiq-lexicon-icon">
                                    <BookOpenText size={21} />
                                </div>

                                <div>
                                    <h2>ORBIQ Lexicon</h2>
                                    <p>Decode the ORBIQ universe.</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="orbiq-lexicon-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close Lexicon"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="orbiq-lexicon-grid">
                            {glossary.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        className="orbiq-lexicon-entry"
                                        key={item.term}
                                    >
                                        <div className="orbiq-lexicon-entry-icon">
                                            <Icon size={17} />
                                        </div>

                                        <div className="orbiq-lexicon-entry-content">
                                            <h3>{item.term}</h3>
                                            <p>{item.meaning}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="orbiq-lexicon-footer">
                            <span>🛰️ ORBIQ SYSTEM TERMINOLOGY</span>
                            <span>10 entries</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OrbiqLexicon;