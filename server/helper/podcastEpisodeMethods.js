import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

export async function getEpisodeSummary(transcription) {
  const outputSummary = await client.summarization({
    model: "facebook/bart-large-cnn",
    inputs: transcription,
    provider: "hf-inference",
  });
  return outputSummary;
}

export async function getAnswerOfQuestion(question) {
  const chatCompletion = await client.chatCompletion({
    provider: "nebius",
    model: "mistralai/Mistral-Nemo-Instruct-2407",
    messages: [
      {
        role: "user",
        content: question,
      },
    ],
    max_tokens: 512,
  });
  return chatCompletion?.choices[0]?.message?.content;
}

export async function getTweetedResponse(context) {
  const prompt = `Generate a short 2-tweet thread summarizing the key ideas from this podcast. Include relevant and popular hashtags related to the topic in each tweet. Content:${context}`;
  const outputResponse = await client.chatCompletion({
    model: "meta-llama/Llama-3.3-70B-Instruct",
    messages: [
        {
            role: "user",
            content: prompt
        },
    ],
    provider: "fireworks-ai",
  });
  return outputResponse?.choices[0]?.message?.content
}
