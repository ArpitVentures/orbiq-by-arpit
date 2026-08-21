require("dotenv").config();

const {
    generateHorizonResponse
} = require("./services/horizonService");

const test = async () => {
    const user = {
        _id: "test-user-001",
        name: "Arpit Srivastava",
        addressPreference: "Captain"
    };

    const workspaceContext = {
        pendingCount: 3,
        completedCount: 2
    };

    const messages = [
        "Mai bahut bore ho raha hu aaj",
        "What is JWT?",
        "Bhai aaj kaam karne ka mann nahi hai",
        "asdfghjkl",
        "What is P.U.L.S.A.R.?",
        "What does P.U.L.S.A.R. stand for?",
        "What is HORIZON?",
        "How are HORIZON and P.U.L.S.A.R. related?",
        "What is ORBIQ?",
        "What is Telemetry in ORBIQ?"
    ];

    for (const message of messages) {

        console.log("\n==============================");
        console.log("USER:", message);
        console.log("==============================");

        try {
            const response = await generateHorizonResponse({
                message,
                user,
                workspaceContext
            });

            console.log("HORIZON:", response);

        } catch (error) {
            console.error("TEST ERROR:", error.message);
        }
    }
};

test();