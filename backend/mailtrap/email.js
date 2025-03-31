import { transporter, sender } from "./mailtrapConfig.js"
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, WELCOME_TEMPLATE } from "./emailTemplates.js"

export const sendVerificationEmail = async (email, verificationToken) => {

    // const recipient = [{ email }];

    // console.log(recipient)

    try {

        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email send successfully: ", response);
    } catch (error) {
        console.error("Error sending verification", error);
    }
}

export const sendWelcomeEmail = async (email, name) => {

    try {

        // const recipient = [{ email }];

        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Welcome Page",
            html: WELCOME_TEMPLATE,
            category: "Welcome Page"
        });

        console.log("Welcome email sent successfully", response);

    } catch (error) {
        console.error("Error sending welcome email", error.message);
    }

}

export const sendPasswordResetEmail = async (email, resetURL) => {
    // const recipient = [{ email }];

    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })

        console.log("forgot password send successfully")
    } catch (error) {
        console.error("Error sending password reset email", error.message);
    }
}

export const sendResetSuccessEmail = async (email) => {
    try {

        // const recipient = [{ email }];

        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password reset successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Successfully"
        });

        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending password reset email", error.message)
    }

}