// app/admin/orders/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ordersAPI } from '../../../../lib/api';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  
  const orderId = params.id;

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching order:', orderId);
      
      const response = await ordersAPI.getOrder(orderId);
      console.log('📥 Order API Response:', response);
      
      if (response && response.data) {
        setOrder(response.data);
      } else {
        console.error('No order data found');
        alert('Order not found');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Error loading order details');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdating(true);
      
      const statusUpdate = {
        status: newStatus,
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: newStatus,
            note: statusNote,
            updatedAt: new Date().toISOString()
          }
        ]
      };

      // Update status-specific timestamps
      if (newStatus === 'delivered') {
        statusUpdate.deliveredAt = new Date().toISOString();
      } else if (newStatus === 'cancelled') {
        statusUpdate.cancelledAt = new Date().toISOString();
      }

      await ordersAPI.updateOrder(orderId, statusUpdate);
      
      // Update local state
      setOrder(prev => ({ 
        ...prev, 
        status: newStatus,
        statusHistory: statusUpdate.statusHistory,
        ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() }),
        ...(newStatus === 'cancelled' && { cancelledAt: new Date().toISOString() })
      }));
      
      alert(`Order status updated to ${newStatus}`);
      setStatusNote('');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer',
      cash_on_delivery: 'Cash on Delivery'
    };
    return methods[method] || method;
  };

  // Get customer information based on order type
  const getCustomerInfo = () => {
    if (order.orderType === 'guest') {
      return {
        name: order.guestUser?.name || `${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}`,
        email: order.guestUser?.email || order.shippingAddress?.email,
        phone: order.guestUser?.phone || order.shippingAddress?.phone,
        type: 'Guest Customer'
      };
    } else {
      return {
        name: 'Registered User',
        email: order.shippingAddress?.email,
        phone: order.shippingAddress?.phone,
        type: 'Registered User'
      };
    }
  };

  // Check if status update should be disabled
  const isStatusUpdateDisabled = order?.status === 'delivered' || order?.status === 'cancelled';

  useEffect(() => {
    if (order) {
      console.log('📦 Order data:', order);
      console.log('🛒 Order items:', order.items);
      if (order.items && order.items.length > 0) {
        console.log('🔍 First item details:', order.items[0]);
        console.log('📝 First item productName:', order.items[0].productName);
        console.log('💰 First item price:', order.items[0].price);
        console.log('📏 First item dimensions:', order.items[0].dimensions);
      }
    }
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading order details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">The requested order could not be found.</p>
            <Link 
              href="/admin/orders"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const customerInfo = getCustomerInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/admin/orders"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-2">
                Placed on {formatDate(order.createdAt)}
                {order.orderType && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                    {order.orderType} order
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
              {isStatusUpdateDisabled && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Final Status
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🪵</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product?.name || 'Product Name Not Available'}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} • {formatCurrency(item.product?.price || 0)} each
                        </p>
                        {item.dimensions && (
                          <p className="text-xs text-gray-400">
                            Dimensions: {item.dimensions.length}" × {item.dimensions.width}" × {item.dimensions.thickness}"
                          </p>
                        )}
                        {item.subtotal && (
                          <p className="text-sm font-medium text-gray-700 mt-1">
                            Subtotal: {formatCurrency(item.subtotal)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(item.subtotal || ((item.product?.price || 0) * item.quantity))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status History</h2>
                
                <div className="space-y-3">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${getStatusColor(history.status)}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900 capitalize">{history.status}</span>
                          <span className="text-sm text-gray-500">{formatDate(history.updatedAt)}</span>
                        </div>
                        {history.note && (
                          <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Notes</h2>
                <p className="text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Summary & Customer Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
                
                {order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">{formatCurrency(order.shippingCost)}</span>
                  </div>
                )}
                
                {order.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">{formatCurrency(order.taxAmount)}</span>
                  </div>
                )}
                
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(order.finalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Customer Type</p>
                  <p className="font-medium text-gray-900">{customerInfo.type}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{customerInfo.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{customerInfo.email}</p>
                </div>
                
                {customerInfo.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{customerInfo.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                
                <div className="space-y-1 text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2">📞 {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium text-gray-900">{getPaymentMethodText(order.paymentMethod)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    order.paymentStatus === 'refunded' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status - Disabled for delivered/cancelled orders */}
            {!isStatusUpdateDisabled ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Status</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(e.target.value)}
                      disabled={updating}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Note (Optional)
                    </label>
                    <textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add a note about this status change..."
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
                <div className="text-center py-4">
                  <div className="text-green-500 text-4xl mb-2">✅</div>
                  <p className="text-gray-600 font-medium">
                    This order has been {order.status} and cannot be modified further.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {order.status === 'delivered' 
                      ? 'The order has been successfully delivered to the customer.'
                      : 'This order has been cancelled and is no longer active.'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Order Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="text-gray-900 font-mono text-xs">{order._id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{formatDate(order.createdAt)}</span>
                </div>
                
                {order.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-900">{formatDate(order.updatedAt)}</span>
                  </div>
                )}

                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered:</span>
                    <span className="text-gray-900">{formatDate(order.deliveredAt)}</span>
                  </div>
                )}

                {order.cancelledAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled:</span>
                    <span className="text-gray-900">{formatDate(order.cancelledAt)}</span>
                  </div>
                )}

                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking:</span>
                    <span className="text-gray-900 font-mono">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => router.push('/admin/orders')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Orders
          </button>
          
          <button
            onClick={fetchOrder}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}