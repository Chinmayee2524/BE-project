import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
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
      // Use enhanced local search functionality
      const products = await storage.searchProducts(q);
      res.json(products);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  return httpServer;
}