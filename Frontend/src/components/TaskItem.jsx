import { FaFlag } from "react-icons/fa";

function TaskItem({ task }) {
    return (
        <div className={`task-item ${task.priority.toLowerCase()}`}>

            <h4>{task.title}</h4>

            <p>{task.description}</p>

            <div className="task-footer">

                <span>
                    <FaFlag /> {task.priority}
                </span>

                <small>{task.date}</small>

            </div>

        </div>
    );
}

export default TaskItem;