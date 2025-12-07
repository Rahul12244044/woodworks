// app/profile/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, processing, shipped, delivered, cancelled

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log('🟡 Fetching orders for user:', user._id);
        
        const response = await fetch(`/api/orders?userId=${user._id}&status=all`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }
        
        const ordersData = await response.json();
        console.log('📦 Orders data received:', ordersData);
        
        setOrders(ordersData);
      } catch (error) {
        console.error('❌ Failed to fetch orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
      case 'completed': 
        return 'bg-green-100 text-green-800';
      case 'processing': 
        return 'bg-blue-100 text-blue-800';
      case 'shipped': 
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'return_requested':
        return 'bg-orange-100 text-orange-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'return_requested': 'Return Requested'
    };
    return statusMap[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getOrderActions = (order) => {
    const actions = [];
    
    // Always show View Details
    actions.push(
      <Link 
        key="details"
        href={`/profile/orders/${order._id}`}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        View Details
      </Link>
    );

    // Cancel order (only for pending/processing orders)
    if (['pending', 'processing'].includes(order.status)) {
      actions.push(
        <button 
          key="cancel"
          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
        >
          Cancel Order
        </button>
      );
    }

    // Return order (only for delivered orders within 30 days)
    if (order.status === 'delivered') {
      const deliveredDate = new Date(order.deliveredAt || order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (deliveredDate > thirtyDaysAgo) {
        actions.push(
          <Link 
            key="return"
            href="/returns"
            className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
          >
            Request Return
          </Link>
        );
      }
    }

    // Track package (only for shipped orders with tracking)
    if (order.status === 'shipped' && order.trackingNumber) {
      actions.push(
        <button 
          key="track"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          Track Package
        </button>
      );
    }

    // Buy again (only for completed/delivered orders)
    if (['delivered', 'completed'].includes(order.status)) {
      actions.push(
        <button 
          key="buy-again"
          className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
        >
          Buy Again
        </button>
      );
    }

    return actions;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
          <Link href="/auth/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">View and manage your wood product orders</p>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Orders' },
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' }
            ].map((filterOption) => {
              const count = filterOption.value === 'all' 
                ? orders.length 
                : orders.filter(o => o.status === filterOption.value).length;
              
              return (
                <button
                  key={filterOption.value}
                  onClick={() => setFilter(filterOption.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start exploring our premium wood collection!"
                : `You don't have any ${getStatusText(filter).toLowerCase()} orders at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link 
                href="/products" 
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        Placed on {formatDate(order.createdAt)}
                        {order.deliveredAt && (
                          <span className="ml-4">• Delivered on {formatDate(order.deliveredAt)}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.finalAmount)}</p>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 py-2">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product?.images?.[0]?.url ? (
                            <img 
                              src={item.product.images[0].url} 
                              alt={item.product.images[0].alt || item.productName} 
                              className="w-full h-full object-cover rounded-lg" 
                            />
                          ) : (
                            <span className="text-2xl text-gray-400">🪵</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} • {item.species || item.product?.species}
                          </p>
                          {item.dimensions && (
                            <p className="text-xs text-gray-500">
                              {typeof item.dimensions === 'string' 
                                ? item.dimensions 
                                : `${item.dimensions.thickness}" × ${item.dimensions.width}" × ${item.dimensions.length}"`
                              }
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-2">
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📦</span>
                          <span>Tracking: {order.trackingNumber}</span>
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📅</span>
                          <span>
                            {order.status === 'delivered' ? 'Delivered' : 'Estimated delivery'}: {formatDate(order.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                      {order.shippingAddress && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📍</span>
                          <span>
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {getOrderActions(order)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}