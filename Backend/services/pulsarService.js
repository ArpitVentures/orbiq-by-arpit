const normalizeText = (message) => {
    return String(message || "")
        .trim()
        .toLowerCase()
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/\s+/g, " ");
};

const isMeaningfulInput = (text) => {
    if (!text || text.length < 2) {
        return false;
    }

    const keyboardSmashPatterns = [
        /^[asdfghjkl]+$/i,
        /^[qwertyuiop]+$/i,
        /^[zxcvbnm]+$/i,
        /^[a-z]{1,3}$/i
    ];

    if (
        keyboardSmashPatterns.some((pattern) =>
            pattern.test(text)
        )
    ) {
        return false;
    }

    if (!/[a-z0-9]/i.test(text)) {
        return false;
    }

    return true;
};

const detectLanguage = (text) => {
    const hinglishMarkers = [
        "bhai",
        "yaar",
        "hu",
        "hai",
        "ho raha",
        "kar do",
        "karna",
        "chahiye",
        "mujhe",
        "meri",
        "mera",
        "mere",
        "kal",
        "aaj",
        "kya",
        "kaise",
        "kyu",
        "kyun",
        "kab",
        "kaun",
        "yaad",
        "bore",
        "bahut",
        "bohot",
        "zyada",
        "kaam",
        "mail",
        "bhej"
    ];

    const matches = hinglishMarkers.filter((marker) =>
        text.includes(marker)
    ).length;

    if (matches >= 1) {
        return "hinglish";
    }

    return "english";
};

const detectActionDomain = (text) => {
    const emailSignals = [
        "send an email",
        "send email",
        "write an email",
        "draft an email",
        "email my",
        "email to",
        "mail my",
        "mail to",
        "mail likh",
        "mail kar",
        "mail bhej",
        "email likh",
        "email kar",
        "email bhej",
        "hr ko mail",
        "manager ko mail"
    ];

    if (emailSignals.some((signal) => text.includes(signal))) {
        return "email";
    }

    const calendarSignals = [
        "schedule a meeting",
        "schedule meeting",
        "book a meeting",
        "create a meeting",
        "schedule an appointment",
        "book an appointment",
        "meeting schedule",
        "meeting set",
        "calendar event",
        "baithak"
    ];

    if (calendarSignals.some((signal) => text.includes(signal))) {
        return "calendar";
    }

    const reminderSignals = [
        "remind me",
        "set a reminder",
        "create a reminder",
        "reminder",
        "remember this",
        "yaad dila",
        "yaad dilana",
        "yaad karwa"
    ];

    if (reminderSignals.some((signal) => text.includes(signal))) {
        return "reminder";
    }

    const taskSignals = [
        "create a task",
        "add a task",
        "make a task",
        "create todo",
        "add todo",
        "add a to-do",
        "complete this task",
        "mark this task complete",
        "delete this task"
    ];

    if (taskSignals.some((signal) => text.includes(signal))) {
        return "task";
    }

    return null;
};

const detectAction = (text, domain) => {
    if (!domain) {
        return null;
    }

    if (domain === "email") {
        if (
            text.includes("send") ||
            text.includes("bhej") ||
            text.includes("dispatch")
        ) {
            return "send_email";
        }

        return "draft_email";
    }

    if (domain === "calendar") {
        return "schedule_meeting";
    }

    if (domain === "reminder") {
        return "create_reminder";
    }

    if (domain === "task") {
        if (
            text.includes("delete") ||
            text.includes("remove")
        ) {
            return "delete_task";
        }

        if (
            text.includes("complete") ||
            text.includes("mark")
        ) {
            return "complete_task";
        }

        return "create_task";
    }

    return null;
};

const requiresConfirmation = (action) => {
    return [
        "send_email",
        "schedule_meeting",
        "delete_task"
    ].includes(action);
};

const determineRoute = ({
                            message,
                            action,
                            actionDomain
                        }) => {
    if (!message) {
        return "direct";
    }

    if (actionDomain && action) {
        return "action";
    }

    if (message.length >= 2) {
        return "gemini";
    }

    return "direct";
};

const requiresWorkspaceContext = ({
                                      route,
                                      actionDomain
                                  }) => {
    if (route === "action") {
        return true;
    }

    if (
        actionDomain === "task" ||
        actionDomain === "calendar" ||
        actionDomain === "email" ||
        actionDomain === "reminder"
    ) {
        return true;
    }

    return route === "gemini";
};

const analyzeRequest = ({ message, user }) => {
    const originalMessage = String(message || "").trim();
    const text = normalizeText(originalMessage);

    if (!isMeaningfulInput(text)) {
        return {
            message: originalMessage,
            userId: user?._id || null,

            route: "direct",

            intent: "unknown",
            language: "unknown",

            actionDomain: null,
            action: null,

            requiresLLM: false,
            requiresAction: false,
            requiresConfirmation: false,
            requiresWorkspaceContext: false,

            timestamp: new Date().toISOString()
        };
    }

    const language = detectLanguage(text);
    const actionDomain = detectActionDomain(text);
    const action = detectAction(text, actionDomain);

    const route = determineRoute({
        message: text,
        action,
        actionDomain
    });

    const confirmationRequired = requiresConfirmation(action);
    const workspaceContextRequired = requiresWorkspaceContext({
        route,
        actionDomain
    });

    let intent = "conversation";

    if (actionDomain) {
        intent = actionDomain;
    }

    return {
        message: originalMessage,
        userId: user?._id || null,

        route,
        intent,
        language,

        actionDomain,
        action,

        requiresLLM: route === "gemini",
        requiresAction: route === "action",
        requiresConfirmation: confirmationRequired,
        requiresWorkspaceContext: workspaceContextRequired,

        timestamp: new Date().toISOString()
    };
};

module.exports = {
    normalizeText,
    detectLanguage,
    detectActionDomain,
    detectAction,
    requiresConfirmation,
    determineRoute,
    isMeaningfulInput,
    analyzeRequest
};