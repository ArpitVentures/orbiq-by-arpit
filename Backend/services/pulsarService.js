const detectIntent = (message) => {
    const text = String(message || "")
        .trim()
        .toLowerCase();

    if (!text) {
        return "unknown";
    }

    if (
        text === "hi" ||
        text === "hello" ||
        text === "hey" ||
        text.includes("hey horizon") ||
        text.includes("hi horizon") ||
        text.includes("hello horizon") ||
        text.includes("good morning") ||
        text.includes("good evening") ||
        text.includes("good night") ||
        text.includes("kaise ho") ||
        text.includes("kaisa hai") ||
        text.includes("kya haal hai")
    ) {
        return "greeting";
    }

    if (
        text.includes("send an email") ||
        text.includes("send email") ||
        text.includes("write an email") ||
        text.includes("email my") ||
        text.includes("mail my") ||
        text.includes("email to") ||
        text.includes("mail to") ||
        text.includes("mail likh") ||
        text.includes("mail kar") ||
        text.includes("mail bhej") ||
        text.includes("email likh") ||
        text.includes("email kar") ||
        text.includes("email bhej") ||
        text.includes("hr ko mail") ||
        text.includes("manager ko mail")
    ) {
        return "email";
    }

    if (
        text.includes("remind me") ||
        text.includes("reminder") ||
        text.includes("remember this") ||
        text.includes("yaad dila") ||
        text.includes("yaad rakh") ||
        text.includes("yaad dilana") ||
        text.includes("mujhe yaad") ||
        text.includes("yaad karwa")
    ) {
        return "reminder";
    }

    if (
        text.includes("meeting") ||
        text.includes("calendar") ||
        text.includes("schedule") ||
        text.includes("appointment") ||
        text.includes("baithak") ||
        text.includes("meeting hai") ||
        text.includes("meeting h")
    ) {
        return "calendar";
    }

    if (
        text.includes("todo") ||
        text.includes("to-do") ||
        text.includes("task") ||
        text.includes("deadline") ||
        text.includes("what should i do") ||
        text.includes("where should i start") ||
        text.includes("too much work") ||
        text.includes("a lot of work") ||
        text.includes("so much work") ||
        text.includes("overwhelmed") ||
        text.includes("don't know where to start") ||
        text.includes("dont know where to start") ||
        text.includes("bahut kaam") ||
        text.includes("bohot kaam") ||
        text.includes("zyada kaam") ||
        text.includes("kaam bahut hai") ||
        text.includes("kahan se shuru") ||
        text.includes("kaha se shuru") ||
        text.includes("kya karu") ||
        text.includes("kya karna chahiye")
    ) {
        return "productivity";
    }

    if (
        text.includes("how are you") ||
        text.includes("how are you doing") ||
        text.includes("what's up") ||
        text.includes("whats up") ||
        text.includes("sup") ||
        text.includes("bored") ||
        text.includes("boring") ||
        text.includes("just chilling") ||
        text.includes("just talking") ||
        text.includes("bore ho raha") ||
        text.includes("bore ho rha") ||
        text.includes("bore ho raha hu") ||
        text.includes("bore ho rha hu") ||
        text.includes("mann nahi lag") ||
        text.includes("man nahi lag")
    ) {
        return "casual";
    }

    if (
        text.includes("fuck") ||
        text.includes("shit") ||
        text.includes("damn") ||
        text.includes("bc") ||
        text.includes("bkl") ||
        text.includes("bakchodi") ||
        text.includes("bakwaas") ||
        text.includes("bakwass") ||
        text.includes("harami") ||
        text.includes("chutiya") ||
        text.includes("madarchod") ||
        text.includes("bhenchod") ||
        text.includes("gussa") ||
        text.includes("angry") ||
        text.includes("frustrated") ||
        text.includes("irritated") ||
        text.includes("irritate")
    ) {
        return "emotional";
    }

    if (
        text.endsWith("?") ||
        text.startsWith("what ") ||
        text.startsWith("why ") ||
        text.startsWith("how ") ||
        text.startsWith("when ") ||
        text.startsWith("where ") ||
        text.startsWith("who ") ||
        text.startsWith("can you ") ||
        text.startsWith("could you ") ||
        text.includes("kya hai") ||
        text.includes("kaise") ||
        text.includes("kyu") ||
        text.includes("kyun") ||
        text.includes("kab") ||
        text.includes("kaun")
    ) {
        return "question";
    }


    return "unknown";
};


const analyzeRequest = ({ message, user }) => {
    const text = String(message || "").trim();

    const intent = detectIntent(text);

    const requiresAction = [
        "email",
        "calendar",
        "reminder",
        "productivity"
    ].includes(intent);

    const requiresLLM = [
        "question",
        "casual",
        "emotional"
    ].includes(intent);

    return {
        message: text,
        userId: user?._id || null,
        intent,
        requiresLLM,
        requiresAction
    };
};


module.exports = {
    detectIntent,
    analyzeRequest
};