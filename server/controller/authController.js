import {errorHandler} from "../middleware/errorMiddleware.js";
import bcrypt from "bcryptjs";
import User from "../schema/userSchema.js";
import {checkEmail, checkExistingUser, validatePassword} from "../helper/authHelperMethods.js";
import jwt from "jsonwebtoken";
// import {generateVerificationCode} from "../helper/generateCode.js";
import {
    sendPasswordResetEmail,
    sendPasswordResetSuccess,
    sendVerificationEmail,
    sendWelcomeEmail
} from "../email/emailController.js";
import {generateVerificationCode} from "../helper/generateCode.js";
import { v4 as uuidv4 } from 'uuid';
import {uploadCustomImageToCloudinary} from "../helper/cloudinaryUpload.js";
import Podcast from "../schema/podcastSchema.js";


export async function signupController(req, res, next) {
    const { username, email, password } = req.body;
    console.log(username, email ,password);
    if (!username || !email || !password) {
        return next(errorHandler(404, "Please Provide Signup Credentials"));
    }

    //checking existing user
    if (await checkExistingUser(email)) {
        return next(errorHandler(409, "user already exists please login"));
        // logic to send the response to frontend to navigate to sign-in page.
    }
    //checking email
    if (!checkEmail(email)) {
        return next(errorHandler(400, "Invalid Email"));
    }
    //checking password validation
    if (!validatePassword(password).success) {
        return next(errorHandler(400, "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."))
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const verificationToken = generateVerificationCode();
    try {
        const newUser = new User({
            username,
            email,
            password : hashPassword,
            isGoogleLogin : false,
            isGithubLogin : false,
            verificationTokenExpiresAt : Date.now() + 24 * 60 * 60 * 1000,
            verificationToken : verificationToken
        })
        await newUser.save();
        const token = jwt.sign({ id : newUser?._id , email : newUser?.email}, process.env.JWT_SECRET , {expiresIn: "1d"});
        await sendVerificationEmail(newUser?.email , newUser.verificationToken , newUser?.username);
        const { password: pass ,verificationToken: verify, ...rest } = newUser?._doc;
        res.cookie("token" , token , {httpOnly : true}).status(200).json({
            success : true,
            message : `${username} registered successfully. email verification code sent`,
            creditMessage :"Congrats! You Earned 2 Credits you can create two podcast",
            userData : rest
        })
    } catch (e) {
        console.log(e);
        return next(errorHandler(500, "Failed To Create User"));
    }
}

export async function loginController(req,res,next){
    const { email , password } = req.body;
    const userExistData = await checkExistingUser(email);

    if (!email || !password) {
        return next(errorHandler(404, "Please Provide login Credentials"));
    }
    if (!checkEmail(email)) {
        return next(errorHandler(400, "Invalid Email"));
    }
    if (!userExistData) {
        return next(errorHandler(404, "user not found please signup"));
        // logic to send the response to frontend to navigate to signup page.
    }
    const isPasswordValid = bcrypt.compareSync(password , userExistData?.password);
    if(!isPasswordValid){
        return next(errorHandler(400, "Invalid Password"));
    }
    try{
        const token = jwt.sign({ id : userExistData?._id , email : userExistData?.email}, process.env.JWT_SECRET , {expiresIn: "1d"});
        const { password , ...rest } = userExistData?._doc;
        res.cookie("token" , token , {httpOnly : true}).status(200).json({
            success : true,
            userData : rest,
            message : `Welcome Back ${userExistData?.username}`
        })
    }catch (e) {
        console.log(e);
        return next(errorHandler(500, "Failed To Login User"));
    }
}

export const googleAuth = async (req,res, next)=>{
    const { email , username , userAvatar } = req.body;
    if(!email || !username || !userAvatar ){
        return next(errorHandler(403, "Please Provide Google Credentials Details"));
    }
    try{
        const existingUser = await checkExistingUser(email);
        if(existingUser){
            const token = jwt.sign({ id : existingUser?._id , email : existingUser?.email} , process.env.JWT_SECRET, {expiresIn: "1d"});
            const { password , ...rest} = existingUser?._doc;
            await sendWelcomeEmail(email , existingUser?.username);
            res.cookie("token" , token , {httpOnly : true}).status(200).json({
                success : true,
                message : `Welcome back login successfully`,
                userData : rest
            })
        }else{
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashPassword = bcrypt.hashSync(generatePassword , 10);

            const newGoogleUser = new User({
                username : username.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email : email,
                password : hashPassword,
                userAvatar : userAvatar,
                isGoogleLogin : true,
                isGithubLogin : false,
                isVerified : true
            });

            await newGoogleUser.save();
            const token = jwt.sign({ id : newGoogleUser?._id , email : newGoogleUser?.email} , process.env.JWT_SECRET, {expiresIn: "1d"});
            console.log(token);
            const { password , ...rest} = newGoogleUser?._doc;
            await sendWelcomeEmail(email , newGoogleUser?.username);
            res.cookie("token" , token , {httpOnly : true}).status(200).json({
                success : true,
                message : `Welcome back login successfully`,
                userData : rest
            })
        }
    }catch (err){
        return next(errorHandler(500 , "Failed to login with google"));
    }
}

export const githubAuth = async (req,res, next)=>{

    const { email , username , userAvatar } = req.body;
    if(!email || !username || !userAvatar ){
        return next(errorHandler(403, "Please Provide Google Credentials Details"));
    }
    try{
        const existingUser = await checkExistingUser(email);
        if(existingUser){
            const token = jwt.sign({ id : existingUser?._id , email : existingUser?.email} , process.env.JWT_SECRET, {expiresIn: "1d"});
            console.log(token);
            const { password , ...rest} = existingUser?._doc;
            await sendWelcomeEmail(existingUser?.email , existingUser?.username);
            res.cookie("token" , token , {httpOnly : true}).status(200).json({
                success : true,
                message : `Welcome back login successfully`,
                userData : rest
            })
        }else{
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashPassword = bcrypt.hashSync(generatePassword , 10);

            const newGithubUser = new User({
                username : username.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email : email,
                password : hashPassword,
                userAvatar : userAvatar,
                isGoogleLogin : false,
                isGithubLogin : true,
                isVerified : true
            });

            await newGithubUser.save();
            const token = jwt.sign({ id : newGithubUser?._id , email : newGithubUser?.email} , process.env.JWT_SECRET, {expiresIn: "1d"});
            console.log(token);
            const { password , ...rest} = newGithubUser?._doc;
            await sendWelcomeEmail(newGithubUser?.email , newGithubUser?.username);
            res.cookie("token" , token , {httpOnly : true}).status(200).json({
                success : true,
                message : `Welcome back login successfully`,
                userData : rest
            })
        }
    }catch (err){
        return next(errorHandler(500 , "Failed to login with github"));
    }
}

export const verifyEmail = async (req,res,next) =>{
    try{
        const { code } = req.body;
        const user = await User.findOne({
            verificationToken : code,
            verificationTokenExpiresAt : { $gt : Date.now() }
        });
        if(!user){
            return next(errorHandler(400 , "Invalid or expired code"));
        }
        if(user?.verificationToken !== code){
            return next(errorHandler(400 , "Invalid or expired code"));
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();
        const {password : pass, ...rest } = user?._doc
        await sendWelcomeEmail(user?.email , user?.username);

        res.status(200).json({
            success : true,
            message : "Email Verification Successful",
            userData : rest
        })
    }catch (e) {
        return next(errorHandler(500 , "Error Verifying Email"))
    }
}

export const resendCodeEmail = async (req,res,next)=>{
    try{
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if(!user){
            return next(errorHandler(404 , "User not found please signup first"));
        }
        const newVerificationToken = generateVerificationCode();
        user.verificationToken = newVerificationToken;
        user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        await sendVerificationEmail(email , user?.verificationToken , user?.username);
        res.status(200).json({
            success : true,
            message : "Verification Code Sent On Email Successfully"
        })
    }catch (e) {
        return next(errorHandler(500 , "Error Sending Code"));
    }
}

//forgot password
export const forgotPassword = async (req, res , next)=>{
    try{
        const { email } = req.body;
        if(!email || !checkEmail(email)){
            return next(errorHandler(400 , "Invalid Email or field is empty"));
        }
        const user = await User.findOne({ email : email});
        if(!user){
            return next(errorHandler(404 , "No user exist please register"));
        }
        const resetToken = uuidv4().toString();
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();
        await sendPasswordResetEmail(user?.email , user?.username , `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success : true,
            message : "Password reset link sent to your email"
        })

    }catch (e) {
        return next(errorHandler(500, "Error in password reset mail"));
    }
}

//set new password
export const resetPassword = async (req,res , next)=>{
    try{
        const { token } = req.params;
        const { password } = req.body;

        if (!validatePassword(password).success) {
            return next(errorHandler(400, "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."))
        }

        const user = await User.findOne({
            resetPasswordToken : token,
            resetPasswordExpiresAt : { $gt : Date.now() }
        })
        if(!user){
            return next(errorHandler(400, "Invalid or expired reset token"))
        }

        const hashPassword =  bcrypt.hashSync(password , 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();
        //send the email of password reset success
        await sendPasswordResetSuccess(user?.email , user?.username);

        res.status(200).json({
            success : true,
            message : "Password reset successful"
        })
    }catch (e) {
        return next(errorHandler(500 , "Error in resetting the password"));
    }
}


//logout
export const logOut = async (req,res, next)=> {
    res.clearCookie("token").status(200).json({ success : true , message : "Logout Successfully"});
}

export const updateProfilePic = async (req, res ,next)=>{
    try{
        const { userId , email } = req.params;
        if(!userId){
            return next(errorHandler(404, "user id not found"));
        }
        const user = await User.findOne({ email : email});
        if(!user){
            return next(errorHandler(404, "user not found"));
        }
        const result = await uploadCustomImageToCloudinary(req?.file?.path);
        user.userAvatar = result?.secure_url;
        await user.save();

        const podcast = await Podcast.updateMany({ userId : userId}, {$set : {creatorImageUrl : result?.secure_url}})
        // await podcast.save();
        res.status(200).json({
            success: true,
            message : "Profile Pic Updated Successfully",
            userData : user
        })
    }catch (e) {
        console.log(e);
        return next(errorHandler(500 , "Error uploading profile pic image"));
    }
}