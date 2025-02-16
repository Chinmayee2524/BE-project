import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { getRecommendations } from "./llama";
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
        if (recommendations && recommendations.length > 0) {
          products = recommendations.map((rec: any) => ({
            ...rec,
            id: Math.floor(Math.random() * 1000000),
            imageUrl: `https://placehold.co/400x300/${rec.ecoScore > 5 ? 'green' : 'gray'}/white?text=${encodeURIComponent(rec.name)}`,
            ecoScore: Math.max(0, Math.min(10, rec.ecoScore))
          }));

          // Process the Llama-2 generated products
          products = products.map((product: any) => ({
            ...product,
            id: Math.floor(Math.random() * 1000000),
            imageUrl: `https://placehold.co/400x300/${product.ecoScore > 5 ? 'green' : 'gray'}/white?text=${encodeURIComponent(product.name)}`,
            ecoScore: Math.max(0, Math.min(10, product.ecoScore))
          }));
        } else {
          console.log("No recommendations from OpenAI, falling back to local search");
          products = await storage.searchProducts(q);
        }
      } catch (error) {
        // If OpenAI fails, fall back to local search
        console.log("OpenAI search failed, falling back to local search:", error);
        products = await storage.searchProducts(q);
      }

      res.json(products);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  return httpServer;
}