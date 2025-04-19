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

export async function getAnswerOfQuestion(question){
    console.log("question", question);
    const chatCompletion = await client.chatCompletion({
        provider: "nebius",
        model : "mistralai/Mistral-Nemo-Instruct-2407",
        messages : [
           { 
            role : "user",
            content : question
           }
        ],
        max_tokens: 512,
    });
    return chatCompletion?.choices[0]?.message?.content;
}