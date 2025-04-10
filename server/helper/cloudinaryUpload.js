import { v4 as uuidv4 } from 'uuid';
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from "streamifier";
import {errorHandler} from "../middleware/errorMiddleware.js";

export const uploadAudioToCloudinary = async (audioBuffer) => {
    return new Promise((resolve, reject) => {
        const fileName = `podcast-${uuidv4()}.mp3`;

        // Convert buffer to a readable stream
        const stream = cloudinary.uploader.upload_stream(
            {
                folder : "podcast_folder",
                resource_type: "video", // Cloudinary treats audio as "video"
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET, // Using a signed preset
                public_id: fileName, // Set custom filename

            },
            (error, result) => {
                if (error) {
                    console.error("Error uploading audio to Cloudinary:", error);
                    return reject(new Error("Audio upload failed."));
                }
                resolve({
                    audioUrl: result.secure_url,
                    audioStorageId: result.public_id,
                });
            }
        );
        // Pipe the buffer into the Cloudinary upload stream
        streamifier.createReadStream(audioBuffer).pipe(stream);
    });
};

export const uploadImageToCloudinary = async (imageBuffer) => {
    return new Promise((resolve, reject) => {
        const fileName = `image-${uuidv4()}.png`;

        const stream = cloudinary.uploader.upload_stream(
            {
                folder : "podcast_folder",
                resource_type: "image",
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                public_id: fileName,

            },
            (error, result) => {
                if (error) {
                    console.error("Error uploading image to Cloudinary:", error);
                    return reject(new Error("Image upload failed."));
                }
                resolve({
                    imageUrl: result.secure_url,
                    imageStorageId: result.public_id,
                });
            }
        );

        streamifier.createReadStream(imageBuffer).pipe(stream);
    });
};

export const uploadCustomImageToCloudinary = async (filePath) => {
    try{
        const fileName = `custom-${uuidv4()}.png`;
        const result = await cloudinary.uploader.upload(filePath, {
            folder : "podcast_folder",
            resource_type : "image",
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            filename_override : fileName
        });
        return result;
    }catch (e){
        console.log(e);

    }

}
