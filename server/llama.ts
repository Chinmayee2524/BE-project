import { PerplexityAI } from "@perplexity/web-api";

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error("PERPLEXITY_API_KEY environment variable is required");
}

const perplexity = new PerplexityAI(process.env.PERPLEXITY_API_KEY);

export async function getRecommendations(query: string) {
  try {
    const response = await perplexity.chat.completions.create({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: "You are a product recommendation expert. For each query, provide a mix of eco-friendly and regular products, with eco-friendly alternatives appearing first. For eco-friendly products, analyze sustainability and provide an ecoScore (0-10). For regular products, assign a lower ecoScore (0-5). Return a JSON array of mixed product recommendations with name, description, category, ecoScore, and estimated price."
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.2,
      top_p: 0.9,
      return_images: false,
      return_related_questions: false
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in Llama-2 response");
    }

    const result = JSON.parse(response.choices[0].message.content);
    return result.recommendations;
  } catch (error) {
    console.error("Llama-2 API error:", error);
    throw new Error("Failed to get recommendations");
  }
}
