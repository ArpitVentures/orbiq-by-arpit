const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash";

const generateGeminiResponse = async (message) => {
    try {
        console.log("\n===== GEMINI REQUEST =====");
        console.log("Model:", MODEL);
        console.log("Input length:", String(message).length);

        const interaction = await ai.interactions.create({
            model: MODEL,
            input: message
        });

        const response = interaction.output_text?.trim();

        if (!response) {
            throw new Error("Gemini returned an empty response.");
        }

        console.log("Gemini response received.");
        console.log("Output length:", response.length);
        console.log("==========================\n");

        return response;

    } catch (error) {
        console.error("\n===== GEMINI API ERROR =====");
        console.error("Message:", error?.message);
        console.error("Status:", error?.status);
        console.error("Code:", error?.code);
        console.error("============================\n");

        throw error;
    }
};

module.exports = {
    generateGeminiResponse
};
