const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

transporter.verify((error) => {
    if (error) {
        console.log("Mail Error", error);
    } else {
        comsole.log("Mail Server Ready");
    }
});

module.exports = transporter;