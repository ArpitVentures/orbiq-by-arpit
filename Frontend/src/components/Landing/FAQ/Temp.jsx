import "./FAQItem.css";
import { Plus } from "lucide-react";

function Temp({
                  question,
                  answer,
                  isOpen,
                  onClick
              }) {

    return (

        <div
            className={`faq-item ${isOpen ? "active" : ""}`}
            onClick={onClick}
        >

            <div className="faq-question">

                <h4>{question}</h4>

                <span className={`faq-icon ${isOpen ? "open" : ""}`}>
    <Plus size={20} />
</span>

            </div>

            <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                <p>{answer}</p>
            </div>

        </div>

    );

}

export default Temp;