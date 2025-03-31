// import { MailtrapClient } from "mailtrap";
// import dotenv from "dotenv";

// dotenv.config();

// const TOKEN = process.env.MAILTRAP_TOKEN;
// const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// export const mailtrapClient = new MailtrapClient({
//     endpoint: ENDPOINT,
//     token: TOKEN,
// });

// export const sender = {
//     email: "hello@demomailtrap.co",
//     name: "Jaimin Gohil",
// };


// const recipients = [
//     {
//         email: "jaimingohil1111@gmail.com",
//     }
// ];

// client
//     .send({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         text: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);


import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL = process.env.EMAIL_SENDER
const PASSWORD = process.env.EMAIL_PASS

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: EMAIL, // Your email
        pass: PASSWORD, // Your email password or app password
    },
});

export const sender = {
    email: EMAIL,
    name: "Jaimin Gohil",
};