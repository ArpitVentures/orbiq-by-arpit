import "./../styles/UpcomingDeadlines.css";

function UpcomingDeadlines() {

    const deadlines = [
        {
            title: "Backend API Integration",
            date: "Tomorrow",
            priority: "High"
        },
        {
            title: "Dashboard Polish",
            date: "2 Days Left",
            priority: "Medium"
        },
        {
            title: "AI Assistant UI",
            date: "Coming Soon",
            priority: "Low"
        }
    ];

    return (
        <div className="deadlines">

            <h2>Upcoming Deadlines</h2>

            {deadlines.map((item,index)=>(

                <div className="deadline-card" key={index}>

                    <div>
                        <h4>{item.title}</h4>
                        <span>{item.date}</span>
                    </div>

                    <span className={`deadline-badge ${item.priority.toLowerCase()}`}>
                        {item.priority}
                    </span>

                </div>

            ))}

        </div>
    );
}

export default UpcomingDeadlines;