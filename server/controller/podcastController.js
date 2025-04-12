import {errorHandler} from "../middleware/errorMiddleware.js";
import Podcast from "../schema/podcastSchema.js";
import NodeCache from "node-cache";
import User from "../schema/userSchema.js";

const cache = new NodeCache({stdTTL : 300});


export async function createPodcast(req, res, next) {
    try {
        const {
            userId,
            podcastTitle,
            podcastDescription,
            voicePrompt,
            imagePrompt,
            audioDuration,
            audioStorageId,
            audioUrl,
            imageStorageId,
            imageUrl,
            podcastCreator,
            creatorEmail,
            voiceId,
            voiceName,
            category,
            creatorImageUrl
        } = req.body;
        if (!userId || !podcastTitle || !voicePrompt || !podcastDescription || !imageStorageId || !audioUrl || !imageUrl || !audioStorageId || !audioDuration || !podcastCreator || !creatorEmail || !voiceId || !voiceName) {
            return next(errorHandler(404, "Missing required parameter check all the fields"));
        }
        if (podcastTitle?.length < 5 || podcastTitle?.length > 200) {
            return next(errorHandler(400, "Title must be of min 5 character and max 150 char"));
        }
        if (podcastDescription.length < 30 || podcastDescription?.length > 600) {
            return next(errorHandler(400, "Description must be of min 5 character and max 500 char"));
        }

        const user = await User.findById(userId);
        if(!user){
            return next(errorHandler(404 , "user not found"));
        }

        if(!user?.isSubscribed && user?.credits <=0){
            return next(errorHandler(403 , "You have no credits left. Please subscribe to create more podcasts."))
        }

        const newPodcast = new Podcast({
            userId,
            podcastTitle,
            podcastDescription,
            voicePrompt,
            imagePrompt,
            audioDuration,
            audioStorageId,
            audioUrl,
            imageStorageId,
            imageUrl,
            podcastCreator,
            creatorEmail,
            voiceId,
            voiceName,
            category,
            creatorImageUrl
        });
        await newPodcast.save();

        if(!user.isSubscribed){
         user.credits -= 1
         await user.save();
        }

        res.status(201).json({
            success: true,
            message: "Podcast created successfully",
            podcastData: newPodcast,
            userData : user,
        });
    } catch (e) {

        return next(errorHandler(500, "Error Creating Podcast"));
    }
}

export async function getAllPodcast(req,res, next){
    try{
        const podcastData = await Podcast.find();
        if(!podcastData){
            return next(errorHandler(404, "Sorry , no podcast found"));
        }
        res.status(200).json({ success : true , message : "Podcast fetched successfully" , podcastData : podcastData});
    }catch (e){
        return next(errorHandler(500 , "Internal server error"));
    }
}

export async function userEditPodcast(req,res,next){
    try{
        //add another check here after verifying the user from jwt
        const { podcastID , userID } = req.params;
        if(!userID){
            return next(errorHandler(404, "No user found"));
        }
        if(!podcastID){
            return next(errorHandler(400 , "Cannot edit the podcast"));
        }
        const updatedPodcastData = req.body;
        const findAndUpdatePodcast = await Podcast.findByIdAndUpdate(podcastID, updatedPodcastData, {new : true});
        if(!findAndUpdatePodcast){
            return next(errorHandler(400 , "Podcast not updated seems error"));
        }
        res.status(200).json({
            success: true,
            message : "Podcast updated Successfully",
            podcastData : findAndUpdatePodcast
        })
    }catch (e) {
        return next(errorHandler(500, "Error editing podcast"));
    }
}

export async function singleUserPodcast(req, res , next){
    try{
        const { userId } = req.params;
        if(!userId){
            return next(errorHandler(404, "No user Id found"));
        }
        const getSingleUserPodcast = await Podcast.find({ userId:  userId});
        if(!getSingleUserPodcast){
            return next(errorHandler(404, "No podcast found"));
        }
        res.status(200).json({
            success:true,
            message : "Podcast fetched successfully",
            podcastData : getSingleUserPodcast
        })
    }catch (e){
        return next(errorHandler(500 , "Error user Podcast"));
    }
}

export async function getSinglePodcast(req, res , next){
    try{
        //add another check here after verifying the user from jwt
        const { podcastID } = req.params;
        if(!podcastID){
            return next(errorHandler(404, "No podcast id found"));
        }
        const getSinglePodcastDetails = await Podcast.findById(podcastID);
        if(!getSinglePodcastDetails){
            return next(errorHandler(404 , "No Podcast Found"));
        }
        res.status(200).json({
            success:true,
            message : "Single Podcast fetched",
            podcastData : getSinglePodcastDetails
        });
    }catch (e) {
        return next(errorHandler(500, "Error getting single Podcast"));
    }
}

export async function getSimilarPodcast(req, res , next){
    try{
        const { podcastId } = req.params;
        let { page =1 , limit = 4} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const currentPodcast = await Podcast.findById(podcastId);
        if(!currentPodcast){
            return next(errorHandler(404, "No current Podcast found"));
        }

        const cacheKey = `similar_${currentPodcast.podcastCreator}_page_${page}`;
        if(cache.has(cacheKey)){
            return res.status(200).json({
                success : true,
                message: "Similar Podcast Found (Cached)",
                podcastData: cache.get(cacheKey),
            })
        }
        

        //fetch only ids 
        const similarPodcast = await Podcast.find({
            voiceName: currentPodcast?.voiceName,
            _id : { $ne : podcastId} }, {_id : 1}
        );

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const selectedPodcastIds = similarPodcast?.slice(startIndex, endIndex);
    
        if (selectedPodcastIds.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Similar Podcasts Found",
            });
        }
        const selectedPodcast = await Podcast.find({ _id : selectedPodcastIds })

        cache.set(cacheKey , selectedPodcast);
        res.status(200).json({
            success:true,
            message : 'Similar Podcast Found',
            podcastData : selectedPodcast
        })
    }catch (e) {
        return next(errorHandler(500, "Internal Server Error"));
    }
}

export async function getTopPodcaster(req, res , next){
    try{
        const topPodcaster = await Podcast.aggregate([
            {
                $group : {
                    _id : "$podcastCreator",
                    totalViews : { $sum : "$views"},
                    totalPodcasts: { $sum: 1 }
                },

            },
            { $sort : { totalViews : -1 }},
            {$limit : 5},
        ]);
        const podcastsByPodcaster = await Promise.all(
            topPodcaster.map(async (name) => {
              const podcasts = await Podcast.find({ podcastCreator: name?._id })
                .sort({ views: -1 }) // Sort by views (most popular first)
                .limit(2); // Fetch only 2 podcasts per podcaster
                return podcasts;
            })
          );
    res.status(200).json({success : true , message: "top podcaster fetched success" , topOne : podcastsByPodcaster, topPodcasterView : topPodcaster})
    }catch(e){
        return next(errorHandler(500, "Internal Server Error"));
    }
}

export async function getAllPodcastDiscoverWithSearchFilter(req, res , next) {
    try{
        let { page , limit=8 , searchTerm } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page-1) * limit;
        const query = searchTerm ? {
            $or : [
                {podcastTitle : {$regex : searchTerm, $options :"i"}},
                {podcastDescription : {$regex : searchTerm , $options : "i"}},
                {voiceName : {$regex : searchTerm, $options : "i"}},
                {podcastCreator : {$regex : searchTerm, $options : "i"}}
            ]
        } : {};

        const podcasts = await Podcast.find(query).skip(skip).limit(limit);
        if(!podcasts){
            return next(errorHandler(404 , "No podcast found"));
        }
        const totalPodcasts = await Podcast.countDocuments(query);
        res.status(200).json({
            success : true,
            totalPodcasts,
            podcastData : podcasts,
            totalPages : Math.ceil(totalPodcasts / limit)
        });
    }catch(e){
        return next(errorHandler(500 , "Internal Server Error"));
    }
    
}

export async function getLatestPodcast(req, res, next){
    try{
        const latestPodcast = await Podcast.find({}).sort({ createdAt : -1}).limit(6);
        if(!latestPodcast){
            return next(errorHandler(404 , "No Latest Podcast Found"));
        }
        res.status(200).json({
            success : true ,
            message : "Latest Podcast fetched",
            podcastData : latestPodcast
        })

    }catch(e){
        return next(errorHandler(500 , "Internal Server Error"));
    }

}

export async function getPopularPodcast(req, res , next) {
    try{
        const getPopularPodcastData = await Podcast.find({}).sort({ views : -1}).limit(10);
        if(!getPopularPodcastData){
            return next(errorHandler(404 , "No Popular Podcast Found"));
        }
        res.status(200).json({
            success : true,
            message : "Popular Podcast Found",
            podcastData : getPopularPodcastData
        });
    }catch(e){
        return next(errorHandler(500 , "Internal Server Error"));
    }
}

export async function checkUserCredit(req, res , next){
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return next(errorHandler(404 , "User Not Found"));
        }
        if(user?.credits <=0){
            return next(errorHandler(403 , "You have no credits left. Please subscribe to create more podcasts."))
        }

        res.status(200).json({
            success : true,
            message : "credits found",
            credits : user?.credits
        })

    }catch(e){
        return next(errorHandler(500 , "Internal Server Error"));
    }

}