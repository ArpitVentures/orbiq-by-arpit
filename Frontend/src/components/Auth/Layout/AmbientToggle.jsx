import {
    Moon,
    Sun
} from "lucide-react";

import "./../Styles/AmbientToggle.css";

function AmbientToggle({
                           enabled,
                           onToggle
                       }) {

    return (

        <button
            className={`ambient-toggle ${enabled ? "enabled" : ""}`}
            onClick={onToggle}
        >

            <span className="ambient-label">

                Ambient Mode

            </span>

            <div className="ambient-switch">

                <span className="ambient-status">

                    {enabled ? "ON" : "OFF"}

                </span>

                <div className="ambient-icon">

                    {enabled
                        ? <Sun size={14}/>
                        : <Moon size={14}/>
                    }

                </div>

            </div>

        </button>

    );

}

export default AmbientToggle;