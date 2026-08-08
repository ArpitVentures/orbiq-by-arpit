import React, { useState } from "react";
import "./FAQ.css";
import FAQItem from "./Temp.jsx";

const faqs = [
    {
        question: "What is ORBIQ?",
        answer: "ORBIQ is an AI-powered productivity workspace that helps developers, students and modern teams organize projects, manage tasks and collaborate efficiently."
    },
    {
        question: "Is ORBIQ free to use?",
        answer: "Yes. You can start with the Free plan and upgrade anytime for advanced collaboration, AI features and premium productivity tools."
    },
    {
        question: "Can I collaborate with my team?",
        answer: "Absolutely. Invite teammates, assign tasks, track progress and work together inside one shared workspace."
    },
    {
        question: "Which devices are supported?",
        answer: "ORBIQ works on modern desktop and mobile browsers with a fully responsive experience."
    },
    {
        question: "Is my data secure?",
        answer: "Yes. We use secure authentication and industry-standard security practices to protect your workspace."
    },
    {
        question: "Do I need technical knowledge?",
        answer: "Not at all. ORBIQ is designed to be simple for beginners while remaining powerful enough for professionals."
    }
];

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="landing-faq" id="faq">
            <div className="faq-container">
                <div className="faq-left">
                    <div className="faq-tag">❓ Frequently Asked Questions</div>
                    <h2>Everything You<br />Need To Know</h2>
                    <p>Have questions? Here are the answers to the most common questions about ORBIQ.</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={activeIndex === index}
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;