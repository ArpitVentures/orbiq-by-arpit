import TaskItem from "./TaskItem";

function TaskColumn({ title, tasks }) {

    return (

        <div className="task-column">

            <h3>{title}</h3>

            {tasks.map((task, index) => (

                <TaskItem
                    key={index}
                    task={task}
                />

            ))}

        </div>

    );

}

export default TaskColumn;