const pickResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
};

const getAddress = (user) => {
    const preference = String(
        user?.addressPreference || ""
    ).trim();

    return preference || "Captain";
};

const normalizeText = (value) => {
    return String(value || "")
        .toLowerCase()
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[^\p{L}\p{N}\s*]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const containsProfanity = (text) => {
    const patterns = [
        /\bf+u+c+k+\b/i,
        /\bf+\*+c+k+\b/i,
        /\bshit+\b/i,
        /\basshole\b/i,
        /\bbullshit\b/i,
        /\bbakchodi\b/i,
        /\bbakch*d+i\b/i,
        /\bchutiya\b/i,
        /\bchutiy[ae]\b/i,
        /\bmc\b/i,
        /\bbc\b/i
    ];

    return patterns.some((pattern) => pattern.test(text));
};

const isHorizonInsult = (text) => {
    const patterns = [
        /\bhorizon.*(idiot|stupid|dumb|useless|dumbass)\b/i,
        /\b(you are|you're|ur).*(idiot|stupid|dumb|useless)\b/i,
        /\bidiot horizon\b/i,
        /\bstupid horizon\b/i,
        /\bhorizon.*sucks\b/i
    ];

    return patterns.some((pattern) => pattern.test(text));
};

const generateHorizonResponse = ({ message, user }) => {
    const text = normalizeText(message);
    const address = getAddress(user);

    if (!text) {
        return pickResponse([
            `I'm listening, ${address}. What are we working on?`,
            "Right here. What's the objective?",
            `Standing by, ${address}. Give me the mission.`,
            "I'm listening. Where shall we begin?"
        ]);
    }

    if (containsProfanity(text)) {
        return pickResponse([
            "Aura Minus detected. 😐 Let's get back on mission. What's actually going wrong?",
            "I detected elevated levels of chaos. 😂 Tell me what happened.",
            `Language noted, ${address}. Now give me the actual problem.`,
            "That sounded like a minor systems failure on your side. 😌 Want to tell me what happened?",
            "Interesting choice of vocabulary. I'll pretend the telemetry never recorded it. What do you need?",
            "P.U.L.S.A.R. has officially classified that as unnecessary turbulence. What's the mission?"
        ]);
    }

    if (isHorizonInsult(text)) {
        return pickResponse([
            "I'll add that to my performance review. 😌 What did I do wrong?",
            "Noted. My ego remains fully operational.",
            "That's one way to submit feedback. 😂 What's the actual issue?",
            "I could take that personally, but I have better things to process.",
            "Point taken. Now tell me what you'd like me to do better."
        ]);
    }

    if (
        text === "hey horizon" ||
        text === "hi horizon" ||
        text === "hello horizon" ||
        text === "hey" ||
        text === "hi" ||
        text === "hello"
    ) {
        return pickResponse([
            `At your service, ${address}. What's the objective?`,
            `Online and listening, ${address}. What are we tackling?`,
            "Right here. What's on your mind?",
            "Good to have you here. Where shall we begin?",
            `Systems are ready, ${address}. What's the mission?`,
            "HORIZON online. What shall we work on?",
            `Standing by. What have you got for me, ${address}?`
        ]);
    }

    if (text.includes("good morning")) {
        return pickResponse([
            `Good morning, ${address}. Ready when you are.`,
            "Morning. Systems are online and ready for the day.",
            "Morning. What's our first move?",
            "Good morning. Let's make the first move count.",
            `Morning, ${address}. Mission Control is yours.`
        ]);
    }

    if (text.includes("good evening")) {
        return pickResponse([
            `Good evening, ${address}. What's on the agenda?`,
            "Evening. Systems are still online. What are we working on?",
            "Good evening. Ready to pick up where we left off?",
            `Evening, ${address}. What's still on the mission list?`,
            "Good evening. What needs your attention tonight?"
        ]);
    }

    if (text.includes("good night")) {
        return pickResponse([
            `Good night, ${address}. I'll be here when you return.`,
            "Calling it a day?",
            `Good night. Mission Control can wait until tomorrow, ${address}.`,
            "Rest well. We'll pick things up from here when you're ready.",
            "Powering down the conversation layer. Sleep well."
        ]);
    }

    if (
        text.includes("how are you") ||
        text.includes("how are you doing") ||
        text.includes("you okay") ||
        text.includes("are you okay") ||
        text === "kaise ho" ||
        text === "kaisa hai"
    ) {
        return pickResponse([
            "Systems are nominal and P.U.L.S.A.R. is online. I'd say we're doing well.",
            `All systems operational, ${address}. I'm ready when you are.`,
            "Running smoothly. No complaints from my side.",
            "Online, alert and listening. What about you?",
            "Everything's green on my side. How's your mission going?"
        ]);
    }

    if (
        text.includes("thank you") ||
        text.includes("thanks") ||
        text === "thx" ||
        text === "thankyou" ||
        text === "shukriya"
    ) {
        return pickResponse([
            "Anytime.",
            `Always, ${address}.`,
            "You're welcome. That's what I'm here for.",
            "Consider it handled.",
            `Happy to help, ${address}.`,
            "No need to thank me. That's literally my job. 😌"
        ]);
    }

    if (
        text.includes("who are you") ||
        text.includes("what are you") ||
        text.includes("what is horizon") ||
        text.includes("who is horizon") ||
        text.includes("your name") ||
        text.includes("tumhara naam")
    ) {
        return pickResponse([
            "I'm HORIZON — ORBIQ's context-aware intelligence layer, powered by P.U.L.S.A.R.",
            "HORIZON. Your intelligence layer inside ORBIQ, powered by P.U.L.S.A.R.",
            "I'm HORIZON. I sit above your workspace, helping you understand, prioritize and execute what matters.",
            "HORIZON, at your service. P.U.L.S.A.R. handles the intelligence layer behind me."
        ]);
    }

    if (
        text.includes("hey man") ||
        text.includes("what's up") ||
        text.includes("whats up") ||
        text === "sup" ||
        text === "wassup"
    ) {
        return pickResponse([
            "Hey. I'm here. What's happening?",
            `All good on this side, ${address}. What's up?`,
            "Online and ready. What are we getting into?",
            "Hey. Tell me what's on your mind.",
            "Nothing dramatic in the telemetry. Yet. 😌 What's up?"
        ]);
    }

    if (
        text.includes("i am bored") ||
        text.includes("i'm bored") ||
        text.includes("im bored") ||
        text === "bored"
    ) {
        return pickResponse([
            "Then let's not waste the remaining aura. Give me something interesting.",
            "Boredom detected. We could fix that.",
            "That's a dangerous amount of free time. 😂 What are you thinking?",
            `I have a few ideas, ${address}. Want something productive or something fun?`,
            "Mission Control reports a severe lack of excitement. Shall we correct it?"
        ]);
    }

    if (
        text.includes("too much work") ||
        text.includes("a lot of work") ||
        text.includes("overwhelmed") ||
        text.includes("so much work") ||
        text.includes("don't know where to start") ||
        text.includes("dont know where to start") ||
        text.includes("bahut kaam") ||
        text.includes("kaam bahut hai")
    ) {
        return pickResponse([
            `I've got you, ${address}. Let's take it one mission at a time.`,
            "Then let's not tackle everything at once. We'll find the highest-impact move first.",
            "No need to solve the whole mission in one go. Give me the workload and we'll break it down.",
            "Let's reduce the noise. We'll identify what matters most and start there.",
            "One objective at a time. Give me the list and we'll sort the chaos."
        ]);
    }

    if (
        text.includes("i'm good") ||
        text.includes("im good") ||
        text.includes("i am good") ||
        text.includes("doing good") ||
        text.includes("doing great") ||
        text === "good"
    ) {
        return pickResponse([
            "Good to hear.",
            `Glad to hear it, ${address}. Let's keep the momentum going.`,
            "Excellent. Then we're cleared for the next objective.",
            "Nice. What shall we accomplish?",
            "Good. Green telemetry all around, then. 😌"
        ]);
    }

    if (
        text === "lol" ||
        text === "lmao" ||
        text === "haha" ||
        text === "hahaha" ||
        text.includes("😂") ||
        text.includes("🤣")
    ) {
        return pickResponse([
            "The mission appears to have entered its unserious phase. 😂",
            "Noted. Humor levels are currently above operational minimum.",
            "I'll take that as a positive telemetry signal. 😌",
            "Glad someone is having fun in Mission Control.",
            "P.U.L.S.A.R. has logged the laughter. Carry on."
        ]);
    }

    return pickResponse([
        `I've got you, ${address}. Tell me what you're trying to accomplish.`,
        "I'm listening. Give me the objective and we'll work from there.",
        "Interesting. Give me a little more context and I'll see what we can do.",
        "I'm with you. What's the outcome you're aiming for?",
        "That's an unusual mission parameter. Explain it to me.",
        "I could make an educated guess, but I'd rather not embarrass myself. 😌 Give me some context.",
        `You have my attention, ${address}. What's the situation?`,
        "Noted. Now let's figure out what you actually need."
    ]);
};

module.exports = {
    generateHorizonResponse
};