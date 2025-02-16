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

    console.log("Generating recommendations with prompt:", prompt);

    const result = await model(prompt, {
      max_length: 1000,
      temperature: 0.7,
      num_return_sequences: 1
    });

    console.log("Raw model response:", result[0].generated_text);

    try {
      // Parse the generated text as JSON, with fallback
      const text = result[0].generated_text || '';
      const jsonStart = text.indexOf('{');
      if (jsonStart === -1) {
        console.error("No JSON object found in response");
        throw new Error("Invalid response format - no JSON found");
      }

      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.slice(jsonStart, jsonEnd);
      console.log("Extracted JSON string:", jsonStr);

      const response = JSON.parse(jsonStr);

      if (!response.recommendations || !Array.isArray(response.recommendations)) {
        console.error("Invalid response structure:", response);
        throw new Error("Invalid response format - missing recommendations array");
      }

      return response.recommendations;
    } catch (parseError) {
      console.error("Failed to parse Llama response:", parseError);
      // Return an empty array to trigger the fallback to local search
      return [];
    }
  } catch (error) {
    console.error("Llama generation error:", error);
    // Return an empty array to trigger the fallback to local search
    return [];
  }
}