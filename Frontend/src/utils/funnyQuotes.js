export const dashboardEmpty = [
    "Your dashboard is looking emptier than my social calendar on a Friday night. 🗓️👻",
    "So clean! It’s almost a shame to clutter it up with actual work. 🧼✨",
    "Nothing to see here! Are you on vacation, or just really good at avoiding tasks? 🌴😎",
    "It’s a blank canvas! Now, go forth and fill it with something productive. 🎨🚀",
    "Dashboard status: Ghost town. Let’s get some action in here! 🏜️🏃"
];

export const deleteQuotes = [
    "Delete it? Are you sure? There’s no undo button for life decisions, you know! 🧠🚫",
    "Sending this to the digital recycling center. Bye-bye, forever! 🚮👋",
    "Once it’s gone, it’s gone. Just like my focus during an 8 AM lecture. 😴📉",
    "Are you absolutely certain? This file is looking pretty attached to you. 🥺💔",
    "Confirmed. Initiating permanent vanishing act... Poof! 🎩✨"
];

export const deleteSuccessQuotes = [
    "Khatam, bye bye, tata! Task uda diya! 🗑️",
    "Digital shamshaan me bhej diya. ⚰️",
    "Task disappeared faster than my motivation on Monday. 😂",
    "Mission accomplished. Target eliminated. 🎯",
    "Aur ek task itihaas ban gaya. 📜😂"
];

export const forgotPasswordQuotes = [
    "Oh no, password mystery! Let's solve it together. 🔍🧩",
    "Password forgot? That's okay, we've got your back! 🛡️✨",
    "Forgot password? It's probably a good time to create a new, epic one anyway! 🚀🔥",
    "Oops, slipped your mind? Let's help you get back in! 🧠🔒",
    "Don't panic! It's just a password. We'll fix it in a jiffy. ⌛⚡"
];

export const loginQuotes = [
    "Welcome back! Your secret lair awaits. 🕶️🚪",
    "Back for more? I promise we've kept everything exactly where you left it. 🤝✨",
    "Ready to be productive? Let’s get into the zone! 🎯🔥",
    "Login success! You’re officially one step closer to graduation. 🎓🥳",
    "Authentication successful. Let the chaos—I mean, learning—begin! 📚⚡"
];

export const signupQuotes = [
    "Welcome to the crew! You’re officially part of the cool kids' club now. 😎🎉",
    "Signup complete! We promise not to send you emails you don't care about. 🚫📧",
    "You’re in! Let’s make some magic happen. 🪄✨",
    "Account created! Ready to conquer the world, or at least this website. 🌍💪",
    "Boom! You’re all signed up. Let's start this adventure. 🚀🤩"
];

export const verifiedQuotes = [
    "Verified! Your email is now officially 'cool'. 😎📧",
    "Success! We’ve confirmed you’re a real human and not a smart robot. 🤖❌",
    "Email verified. You’re now part of the exclusive inner circle. 🤫🌟",
    "Verified! We promise to only send you the good stuff. 🎁✨",
    "You’re all set! No more 'please verify' pestering from us. ✅😇"
];

export const completedQuotes = [
    "Task finished! Time for a celebratory snack break. 🍕😋",
    "Done and dusted! You’re basically a productivity ninja now. 🥷🔥",
    "Achievement unlocked! Take a bow, you earned it. 🙇‍♂️🏅",
    "Another one bites the dust. What’s next on your quest? 🗺️⚔️",
    "Task completed! You’re officially smarter than five minutes ago. 🧠💡"
];

export const peakProductivityQuotes = [
    "Productivity 100%! Are you a wizard? Seriously, how? 🧙‍♂️⚡",
    "You’ve hit the max! Go reward yourself with a nap, you’ve earned it. 😴🏆",
    "Peak performance achieved. Can we bottle this energy? 🧪⚡",
    "100% productivity? You’re making the rest of us look bad! 😅🚀",
    "Maxed out! You’re officially the MVP of this website today. 🏅😎"
];

export const logoutQuotes = [
        "See you soon! Don't procrastinate too much. 👋",
        "Logged out successfully. Go touch some grass. 🌿",
        "Session ended. Your assignments are still waiting. 📚",
        "Bye! We'll pretend you actually finished today's work. 😂",
        "Logout successful. Productivity level saved... hopefully. 💾"

];

export const settingsQuotes = [
    "Preferences updated! You're all set for future greatness. 🚀✨",
    "Settings saved! You're officially ready to conquer the world. 🌍💪🏻",
    "Settings locked in! Ready to tackle whatever comes next. 🎯😎",
    "All saved! You're one step closer to maximum productivity. 🧠⚡",
    "Preferences updated! Now go make some magic happen. 🧙🏻‍♂️✨"
]

export const morningDashboardQuotes = [
    "Coffee first, bugs later. ☕🐛",
    "Fresh morning. Time to build something awesome. 🚀",
    "Let's turn today's ideas into shipped features. 💻✨",
    "New day. New commits. New victories. 🌞"
];

export const afternoonDashboardQuotes = [
    "Afternoon energy check. Keep stacking those features. ⚡",
    "Half the day is gone, half the work can still be conquered. 💪",
    "Progress > Perfection. Keep moving. 🚀"
];

export const nightDashboardQuotes = [
    "Night owl mode activated. 🌙",
    "Remember to commit before sleeping. 💾",
    "Code now. Debug tomorrow. 😴"
];

export const getRandomQuote = (quotes) => {
    return quotes[
        Math.floor(Math.random() * quotes.length)
        ];
};