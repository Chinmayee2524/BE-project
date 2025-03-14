import { type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private currentId: number;

  constructor() {
    this.products = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Bamboo Water Bottle",
        description: "Sustainable bamboo water bottle with stainless steel interior",
        ecoScore: 9.5,
        category: "Drinkware",
        imageUrl: "https://placehold.co/400x300/green/white?text=Bamboo+Bottle",
        price: 24.99
      },
      {
        name: "Recycled Cotton Tote",
        description: "Durable tote bag made from 100% recycled cotton",
        ecoScore: 9.0,
        category: "Bags",
        imageUrl: "https://placehold.co/400x300/green/white?text=Cotton+Tote",
        price: 19.99
      },
      {
        name: "Plastic Water Bottle",
        description: "Standard reusable water bottle made from BPA-free plastic",
        ecoScore: 4.5,
        category: "Drinkware",
        imageUrl: "https://placehold.co/400x300/gray/white?text=Plastic+Bottle",
        price: 12.99
      },
      {
        name: "Steel Water Bottle",
        description: "Durable stainless steel water bottle with vacuum insulation",
        ecoScore: 7.5,
        category: "Drinkware",
        imageUrl: "https://placehold.co/400x300/green/white?text=Steel+Bottle",
        price: 29.99
      },
      {
        name: "Canvas Shopping Bag",
        description: "Reusable shopping bag made from organic canvas",
        ecoScore: 8.5,
        category: "Bags",
        imageUrl: "https://placehold.co/400x300/green/white?text=Canvas+Bag",
        price: 15.99
      },
      {
        name: "Bamboo Cutlery Set",
        description: "Portable bamboo utensils set with carrying case",
        ecoScore: 9.2,
        category: "Kitchen",
        imageUrl: "https://placehold.co/400x300/green/white?text=Bamboo+Cutlery",
        price: 18.99
      },
      {
        name: "Plastic Cutlery Set",
        description: "Reusable plastic utensils for everyday use",
        ecoScore: 4.0,
        category: "Kitchen",
        imageUrl: "https://placehold.co/400x300/gray/white?text=Plastic+Cutlery",
        price: 9.99
      },
      {
        name: "Solar Power Bank",
        description: "10000mAh portable charger with solar charging capability",
        ecoScore: 8.8,
        category: "Electronics",
        imageUrl: "https://placehold.co/400x300/green/white?text=Solar+Bank",
        price: 45.99
      },
      {
        name: "Regular Power Bank",
        description: "Standard 10000mAh portable battery pack",
        ecoScore: 3.5,
        category: "Electronics",
        imageUrl: "https://placehold.co/400x300/gray/white?text=Power+Bank",
        price: 29.99
      },
      {
        name: "Bamboo Toothbrush",
        description: "Biodegradable toothbrush with bamboo handle",
        ecoScore: 9.7,
        category: "Personal Care",
        imageUrl: "https://placehold.co/400x300/green/white?text=Bamboo+Brush",
        price: 4.99
      },
      {
        name: "Plastic Toothbrush",
        description: "Regular plastic toothbrush",
        ecoScore: 2.0,
        category: "Personal Care",
        imageUrl: "https://placehold.co/400x300/gray/white?text=Plastic+Brush",
        price: 2.99
      },
      {
        name: "Recycled Paper Notebook",
        description: "100% recycled paper notebook with seed paper cover",
        ecoScore: 9.3,
        category: "Stationery",
        imageUrl: "https://placehold.co/400x300/green/white?text=Eco+Notebook",
        price: 12.99
      },
      {
        name: "Regular Notebook",
        description: "Standard spiral notebook",
        ecoScore: 3.0,
        category: "Stationery",
        imageUrl: "https://placehold.co/400x300/gray/white?text=Notebook",
        price: 7.99
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    const products = Array.from(this.products.values());

    // Score each product based on relevance
    const scoredProducts = products.map(product => {
      let score = 0;

      // Exact matches in name
      if (product.name.toLowerCase().includes(lowercaseQuery)) {
        score += 10;
      }

      // Matches in description
      if (product.description.toLowerCase().includes(lowercaseQuery)) {
        score += 5;
      }

      // Matches in category
      if (product.category.toLowerCase().includes(lowercaseQuery)) {
        score += 8;
      }

      // Boost eco-friendly products
      if (product.ecoScore > 5) {
        score += 5;
      }

      return { product, score };
    });

    // Filter products with any relevance and sort by score
    return scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => {
        // First sort by score
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // Then by ecoScore for items with same relevance
        return b.product.ecoScore - a.product.ecoScore;
      })
      .map(item => item.product);
  }
}

export const storage = new MemStorage();