import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

export async function getEpisodeSummary(transcription){
    const outputSummary = await client.summarization({
        model: "facebook/bart-large-cnn",
        inputs : transcription,
        provider: "hf-inference",
    });
    return outputSummary;
}