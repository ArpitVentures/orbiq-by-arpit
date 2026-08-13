const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateOpenAIResponse = async (message) => {
    try {
        const response = await client.responses.create({
            model: "gpt-5.5",
            input: message
        });

        return response.output_text;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
};

module.exports = {
    generateOpenAIResponse
};