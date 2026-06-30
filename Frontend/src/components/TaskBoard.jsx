import "./../styles/TaskBoard.css";
import TaskColumn from "./TaskColumn";

function TaskBoard() {

    const todo = [
        {
            title: "Login UI",
            description: "Finish Login Page",
            priority: "High",
            date: "Today"
        },
        {
            title: "Signup API",
            description: "Connect Backend",
            priority: "Medium",
            date: "Tomorrow"
        }
    ];

    const progress = [
        {
            title: "Dashboard",
            description: "Build Widgets",
            priority: "Medium",
            date: "Today"
        }
    ];

    const completed = [
        {
            title: "Landing Page",
            description: "Completed Successfully",
            priority: "Low",
            date: "Done"
        }
    ];

    return (

        <div className="task-board">

            <h2>Task Board</h2>

            <div className="board">

                <TaskColumn
                    title="To Do"
                    tasks={todo}
                />

                <TaskColumn
                    title="In Progress"
                    tasks={progress}
                />

                <TaskColumn
                    title="Completed"
                    tasks={completed}
                />

            </div>

        </div>

    );

}

export default TaskBoard;