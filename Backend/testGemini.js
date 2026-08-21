require("dotenv").config();

const {
    generateGeminiResponse
} = require("./services/llm/geminiService");

const test = async () => {
    try {
        const response = await generateGeminiResponse(
            "Say hello to ORBIQ in one short sentence."
        );

        console.log("\nGEMINI TEST RESPONSE:");
        console.log(response);

    } catch (error) {
        console.error("\nTEST FAILED:");
        console.error(error.message);
    }
};

test();