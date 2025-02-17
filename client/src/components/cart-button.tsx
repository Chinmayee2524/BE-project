
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';
import { type Product } from '@shared/schema';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export function CartButton() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const handleAddToCart = (e: CustomEvent<Product>) => {
      setItems(prev => [...prev, e.detail]);
    };

    window.addEventListener('add-to-cart' as any, handleAddToCart as any);
    return () => window.removeEventListener('add-to-cart' as any, handleAddToCart as any);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {items.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end">
        <h3 className="font-medium mb-3">Shopping Cart</h3>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Your cart is empty</p>
        ) : (
          <>
            <ScrollArea className="h-[300px]">
              {items.map((item, index) => (
                <Card key={index} className="mb-2">
                  <CardContent className="p-2 flex items-center gap-2">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Checkout
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
