import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import "./BackToLanding.css";

function BackToLanding() {

    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {

        navigate("/", {
            state: {
                scrollTo: location.state?.scrollTo
            }
        });

    };

    return (

        <button
            className="back-to-landing"
            onClick={handleBack}
        >

            <ArrowLeft size={18} />

            <span>Continue Exploring</span>

        </button>

    );

}

export default BackToLanding;