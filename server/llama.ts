import { pipeline } from '@xenova/transformers';

// Initialize the model - this will download and cache the model locally
let generator: any = null;

async function initializeModel() {
  if (!generator) {
    // Using a smaller, publicly available model
    generator = await pipeline('text-generation', 'Xenova/distilgpt2', {
      quantized: true // Use quantized model to reduce memory usage
    });
  }
  return generator;
}

export async function getRecommendations(query: string) {
  try {
    const model = await initializeModel();

    const prompt = `Generate eco-friendly product recommendations for: ${query}
    Return a JSON array of products. Each product should have:
    - name: product name
    - description: brief description
    - category: product category
    - ecoScore: number from 0-10 (eco-friendly > 5)
    - price: estimated price in USD
    Example: {"recommendations": [{"name": "Bamboo Water Bottle", "description": "Sustainable bottle", "category": "Kitchen", "ecoScore": 8.5, "price": 24.99}]}`;

    const result = await model(prompt, {
      max_length: 1000,
      temperature: 0.7,
      num_return_sequences: 1
    });

    try {
      // Parse the generated text as JSON, with fallback
      const text = result[0].generated_text || '';
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.slice(jsonStart, jsonEnd);
      const response = JSON.parse(jsonStr);
      return response.recommendations || [];
    } catch (parseError) {
      console.error("Failed to parse Llama response:", parseError);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Llama generation error:", error);
    throw new Error("Failed to get recommendations");
  }
}