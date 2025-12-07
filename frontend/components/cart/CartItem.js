// components/cart/CartItem.js
'use client';
import Image from 'next/image';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  // Safe dimension display handling
  const renderDimensions = () => {
    if (!item.dimensions) return null;
    
    try {
      // If dimensions is a string, display as is
      if (typeof item.dimensions === 'string') {
        return <p className="text-sm text-gray-500">{item.dimensions}</p>;
      }
      
      // If dimensions is an object, format it properly
      if (typeof item.dimensions === 'object') {
        const { thickness, width, length, unit } = item.dimensions;
        if (thickness && width && length) {
          return (
            <p className="text-sm text-gray-500">
              {thickness}" × {width}" × {length}" {unit || ''}
            </p>
          );
        }
      }
    } catch (error) {
      console.error('Error rendering dimensions:', error);
      return null;
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 0) return;
    
    if (newQuantity === 0) {
      handleRemove();
    } else {
      updateQuantity(item._id, newQuantity);
    }
  };

  const incrementQuantity = () => {
    handleQuantityChange((item.quantity || 1) + 1);
  };

  const decrementQuantity = () => {
    handleQuantityChange((item.quantity || 1) - 1);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    // Add a small delay for smooth animation
    setTimeout(() => {
      removeFromCart(item._id);
    }, 300);
  };

  // Calculate total price for this item
  const itemTotal = (item.price || 0) * (item.quantity || 1);

  // Safe text rendering helper
  const safeText = (text, fallback = '') => {
    if (typeof text === 'string' || typeof text === 'number') {
      return text;
    }
    return fallback;
  };

  if (isRemoving) {
    return (
      <div className="flex items-center gap-4 py-4 border-b border-gray-200 animate-pulse opacity-50">
        <div className="flex-grow text-center text-gray-500">
          Removing item...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 py-6 border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 px-4 rounded-lg">
      {/* Product Image */}
      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        {item.image ? (
          <Image
            src={item.image}
            alt={safeText(item.name, 'Product image')}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-2xl text-gray-400">🪵</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {safeText(item.name, 'Unnamed Product')}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {item.species && (
            <span className="text-sm text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded">
              {safeText(item.species)}
            </span>
          )}
          {item.category && (
            <span className="text-sm text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded">
              {safeText(item.category)}
            </span>
          )}
        </div>

        {renderDimensions()}

        {/* Mobile price display */}
        <div className="lg:hidden mt-2">
          <p className="text-lg font-bold text-primary-600">
            ${itemTotal.toFixed(2)}
          </p>
          {item.quantity > 1 && (
            <p className="text-sm text-gray-500">
              ${(item.price || 0).toFixed(2)} each
            </p>
          )}
        </div>
      </div>

      {/* Desktop Price */}
      <div className="hidden lg:flex flex-col items-end min-w-[100px]">
        <p className="text-lg font-bold text-primary-600">
          ${itemTotal.toFixed(2)}
        </p>
        {item.quantity > 1 && (
          <p className="text-sm text-gray-500">
            ${(item.price || 0).toFixed(2)} each
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={decrementQuantity}
          disabled={item.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <span className="text-lg">−</span>
        </button>
        
        <span className="w-12 text-center font-medium text-gray-900">
          {item.quantity || 1}
        </span>
        
        <button
          onClick={incrementQuantity}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Increase quantity"
        >
          <span className="text-lg">+</span>
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors group"
        aria-label="Remove item from cart"
      >
        <svg 
          className="w-5 h-5 group-hover:scale-110 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
      </button>
    </div>
  );
}