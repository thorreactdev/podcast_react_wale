import express from 'express';
import {checkUsernameAvailability} from "../helper/authHelperMethods.js";
import {
    forgotPassword,
    githubAuth,
    googleAuth,
    loginController, logOut,
    resendCodeEmail, resetPassword,
    signupController, updateProfilePic,
    verifyEmail
} from "../controller/authController.js";
import {upload} from "./podcastRouter.js";
const router = express.Router();

router.route("/signup").post(checkUsernameAvailability, signupController);
router.route("/google-auth").post(googleAuth);
router.route("/github-auth").post(githubAuth);
router.route("/login").post(loginController);
router.route("/verify-email").post(verifyEmail);
router.route("/resend-code").post(resendCodeEmail);
router.route("/logout").post(logOut);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/update-profile-pic/:userId/:email").post(upload.single("image"), updateProfilePic)


export default router;