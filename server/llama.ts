
import { pipeline } from '@xenova/transformers';

// Initialize the model - this will download and cache the model locally
let generator: any = null;

async function initializeModel() {
  if (!generator) {
    generator = await pipeline('text-generation', 'Xenova/Llama-2-7b-chat', {
      quantized: true // Use quantized model to reduce memory usage
    });
  }
  return generator;
}

export async function getRecommendations(query: string) {
  try {
    const model = await initializeModel();

    const prompt = `[INST] Generate eco-friendly product recommendations for: ${query}
    Return a JSON array of products. Each product should have:
    - name: product name
    - description: brief description
    - category: product category
    - ecoScore: number from 0-10 (eco-friendly > 5)
    - price: estimated price in USD [/INST]`;

    console.log("Generating recommendations with prompt:", prompt);

    const result = await model(prompt, {
      max_length: 1000,
      temperature: 0.7,
      num_return_sequences: 1
    });

    console.log("Raw model response:", result[0].generated_text);

    try {
      const text = result[0].generated_text.split('[/INST]')[1] || '';
      const jsonStart = text.indexOf('{');
      if (jsonStart === -1) {
        throw new Error("No JSON object found in response");
      }

      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.slice(jsonStart, jsonEnd);
      const response = JSON.parse(jsonStr);

      if (!response.recommendations || !Array.isArray(response.recommendations)) {
        throw new Error("Invalid response format - missing recommendations array");
      }

      return response.recommendations;
    } catch (parseError) {
      console.error("Failed to parse Llama response:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Llama generation error:", error);
    return [];
  }
}
