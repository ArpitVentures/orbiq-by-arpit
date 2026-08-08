import React, { useMemo } from "react";
import {
    Activity,
    MessageSquare,
    Brain,
    Zap,
    AlertCircle,
    CheckCircle2,
    Clock3
} from "lucide-react";
import "./ApexActivity.css";

function ApexActivity({ messages = [] }) {

    const normalizedMessages = useMemo(() => {
        if (!Array.isArray(messages)) return [];

        return messages
            .filter(Boolean)
            .map((message, index) => ({
                id: message.id || message._id || index,
                text:
                    typeof message === "string"
                        ? message
                        : message.text || message.content || "",
                timestamp:
                    message.timestamp ||
                    message.createdAt ||
                    message.time ||
                    null,
                role: message.role || "user",
                intent: message.intent || null,
                emotion: message.emotion || null,
                intensity: message.intensity || null,
                processed: message.processed ?? false
            }))
            .filter((message) => message.text.trim().length > 0);
    }, [messages]);

    const contextStats = useMemo(() => {

        const total = normalizedMessages.length;

        const processed = normalizedMessages.filter(
            (message) => message.processed
        ).length;

        const emotionalSignals = normalizedMessages.filter(
            (message) => message.emotion
        ).length;

        const intentSignals = normalizedMessages.filter(
            (message) => message.intent
        ).length;

        return {
            total,
            processed,
            emotionalSignals,
            intentSignals
        };

    }, [normalizedMessages]);

    const getEmotionIcon = (emotion) => {

        switch (String(emotion || "").toLowerCase()) {
            case "frustrated":
            case "anger":
                return <AlertCircle size={15} />;

            case "excited":
            case "positive":
                return <Zap size={15} />;

            case "confused":
                return <Brain size={15} />;

            default:
                return <MessageSquare size={15} />;
        }
    };

    const formatTime = (timestamp) => {

        if (!timestamp) return "Recent";

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "Recent";
        }

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    };

    return (
        <section className="apex-activity">

            {/* Header */}

            <div className="apex-activity-header">

                <div className="apex-section-heading">

                    <div className="apex-heading-icon">
                        <Activity size={20} />
                    </div>

                    <div>
                        <span className="apex-eyebrow">
                            P.U.L.S.A.R. CONTEXT STREAM
                        </span>

                        <h2>Workspace Activity</h2>

                        <p>
                            P.U.L.S.A.R. interprets workspace signals to
                            understand what requires attention.
                        </p>
                    </div>

                </div>

                <div className="apex-live-indicator">
                    <span className="apex-live-dot" />
                    LIVE CONTEXT
                </div>

            </div>


            {/* Context intelligence summary */}

            <div className="apex-context-summary">

                <div className="context-stat">
                    <MessageSquare size={17} />

                    <div>
                        <span>MESSAGES</span>
                        <strong>{contextStats.total}</strong>
                    </div>
                </div>


                <div className="context-stat">
                    <Brain size={17} />

                    <div>
                        <span>INTERPRETED</span>
                        <strong>{contextStats.processed}</strong>
                    </div>
                </div>


                <div className="context-stat">
                    <Activity size={17} />

                    <div>
                        <span>INTENT SIGNALS</span>
                        <strong>{contextStats.intentSignals}</strong>
                    </div>
                </div>


                <div className="context-stat">
                    <Zap size={17} />

                    <div>
                        <span>EMOTION SIGNALS</span>
                        <strong>{contextStats.emotionalSignals}</strong>
                    </div>
                </div>

            </div>


            {/* Message stream */}

            <div className="apex-message-stream">

                <div className="stream-header">
                    <div>
                        <span className="apex-eyebrow">
                            INTELLIGENCE FEED
                        </span>

                        <h3>Recent Context</h3>
                    </div>

                    <span className="stream-status">
                        <span />
                        P.U.L.S.A.R. ONLINE
                    </span>
                </div>


                {normalizedMessages.length === 0 ? (

                    <div className="empty-context-state">

                        <div className="empty-context-icon">
                            <Brain size={24} />
                        </div>

                        <h3>Context window is clear.</h3>

                        <p>
                            As you interact with your workspace,
                            P.U.L.S.A.R. will interpret relevant signals
                            and build a contextual understanding of your
                            current mission.
                        </p>

                    </div>

                ) : (

                    <div className="message-list">

                        {normalizedMessages.map((message) => (

                            <article
                                className="context-message"
                                key={message.id}
                            >

                                <div className="message-indicator">
                                    <MessageSquare size={16} />
                                </div>


                                <div className="message-content">

                                    <div className="message-meta">

                                        <span>
                                            {message.role === "user"
                                                ? "WORKSPACE MEMBER"
                                                : "SYSTEM SIGNAL"}
                                        </span>

                                        <span>
                                            <Clock3 size={12} />
                                            {formatTime(message.timestamp)}
                                        </span>

                                    </div>


                                    <p className="message-text">
                                        {message.text}
                                    </p>


                                    {(message.intent ||
                                        message.emotion ||
                                        message.intensity) && (

                                        <div className="message-signals">

                                            {message.intent && (
                                                <span className="signal intent">
                                                    <Brain size={12} />
                                                    {message.intent}
                                                </span>
                                            )}

                                            {message.emotion && (
                                                <span className="signal emotion">
                                                    {getEmotionIcon(message.emotion)}
                                                    {message.emotion}
                                                </span>
                                            )}

                                            {message.intensity && (
                                                <span className="signal intensity">
                                                    <Activity size={12} />
                                                    {message.intensity}
                                                </span>
                                            )}

                                        </div>
                                    )}

                                </div>


                                <div className="message-processing">

                                    {message.processed ? (
                                        <>
                                            <CheckCircle2 size={15} />
                                            <span>INTERPRETED</span>
                                        </>
                                    ) : (
                                        <>
                                            <Brain size={15} />
                                            <span>ANALYZING</span>
                                        </>
                                    )}

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </div>


            {/* Intelligence note */}

            <div className="apex-context-note">

                <Brain size={18} />

                <div>
                    <strong>P.U.L.S.A.R. Context Intelligence</strong>

                    <p>
                        Messages are interpreted as workspace signals —
                        including intent, urgency, emotional tone,
                        informal language and contextual patterns —
                        rather than being treated as isolated text.
                    </p>
                </div>

            </div>

        </section>
    );
}

export default ApexActivity;