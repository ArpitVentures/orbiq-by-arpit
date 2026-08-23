const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        console.log(`📩 Attempting to send email to: ${to}`);

        const { data, error } = await resend.emails.send({
            from: "ORBIQ Support <onboarding@resend.dev>",
            to: [to],
            subject,
            html,
        });

        if (error) {
            console.error("❌ Resend Send Failed:", error);
            throw new Error(error.message || "Email sending failed");
        }

        console.log("✅ Email sent successfully! Message ID:", data.id);

        return data;

    } catch (error) {
        console.error("❌ Email Delivery Failed:", error.message);
        throw error;
    }
};

module.exports = sendEmail;