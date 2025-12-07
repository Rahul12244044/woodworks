'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsAPI } from '../../lib/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProductForm({ productId, onSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // In ProductForm component
const [formData, setFormData] = useState({
  name: '',
  description: '',
  category: 'lumber',
  species: 'oak',
  price: '',
  originalPrice: '', // Add this field
  boardFeet: '',
  moistureContent: '',
  dimensions: {
    thickness: '',
    width: '',
    length: '', // Note: changed order to match model
    unit: 'inches'
  },
  grainPattern: [],
  images: [{ url: '', alt: '' }],
  inStock: true,
  quantity: '',
  isUniqueItem: false,
  featured: false
});
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'lumber', label: 'Lumber' },
    { value: 'slab', label: 'Live Edge Slab' },
    { value: 'plywood', label: 'Plywood' },
    { value: 'turning_blank', label: 'Turning Blank' },
    { value: 'project_kit', label: 'Project Kit' }
  ];

  const species = [
    'oak', 'walnut', 'maple', 'cherry', 'pine', 
    'cedar', 'teak', 'mahogany', 'birch'
  ];

  const grainPatterns = [
    { value: 'straight', label: 'Straight' },
    { value: 'curly', label: 'Curly' },
    { value: 'birdseye', label: 'Birdseye' },
    { value: 'burl', label: 'Burl' },
    { value: 'quartered', label: 'Quartered' },
    { value: 'flat_sawn', label: 'Flat Sawn' }
  ];

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

 const fetchProduct = async () => {
  setLoading(true);
  try {
    const { data } = await productsAPI.getProduct(productId);
    setFormData({
      name: data.name || '',
      description: data.description || '',
      category: data.category || 'lumber',
      species: data.species || 'oak',
      price: data.price || '',
      originalPrice: data.originalPrice || '', // Add this line
      boardFeet: data.boardFeet || '',
      moistureContent: data.moistureContent || '',
      dimensions: {
        thickness: data.dimensions?.thickness || '',
        width: data.dimensions?.width || '',
        length: data.dimensions?.length || '',
        unit: data.dimensions?.unit || 'inches'
      },
      grainPattern: data.grainPattern || [],
      images: data.images && data.images.length > 0 ? data.images : [{ url: '', alt: '' }],
      inStock: data.inStock !== undefined ? data.inStock : true,
      quantity: data.quantity || '',
      isUniqueItem: data.isUniqueItem || false,
      featured: data.featured || false
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    alert('Error loading product data');
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('dimensions.')) {
      const dimensionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGrainPatternChange = (pattern) => {
    setFormData(prev => ({
      ...prev,
      grainPattern: prev.grainPattern.includes(pattern)
        ? prev.grainPattern.filter(p => p !== pattern)
        : [...prev.grainPattern, pattern]
    }));
  };

  const handleImageChange = (index, field, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '' }]
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = 'Valid quantity is required';
    
    if (formData.category === 'lumber' || formData.category === 'slab') {
      if (!formData.boardFeet || formData.boardFeet <= 0) {
        newErrors.boardFeet = 'Board feet is required for lumber and slabs';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setSaving(true);
  try {
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price), // Use same as price if not set
      boardFeet: formData.boardFeet ? parseFloat(formData.boardFeet) : undefined,
      moistureContent: formData.moistureContent ? parseFloat(formData.moistureContent) : undefined,
      quantity: parseInt(formData.quantity),
      dimensions: formData.dimensions.thickness || formData.dimensions.width || formData.dimensions.length ? {
        thickness: formData.dimensions.thickness ? parseFloat(formData.dimensions.thickness) : undefined,
        width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : undefined,
        length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : undefined,
        unit: formData.dimensions.unit || 'inches'
      } : undefined,
      images: formData.images.filter(img => img.url.trim() !== '')
    };

    console.log('📦 Submitting product data:', submitData);
    console.log('🌐 API URL:', productId ? `/api/products/${productId}` : '/api/products');
    
    let result;
    if (productId) {
      result = await productsAPI.updateProduct(productId, submitData);
    } else {
      result = await productsAPI.createProduct(submitData);
    }

    if (onSuccess) {
      onSuccess(result.data);
    } else {
      router.push('/admin/products');
    }
    
    alert(productId ? 'Product updated successfully!' : 'Product created successfully!');
  } catch (error) {
    console.error('Error saving product:', error);
    
    // More detailed error message
    if (error.message.includes('500')) {
      alert('Server error: Please check if the database is connected and the API route is properly set up.');
    } else if (error.message.includes('401')) {
      alert('Authentication error: Please make sure you are logged in as admin.');
    } else {
      alert(`Error saving product: ${error.message}`);
    }
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading product...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
  {/* Basic Information */}
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="Product Name *"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        placeholder="e.g., Black Walnut Live Edge Slab"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wood Species *
        </label>
        <select
          name="species"
          value={formData.species}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {species.map(sp => (
            <option key={sp} value={sp}>
              {sp.charAt(0).toUpperCase() + sp.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Price ($) *"
        name="price"
        type="number"
        step="0.01"
        value={formData.price}
        onChange={handleInputChange}
        error={errors.price}
        placeholder="0.00"
      />

      {/* ADD THE ORIGINAL PRICE INPUT RIGHT HERE */}
      <Input
        label="Original Price ($) (Optional)"
        name="originalPrice"
        type="number"
        step="0.01"
        value={formData.originalPrice}
        onChange={handleInputChange}
        placeholder="0.00"
      />
    </div>

    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description *
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        placeholder="Describe the wood's characteristics, quality, and potential uses..."
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
      )}
    </div>
  </div>
      {/* Wood Specifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Wood Specifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Board Feet"
            name="boardFeet"
            type="number"
            step="0.1"
            value={formData.boardFeet}
            onChange={handleInputChange}
            error={errors.boardFeet}
            placeholder="0.0"
          />

          <Input
            label="Moisture Content (%)"
            name="moistureContent"
            type="number"
            step="0.1"
            value={formData.moistureContent}
            onChange={handleInputChange}
            placeholder="8.0"
          />

          <Input
            label="Quantity in Stock *"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            error={errors.quantity}
            placeholder="0"
          />
        </div>

        {/* Dimensions */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Dimensions (inches)</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Thickness"
              name="dimensions.thickness"
              type="number"
              step="0.1"
              value={formData.dimensions.thickness}
              onChange={handleInputChange}
              placeholder="1.0"
            />
            <Input
              label="Width"
              name="dimensions.width"
              type="number"
              step="0.1"
              value={formData.dimensions.width}
              onChange={handleInputChange}
              placeholder="8.0"
            />
            <Input
              label="Length"
              name="dimensions.length"
              type="number"
              step="0.1"
              value={formData.dimensions.length}
              onChange={handleInputChange}
              placeholder="96.0"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                name="dimensions.unit"
                value={formData.dimensions.unit}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="inches">Inches</option>
                <option value="mm">Millimeters</option>
              </select>
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
                  checked={formData.grainPattern.includes(pattern.value)}
                  onChange={() => handleGrainPatternChange(pattern.value)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{pattern.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Product Images</h2>
        
        {formData.images.map((image, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <Input
                label="Image URL"
                value={image.url}
                onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex-1">
              <Input
                label="Alt Text"
                value={image.alt}
                onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                placeholder="Description of the image"
              />
            </div>
            {formData.images.length > 1 && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="text-red-600 hover:text-red-700 font-medium py-2"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={addImageField}
          className="btn-outline"
        >
          + Add Another Image
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Product Settings</h2>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isUniqueItem"
              checked={formData.isUniqueItem}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Unique Item (e.g., one-of-a-kind slab)</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Featured Product</span>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
        >
          {saving ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              {productId ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            productId ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
}