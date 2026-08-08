import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PricingCard from "./Card";
import CheckOutModal from "./CheckOutModal";
import "./Pricing.css";

const PRICING_PLANS = [
    {
        title: "Free",
        price: "₹0",
        period: "Forever",
        popular: false,
        tier: "free",
        button: "Launch Workspace →",
        features: [
            { text: "Up to 3 Active Projects", available: true },
            { text: "Basic Task Tracking", available: true },
            { text: "Community Support", available: true },
            { text: "Team Collaboration", available: false },
            { text: "AI Productivity Suite", available: false },
            { text: "Dedicated ORBIQ Expert", available: false }
        ]
    },
    {
        title: "Silver",
        price: "₹199",
        period: "per month",
        popular: true,
        tier: "silver",
        button: "Unlock Silver →",
        features: [
            { text: "Unlimited Projects & Boards", available: true },
            { text: "Advanced Analytics", available: true },
            { text: "Priority Support (24×7)", available: true },
            { text: "Team Collaboration", available: true },
            { text: "AI Productivity Suite", available: false },
            { text: "Dedicated ORBIQ Expert", available: false }
        ]
    },
    {
        title: "Gold",
        price: "₹499",
        period: "per month",
        popular: false,
        tier: "gold",
        button: "Activate Gold →",
        features: [
            { text: "Everything in Silver", available: true },
            { text: "AI Productivity Suite", available: true },
            { text: "Workflow Automation", available: true },
            { text: "Dedicated ORBIQ Expert", available: true },
            { text: "Unlimited Team Members", available: true },
            { text: "Early Access Features", available: true }
        ]
    }
];

const getStoredUser = () => {
    try {
        const userObj = localStorage.getItem("user");
        return userObj ? JSON.parse(userObj) : null;
    } catch (e) {
        return null;
    }
};

function Pricing() {
    const navigate = useNavigate();
    const location = useLocation();

    const isStandalonePricing = location.pathname === "/pricing";
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currentUser, setCurrentUser] = useState(getStoredUser);

    useEffect(() => {
        const syncState = () => {
            setCurrentUser(getStoredUser());
        };

        window.addEventListener("storage", syncState);
        window.addEventListener("user-updated", syncState);

        return () => {
            window.removeEventListener("storage", syncState);
            window.removeEventListener("user-updated", syncState);
        };
    }, []);

    const userPlan = isStandalonePricing? String(currentUser?.plan || currentUser?.tier || "Free").trim().toLowerCase() : "guest";

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const expiryDateFormatted = formatDate(currentUser?.planExpiry);

    useEffect(() => {
        if (location.state?.openPlan && !selectedPlan) {
            const targetedPlan = PRICING_PLANS.find(p => p.tier === location.state.openPlan);
            if (targetedPlan) {
                setSelectedPlan(targetedPlan);
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location.state, navigate, selectedPlan]);

    return (
        <section className="pricing" id="pricing">
            {isStandalonePricing && (
                <button
                    className="pricing-back-btn"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
            )}

            <div className="pricing-header">
                <span className="section-tag">PRICING</span>
                <h2>Start Free. Upgrade When You Grow.</h2>
                <p>Flexible pricing for individuals, teams and growing businesses.</p>
            </div>

            <div className="pricing-grid">
                {PRICING_PLANS.map((plan) => {
                    const targetPlanLower = plan.tier.toLowerCase();
                    const isCurrentPlan = userPlan === targetPlanLower;
                    const planWeights = { free: 0, silver: 1, gold: 2 };

                    const currentWeight = planWeights[userPlan] || 0;
                    const targetWeight = planWeights[targetPlanLower] || 0;

                    let buttonText = plan.button;
                    let isButtonDisabled = false;
                    let extraPlanDetails = null;

                    if (isStandalonePricing && isCurrentPlan) {
                        buttonText="Workspace Active ✓";
                        isButtonDisabled = true;

                        if (userPlan !== "free" && expiryDateFormatted) {
                            extraPlanDetails = (
                                <div className="card-saas-status-wrap" style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#94a3b8" }}>
                                    <span className="status-badge-saas" style={{ color: "#4ade80", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <CheckCircle2 size={12} color="#22c55e" /> ACTIVE
                                    </span>
                                    <span className="expiry-date-detail" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Clock size={12} /> Expires {expiryDateFormatted}
                                    </span>
                                </div>
                            );
                        }
                    } else if (
                        isStandalonePricing &&
                        userPlan !== "free"
                    ) {

                        if (targetWeight < currentWeight) {

                            buttonText = "Included";
                            isButtonDisabled = true;

                        }

                        else if (targetWeight > currentWeight) {

                            buttonText = "Upgrade Plan →";
                            isButtonDisabled = false;

                        }

                    }

                    return (
                        <PricingCard
                            key={plan.tier}
                            {...plan}
                            button={buttonText}
                            isDisabled={isButtonDisabled}
                            expiresDate={isCurrentPlan && expiryDateFormatted ? `Expires ${expiryDateFormatted}` : null}
                            startedDate={isCurrentPlan && currentUser?.planStart ? `Started ${formatDate(currentUser.planStart)}` : null}
                            extraDetails={extraPlanDetails}
                            onSelect={() => {
                                if (isButtonDisabled) return;

                                if (plan.tier === "free") {
                                    navigate("/login?mode=signup", { state: { from: "pricing", selectedPlan: plan.tier } });
                                    return;
                                }

                                const token = localStorage.getItem("token");
                                if (!token) {
                                    window.history.replaceState({}, document.title);
                                    navigate("/login", { state: { from: "pricing", selectedPlan: plan.tier } });
                                    return;
                                }

                                setSelectedPlan(plan);
                            }}
                        />
                    );
                })}
            </div>

            {selectedPlan && selectedPlan.tier !== "free" && (
                <CheckOutModal
                    plan={selectedPlan}
                    onClose={() => {
                        setSelectedPlan(null);
                        setCurrentUser(getStoredUser());
                    }}
                />
            )}
        </section>
    );
}

export default Pricing;