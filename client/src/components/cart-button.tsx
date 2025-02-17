
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ShoppingBag } from 'lucide-react';
import { type Product } from '@shared/schema';

export function CartButton() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const handleAddToCart = (e: CustomEvent<Product>) => {
      setItems(prev => [...prev, e.detail]);
    };

    window.addEventListener('add-to-cart' as any, handleAddToCart as any);
    return () => window.removeEventListener('add-to-cart' as any, handleAddToCart as any);
  }, []);

  return (
    <Button variant="ghost" className="relative">
      <ShoppingBag className="h-5 w-5" />
      {items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {items.length}
        </span>
      )}
    </Button>
  );
}
