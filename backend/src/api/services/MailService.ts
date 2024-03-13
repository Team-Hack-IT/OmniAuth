import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function sendEmail(
    recipient: string,
    subject: string,
    text: string,
    html: string
) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_FROM,
            clientId: process.env.EMAIL_CLIENT_ID,
            clientSecret: process.env.EMAIL_CLIENT_SECRET,
            refreshToken: process.env.EMAIL_REFRESH_TOKEN,
            accessToken: process.env.EMAIL_ACCESS_TOKEN,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: subject,
        text: text,
        html: html,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
}

export default sendEmail;
