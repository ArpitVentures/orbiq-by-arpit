import { useEffect, useMemo, useRef, useState } from "react";
import { sendHorizonMessage } from "../../services/horizonService";
import {
    Send,
    Sparkles,
    Brain,
    Mic,
    RotateCcw,
    ChevronRight,
    History
} from "lucide-react";
import "./HorizonPanel.css";

function HorizonPanel({ user, workspaceContext }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (showHistory) return;

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, [messages, isThinking, showHistory]);

    const currentUser = useMemo(() => {
        if (user) return user;
        try {
            return JSON.parse(sessionStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    }, [user]);

    const displayName =
        currentUser?.name ||
        currentUser?.fullName ||
        currentUser?.username ||
        "Commander";

    const firstName = displayName.split(" ")[0];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const sendMessage = async (textToSend) => {
        const trimmedMessage = textToSend.trim();

        if (!trimmedMessage || isThinking) return;

        const userMessage = {
            id: Date.now(),
            role: "user",
            text: trimmedMessage
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage("");
        setIsThinking(true);

        try {
            console.log("HORIZON FRONTEND CONTEXT:", workspaceContext);

            const response = await sendHorizonMessage(
                trimmedMessage,
                workspaceContext
            );

            const horizonMessage = {
                id: Date.now() + 1,
                role: "horizon",
                text:
                    response?.data?.response ||
                    "I’m here. How can I help?"
            };

            setMessages((prev) => [
                ...prev,
                horizonMessage
            ]);
        } catch (error) {
            console.error(
                "HORIZON request failed:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "horizon",
                    text:
                        "I’m having trouble reaching the P.U.L.S.A.R. core right now. Please try again in a moment."
                }
            ]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleSend = () => {
        sendMessage(message);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const clearConversation = () => {
        setMessages([]);
        setMessage("");
    };

    const suggestedPrompts = [
        "What should I focus on next?",
        "Summarize my workspace",
        "Help me plan today"
    ];

    return (
        <section className="horizon-panel">

            <div className="horizon-panel-header">
                <div className="horizon-panel-identity">
                    <div className="horizon-panel-orb">
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <span className="horizon-panel-eyebrow">
                            P.U.L.S.A.R. INTELLIGENCE
                        </span>
                        <h2>HORIZON</h2>
                        <p>Your context-aware intelligence layer.</p>
                    </div>
                </div>

                <div className="horizon-panel-header-actions">
                    <button
                        type="button"
                        className={`horizon-history-btn ${
                            showHistory ? "active" : ""
                        }`}
                        onClick={() => setShowHistory((prev) => !prev)}
                    >
                        <History size={15} />
                        History
                    </button>

                    <div className="horizon-panel-status">
                        <span className="horizon-status-dot"></span>
                        <span>ONLINE</span>
                    </div>
                </div>
            </div>

            <div className="horizon-primary-chat">
                <div className="horizon-chat-label">
                    <div className="horizon-chat-label-icon">
                        <Brain size={16} />
                    </div>
                    <div>
                        <span>HORIZON</span>
                        <small>Context-aware workspace intelligence</small>
                    </div>
                </div>

                <div className="horizon-input-shell">
                    <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask HORIZON, ${firstName}...`}
                        rows={1}
                        disabled={isThinking}
                    />

                    <div className="horizon-input-actions">
                        <button
                            type="button"
                            className="horizon-icon-btn"
                            title="Voice input"
                            disabled
                        >
                            <Mic size={18} />
                        </button>

                        <button
                            type="button"
                            className="horizon-send-btn"
                            onClick={handleSend}
                            disabled={!message.trim() || isThinking}
                            title="Send message"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                <div className="horizon-input-meta">
                    <span>
                        Press Enter to send · Shift + Enter for a new line
                    </span>
                    <span>P.U.L.S.A.R. CONTEXT ACTIVE</span>
                </div>
            </div>

            {messages.length === 0 && !showHistory && (
                <div className="horizon-suggestions">
                    <span className="horizon-suggestions-label">
                        Try asking
                    </span>
                    <div className="horizon-suggestion-list">
                        {suggestedPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                onClick={() => sendMessage(prompt)}
                            >
                                {prompt}
                                <ChevronRight size={13} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="horizon-conversation">
                {showHistory ? (
                    <div className="horizon-history-panel">
                        <div className="horizon-history-heading">
                            <div>
                                <span>HORIZON HISTORY</span>
                                <h3>Previous Conversations</h3>
                            </div>
                            <span className="horizon-history-count">V1.0</span>
                        </div>

                        <div className="horizon-history-empty">
                            <History size={24} />
                            <strong>Conversation history will appear here.</strong>
                            <p>
                                HORIZON will retain relevant workspace context across conversations.
                            </p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="horizon-empty-state">
                        <h3>
                            {getGreeting()}, {firstName}.
                        </h3>
                        <p>
                            Your workspace telemetry is active. Ask anything about your ORBIQ missions or productivity.
                        </p>
                    </div>
                ) : (
                    <div className="horizon-message-list">
                        {messages.map((item) => (
                            <div
                                key={item.id}
                                className={`horizon-message ${
                                    item.role === "user"
                                        ? "user-message"
                                        : "horizon-message-item"
                                }`}
                            >
                                {item.role !== "user" && (
                                    <div className="message-avatar">
                                        <Sparkles size={16} />
                                    </div>
                                )}
                                <div className="message-content">
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        ))}

                        {isThinking && (
                            <div className="horizon-message horizon-message-item">
                                <div className="message-avatar">
                                    <Sparkles size={16} />
                                </div>
                                <div className="message-content">
                                    <div className="thinking-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="horizon-input-footer">
                <span>HORIZON operates within the ORBIQ workspace.</span>
                {messages.length > 0 && (
                    <button
                        type="button"
                        onClick={clearConversation}
                        className="clear-horizon-btn"
                    >
                        <RotateCcw size={12} />
                        New conversation
                    </button>
                )}
            </div>
        </section>
    );
}

export default HorizonPanel;