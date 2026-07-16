import "./Stats.css";

function StatCard({
                      icon,
                      title,
                      value,
                      subtitle,
                      accentClass = ""
                  }) {
    return (
        <div className={`stat-card ${accentClass}`}>
            <div className="stat-icon">
                {icon}
            </div>

            <div className="stat-content">
                <h2>{value}</h2>
                <h4>{title}</h4>

                {subtitle && (
                    <p>{subtitle}</p>
                )}
            </div>
        </div>
    );
}

export default StatCard;