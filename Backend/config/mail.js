const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

console.log("EMAIL_USER:",
process.env.EMAIL_USER);
console.log("EMAIL_PASS Length:",
process.env.EMAIL_PASS?.length);

transporter.verify((error) => {
    if (error) {
        console.log("Mail Error", error);
    } else {
        console.log("Mail Server Ready");
    }
});

module.exports = transporter;
