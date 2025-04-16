
import { getEpisodeSummary } from "../helper/podcastEpisodeMethods.js";
import { errorHandler } from "../middleware/errorMiddleware.js";

export async function generateSummaryOfTranscription(req, res , next) {
    try{
       const { transcription } = req.body;
       if(!transcription){
        return next(errorHandler(400 , "Transcription is required"));
       }

       const getSummary = await getEpisodeSummary(transcription);
        if(!getSummary){
          return next(errorHandler(500 , "Error in generating summary of transcription"));
        }

        res.status(200).json({
            success : true,
            message : "Summary generated successfully",
            summaryData : getSummary?.summary_text
        })
    }catch(e){
        console.log(e);
        return next(errorHandler(500 , "Error in generating summary of transcription"));
    }
    
}