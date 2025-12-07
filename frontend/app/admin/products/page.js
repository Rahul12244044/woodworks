// app/admin/products/page.js
'use client';

import { useState, useEffect } from 'react';
import { productsAPI } from '../../../lib/api';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function ProductsManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getProducts();
      console.log('API Response:', response); // Debug log
      
      // The API returns { data: { products: [], ... } }
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          // If data is directly an array
          setProducts(response.data);
        } else if (response.data.products && Array.isArray(response.data.products)) {
          // If data has a products property
          setProducts(response.data.products);
        } else if (Array.isArray(response.data.data)) {
          // If data has a data property
          setProducts(response.data.data);
        } else {
          console.warn('Unexpected API response structure:', response.data);
          setProducts([]);
        }
      } else {
        console.warn('No data in API response');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error loading products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh products when the page gains focus (useful when coming back from product creation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchProducts);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchProducts);
    };
  }, []);

  const deleteProduct = async (productId, productName) => {
    if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        const response = await productsAPI.deleteProduct(productId);
        console.log('Delete response:', response);
        
        // Update local state immediately
        setProducts(prev => prev.filter(p => (p._id || p.id) !== productId));
        
        // Show success message from API or default
        alert(response?.message || 'Product deleted successfully');
        
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error deleting product: ${error.message}`);
      }
    }
  };

  const toggleFeatured = async (productId, currentlyFeatured) => {
    try {
      await productsAPI.updateProduct(productId, { featured: !currentlyFeatured });
      // Update local state immediately
      setProducts(prev => prev.map(p => 
        (p._id || p.id) === productId 
          ? { ...p, featured: !currentlyFeatured }
          : p
      ));
      alert(`Product ${currentlyFeatured ? 'removed from' : 'added to'} featured items`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const toggleStockStatus = async (productId, currentlyInStock) => {
    try {
      await productsAPI.updateProduct(productId, { inStock: !currentlyInStock });
      // Update local state immediately
      setProducts(prev => prev.map(p => 
        (p._id || p.id) === productId 
          ? { ...p, inStock: !currentlyInStock }
          : p
      ));
      alert(`Product marked as ${!currentlyInStock ? 'in stock' : 'out of stock'}`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  // Force refresh products (useful for debugging)
  const forceRefresh = () => {
    setLoading(true);
    fetchProducts();
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.species?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'inStock' && product.inStock) ||
                        (stockFilter === 'outOfStock' && !product.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'lumber', label: 'Lumber' },
    { value: 'slab', label: 'Live Edge Slab' },
    { value: 'plywood', label: 'Plywood' },
    { value: 'turning_blank', label: 'Turning Blank' },
    { value: 'project_kit', label: 'Project Kit' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main container with proper padding and max-width */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
              <p className="text-gray-600 mt-2">Add, edit, or remove wood products from your store</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={forceRefresh}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Refresh products"
              >
                🔄 Refresh
              </button>
              <Link href="/admin/products/new">
                <Button>Add New Product</Button>
              </Link>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Debug Info:</strong> Showing {filteredProducts.length} filtered products from {products.length} total products
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.inStock).length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => !p.inStock).length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.featured).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search by name or species..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Stock Status
                </label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Species
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id || product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.images[0].alt || product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-xl">🌲</span>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {product.featured && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                                  Featured
                                </span>
                              )}
                              {product.isUniqueItem && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  Unique
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {product.category?.replace('_', ' ') || 'Uncategorized'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {product.species || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.quantity || 0}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/admin/products/${product._id}`} // Note: /edit at the end
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                        Edit
                        </Link>
                        <button
                          onClick={() => toggleFeatured(product._id || product.id, product.featured)}
                          className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded hover:bg-yellow-50 transition-colors"
                        >
                          {product.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => toggleStockStatus(product._id || product.id, product.inStock)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          {product.inStock ? 'Mark Out' : 'Mark In'}
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id || product.id, product.name)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-6">🌲</div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all' 
                    ? 'No products found' 
                    : 'No products yet'
                  }
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                    ? 'Try adjusting your search terms or filters' 
                    : 'Get started by adding your first wood product'
                  }
                </p>
                {!searchTerm && categoryFilter === 'all' && stockFilter === 'all' && (
                  <Link href="/admin/products/new">
                    <Button>Add Your First Product</Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 py-4">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>
    </div>
  );
}