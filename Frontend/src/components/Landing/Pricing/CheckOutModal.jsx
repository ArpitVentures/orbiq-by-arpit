import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CreditCard } from "lucide-react";
import { createOrder, verifyPayment } from "../../../services/paymentService";
import { useNavigate } from "react-router-dom";

function CheckOutModal({ plan, onClose }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState("Connecting secure payment...");

    if (!plan) return null;
    const isFree = plan.title === "Free";

    const interactionMessages = [
        "Preparing your workspace...",
        "Allocating cloud resources...",
        "Initializing productivity engine...",
        "Synchronizing encrypted session...",
        "Activating AI infrastructure...",
        "Launching secure payment gateway...",
        "Verifying enterprise environment...",
        "Almost ready...",
        "Don't panic 😎",
        "Hamare servers red carpet bicha rahe hain 🚀",
        "Coffee pila rahe hain backend ko ☕",
        "Elite access almost ready 👑",
        "Superpowers unlock ho rahi hain 🦾"
    ];

    useEffect(() => {
        let progressInterval;
        let messageInterval;

        if (isLoading) {
            messageInterval = setInterval(() => {
                const randomMsg = interactionMessages[Math.floor(Math.random() * interactionMessages.length)];
                setCurrentMessage(randomMsg);
            }, 1700);

            progressInterval = setInterval(() => {
                setLoadingProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        clearInterval(messageInterval);
                        return 100;
                    }
                    const increment = Math.floor(Math.random() * 15) + 5;
                    return Math.min(prev + increment, 100);
                });
            }, 300);
        }

        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, [isLoading]);

    useEffect(() => {
        if (loadingProgress === 100) {
            const timeout = setTimeout(async () => {
                try {
                    setIsLoading(false);
                    setLoadingProgress(0);
                    onClose();

                    const order = await createOrder(plan.title);

                    const user = JSON.parse(
                        localStorage.getItem("user")
                    );

                    if (!user) {
                        navigate("/login");
                        return;
                    }

                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY,
                        amount: order.amount,
                        currency: order.currency,
                        name: "ORBIQ",
                        description: `${plan.title} Subscription`,
                        order_id: order.id,
                        handler: async function (response) {
                            try {
                                await verifyPayment({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    email: user.email,
                                    plan: plan.title
                                });
                                navigate("/dashboard");
                            } catch (err) {
                                console.error("Verification failed:", err);
                            }
                        },
                        theme: {
                            color: plan.title === "Silver" ? "#22d3ee" : "#7c3aed"
                        }
                    };

                    const razorpay = new window.Razorpay(options);
                    razorpay.open();
                } catch (error) {
                    console.error("Order initialization failed:", error);
                }
            }, 800);

            return () => clearTimeout(timeout);
        }
    }, [loadingProgress]);

    const handleAction = () => {
        if (isFree) {
            navigate("/login");
            onClose();
        } else {
            setIsLoading(true);
        }
    };

    const getPlanMeta = () => {
        if (plan.title === "Gold") return { icon: "👑", highlights: ["AI Productivity Suite", "Workflow Automation", "Dedicated ORBIQ Expert"] };
        if (plan.title === "Silver") return { icon: "🥈", highlights: ["Unlimited Projects & Boards", "Advanced Analytics", "Priority Support (24×7)"] };
        return { icon: "🚀", highlights: ["Up to 3 Active Projects", "Basic Task Tracking", "Community Support"] };
    };

    const meta = getPlanMeta();

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={isLoading ? null : onClose}>

                {isLoading && (
                    <div className="particles-container">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="floating-particle" />
                        ))}
                    </div>
                )}

                <motion.div
                    className={`modal-container checkout-tier-${plan.tier} ${isLoading ? "expanded-loading" : ""}`}
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {!isLoading ? (
                        <>
                            <div className="modal-header">
                                <div>
                                    <h2>Secure Checkout</h2>
                                    <p>Complete your upgrade securely.</p>
                                </div>
                                <button className="close-modal-btn" onClick={onClose}><X size={20} /></button>
                            </div>

                            <div className="order-summary-box">
                                <div className="summary-row">
                                    <span className="summary-plan-name">
                                        <span className="plan-emoji-accent">{meta.icon}</span> ORBIQ {plan.title}
                                    </span>
                                    <span className="summary-plan-price">{plan.price}</span>
                                </div>
                                <div className="summary-row sub-detail">
                                    <span>Billing</span>
                                    <span>{plan.period === "Forever" ? "Lifetime Access" : `Billed ${plan.period}`}</span>
                                </div>
                                <div className="modal-feature-highlights">
                                    {meta.highlights.map((h, i) => (
                                        <div key={i} className="modal-highlight-item">
                                            <span className="bullet-tick">✓</span> {h}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="secure-checkout-badge">
                                <ShieldCheck size={18} className="secure-badge-icon" />
                                <span>Protected by Razorpay • 256-bit Encryption</span>
                            </div>

                            <button className={`modal-pay-btn modal-btn-${plan.tier}`} onClick={handleAction}>
                                <CreditCard size={18} /> Continue Secure Payment →
                            </button>
                        </>
                    ) : (
                        <div className="gateway-loading-stage">
                            {loadingProgress < 100 ? (
                                <>
                                    <div className="orbiq-engine">
                                        <motion.div
                                            className="engine-ring"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 10,
                                                ease: "linear"
                                            }}
                                        />
                                        <motion.div
                                            className="engine-core"
                                            animate={{
                                                scale: [1, 1.08, 1],
                                                opacity: [0.9, 1, 0.9]
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 2
                                            }}
                                        >
                                            ORBIQ
                                        </motion.div>
                                    </div>

                                    <div className="circular-progress-wrap">
                                        <svg className="progress-ring-svg" width="120" height="120">
                                            <circle className="progress-ring-bg" cx="60" cy="60" r="50" />
                                            <circle
                                                className="progress-ring-bar"
                                                cx="60"
                                                cy="60"
                                                r="50"
                                                style={{ strokeDashoffset: 314 - (314 * loadingProgress) / 100 }}
                                            />
                                        </svg>
                                        <div className="circular-progress-text">
                                            <span className="progress-percent">{loadingProgress}%</span>
                                            <span className="progress-brand">ORBIQ</span>
                                        </div>
                                    </div>

                                    <div className="engine-stage">
                                        <div className="stage-title">
                                            ORBIQ ENGINE INITIALIZATION
                                        </div>
                                        <div className="stage-progress">
                                            <div className={`stage-item ${loadingProgress > 15 ? "active" : ""}`}>
                                                ✓ Creating Secure Session
                                            </div>
                                            <div className={`stage-item ${loadingProgress > 35 ? "active" : ""}`}>
                                                ✓ Validating Account
                                            </div>
                                            <div className={`stage-item ${loadingProgress > 60 ? "active" : ""}`}>
                                                ✓ Connecting Payment Gateway
                                            </div>
                                            <div className={`stage-item ${loadingProgress > 82 ? "active" : ""}`}>
                                                ○ Redirecting to Razorpay
                                            </div>
                                        </div>
                                    </div>

                                    <motion.p
                                        key={currentMessage}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="loading-message-prompt"
                                    >
                                        {currentMessage}
                                    </motion.p>
                                </>
                            ) : (
                                <motion.div
                                    className="end-gate-celebration"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="success-screen">
                                        <motion.div
                                            initial={{ scale: .7 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: .5 }}
                                            className="success-icon"
                                        >
                                            ✓
                                        </motion.div>
                                        <h2>
                                            Secure Channel Established
                                        </h2>
                                        <p>
                                            Redirecting to Razorpay...
                                        </p>
                                    </div>
                                    <p className="success-gate-sub">Redirecting to Razorpay...</p>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default CheckOutModal;