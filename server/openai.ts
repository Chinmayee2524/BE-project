import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export async function getRecommendations(query: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }

    const result = JSON.parse(response.choices[0].message.content);
    return result.recommendations;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get recommendations");
  }
}