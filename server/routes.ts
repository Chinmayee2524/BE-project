import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { getRecommendations } from "./openai";
import { insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/search", async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    try {
      const recommendations = await getRecommendations(q);
      const products = recommendations.map(rec => ({
        ...rec,
        id: Math.random() * 1000000,
        imageUrl: `https://placehold.co/400x300/green/white?text=${encodeURIComponent(rec.name)}`
      }));

      for (const product of products) {
        const validated = insertProductSchema.parse(product);
        await storage.createProduct(validated);
      }

      res.json(products);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  return httpServer;
}
