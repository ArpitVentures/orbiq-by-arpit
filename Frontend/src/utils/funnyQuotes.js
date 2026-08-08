export const dashboardEmpty = [
    "Mission Control is unusually quiet today. 🌌",
    "Telemetry is clear. Ready to chart your next mission? 🚀",
    "Beacon is quiet. No new signals detected. 📡",
    "Ecosystem clear. A perfect canvas to launch your next sector. 🎨🚀",
    "Sector status: Uncharted nebula. Let's deploy some objectives! 🏜️🏃"
];

export const deleteQuotes = [
    "Abort sequence initialized. Permanent ejection ahead! 🧠🚫",
    "Purging mission data from Mission Control... 👋",
    "Once jettisoned, this mission cannot be recovered. 😴📉",
    "Are you certain, Captain? This operation cannot be reversed. 🥺💔",
    "Confirmed. Disintegrating target vector into space dust... Poof! 🎩✨"
];

export const deleteSuccessQuotes = [
    "Khatam, bye bye, tata! Target eliminated! 🗑️",
    "Sent straight to the digital black hole. ⚰️",
    "Target disappeared beyond the event horizon. 🌌",
    "Mission accomplished. Target coordinates purged. 🎯",
    "Aur ek execution itihaas ban gaya. 📜😂"
];

export const forgotPasswordQuotes = [
    "Encryption breach? Let's recalibrate your access keys. 🔍🧩",
    "Comms grid locked? Don't worry, Horizon is helping restore secure access. 🛡️✨",
    "Lost your token keys? Time to forge an epic new passcode passphrase. 🔥",
    "Lost access? Recalibrating secure entry... 🧠🔒",
    "Don't panic! Overriding security blocks in a jiffy. ⌛⚡"
];

export const loginQuotes = [
    "Welcome back, Captain! Your central command matrix awaits. 🕶️🚪",
    "Docking successful. Mission Control is fully operational. 🤝✨",
    "Mission Control is online. Ready for launch? 🎯🔥",
    "Clearance granted! You are officially one step closer to orbit graduation. 🎓🥳",
    "Authentication successful. Let the cosmic operations begin! 📚⚡"
];

export const signupQuotes = [
    "Welcome to the fleet! You're officially registered at ORBIQ Base. 😎🎉",
    "Fleet registration complete! Welcome aboard ORBIQ. 🚀📧",
    "Coordinates logged! Let's make some technological breakthroughs. 🪄✨",
    "New workspace deployed! Ready to conquer the tech quadrant. 🌍💪",
    "Boom! Gateway initialized. Let's start this space adventure. 🤩"
];

export const verifiedQuotes = [
    "Secure channel verified! Your communication channel is secured. 😎📧",
    "Scan successful! Core logic confirms you are an organic intelligence. 🤖❌",
    "Signature verified. Welcome to the elite orbit command council. 🤫🌟",
    "Secure stream established. Mainframe feed configured successfully. 🎁✨",
    "Handshake complete! No more verification tracking from the server. ✅😇"
];

export const completedQuotes = [
    "Mission success! Power down for a temporary resource recharging loop. 🍕😋",
    "Objective secured! You're operating at maximum kinetic speed now. 🥷🔥",
    "Milestone achieved! Telemetry logs updated on the master grid. 🙇‍♂️🏅",
    "Another sector cleared. Plotting coordinates for the next vector. 🗺️⚔️",
    "Execution complete! Core memory stack updated successfully. 🧠💡"
];

export const peakProductivityQuotes = [
    "Mission success rate: 100%. Are you running on an arc reactor? 🧙‍♂️⚡",
    "Maximum performance achieved! Initiate standard recovery protocol. 😴🏆",
    "Peak performance achieved. Can we clone this computational stream? 🧪⚡",
    "100% mission efficiency! You're setting new acceleration standards for the network! 😅🚀",
    "Ecosystem maxed out! You are officially the supreme captain of the deck. 🏅😎"
];

export const logoutQuotes = [
    "Disconnecting comms... Don't drift off course too long, Captain. 👋",
    "Decoupling successful. Go touch some terrestrial grass. 🌿",
    "Terminal session closed. Current assignments remain safely in stasis. 📚",
    "Powering down... We'll pretend you ran out of solar battery power today. 😂",
    "Secure logoff completed. Workspace state saved... hopefully. 💾"
];

export const settingsQuotes = [
    "Ecosystem parameters calibrated! System ready for dynamic routing. 🚀✨",
    "Configuration keys locked! Command matrix completely updated. 🌍💪🏻",
    "Mainframe settings stabilized! Ready to capture new flight frequencies. 🎯😎",
    "Parameters persistent! You are one step closer to absolute peak automation. 🧠⚡",
    "Mission parameters updated successfully. Go make some technological magic happen. 🧙🏻‍♂️✨"
];

export const morningDashboardQuotes = [
    "Mission Control is online. Time to fuel up. ☕",
    "Systems rebooted. Excellent morning parameters to build something epic. 🚀",
    "Let's turn today's ideas into successful missions. 🚀",
    "New orbit rotation. New commits ready for deployment. 🌞"
];

export const afternoonDashboardQuotes = [
    "Mid-orbit status check. Keep stacking those structural payloads. ⚡",
    "Standard day cycle 50% depleted. The remaining targets can still be secured. 💪",
    "Maintain trajectory alignment. Stay absolutely unstoppable."
];

export const eveningDashboardQuotes = [
    "Approaching orbital twilight! Wrap up today's missions and prepare tomorrow's launch. 🌅",
    "Evening propulsion loop: Keep focus intact, touchdown is close. ☕",
    "Horizon view initialized. Let's execute the final sprint strong. 🌇",
    "Don't kill the thrusters now; the deepest code patterns run in the dark. ✨"
];

export const nightDashboardQuotes = [
    "Deep space night owl tracking activated. 🌙",
    "System warning: Remember to push updates to the mainframe before stasis. 💾",
    "Compile operations tonight. Debug the universe tomorrow. 😴"
];

export const getRandomQuote = (quotes) => {
    return quotes[
        Math.floor(Math.random() * quotes.length)
        ];
};