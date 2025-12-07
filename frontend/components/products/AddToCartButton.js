// components/products/AddToCartButton.js
'use client';
import { useState } from 'react';
import { useCart } from '../../../contexts/CartContext';
import Button from '../../ui/Button';

export default function AddToCartButton({ product, variant = 'primary' }) {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setIsAdding(true);
    
    // Simulate API call/processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart(product);
    setIsAdding(false);
    
    // You could add a toast notification here
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!product.inStock || isAdding}
      variant={variant}
      className="w-full"
    >
      {isAdding ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding...
        </>
      ) : (
        product.inStock ? 'Add to Cart' : 'Out of Stock'
      )}
    </Button>
  );
}