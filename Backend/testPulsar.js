const {
    analyzeRequest
} = require("./services/pulsarService");

const testMessages = [
    "Hey Horizon",
    "Good morning",
    "I'm bored",
    "What is JWT?",
    "Why is my laptop so slow?",
    "Write an email to my HR",
    "Send an email to my manager saying I'll be late",
    "I have a meeting tomorrow",
    "Schedule a meeting with Rahul",
    "Remind me tomorrow to submit my assignment",
    "I have too much work and don't know where to start",
    "Bhai bore ho raha hu",
    "Kal meri meeting hai",
    "Mere HR ko mail likh do ki kal mai leave pe rahunga",
    "Mujhe yaad dila dena assignment submit karna hai",
    "What should I do first?",
    "Fuck this",
    "HORIZON tu kya kar sakta hai?",
    "Can you help me plan my day?",
    "asdfghjkl"
];

const test = () => {

    console.log("\n==============================");
    console.log("P.U.L.S.A.R. INTENT TEST");
    console.log("==============================\n");

    testMessages.forEach((message, index) => {

        const result = analyzeRequest({
            message,
            user: {
                _id: "test-user-001"
            }
        });

        console.log(`${index + 1}. USER: ${message}`);
        console.log(`   INTENT: ${result.intent}`);
        console.log(`   LLM: ${result.requiresLLM}`);
        console.log(`   ACTION: ${result.requiresAction}`);
        console.log("--------------------------------");
    });
};

test();