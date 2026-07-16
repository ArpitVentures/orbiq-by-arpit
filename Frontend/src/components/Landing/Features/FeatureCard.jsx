import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function FeatureCard({
                         icon: Icon,
                         title,
                         description,
                         accent = "cyan",
                         featured = false,
                         link = "#"
                     }) {
    return (
        <article className={`feature-card ${featured ? "featured" : ""}`}>

            {featured && (
                <span className="feature-badge">
                    AI Powered
                </span>
            )}

            <div className={`feature-icon ${accent}`}>
                <Icon
                    size={28}
                    strokeWidth={2.2}
                />
            </div>

            <h3 className="feature-title">
                {title}
            </h3>

            <p className="feature-description">
                {description}
            </p>

            <Link
                to={link}
                className="feature-link"
            >
                Learn More
                <ArrowRight
                    size={18}
                />
            </Link>
        </article>
    );
}

export default FeatureCard;