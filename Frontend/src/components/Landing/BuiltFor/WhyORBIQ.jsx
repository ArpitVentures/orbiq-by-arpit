import "./WhyORBIQ.css";
import {
    Layers3,
    Building2,
    Users,
    Zap
} from "lucide-react";

function WhyORBIQ() {

    const reasons = [
        {
            icon: <Layers3 size={28} />,
            title: "No IT Team?",
            description:
                "ORBIQ works out of the box. No complicated setup or technical expertise required.",
            className: "cyan-card"
        },
        {
            icon: <Building2 size={28} />,
            title: "One Workspace",
            description:
                "Bring projects, tasks and collaboration together in one organized workspace.",
            className: "purple-card"
        },
        {
            icon: <Users size={28} />,
            title: "Stay Updated",
            description:
                "See who's doing what without chasing people for constant progress updates.",
            className: "green-card"
        },
        {
            icon: <Zap size={28} />,
            title: "Ready in Minutes",
            description:
                "Start working immediately with an experience designed to be simple and intuitive.",
            className: "orange-card"
        }
    ];

    return (

        <section className="why-orbiq">

            <div className="why-header">

                <span className="why-tag">
                    WHY ORBIQ
                </span>

                <h2>
                    Work doesn't have to be complicated.
                </h2>

                <p>
                    ORBIQ helps students, businesses and growing teams stay organized,
                    collaborate better and get work done without unnecessary complexity.
                </p>

            </div>

            <div className="why-grid">

                {reasons.map((item, index) => (

                    <div
                        key={index}
                        className={`why-card ${item.className}`}
                    >

                        <div className="why-icon">
                            {item.icon}
                        </div>

                        <h3>
                            {item.title}
                        </h3>

                        <p>
                            {item.description}
                        </p>

                    </div>

                ))}

            </div>

        </section>

    );
}

export default WhyORBIQ;