import jwt from "jsonwebtoken";
import { errorHandler} from "./errorMiddleware.js"

export async function authChecker(req, res, next) {
    try{
        const token = req?.cookies?.token;
        jwt.verify(token , process.env.JWT_SECRET , (err , user)=>{
            if(err){
                if(err.name === "TokenExpiredError"){
                    return next(errorHandler(401 , "Token expired, Please login again"));
                }
                if(err.name === "JsonWebTokenError"){
                    return next(errorHandler(401 , "Invalid or malformed token, please login again"));
                }
            }
            req.user = user;
            next();
        })

    }catch(err){
        return next(errorHandler(500 , "Internal Server Error"));
    }

}