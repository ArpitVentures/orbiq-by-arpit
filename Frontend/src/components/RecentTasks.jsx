import "../styles/RecentTasks.css";

function RecentTasks({ tasks }) {

    return (

        <div className="recent-tasks">

            <h2>Recent Tasks</h2>

            {tasks.length === 0 ? (

                <p>No tasks available.</p>

            ) : (

                tasks
                    .slice(-5)
                    .reverse()
                    .map((task) => (

                        <div
                            className="task-row"
                            key={task._id || task.id}
                        >

                            <span>{task.title}</span>

                            <span className={`task-status $
                            {task.status.toLowerCase().replace(/\s+/g, "-")}`} >
                                {task.status}
                            </span>

                        </div>

                    ))

            )}

        </div>

    );

}

export default RecentTasks;