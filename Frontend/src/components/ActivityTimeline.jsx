import "./../styles/ActivityTimeline.css";

function ActivityTimeline() {

    const activities = [
        {
            time: "10:30 AM",
            action: "Completed Landing Page UI",
            color: "green"
        },
        {
            time: "12:15 PM",
            action: "Started Backend Authentication",
            color: "orange"
        },
        {
            time: "2:45 PM",
            action: "Dashboard Updated",
            color: "blue"
        },
        {
            time: "5:00 PM",
            action: "Horizon Planned",
            color: "purple"
        }
    ];

    return (

        <div className="timeline">

            <h2>Recent Activity</h2>

            {activities.map((item,index)=>(

                <div className="timeline-item" key={index}>

                    <div className={`dot ${item.color}`}></div>

                    <div>

                        <h4>{item.action}</h4>

                        <span>{item.time}</span>

                    </div>

                </div>

            ))}

        </div>

    );
}

export default ActivityTimeline;