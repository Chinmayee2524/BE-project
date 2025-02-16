import { type Product } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isEcoFriendly = product.ecoScore > 5;

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
        <div className="flex justify-between items-center">
          <span className="text-primary font-medium">${product.price.toFixed(2)}</span>
          <Badge variant="outline">{product.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}