import "../styles/RecentTasks.css";

function RecentTasks() {

    const tasks = [
        {
            title: "Landing Page UI",
            status: "Completed"
        },
        {
            title: "Backend Authentication",
            status: "In Progress"
        },
        {
            title: "Dashboard Design",
            status: "Pending"
        },
        {
            title: "AI Assistant",
            status: "Coming Soon"
        }
    ];

    return (

        <div className="recent-tasks">

            <h2>Recent Tasks</h2>

            {tasks.map((task, index) => (

                <div className="task-row" key={index}>

                    <span>{task.title}</span>

                    <span className="task-status">
                        {task.status}
                    </span>

                </div>

            ))}

        </div>

    );

}

export default RecentTasks;