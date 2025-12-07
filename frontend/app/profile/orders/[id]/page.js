// app/profile/orders/[id]/page.js
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../../contexts/AuthContext';
import Link from 'next/link';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log('🟡 Fetching order details for:', id);
        
        const response = await fetch(`/api/orders/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error(`Failed to fetch order: ${response.status}`);
        }
        
        const orderData = await response.json();
        console.log('📦 Order data received:', orderData);
        
        setOrder(orderData);
      } catch (error) {
        console.error('❌ Failed to fetch order:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, id]);

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

  const getTimelineEvents = (order) => {
    const events = [];
    
    // Order placed
    events.push({
      title: 'Order Placed',
      date: order.createdAt,
      description: 'Your order was successfully placed',
      completed: true
    });

    // Processing
    if (['processing', 'shipped', 'delivered', 'completed'].includes(order.status)) {
      events.push({
        title: 'Order Processing',
        date: order.createdAt, // You might want to add a processing date field
        description: 'We are preparing your order for shipment',
        completed: true
      });
    }

    // Shipped
    if (['shipped', 'delivered', 'completed'].includes(order.status)) {
      events.push({
        title: 'Order Shipped',
        date: order.updatedAt, // You might want to add a shipped date field
        description: order.trackingNumber ? `Tracking: ${order.trackingNumber}` : 'Your order has been shipped',
        completed: true
      });
    }

    // Delivered
    if (['delivered', 'completed'].includes(order.status)) {
      events.push({
        title: 'Order Delivered',
        date: order.deliveredAt || order.updatedAt,
        description: 'Your order has been delivered',
        completed: true
      });
    }

    // Cancelled
    if (order.status === 'cancelled') {
      events.push({
        title: 'Order Cancelled',
        date: order.cancelledAt || order.updatedAt,
        description: order.cancellationReason || 'Order was cancelled',
        completed: true
      });
    }

    return events.reverse(); // Show most recent first
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view order details.</p>
          <Link href="/auth/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't find the order you're looking for."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link 
              href="/profile/orders" 
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Orders
            </Link>
            <Link 
              href="/" 
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const timelineEvents = getTimelineEvents(order);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <p className="text-gray-600">
                Placed on {formatDate(order.createdAt)}
                {order.deliveredAt && (
                  <span className="ml-4">• Delivered on {formatDate(order.deliveredAt)}</span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Print Invoice
              </button>
              <Link 
                href="/profile/orders" 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.species || item.product?.species}
                      </p>
                      {item.dimensions && (
                        <p className="text-sm text-gray-500 mt-1">
                          {typeof item.dimensions === 'string' 
                            ? item.dimensions 
                            : `${item.dimensions.thickness}" × ${item.dimensions.width}" × ${item.dimensions.length}"`
                          }
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-2">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      event.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                      {event.description && (
                        <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Requests */}
            {order.returnRequests && order.returnRequests.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Return Requests</h2>
                <div className="space-y-4">
                  {order.returnRequests.map((returnReq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">Return #{returnReq.returnId}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          returnReq.status === 'approved' ? 'bg-green-100 text-green-800' :
                          returnReq.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {returnReq.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Reason: {returnReq.reason}</p>
                      {returnReq.description && (
                        <p className="text-sm text-gray-500">{returnReq.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Requested: {formatDate(returnReq.requestedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>{formatCurrency(order.finalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h2>
              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </p>
                <p>{order.shippingAddress?.address}</p>
                {order.shippingAddress?.apartment && <p>{order.shippingAddress.apartment}</p>}
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                {order.shippingAddress?.email && (
                  <p className="mt-2">{order.shippingAddress.email}</p>
                )}
                {order.shippingAddress?.phone && (
                  <p>{order.shippingAddress.phone}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h2>
              <p className="text-sm text-gray-600 capitalize">
                {order.paymentMethod?.replace('_', ' ') || 'Credit Card'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className="capitalize">{order.paymentStatus || 'Paid'}</span>
              </p>
            </div>

            {/* Shipping Information */}
            {/* Shipping Information */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
  
  {/* General Delivery Information */}
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <TruckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-blue-800">Delivery Estimate</h3>
        <p className="text-sm text-blue-700 mt-1">
          Standard delivery: <span className="font-semibold">4-5 business days</span>
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Orders are processed within 24 hours and shipped via standard courier service
        </p>
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}