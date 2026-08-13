require("dotenv").config();

const {
    generateOpenAIResponse
} = require("./services/llm/openaiService");

const test = async () => {
    try {
        const response = await generateOpenAIResponse(
            "Say hello to ORBIQ in one short sentence."
        );

        console.log("\nHORIZON TEST RESPONSE:");
        console.log(response);
    } catch (error) {
        console.error("\nTEST FAILED:");
        console.error(error.message);
    }
};

test();