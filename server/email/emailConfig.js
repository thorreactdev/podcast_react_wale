import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
   service : "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
    },
});

export const sender = {
    address: process.env.USER_EMAIL,
    name: "Podcast wale",
};


