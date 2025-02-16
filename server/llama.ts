import { pipeline } from '@xenova/transformers';

// Initialize the model - this will download and cache the model locally
let generator: any = null;

async function initializeModel() {
  if (!generator) {
    generator = await pipeline('text-generation', 'Xenova/Llama-2-7b-chat-hf', {
      quantized: true // Use quantized model to reduce memory usage
    });
  }
  return generator;
}

export async function getRecommendations(query: string) {
  try {
    const model = await initializeModel();

    const prompt = `You are a product recommendation expert. For the query "${query}", provide eco-friendly and regular products, prioritizing sustainable alternatives. Format the response as a JSON array of products with fields: name, description, category, ecoScore (0-10), and price. Eco-friendly products should have ecoScore > 5.`;

    const result = await model(prompt, {
      max_length: 1000,
      temperature: 0.7,
      num_return_sequences: 1
    });

    // Parse the generated text as JSON
    const response = JSON.parse(result[0].generated_text);
    return response.recommendations || [];
  } catch (error) {
    console.error("Llama-2 generation error:", error);
    throw new Error("Failed to get recommendations from Llama-2");
  }
}