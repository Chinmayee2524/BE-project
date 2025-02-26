import { type Product } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const isEcoFriendly = product.ecoScore > 5;
  const isIndianProduct = product.category === "Indian Products";

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isEcoFriendly ? 'border-green-500 border-2' : ''}`}>
      <CardHeader className="p-0 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {isEcoFriendly && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500 text-white">Eco-Friendly</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <Badge 
            variant={isEcoFriendly ? "secondary" : "outline"} 
            className={`flex items-center gap-1 ${isEcoFriendly ? 'bg-green-100' : ''}`}
          >
            <Leaf className="h-3 w-3" />
            {product.ecoScore.toFixed(1)}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">${product.price.toFixed(2)}</span>
            <Badge variant="outline">{product.category}</Badge>
          </div>
          {isIndianProduct && (
            <Button variant="outline" className="mt-2" onClick={() => setShowPrompt(true)}>
              Shop Indian Products
            </Button>
          )}
          {showPrompt && (
            <div className="mt-2 p-4 bg-gray-100 rounded-md">
              <p className="text-sm">
                Explore our curated selection of Indian products! Discover authentic flavors, traditional crafts, and unique treasures from India.
              </p>
            </div>
          )}
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }))}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
