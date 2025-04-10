import {errorHandler} from "../middleware/errorMiddleware.js";
import User from "../schema/userSchema.js";

export const checkUsernameAvailability = async (req, res, next) => {
    try {
        const { username } = req.body;
        // Query the database to check if the username already exists
        const isUserNameTaken = await User.exists({ username });
        if (isUserNameTaken) {
            return next(errorHandler(409, "Username already taken, try a different one"));
        }
        // Proceed if username is available
        next();
    } catch (error) {
        // Handle any potential errors
        next(errorHandler(500, "An error occurred while checking username availability"));
    }
};

export const checkEmail = (email)=>{
    let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    return regex.test(email);
}

export const validatePassword = (password) => {
    if (password.length < 8) {
        return { success: false, message: "Password must be at least 8 characters long" };
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return { success: false, message: "Password must contain at least one uppercase, one lowercase, one digit, and one special character" };
    }
    return { success: true };
};


export const checkExistingUser = async (email)=>{
    const userExists = await User.findOne({ email });
    return userExists;
};
