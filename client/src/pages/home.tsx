import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { LoadingResults } from "@/components/loading-results";
import { type Product } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery],
    queryFn: () =>
      fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json()),
    enabled: searchQuery.length > 0,
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">
            Eco-Friendly Product Finder
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search for sustainable alternatives to everyday products. Our AI-powered system will help you make environmentally conscious choices.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="mt-12">
          {isLoading ? (
            <LoadingResults />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center text-muted-foreground">
              No products found. Try a different search term.
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Enter a search term to find eco-friendly products
            </div>
          )}
        </div>
      </main>
    </div>
  );
}