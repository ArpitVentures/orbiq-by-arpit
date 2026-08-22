export function generateDynamicNotifications(dashboardData) {
    const notifications = [];
    const now = new Date();

    notifications.push({
        id: "signal-welcome",
        title: "Mission Control Online 🚀",
        description:
            "ORBIQ core OS connected. Live telemetry matrix synced.",
        priority: "info",
        icon: "🛰️",
        time: now.toISOString(),
        read: true
    });

    if (!dashboardData) {
        return notifications;
    }

    const { stats, todayFocus, user } = dashboardData;

    if (
        todayFocus?.dueDate &&
        todayFocus?.status?.toLowerCase() !== "completed"
    ) {
        const dueDate = new Date(todayFocus.dueDate);

        if (!Number.isNaN(dueDate.getTime())) {
            const diffMs = dueDate.getTime() - now.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 0) {
                notifications.push({
                    id: `signal-overdue-${todayFocus._id || "focus"}`,
                    title: "Mission Overdue 🚨",
                    description: `Task "${todayFocus.title}" has passed its deadline.`,
                    priority: "critical",
                    icon: "🚨",
                    time: now.toISOString(),
                    read: false
                });
            } else if (diffHours <= 24) {
                notifications.push({
                    id: `signal-deadline-${todayFocus._id || "focus"}`,
                    title: "Orbit Deadline Looming ⏳",
                    description: `Task "${todayFocus.title}" needs execution within 24 hours.`,
                    priority: "critical",
                    icon: "⚠️",
                    time: now.toISOString(),
                    read: false
                });
            }
        }
    }

    const userPlan = String(user?.plan || "Free").trim();
    const planLower = userPlan.toLowerCase();

    if (planLower === "free") {
        notifications.push({
            id: "signal-plan-free",
            title: "Core Workspace Active 🛡️",
            description:
                "Upgrade to Silver or Gold to unlock Horizon AI, Premium Telemetry and Unlimited Workspace.",
            priority: "warning",
            icon: "🛡️",
            time: now.toISOString(),
            read: false
        });
    } else {
        notifications.push({
            id: "signal-plan-active",
            title: `${userPlan} Horizon Active 👑`,
            description:
                "All telemetry modules, AI assist, and workspace vectors unlocked.",
            priority: "success",
            icon: "✨",
            time: now.toISOString(),
            read: true
        });
    }

    const pendingTasks = Number(stats?.pendingTasks || 0);
    const totalTasks = Number(stats?.totalTasks || 0);

    if (pendingTasks === 0 && totalTasks > 0) {
        notifications.push({
            id: "signal-all-clear",
            title: "All Missions Accomplished! 🎉",
            description:
                "Zero pending vectors in pipeline. Workspace status: Pristine.",
            priority: "success",
            icon: "🏆",
            time: now.toISOString(),
            read: false
        });
    } else if (pendingTasks > 0) {
        notifications.push({
            id: "signal-pending-summary",
            title: `${pendingTasks} Active Vectors Pending`,
            description:
                "Maintain momentum to optimize your weekly velocity score.",
            priority: "info",
            icon: "📡",
            time: now.toISOString(),
            read: false
        });
    }

    return notifications;
}

export function getNotifications(dashboardData) {
    const STORAGE_KEY = "orbiq_notifications";

    if (!dashboardData) {
        return [];
    }

    let storedNotifications = [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                storedNotifications = parsed;
            }
        }
    } catch (error) {
        console.error(
            "Failed to parse notifications cache:",
            error
        );

        localStorage.removeItem(STORAGE_KEY);
    }

    const freshNotifications =
        generateDynamicNotifications(dashboardData);

    const readState = new Map(
        storedNotifications.map((notification) => [
            notification.id,
            notification.read
        ])
    );

    const mergedNotifications = freshNotifications.map(
        (notification) => ({
            ...notification,
            read: readState.has(notification.id)
                ? readState.get(notification.id)
                : notification.read
        })
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(mergedNotifications)
    );

    return mergedNotifications;
}

export function formatTimeAgo(isoString) {
    if (!isoString) {
        return "Just now";
    }

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
        return "Just now";
    }

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days}d ago`;
}