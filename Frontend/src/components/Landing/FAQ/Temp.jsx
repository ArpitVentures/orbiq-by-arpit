import { useState } from "react";
import "./FAQItem.css";

function FAQItem({ question, answer }) {

    const [open, setOpen] = useState(false);

    return (

        <div
            className={`faq-item ${open ? "active" : ""}`}
            onClick={() => setOpen(!open)}
        >

            <div className="faq-question">

                <h4>{question}</h4>

                <span>{open ? "−" : "+"}</span>

            </div>

            <div className="faq-answer">

                <p>{answer}</p>

            </div>

        </div>

    );

}

export default FAQItem;