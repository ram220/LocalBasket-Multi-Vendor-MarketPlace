const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:process.env.EMAIL_PORT,
    secure:true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"LocalBasket" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
    } catch (err) {
        console.log("Email error:", err);
    }
};

module.exports = sendEmail;