'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../../contexts/CartContext';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleCardClick = () => {
    console.log('🔄 Navigating to product:', `/products/${product._id}`);
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Important: prevent card navigation
    console.log('🛒 Add to cart clicked for:', product.name);
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  // Check if product has valid ID
  if (!product._id) {
    console.error('❌ Product missing ID:', product);
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full p-4">
        <p className="text-red-500">Error: Product missing ID</p>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="aspect-w-4 aspect-h-3 bg-gray-200 relative">
        {product.images?.[0] ? (
          <Image
            src={product.images[0].url || product.images[0]}
            alt={product.images[0].alt || product.name}
            width={300}
            height={225}
            className="object-cover w-full h-48"
            priority={false}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors line-clamp-2 min-h-[56px] flex items-start cursor-pointer">
          {product.name}
        </h3>
        
        {/* Price and Board Feet */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-primary-700">
            ${product.price}
          </span>
          {product.boardFeet && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.boardFeet} BF
            </span>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded capitalize">
            {product.species}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded capitalize">
            {product.category?.replace('_', ' ') || 'Uncategorized'}
          </span>
          {product.grainPattern?.map(pattern => (
            <span key={pattern} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded capitalize">
              {pattern.replace('_', ' ')}
            </span>
          ))}
        </div>
        
        {/* Description - Fixed height */}
        <div className="mb-4 flex-grow">
          <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
            {product.description}
          </p>
        </div>
        
        {/* Stock Status and Add to Cart - Always at bottom */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          <button 
            onClick={handleAddToCart}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
            disabled={!product.inStock}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}