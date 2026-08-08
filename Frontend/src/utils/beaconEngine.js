export function generateDynamicNotifications(dashboardData) {
    const notifications = [];
    const now = new Date();

    notifications.push({
        id: "signal-welcome",
        title: "Mission Control Online 🚀",
        description: "ORBIQ core OS connected. Live telemetry matrix synced.",
        priority: "info",
        icon: "🛰️",
        time: now.toISOString(),
        read: true
    });

    if (!dashboardData) return notifications;

    const { stats, todayFocus, user } = dashboardData;

    if (todayFocus && todayFocus.dueDate) {
        const dueDate = new Date(todayFocus.dueDate);
        const diffHours = Math.round((dueDate - now) / (1000 * 60 * 60));

        if (diffHours <= 24 && diffHours >= 0) {
            notifications.push({
                id: `signal-deadline-${todayFocus._id || "focus"}`,
                title: "Orbit Deadline Looming ⏳",
                description: `High priority task "${todayFocus.title}" needs execution soon!`,
                priority: "critical",
                icon: "⚠️",
                time: now.toISOString(),
                read: false
            });
        }
    }

    const userPlan = user?.plan || "Free";
    if (userPlan.toLowerCase() === "free") {
        notifications.push({
            id: "signal-plan-free",
            title: "Core Workspace Active 🛡️",
            description: "Upgrade to Silver or Gold to unlock Horizon AI, Premium Telemetry and Unlimited Workspace.",
            priority: "warning",
            icon: "🛡️",
            time: now.toISOString(),
            read: false
        });
    } else {
        notifications.push({
            id: "signal-plan-active",
            title: `${userPlan} Horizon Active 👑`,
            description: "All telemetry modules, AI assist, and workspace vectors unlocked.",
            priority: "success",
            icon: "✨",
            time: now.toISOString(),
            read: true
        });
    }

    if (stats?.pendingTasks === 0 && stats?.totalTasks > 0) {
        notifications.push({
            id: "signal-all-clear",
            title: "All Missions Accomplished! 🎉",
            description: "Zero pending vectors in pipeline. Workspace status: Pristine.",
            priority: "success",
            icon: "🏆",
            time: now.toISOString(),
            read: false
        });
    } else if (stats?.pendingTasks > 0) {
        notifications.push({
            id: "signal-pending-summary",
            title: `${stats.pendingTasks} Active Vectors Pending`,
            description: "Maintain momentum to optimize your weekly velocity score.",
            priority: "info",
            icon: "📡",
            time: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
            read: false
        });
    }

    return notifications;
}

export function getNotifications(dashboardData) {
    let stored = localStorage.getItem("orbiq_notifications");

    if (stored && (stored.includes("Core Tier Active") || stored.includes("Physics assignment"))) {
        localStorage.removeItem("orbiq_notifications");
        stored = null;
    }

    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse notifications cache");
        }
    }

    const fresh = generateDynamicNotifications(dashboardData);
    localStorage.setItem("orbiq_notifications", JSON.stringify(fresh));
    return fresh;
}

export function formatTimeAgo(isoString) {
    if (!isoString) return "Just now";
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}