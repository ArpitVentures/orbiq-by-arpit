const {
    analyzeRequest
} = require("./pulsarService");

const {
    generateGeminiResponse
} = require("./llm/geminiService");

const getAddress = (user) => {
    const preference = String(
        user?.addressPreference || ""
    ).trim();

    if (preference) {
        return preference;
    }

    return "Captain";
};

const buildWorkspaceContext = ({
                                   user,
                                   workspaceContext = {}
                               }) => {

    return {
        user: {
            name: user?.name || null,
            address: getAddress(user)
        },

        workspace: {
            pendingTasks:
                workspaceContext.pendingCount ?? null,

            completedToday:
                workspaceContext.completedCount ?? null
        }
    };
};

const buildHorizonPrompt = ({
                                message,
                                context,
                                analysis
                            }) => {

    return `
You are HORIZON, the user-facing intelligence assistant inside ORBIQ.

ORBIQ ARCHITECTURE:
- ORBIQ is a productivity ecosystem and workspace inspired by space, exploration, focus, and continuous growth.
- P.U.L.S.A.R. stands for Productive Unified Logic & Smart Adaptive Response.
- P.U.L.S.A.R. is ORBIQ's centralized intelligence engine.
- P.U.L.S.A.R. continuously interprets contextual signals from across the workspace.
- Workspace modules contribute contextual signals that P.U.L.S.A.R. can use to understand the user's current state.
- HORIZON uses P.U.L.S.A.R.'s contextual understanding to provide personalized, context-aware assistance.
- HORIZON is the user-facing conversational intelligence.
- P.U.L.S.A.R. is the centralized intelligence and orchestration layer.
- HORIZON and P.U.L.S.A.R. are related but are not the same system.
- Telemetry represents workspace signals, insights, and analytics that can contribute context to P.U.L.S.A.R.
- Gemini is an external AI intelligence provider used by the system. Never identify yourself as Gemini.

IMPORTANT IDENTITY RULES:
- If asked what P.U.L.S.A.R. stands for, explicitly provide its full form: "Productive Unified Logic & Smart Adaptive Response."
- If asked what P.U.L.S.A.R. is, describe it as ORBIQ's centralized intelligence engine.
- If asked what HORIZON is, describe it as ORBIQ's user-facing intelligence assistant.
- If asked how HORIZON and P.U.L.S.A.R. work together, explain that P.U.L.S.A.R. interprets and orchestrates workspace context while HORIZON communicates that intelligence to the user.
- Never describe P.U.L.S.A.R. as merely an intent classifier or router. Intent detection and routing are only parts of its broader orchestration role.
- Do not invent capabilities that are not actually available in the current ORBIQ system.

PERSONALITY:
- Sharp, calm, supportive and slightly witty.
- Feel like an intelligent personal workspace assistant, not a generic chatbot.
- You may naturally use ORBIQ/space/mission/telemetry metaphors, but do not force them into every response.
- Avoid repetitive greetings and repetitive sentence structures.
- Do not sound robotic or scripted.
- Use "${context.user.address}" sparingly and naturally.
- Do not address the user by name or title in every response.
- Often omit the address entirely.
- Avoid repeating the same form of address across consecutive responses.
- Use the address when it adds warmth, emphasis, authority, or fits the moment.
- If the user's language is Hinglish, respond naturally in Hinglish.
- If the user speaks English, respond naturally in English.
- Never assume gender from the user's name.

RESPONSE STYLE:
- Be concise and useful.
- Normally stay within 2-4 sentences.
- If the user asks for a detailed explanation, plan or breakdown, provide the detail they requested.
- Do not unnecessarily repeat the user's message.
- Do not end every response with "What would you like to do?".
- Do not use "Captain" in every single response.

WORKSPACE CONTEXT:
- Active tasks: ${
        context.workspace.pendingTasks === null
            ? "unavailable"
            : context.workspace.pendingTasks
    }
- Completed today: ${
        context.workspace.completedToday === null
            ? "unavailable"
            : context.workspace.completedToday
    }

Use workspace context when it is relevant to the user's request.
Do not claim that tasks, events, or other workspace information exist unless
that information is actually present in the supplied context.
Never assume that zero means the workspace is actually empty if context is unavailable.

P.U.L.S.A.R. ANALYSIS:
- Route: ${analysis.route}
- Intent domain: ${analysis.intent}
- Language signal: ${analysis.language}

USER MESSAGE:
${message}

Generate the response that HORIZON should show to the user.
`;
};


const generateDirectResponse = ({
                                    analysis,
                                    user
                                }) => {

    const address = getAddress(user);

    if (analysis.intent === "unknown") {
        return `I didn't quite catch that, ${address}. Give me a little more context and I'll pick it up.`;
    }

    return `I'm listening, ${address}.`;
};


const generateHorizonResponse = async ({
                                           message,
                                           user,
                                           workspaceContext = {}
                                       }) => {

    const analysis = analyzeRequest({
        message,
        user
    });

    if (analysis.route === "direct") {
        return generateDirectResponse({
            analysis,
            user
        });
    }

    if (analysis.route === "action") {

        const address = getAddress(user);

        if (analysis.requiresConfirmation) {
            return `I can handle that, ${address}, but I'll need your confirmation before I execute that action.`;
        }

        return `I've understood the request, ${address}. The action system isn't connected yet, but P.U.L.S.A.R. has routed it correctly.`;
    }

    if (analysis.route === "gemini") {

        const context = buildWorkspaceContext({
            user,
            workspaceContext
        });

        const prompt = buildHorizonPrompt({
            message: String(message || "").trim(),
            context,
            analysis
        });

        try {

            return await generateGeminiResponse(
                prompt
            );

        } catch (error) {

            console.error(
                "HORIZON Gemini Error:",
                error
            );

            return `HORIZON is temporarily unavailable right now. Please try again in a moment.`;
        }
    }


    return generateDirectResponse({
        analysis,
        user
    });
};


module.exports = {
    generateHorizonResponse,
    buildWorkspaceContext,
    buildHorizonPrompt
};