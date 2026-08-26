const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
    try {
        console.log(`📩 Dispatching Gmail verification to: ${to}`);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"ORBIQ Workspace" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Verification Email Delivered via Gmail! Message ID:", info.messageId);

        return info;
    } catch (error) {
        console.error("🚨 Gmail SMTP Transport Failed:", error.message);
        throw error;
    }
};

module.exports = sendEmail;