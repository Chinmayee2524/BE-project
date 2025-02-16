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
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const storage = new MemStorage();