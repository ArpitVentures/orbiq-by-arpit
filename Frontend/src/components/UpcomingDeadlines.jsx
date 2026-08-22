import "../styles/UpcomingDeadlines.css";

function UpcomingDeadlines({ tasks = [] }) {
    const today = new Date();
    const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const upcomingTasks = tasks
        .filter((task) => task.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    return (
        <div className="deadlines">
            <h2>Upcoming Deadlines</h2>

            {upcomingTasks.map((task, index) => {
                const due = new Date(task.dueDate);
                const dueStart = new Date(
                    due.getFullYear(),
                    due.getMonth(),
                    due.getDate()
                );

                const diffDays = Math.round(
                    (dueStart - todayStart) / (1000 * 60 * 60 * 24)
                );

                const deadlineClass =
                    diffDays < 0
                        ? "overdue"
                        : diffDays === 0
                            ? "today"
                            : "upcoming";

                return (
                    <div className={`deadline-card ${deadlineClass}`} key={task._id || index}>
                        <div>
                            <h4>{task.title}</h4>
                            <span className={deadlineClass}>
                                {
                                    diffDays < 0
                                        ? `${Math.abs(diffDays)} Days Overdue`
                                        : diffDays === 0
                                            ? "Today"
                                            : diffDays === 1
                                                ? "Tomorrow"
                                                : `${diffDays} Days Left`
                                }
                            </span>
                        </div>

                        <span className={`deadline-badge ${(task.priority || "medium").toLowerCase()}`}>
                            {task.priority || "Normal"}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default UpcomingDeadlines;