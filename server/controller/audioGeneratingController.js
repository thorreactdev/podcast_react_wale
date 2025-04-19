import {errorHandler} from "../middleware/errorMiddleware.js";
import dotenv from "dotenv";
import {ElevenLabsClient} from "elevenlabs";
import {
    uploadAudioToCloudinary,
    uploadCustomImageToCloudinary,
    uploadImageToCloudinary
} from "../helper/cloudinaryUpload.js";
dotenv.config();

const client = new ElevenLabsClient({
    apiKey : process.env.ELEVEN_LABS_API_KEY
});

const VOICE_ID = "9BWtsMINqrJLrRacOk9x"
const REQUIRED_PREFIX = "Hello listeners, welcome to the new podcast.";

async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

export async function generateAudioFromElevenLabs(req, res , next){
    try{
        let { voicePrompt , voiceId } = req.body;
        if(!voicePrompt){
            return next(errorHandler(400 , "provide text to generate audio"));
        }
        if(!voiceId){
            return next(errorHandler(400 , "Please select the voice first"));
        }
        // if(voicePrompt?.length > 1800 || voicePrompt?.length < 500){
        //     return next(errorHandler(400, "text Char min 500 and max 1800"));
        // }
        if(!voicePrompt?.toLowerCase()?.startsWith(REQUIRED_PREFIX.toLowerCase())){
            voicePrompt = `${REQUIRED_PREFIX} ${voicePrompt}`
        }
        const mp3Response = await client.textToSpeech.convertAsStream(voiceId,{
            output_format : "mp3_44100_128",
            text : voicePrompt,
            model_id: "eleven_multilingual_v2"
        })
        const audioBuffer = await streamToBuffer(mp3Response);
        if(!audioBuffer){
            return next(errorHandler(500 , "some error from backend in audio buffer"));
        }
        //call the cloudinary audio upload
        const { audioUrl , audioStorageId } = await uploadAudioToCloudinary(audioBuffer);
        if(!audioUrl || !audioStorageId){
            return next(errorHandler(500 , "error in generating audio url"));
        }

        res.status(200).json({
            success: true,
            message : "Podcast file generated successfully",
            audioFileData : {
                audioUrl,
                audioStorageId
            }
        });

    }catch (e) {
      console.log(e);
      return next(errorHandler(500 , "Error Generating Audio"));
    }
}

export async function generateImageFromClickDrop(req, res, next){
    try{
        const { imagePrompt } = req.body;
        if(!imagePrompt){
            return next(errorHandler(400 , "No image prompt provided"));
        }
        if(imagePrompt?.length > 800){
            return next(errorHandler(500 , "Image prompt should not be greater than 800 character"));
        }
        const formData = new FormData();
        formData.append("prompt", imagePrompt);
        const response = await fetch("https://clipdrop-api.co/text-to-image/v1",{
            method : "POST",
            headers : {
                "x-api-key" : process.env.CLICKDROP_API_KEY
            },
            body: formData
        });
        if(!response.ok){
            const errorData = await response.json();
            return next(errorHandler(500, errorData));
        }
        const imageBuffer = await response.arrayBuffer()
        if(!imageBuffer){
            return next(errorHandler(500, "Error in generating buffer"));
        }
        const { imageUrl , imageStorageId } = await uploadImageToCloudinary(Buffer.from(imageBuffer));
        if(!imageUrl || !imageStorageId){
            return next(errorHandler(500, "Error generating image url"));
        }

        res.json({
            success: true,
            message : "Podcast image generated successfully",
            imageFileData : {
                imageUrl,
                imageStorageId
            }
        });
    }catch (e) {
        return next(errorHandler(500 , "Error Generating Image"));
    }
}

export async function uploadCustomImage(req, res , next){
    try {
        const result = await uploadCustomImageToCloudinary(req?.file?.path);
        if(!result){
            return next(errorHandler(500 ,"Error in getting results"));
        }
        res.status(200).json({
            success: true,
            message : "file uploaded successfully",
            customFileData : {
                imageUrl : result.secure_url,
                imageStorageId : result.public_id
            }
        })
    }catch (e) {
        return next(errorHandler(500 , "Error uploading custom image file"));
    }

}