import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { getRecommendations } from "./openai";
import { insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    // Sort products by ecoScore in descending order
    const sortedProducts = products.sort((a: any, b: any) => b.ecoScore - a.ecoScore);
    res.json(sortedProducts);
  });

  app.get("/api/products/search", async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    try {
      // First try to get recommendations from OpenAI
      let products = [];
      try {
        const recommendations = await getRecommendations(q);
        products = recommendations.map((rec: any) => ({
          ...rec,
          id: Math.floor(Math.random() * 1000000),
          imageUrl: `https://placehold.co/400x300/green/white?text=${encodeURIComponent(rec.name)}`,
          ecoScore: Math.max(0, Math.min(10, rec.ecoScore))
        }));
      } catch (error) {
        // If OpenAI fails, fall back to local search
        console.log("OpenAI search failed, falling back to local search");
        products = await storage.searchProducts(q);
      }

      // Sort products by ecoScore to ensure eco-friendly products appear first
      const sortedProducts = products.sort((a: any, b: any) => b.ecoScore - a.ecoScore);

      // Store new products if we got them from OpenAI
      if (products.length > 0) {
        for (const product of sortedProducts) {
          try {
            const validated = insertProductSchema.parse(product);
            await storage.createProduct(validated);
          } catch (error) {
            console.error("Failed to store product:", error);
            // Continue with other products if one fails
          }
        }
      }

      res.json(sortedProducts);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  return httpServer;
}