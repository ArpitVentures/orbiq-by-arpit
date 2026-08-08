import React from "react";
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

    const arrowAccentClass = accent === "cyan" ? "arrow-purple" : "arrow-cyan";

    return (

        <Link to={link} className={`feature-card ${featured ? "featured" : ""}`}>

            {featured && (
                <span className="feature-badge">
                    Beta
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

            <div className={`feature-arrow-indicator ${arrowAccentClass}`}>
                <ArrowRight size={20} />
            </div>
        </Link>
    );
}

export default FeatureCard;