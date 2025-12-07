// app/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../lib/api';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, sortBy]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🟡 Fetching orders for user:', user?.email);
      
      const response = await ordersAPI.getOrders();
      console.log('📦 Orders API response:', response);
      
      if (response.data) {
        const userOrders = response.data.filter(order => {
          const isUserOrder = order.userId === user?._id;
          const isGuestOrder = order.guestUser?.email === user?.email;
          const isShippingEmailMatch = order.shippingAddress?.email === user?.email;
          const isCustomerEmailMatch = order.customer?.email === user?.email;
          
          return isUserOrder || isGuestOrder || isShippingEmailMatch || isCustomerEmailMatch;
        });
        
        console.log(`✅ Found ${userOrders.length} orders for user`);
        setOrders(userOrders);
      } else {
        setError('No orders found');
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => 
          getProductName(item).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return getFinalAmount(b) - getFinalAmount(a);
        case 'price-low':
          return getFinalAmount(a) - getFinalAmount(b);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      processing: '🔧',
      shipped: '🚚',
      delivered: '📦',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  const getProductName = (item) => {
    if (!item) return 'Wood Product';
    if (item.product?.name) return item.product.name;
    if (item.productName) return item.productName;
    if (item.name) return item.name;
    return 'Wood Product';
  };

  const getProductPrice = (item) => {
    if (!item) return 0;
    if (item.product?.price) return item.product.price;
    if (item.price) return item.price;
    return 0;
  };

  const getItemQuantity = (item) => {
    return item.quantity || 1;
  };

  const getItemSubtotal = (item) => {
    if (item.subtotal) return item.subtotal;
    return (getProductPrice(item) || 0) * (getItemQuantity(item) || 1);
  };

  const getFinalAmount = (order) => {
    return order.finalAmount || order.totalAmount || 0;
  };

  const getOrderType = (order) => {
    if (order.orderType) return order.orderType;
    if (order.userId) return 'user';
    if (order.guestUser) return 'guest';
    return 'unknown';
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalSpent: orders.reduce((sum, order) => sum + getFinalAmount(order), 0)
    };
    return stats;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to view your order history.
            </p>
            <Link 
              href="/auth/login" 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="text-gray-600 text-lg">Loading your orders...</span>
            <p className="text-sm text-gray-500">Fetching your order history</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Orders</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">
                View your order history and track your purchases
              </p>
            </div>
            <button
              onClick={refreshOrders}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          {orders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalSpent)}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          )}

          {/* Filters */}
          {orders.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search orders or products... by Order Number or Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="text-gray-300 text-8xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Explore our wood collection and start your next project today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Info */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredOrders.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="text-gray-300 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const hasItems = order.items && order.items.length > 0;
                const orderType = getOrderType(order);
                
                return (
                  <div key={order._id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border-2 ${getStatusColor(order.status)}`}>
                          <span className="text-xl">{getStatusIcon(order.status)}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                            Order #{order.orderNumber}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                              {orderType} order
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(getFinalAmount(order))}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    {hasItems && (
                      <div className="mb-6">
                        <div className="grid gap-4">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
                                  <span className="text-lg">🪵</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {getProductName(item)}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span>Qty: {getItemQuantity(item)}</span>
                                    <span>•</span>
                                    <span>{formatCurrency(getProductPrice(item))} each</span>
                                  </div>
                                  {item.dimensions && (
                                    <p className="text-xs text-gray-400 mt-2">
                                      📏 {item.dimensions.length}" × {item.dimensions.width}" × {item.dimensions.thickness}"
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900 text-sm">
                                  {formatCurrency(getItemSubtotal(item))}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {order.items.length > 3 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600 text-center">
                              +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                      <Link
                        href={`/orders/${order._id}`}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-center flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </Link>
                      
                      <Link
                        href={`/checkout/confirmation?orderId=${order._id}`}
                        className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-center flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Receipt
                      </Link>

                      {order.status === 'shipped' && order.trackingNumber && (
                        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-center flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Track Package
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Help Section */}
        {orders.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Need Help With Your Orders?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-lg">•</span>
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Order Support</h4>
                        <p className="text-blue-700 text-sm">Questions about your order? Our team is here to help.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-lg">•</span>
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Shipping Info</h4>
                        <p className="text-blue-700 text-sm">Most orders ship within 2-3 business days.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-lg">•</span>
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Returns & Exchanges</h4>
                        <p className="text-blue-700 text-sm">30-day return policy on most items.</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-blue-800 font-medium">
                        📧 support@woodworks.com<br/>
                        📞 (555) 123-WOOD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}