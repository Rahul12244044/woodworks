'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { productsAPI } from '../../../lib/api';
import Image from 'next/image';
import { useCart } from '../../../contexts/CartContext';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCart();

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(params.id);
      
      if (response.data) {
        setProduct(response.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      addToCart(product, quantity);
      // Success feedback
      setTimeout(() => setAddingToCart(false), 1000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setAddingToCart(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const formatDimensions = (dimensions) => {
    if (!dimensions) return null;
    
    if (typeof dimensions === 'string') {
      return dimensions;
    }
    
    if (dimensions.thickness && dimensions.width && dimensions.length) {
      return `${dimensions.thickness}" × ${dimensions.width}" × ${dimensions.length}"`;
    }
    
    return null;
  };

  // Move getStockStatus inside the component and call it only when product exists
  const getStockStatus = () => {
    if (!product) {
      return { text: 'Loading...', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
    
    if (!product.inStock) {
      return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    }
    
    if (product.lowStockThreshold && product.stockQuantity <= product.lowStockThreshold) {
      return { text: `Low Stock - Only ${product.stockQuantity} left`, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    }
    
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-6">🪵</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {error || 'The product you are looking for does not exist or may have been removed.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Browse All Products
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Call getStockStatus only after we know product exists
  const stockStatus = getStockStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Enhanced Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700 transition-colors">
                Products
              </Link>
            </li>
            {product.category && (
              <>
                <li>
                  <span className="text-gray-400">/</span>
                </li>
                <li>
                  <span className="text-gray-500 capitalize">{product.category.replace('_', ' ')}</span>
                </li>
              </>
            )}
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium truncate max-w-32 md:max-w-64">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                {product.images?.[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage].url || product.images[selectedImage]}
                    alt={product.images[selectedImage].alt || product.name}
                    width={600}
                    height={450}
                    className="w-full h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-300"
                    priority
                  />
                ) : (
                  <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl text-gray-400 mb-2">🪵</span>
                      <p className="text-gray-500">No Image Available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-gray-50 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-primary-500 ring-2 ring-primary-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image.url || image}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        width={100}
                        height={75}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                
                {/* Price and Stock */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl lg:text-4xl font-bold text-primary-700">
                    ${product.price}
                  </span>
                  {product.boardFeet && (
                    <span className="text-lg text-gray-600 bg-gray-100 px-3 py-2 rounded-lg font-medium">
                      {product.boardFeet} Board Feet
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${stockStatus.bg} ${stockStatus.border} ${stockStatus.color} mb-4`}>
                  <span className="font-medium text-sm">{stockStatus.text}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-sm font-medium capitalize">
                    {product.species}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium capitalize">
                    {product.category?.replace('_', ' ')}
                  </span>
                  {product.grainPattern?.map(pattern => (
                    <span key={pattern} className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium capitalize">
                      {pattern.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {formatDimensions(product.dimensions) && (
                  <div className="text-center">
                    <div className="text-gray-500 text-sm mb-1">Dimensions</div>
                    <div className="font-medium text-gray-900">{formatDimensions(product.dimensions)}</div>
                  </div>
                )}
                {product.origin && (
                  <div className="text-center">
                    <div className="text-gray-500 text-sm mb-1">Origin</div>
                    <div className="font-medium text-gray-900 capitalize">{product.origin}</div>
                  </div>
                )}
                {product.dry && (
                  <div className="text-center">
                    <div className="text-gray-500 text-sm mb-1">Condition</div>
                    <div className="font-medium text-gray-900">Kiln Dried</div>
                  </div>
                )}
                {product.featured && (
                  <div className="text-center">
                    <div className="text-gray-500 text-sm mb-1">Quality</div>
                    <div className="font-medium text-amber-600">Premium</div>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-medium text-gray-900">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-xl">−</span>
                    </button>
                    <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addingToCart}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {addingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <span>🛒</span>
                        Add to Cart - ${(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Free shipping on orders over $200 • Secure checkout
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  Premium Quality
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  Sustainably Sourced
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  Expert Support
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            <div className="px-8">
              <div className="flex border-b border-gray-200">
                {['description', 'specifications', 'shipping'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'description' ? 'Product Details' : 
                     tab === 'specifications' ? 'Specifications' : 'Shipping & Returns'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {activeTab === 'description' && (
  <div className="prose max-w-none space-y-4">
    {product.description && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Description:</span>
            <span className="text-gray-700">{product.description}</span>
          </div>
        )}
    
    {/* All information in a compact row-wise layout */}
    <div className="space-y-4">
      {/* Grain Patterns - Horizontal */}
      {product.grainPattern && product.grainPattern.length > 0 && (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-900 min-w-32">Grain Patterns:</span>
          <div className="flex flex-wrap gap-2">
            {product.grainPattern.map((pattern, index) => (
              <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm capitalize">
                {pattern.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Wood Properties - Horizontal */}
      <div className="flex flex-wrap items-center gap-6">
        {product.hardness && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Hardness:</span>
            <span className="text-gray-700">{product.hardness}</span>
          </div>
        )}
        {product.moistureContent && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Moisture:</span>
            <span className="text-gray-700">{product.moistureContent}%</span>
          </div>
        )}
        {product.origin && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Origin:</span>
            <span className="text-gray-700 capitalize">{product.origin}</span>
          </div>
        )}
        {product.weight && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Weight:</span>
            <span className="text-gray-700">{product.weight} kg</span>
          </div>
        )}
      </div>

      {/* Sustainability Info - Horizontal */}
      {product.sustainability && product.sustainability.certified && (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-900 min-w-32">Sustainability:</span>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <span className="text-green-800 flex items-center gap-2">
              <span className="text-green-500">🌱</span>
              {product.sustainability.certification 
                ? `Certified ${product.sustainability.certification}`
                : 'Sustainably Sourced'
              }
            </span>
          </div>
        </div>
      )}

      {/* Tags - Horizontal */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-900 min-w-32">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-900">Wood Species:</span>
                      <span className="ml-2 text-gray-700 capitalize">{product.species}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Category:</span>
                      <span className="ml-2 text-gray-700 capitalize">{product.category?.replace('_', ' ')}</span>
                    </div>
                    {product.origin && (
                      <div>
                        <span className="font-medium text-gray-900">Origin:</span>
                        <span className="ml-2 text-gray-700 capitalize">{product.origin}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {formatDimensions(product.dimensions) && (
                      <div>
                        <span className="font-medium text-gray-900">Dimensions:</span>
                        <span className="ml-2 text-gray-700">{formatDimensions(product.dimensions)}</span>
                      </div>
                    )}
                    {product.boardFeet && (
                      <div>
                        <span className="font-medium text-gray-900">Board Feet:</span>
                        <span className="ml-2 text-gray-700">{product.boardFeet} BF</span>
                      </div>
                    )}
                    {product.dry && (
                      <div>
                        <span className="font-medium text-gray-900">Moisture Content:</span>
                        <span className="ml-2 text-gray-700">Kiln Dried (6-8%)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4 text-gray-700">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Shipping Information</h4>
                    <p>Free standard shipping on orders over $200. Most orders ship within 2-3 business days.</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Returns Policy</h4>
                    <p>30-day return policy. Wood products must be returned in original condition. Custom cuts are final sale.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Call-to-Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 border border-primary-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Looking for More?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Explore our complete collection of premium woods and find the perfect material for your next project.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Browse All Woods</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}