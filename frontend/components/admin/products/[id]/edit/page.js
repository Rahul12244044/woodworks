'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { productsAPI } from '../../../lib/api';
import Link from 'next/link';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productsAPI.getProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchProducts();
    }
  }, [user]);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(productId);
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <Link href="/auth/login" className="btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Products</h1>
          <p className="text-gray-600">Add, edit, or remove wood products from your store</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors mt-4 lg:mt-0"
        >
          + Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <input
          type="text"
          placeholder="Search products by name, species, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-900">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Species</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Actions</div>
          </div>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-3">🌲</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first product to get started'}
              </p>
              {!searchTerm && (
                <Link href="/admin/products/new" className="btn-primary">
                  Add First Product
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <div key={product._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                  {/* Product Info */}
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400">🌲</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded capitalize">
                      {product.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Species */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-900 capitalize">{product.species}</span>
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <div className="font-bold text-primary-700">${product.price}</div>
                    {product.boardFeet && (
                      <div className="text-xs text-gray-500">{product.boardFeet} BF</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      {/* FIXED: Using product._id (not product_id) */}
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}