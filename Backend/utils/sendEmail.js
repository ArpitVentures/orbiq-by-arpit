const sendEmail = async (to, subject, html) => {
    try {
        console.log(`📩 Relay dispatching email to: ${to}`);

        const scriptUrl = process.env.APPS_SCRIPT_URL;
        const scriptSecret = process.env.APPS_SCRIPT_SECRET;

        if (!scriptUrl || !scriptSecret) {
            throw new Error("Apps Script URL or Secret missing in environment variables.");
        }

        const utf8Subject = subject || "Welcome to ORBIQ 🙏🏻 — Verify Your Account";
        const mimeEncodedSubject = `=?UTF-8?B?${Buffer.from(utf8Subject).toString('base64')}?=`;

        const response = await fetch(scriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                secret: scriptSecret,
                to,
                subject: mimeEncodedSubject,
                html: html
            })
        });

        const data = await response.json();

        if (!data.success) {
            console.error("❌ Apps Script Email Relay Failed:", data.message);
            throw new Error(data.message || "Email relay execution failed.");
        }

        console.log("✅ Verification Email Sent via Google Relay!");
        return data;

    } catch (error) {
        console.error("🚨 SendEmail Delivery Failed:", error.message);
        throw error;
    }
};

module.exports = sendEmail;