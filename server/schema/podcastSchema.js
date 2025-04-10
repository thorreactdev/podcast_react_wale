import mongoose from "mongoose";

const PodcastSchema = new mongoose.Schema({
    userId : { type : String , required : true , ref : "User"},
    podcastTitle: { type: String, required: true },
    podcastDescription: { type: String, required: true },
    voicePrompt: { type: String, required: true },
    audioStorageId: { type: String },
    audioUrl: { type: String },
    audioDuration: { type: Number }, // Store in seconds
    imagePrompt: { type: String },
    imageStorageId: { type: String },
    imageUrl: { type: String },
    podcastCreator : { type: String , required: true },
    creatorEmail : {type: String , required: true },
    views : { type : Number , default: 0 },
    voiceId : { type : String , required: true },
    voiceName : { type : String , default : "daniel"},
    category : {type : String , default : "motivation"},
    creatorImageUrl : {type : String}
}, {timestamps: true});

const Podcast = mongoose.model("Podcast", PodcastSchema);
export default Podcast;
