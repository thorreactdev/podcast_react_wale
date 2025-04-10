import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    userAvatar : {
        type : String,
        default : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    credits : {
        type : Number,
        default : 2
    },
    isSubscribed : {
        type : Boolean,
        default : false
    },
    isGoogleLogin : Boolean,
    isGithubLogin : Boolean,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
} , { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;