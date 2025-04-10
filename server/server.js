//import statements
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';
dotenv.config();

//import route statement
import authRoute from "./router/authRouter.js";
import podcastRoute from "./router/podcastRouter.js";
import protectedRoute from "./router/protectedRouter.js";




//database connection with mongoDB
mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING).then(()=>{
    console.log("MongoDB Connected");
}).catch((err)=>{console.log(err)});
const __dirname = path.resolve();

const PORT = process.env.PORT || 6000;
const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(cors());


//routes declaration all are here
app.use("/api", authRoute);
app.use("/api" , podcastRoute);
app.use("/api", protectedRoute);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

//error middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

