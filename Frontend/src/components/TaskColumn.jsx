import TaskItem from "./TaskItem";

function TaskColumn({ title, tasks, openEditModal, removeTask }) {

    return (

        <div className="task-column">

            <h3>{title}</h3>

            {tasks.map((task) => (

                <TaskItem
                    key={task._id || task.id}
                    task={task}
                    openEditModal={openEditModal}
                    removeTask={removeTask}
                />

            ))}

        </div>

    );

}

export default TaskColumn;