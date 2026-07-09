import "./../styles/UpcomingDeadlines.css";

function UpcomingDeadlines({ tasks }) {

    const today = new Date();

    const upcomingTasks = tasks
        .filter((task) => task.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    return (
        <div className="deadlines">

            <h2>Upcoming Deadlines</h2>

            {upcomingTasks.map((task, index) => {
                const due = new Date(task.dueDate);

                const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24)
            );
                const deadlineClass =
                    diffDays < 0
                     ? "overdue"
                     : diffDays === 0
                     ? "today"
                     : "upcoming";

                return (
                <div className={`deadline-card ${deadlineClass}`} key={index}>

                    <div>
                        <h4>{task.title}</h4>
                        <span className={deadlineClass}>
                            {
                                diffDays === 0
                                 ? "Today"
                                 : diffDays === 1
                                 ? "Tomorrow"
                                 : diffDays > 1
                                 ? `${diffDays} Days Left`
                                 : `${Math.abs(diffDays)} Days Overdue`
                            }
                        </span>
                    </div>

                    <span className={`deadline-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                    </span>

                </div>
                );

            })}

        </div>
    );
}

export default UpcomingDeadlines;