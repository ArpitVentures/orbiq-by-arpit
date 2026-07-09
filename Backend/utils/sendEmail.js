const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
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

    await transporter.sendMail({

        from: process.env.EMAIL_USER,
        to,
        subject,
        html

    });

};

module.exports = sendEmail;