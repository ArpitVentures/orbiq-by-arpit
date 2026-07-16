import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PricingCard from "./Card";
import CheckOutModal from "./CheckOutModal";
import "./Pricing.css";

function Pricing() {
    const navigate = useNavigate();
    const location = useLocation();

    const isStandalonePricing = location.pathname === "/pricing";
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        {
            title: "Free",
            price: "₹0",
            period: "Forever",
            popular: false,
            tier: "free",
            button: "Start Free",
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
            period: "/month",
            popular: true,
            tier: "silver",
            button: "Get Silver",
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
            period: "/month",
            popular: false,
            tier: "gold",
            button: "Unlock Gold 👑",
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
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.title}
                        {...plan}
                        onSelect={() => {

                            if (plan.tier === "free") {

                                navigate("/login?mode=signup", {
                                    state: {
                                        cameFromLanding: true,
                                        scrollTo: "pricing"
                                    }
                                });
                                return;
                            }

                            setSelectedPlan(plan);
                        }}
                    />
                ))}
            </div>

            {selectedPlan && (
                <CheckOutModal
                    plan={selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                />
            )}
        </section>
    );
}

export default Pricing;