import "./SkeletonLoader.css";

function DashboardSkeleton() {
    return (
        <div className="skeleton-container">
            <div className="skeleton-box skeleton-header"></div>

            <div className="skeleton-grid-4">
                <div className="skeleton-box skeleton-stat-card"></div>
                <div className="skeleton-box skeleton-stat-card"></div>
                <div className="skeleton-box skeleton-stat-card"></div>
                <div className="skeleton-box skeleton-stat-card"></div>
            </div>

            <div className="skeleton-grid-2">
                <div className="skeleton-left">
                    <div className="skeleton-box skeleton-card-large"></div>
                    <div className="skeleton-box skeleton-card-medium"></div>
                </div>
                <div className="skeleton-right">
                    <div className="skeleton-box skeleton-card-medium"></div>
                    <div className="skeleton-box skeleton-card-small"></div>
                </div>
            </div>
        </div>
    );
}

export default DashboardSkeleton;