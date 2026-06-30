import "./../styles/TodayTasks.css";

function TodayTasks() {
    const tasks = [
        {
            title: "Landing Page UI",
            priority: "High",
            status: "Completed",
        },
        {
            title: "Backend Authentication",
            priority: "Medium",
            status: "In Progress",
        },
        {
            title: "Dashboard Design",
            priority: "High",
            status: "Pending",
        },
        {
            title: "AI Assistant",
            priority: "Low",
            status: "Coming Soon",
        },
    ];

    return (
        <div className="today-tasks">
            <h2>Today's Tasks</h2>

            {tasks.map((task, index) => (
                <div className="task-row" key={index}>
                    <div>
                        <h4>{task.title}</h4>
                        <span className={`priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
                    </div>

                    <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>
            {task.status}
          </span>
                </div>
            ))}
        </div>
    );
}

export default TodayTasks;