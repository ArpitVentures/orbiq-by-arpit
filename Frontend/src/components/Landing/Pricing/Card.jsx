import { Check, X, Compass, Gem, Crown, Sparkles } from "lucide-react";

function PricingCard({
                         title,
                         price,
                         period,
                         button,
                         features,
                         popular,
                         tier,
                         isDisabled,
                         onSelect,
                         extraDetails
                     }){
    return (
        <article className={`pricing-card ${popular ? "popular" : ""} tier-${tier} ${isDisabled ? "disabled-card" : ""}`}>
            {popular && (
                <span className="popular-badge">
                    <>
    <Sparkles size={14}/>
    MOST POPULAR
</>
                </span>
            )}

            <div className={`plan-icon plan-icon-${tier}`}>
                {tier === "free" && <Compass size={24} />}
                {tier === "silver" && <Gem size={24} />}
                {tier === "gold" && <Crown size={24} />}
            </div>


            <h3>{title}</h3>
            <div className="price">{price}</div>

            <p className="plan-type">
                {title === "Free" && "Perfect for Getting Started"}
                {title === "Silver" && "Most Popular Choice"}
                {title === "Gold" && "Built for Growing Teams"}
            </p>

            <span className="period">{period}</span>

            <ul>
                {features.map((feature) => (
                    <li
                        key={feature.text}
                        className={feature.available ? "available" : "unavailable"}
                    >
                        {feature.available ? <Check size={18} /> : <X size={18} />}
                        <span>{feature.text}</span>
                    </li>
                ))}
            </ul>

            {extraDetails}

            <button
                onClick={onSelect}
                disabled={isDisabled}
                className={`card-action-btn ${isDisabled ? 'disabled-btn' : ''}`}
                style={{
                    cursor: isDisabled ? "not-allowed" : "pointer"
                }}
            >
                {button}
            </button>
        </article>
    );
}

export default PricingCard;