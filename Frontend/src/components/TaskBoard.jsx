import "./../styles/TaskBoard.css";
import TaskColumn from "./TaskColumn";

function TaskBoard({ tasks, openEditModal, removeTask }) {

    const todo = tasks.filter(
        task => task.status === "To Do"
    );

    const progress = tasks.filter(
        task => task.status === "In Progress"
    );

    const completed = tasks.filter(
        task => task.status === "Completed"
    );

    return (
        <div className="task-board">
            <h2>Task Board</h2>

            <div className="board">
                <TaskColumn
                    title="To Do"
                    tasks={todo}
                    openEditModal={openEditModal}
                    removeTask={removeTask}
                />

                <TaskColumn
                    title="In Progress"
                    tasks={progress}
                    openEditModal={openEditModal}
                    removeTask={removeTask}
                />

                <TaskColumn
                    title="Completed"
                    tasks={completed}
                    openEditModal={openEditModal}
                    removeTask={removeTask}
                />
            </div>
        </div>
    );
}

export default TaskBoard;