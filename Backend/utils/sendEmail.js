const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    family: 4,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((err) => {
    if (err) {
        console.log("Mail Error:", err);
    } else {
        console.log("Mail Server Ready");
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        console.log(`📩 Attempting to send email to: ${to}`);

        const info = await transporter.sendMail({
            from: `"ORBIQ Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log(
            "✅ Email sent successfully! Message ID:",
            info.messageId
        );

        return info;

    } catch (error) {
        console.error(
            "❌ Nodemailer Send Failed:",
            error.message
        );

        throw error;
    }
};

module.exports = sendEmail;