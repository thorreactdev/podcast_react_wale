
import {transporter, sender} from "./emailConfig.js";
import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE
} from "./emailTemplate.js";

export async function sendVerificationEmail(email , verificationCode , userName){
    const recipient = [email];
    try{
        const response = await transporter.sendMail({
            from : sender,
            to : recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode).replace("{userName}", userName),
            category: "Email Verification",
        })
    }catch (e) {
        console.log("Error sending email", e);
    }
}

export async function sendWelcomeEmail(email , userName){
    const recipient = [email];
    try{
        const response = await transporter.sendMail({
            from : sender,
            to : recipient,
            subject: "Welcome to Our Website Podcast Wale",
            html : WELCOME_EMAIL_TEMPLATE.replace("{userName}", userName),
            category : "Welcome Email"
        })
    }catch (e){
        console.log("Error sending Welcome email", e);
    }
}

export async function sendPasswordResetEmail(email , userName , resetURL){
    const recipient = [email];

    try{
        const response = await transporter.sendMail({
            from : sender,
            to : recipient,
            subject: "Request For Password Reset",
            html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{userName}", userName).replace("{resetURL}" , resetURL),
            category : "Password reset"
        })
    }catch (e){
        console.log("Error sending Welcome email", e);
    }
}

export async function sendPasswordResetSuccess(email , userName){
    try{
        const recipient = [email];
        const response = await transporter.sendMail({
            from : sender,
            to : recipient,
            subject: "Request For Password Reset",
            html : PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{userName}", userName),
            category : "Password reset"
        })

    }catch (e) {
        console.log("Error sending Welcome email", e);
    }

}