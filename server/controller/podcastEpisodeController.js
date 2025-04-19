
import { getAnswerOfQuestion, getEpisodeSummary } from "../helper/podcastEpisodeMethods.js";
import { errorHandler } from "../middleware/errorMiddleware.js";
import FAQ from "../schema/faqSchema.js";

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

export async function askQuestion(req, res , next){
    try{
      const { question , episodeId } = req.body;
        if(!question || !episodeId){
            return next(errorHandler(400 , "Question and episodeId  are required"));
        }
        
        const existingFAQ = await FAQ.findOne({ question, episodeId});
        if(existingFAQ){
            existingFAQ.askedCount +=1;
            existingFAQ.lastAskedAt = Date.now();
            await existingFAQ.save();
            return res.status(200).json({
                success : true,
                message : "Question asked successfully",
                faqData : existingFAQ?.answer,
                fromCache : true
            })
        }

        const getAnswer = await getAnswerOfQuestion(question);
        if(!getAnswer){
            return next(errorHandler(500 , "Error in getting answer of question"));
        }

        const newFaq = new FAQ({ question , answer : getAnswer, episodeId });
        await newFaq.save();
        res.status(200).json({
            success : true,
            message : "Question asked successfully",
            faqData : newFaq?.answer,
            fromCache : false
        });
    }catch(e){
        return next(errorHandler(500 , "Error in asking question"));
    }

}

export async function getMoskedAskedFAQ(req, res , next){
    try{
      const { episodeId } = req.params;
      if(!episodeId){
        return next(errorHandler(400 , "episodeId is required"));
      }
      const mostAskedFAQ = await FAQ.find({ episodeId }).sort({ askedCount : -1 }).limit(5);
      if(!mostAskedFAQ || mostAskedFAQ.length === 0){
        return next(errorHandler(404 , "No FAQ found"));
      }

      res.status(200).json({
        success : true,
        message : "Most asked FAQ fetched successfully",
        mostAskedFAQ
      })
    }catch(e){
        return next(errorHandler(500 , "Error in getting most asked FAQ"));
    }

}