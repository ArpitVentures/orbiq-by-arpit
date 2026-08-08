import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import { createOrder, verifyPayment } from "../../../services/paymentService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function CheckOutModal({ plan, onClose }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    if (!plan) return null;

    const isFree = String(plan?.title).toLowerCase() === "free";

    const handleAction = async () => {
        const token = localStorage.getItem("token");
        const userObj = localStorage.getItem("user");

        if (!isFree && (!token || !userObj)) {
            toast.error("Authentication required! Redirecting to setup your account first. 🔐", { icon: "ℹ️" });
            onClose();
            navigate("/login", {
                state: { from: "pricing", planToPurchase: plan.tier }
            });
            return;
        }

        if (isFree) {
            onClose();
            navigate("/login?mode=signup", {
                state: { cameFromLanding: true, scrollTo: "pricing" }
            });
            return;
        }

        try {
            setIsLoading(true);

            const razorpaySDK = window["Razorpay"];
            if (!razorpaySDK) {
                setIsLoading(false);
                toast.error("Razorpay SDK failed to load. Please refresh! ❌");
                return;
            }

            const orderResponse = await createOrder(plan.title);
            const order = orderResponse?.data ? orderResponse.data : orderResponse;

            if (!order || !order.id) {
                setIsLoading(false);
                toast.error("Invalid order received from backend. ❌");
                return;
            }

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

            if (!razorpayKey) {
                toast.error("Payment gateway configuration is missing.");
                setIsLoading(false);
                return;
            }

            const handlePaymentSuccess = async (response) => {
                try {
                    const verifyResponse = await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        plan: plan.title
                    });

                    const data = verifyResponse?.data ? verifyResponse.data : verifyResponse;

                    if (data.user) {
                        localStorage.setItem("user", JSON.stringify(data.user));
                    }

                    window.dispatchEvent(new Event("user-updated"));

                    const toastOptions = { duration: 6000, icon: <Sparkles color={plan.tier === "silver" ? "#22d3ee" : "#fbbf24"} /> };
                    const formattedPlanName = plan.title.charAt(0).toUpperCase() + plan.title.slice(1);

                    switch (data.purchaseType) {
                        case "upgrade":
                            toast.success(
                                <div>
                                    <b>{formattedPlanName} Membership Activated! 🚀</b>
                                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                                        {plan.tier === "silver"
                                            ? "Enjoy Unlimited Projects, Advanced Analytics, & Priority Support."
                                            : "Enjoy AI Suite, Workflow Automation, & Dedicated Support."}
                                    </div>
                                </div>,
                                toastOptions
                            );
                            break;

                        case "renewal":
                            toast.success(`⚡ ${formattedPlanName} Plan Renewed! Your 30-day quota is extended.`, toastOptions);
                            break;

                        default:
                            toast.success(`🚀 Welcome to ORBIQ ${formattedPlanName}! Premium features unlocked.`, toastOptions);
                    }

                    onClose();
                    navigate("/dashboard");

                } catch (err) {
                    console.error("Verification failed:", err);
                    const errorMsg = err.response?.data?.message || "Payment confirmation trace rejected! ❌";
                    toast.error(errorMsg);
                }
            };

            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency || "INR",
                name: "ORBIQ",
                description: `${plan.title} Subscription Package`,
                order_id: order.id,
                handler: handlePaymentSuccess,
                theme: {
                    color: plan.tier === "silver" ? "#22d3ee" : "#7c3aed"
                }
            };

            setIsLoading(false);
            const rzpInstance = new razorpaySDK(options);
            rzpInstance.open();

        } catch (error) {
            console.error("Order initialization failed:", error);
            setIsLoading(false);
            toast.error(error.response?.data?.message || "Failed to establish checkout channel. ❌");
        }
    };

    const getPlanMeta = () => {
        if (plan.tier === "gold") return { icon: "👑", highlights: ["AI Productivity Suite", "Workflow Automation", "Dedicated ORBIQ Expert"] };
        if (plan.tier === "silver") return { icon: "🥈", highlights: ["Unlimited Projects & Boards", "Advanced Analytics", "Priority Support (24×7)"] };
        return { icon: "🚀", highlights: ["Up to 3 Active Projects", "Basic Task Tracking", "Community Support"] };
    };

    const meta = getPlanMeta();

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={isLoading ? null : onClose}>
                <motion.div
                    className={`modal-container checkout-tier-${plan.tier}`}
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <div>
                            <h2>{isFree ? "Initialize Environment" : `Upgrade to ${plan.title}`}</h2>
                            <p>{isFree ? "Set up your sandbox environment." : "Complete your subscription securely."}</p>
                        </div>
                        <button className="close-modal-btn" onClick={onClose} disabled={isLoading}><X size={20} /></button>
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
                            <span>{plan.period === "Forever" ? "Lifetime Access" : "Recurring Monthly Billing"}</span>
                        </div>

                        {!isFree && (
                            <div className="modal-feature-highlights unlock-section">
                                <div className="unlock-title">You'll Unlock:</div>
                                {meta.highlights.map((h, i) => (
                                    <div key={i} className="modal-highlight-item">
                                        <span className="bullet-tick">✓</span> {h}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="secure-checkout-badge">
                        <ShieldCheck size={18} className="secure-badge-icon" />
                        <span>{isFree ? "Direct Cloud Allocation" : "Protected by Razorpay • 256-bit Encryption"}</span>
                    </div>

                    <button
                        className={`modal-pay-btn modal-btn-${plan.tier}`}
                        onClick={handleAction}
                        disabled={isLoading}
                        style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
                    >
                        <CreditCard size={18} /> {isLoading ? "Initializing Secure Checkout..." : isFree ? "Set Up Free Plan →" : "Continue Secure Payment →"}
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default CheckOutModal;