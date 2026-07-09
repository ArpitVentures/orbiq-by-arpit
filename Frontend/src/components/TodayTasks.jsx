import "./../styles/TodayTasks.css";

function TodayTasks({ tasks }) {

    const today = new Date().toISOString().split("T")[0];

    const todayTasks = tasks.filter((task) =>

        task.dueDate &&
        task.dueDate.substring(0, 10) === today

    );
    return (

        <div className="today-tasks">

            <h2>Today's Tasks</h2>

            {todayTasks.length === 0 ? (

                <p>No tasks available.</p>

            ) : (

                todayTasks.map((task) => (

                    <div
                        className="task-row"
                        key={task._id || task.id}
                    >

                        <div>

                            <h4>{task.title}</h4>

                            <span
                                className={`priority ${(task.priority || "Medium").toLowerCase()}`}
                            >
                                {task.priority || "Medium"}
                            </span>

                        </div>

                        <span
                            className={`status ${(task.status || "Pending")
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                        >
                            {task.status || "Pending"}
                        </span>

                    </div>

                ))

            )}

        </div>

    );

}

export default TodayTasks;