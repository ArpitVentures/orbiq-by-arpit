import "../styles/StatCard.css";

function StatCard({ title, value, icon, color }) {
    return (
        <div className="stat-card">

            <div
                className="stat-icon"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div className="stat-info">
                <h2>{value}</h2>
                <p>{title}</p>
            </div>

        </div>
    );
}

export default StatCard;