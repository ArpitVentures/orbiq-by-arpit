import { Check, X } from "lucide-react";

function PricingCard({
                         title,
                         price,
                         period,
                         button,
                         features,
                         popular,
                         tier,
                         onSelect
                     }) {
    return (
        <article className={`pricing-card ${popular ? "popular" : ""} tier-${tier}`}>
            {popular && (
                <span className="popular-badge">
                    ⭐ MOST POPULAR
                </span>
            )}

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

            <button onClick={onSelect}>
                {button}
            </button>
        </article>
    );
}

export default PricingCard;