// app/admin/products/[id]/page.js - UPDATED VERSION
'use client';

import { useAuth } from '../../../../contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { productsAPI } from '../../../../lib/api';

export default function EditProductPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch real product data
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log('🔄 Fetching real product data for:', productId);
        setIsLoading(true);
        setError('');
        
        const response = await productsAPI.getProduct(productId);
        console.log('📦 Full API response:', response);
        
        let productData = null;
        
        if (response.data) {
          if (response.data._id) {
            productData = response.data;
          } else if (response.data.product && response.data.product._id) {
            productData = response.data.product;
          } else if (response.data.data && response.data.data._id) {
            productData = response.data.data;
          }
        }
        
        if (productData) {
          console.log('✅ Product data loaded successfully:', productData);
          setProduct(productData);
        } else {
          console.error('❌ Could not extract product data from response');
          setError('Product data format is invalid');
        }
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        setError('Failed to load product: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin' && productId) {
      fetchProduct();
    }
  }, [user, loading, productId, router]);

  // Complete update function with all required fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!product?.name || !product?.price || !product?.category || !product?.species || !product?.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      console.log('💾 Saving product updates:', product);
      
      // Prepare COMPLETE data for API - include all fields from your Product model
      const updateData = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : parseFloat(product.price),
        category: product.category,
        species: product.species,
        boardFeet: product.boardFeet ? parseFloat(product.boardFeet) : undefined,
        moistureContent: product.moistureContent ? parseFloat(product.moistureContent) : undefined,
        dimensions: product.dimensions ? {
          length: product.dimensions.length ? parseFloat(product.dimensions.length) : undefined,
          width: product.dimensions.width ? parseFloat(product.dimensions.width) : undefined,
          thickness: product.dimensions.thickness ? parseFloat(product.dimensions.thickness) : undefined,
          unit: product.dimensions.unit || 'cm'
        } : undefined,
        grainPattern: product.grainPattern || [],
        images: product.images || [],
        inStock: product.inStock !== undefined ? product.inStock : true,
        quantity: product.quantity ? parseInt(product.quantity) : 0,
        featured: product.featured || false,
        isUniqueItem: product.isUniqueItem || false
      };

      console.log('📤 Sending update data:', updateData);
      
      // Use real API call to update product
      const response = await productsAPI.updateProduct(productId, updateData);
      console.log('✅ Update response:', response);
      
      if (response.data) {
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        throw new Error('Update failed - no response data');
      }
    } catch (error) {
      console.error('❌ Error updating product:', error);
      setError('Failed to update product: ' + error.message);
      alert('Error updating product: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDimensionChange = (dimension, value) => {
    setProduct(prev => ({
      ...prev,
      dimensions: {
        ...(prev.dimensions || {}),
        [dimension]: value ? parseFloat(value) : ''
      }
    }));
  };

  const handleNumberChange = (field, value) => {
    setProduct(prev => ({
      ...prev,
      [field]: value ? parseFloat(value) : ''
    }));
  };

  const handleGrainPatternChange = (pattern) => {
    setProduct(prev => ({
      ...prev,
      grainPattern: prev.grainPattern?.includes(pattern)
        ? prev.grainPattern.filter(p => p !== pattern)
        : [...(prev.grainPattern || []), pattern]
    }));
  };

  // Debug: Log product state when it changes
  useEffect(() => {
    if (product) {
      console.log('📝 Current product state:', product);
    }
  }, [product]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (error && !product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push('/admin/products')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    { value: 'lumber', label: 'Lumber' },
    { value: 'slab', label: 'Live Edge Slab' },
    { value: 'plywood', label: 'Plywood' },
    { value: 'turning_blank', label: 'Turning Blank' },
    { value: 'project_kit', label: 'Project Kit' },
    { value: 'hardwood', label: 'Hardwood' },
    { value: 'softwood', label: 'Softwood' },
    { value: 'other', label: 'Other' }
  ];

  const grainPatterns = [
    { value: 'straight', label: 'Straight' },
    { value: 'curly', label: 'Curly' },
    { value: 'birdseye', label: 'Birdseye' },
    { value: 'burl', label: 'Burl' },
    { value: 'quartered', label: 'Quartered' },
    { value: 'flat_sawn', label: 'Flat Sawn' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => router.push('/admin/products')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <span>←</span>
          Back to Products
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product ? `Edit: ${product.name}` : 'Edit Product'}
            </h1>
            <p className="text-gray-600">Update product information</p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
            ID: {productId}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {product && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-blue-600 mr-2">ℹ️</span>
            <div>
              <p className="text-sm text-blue-800">
                <strong>Debug:</strong> Product loaded with {Object.keys(product).length} fields
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Name: "{product.name}", Price: ${product.price}, Category: {product.category}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-400 mr-2">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {product ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={product.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={product.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Species *
                  </label>
                  <input
                    type="text"
                    value={product.species || ''}
                    onChange={(e) => handleChange('species', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter wood species"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.price || ''}
                    onChange={(e) => handleNumberChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.originalPrice || ''}
                    onChange={(e) => handleNumberChange('originalPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity in Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={product.quantity || ''}
                    onChange={(e) => handleNumberChange('quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={product.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter product description"
                  required
                />
              </div>
            </div>

            {/* Wood Specifications */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Wood Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Board Feet
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={product.boardFeet || ''}
                    onChange={(e) => handleNumberChange('boardFeet', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={product.moistureContent || ''}
                    onChange={(e) => handleNumberChange('moistureContent', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="8.0"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Dimensions (cm)</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={product.dimensions?.length || ''}
                      onChange={(e) => handleDimensionChange('length', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Length"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={product.dimensions?.width || ''}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thickness
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={product.dimensions?.thickness || ''}
                      onChange={(e) => handleDimensionChange('thickness', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Thickness"
                    />
                  </div>
                </div>
              </div>

              {/* Grain Patterns */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Grain Patterns</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {grainPatterns.map(pattern => (
                    <label key={pattern.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={product.grainPattern?.includes(pattern.value) || false}
                        onChange={() => handleGrainPatternChange(pattern.value)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{pattern.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Settings */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Product Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.inStock || false}
                    onChange={(e) => handleChange('inStock', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.featured || false}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.isUniqueItem || false}
                    onChange={(e) => handleChange('isUniqueItem', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Unique Item (one-of-a-kind)</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're trying to edit doesn't exist.</p>
            <button 
              onClick={() => router.push('/admin/products')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}