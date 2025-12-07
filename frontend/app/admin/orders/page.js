'use client';

import { useState, useEffect } from 'react';
import { ordersAPI } from '../../../lib/api';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getOrders();
      console.log('Orders API Response:', response);
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else if (Array.isArray(response.data.data)) {
          setOrders(response.data.data);
        } else {
          console.warn('Unexpected orders API response structure:', response.data);
          setOrders([]);
        }
      } else {
        console.warn('No data in orders API response');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error loading orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, orderNumber) => {
    try {
      await ordersAPI.updateOrder(orderId, { status: newStatus });
      
      // Update local state immediately
      setOrders(prev => prev.map(order => 
        (order._id || order.id) === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      alert(`Order #${orderNumber} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const deleteOrder = async (orderId, orderNumber) => {
    if (confirm(`Are you sure you want to delete order #${orderNumber}? This action cannot be undone.`)) {
      try {
        await ordersAPI.deleteOrder(orderId);
        // Update local state immediately
        setOrders(prev => prev.filter(order => (order._id || order.id) !== orderId));
        alert('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
      }
    }
  };

  // Force refresh orders
  const forceRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || isWithinDateRange(order.createdAt, dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Helper function for date filtering
  function isWithinDateRange(orderDate, range) {
    const orderDateObj = new Date(orderDate);
    const now = new Date();
    
    switch (range) {
      case 'today':
        return orderDateObj.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return orderDateObj >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return orderDateObj >= monthAgo;
      default:
        return true;
    }
  }

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  // Date filter options
  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' }
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading orders...</span>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
              <p className="text-gray-600 mt-2">View and manage customer orders</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={forceRefresh}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Refresh orders"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Debug Info:</strong> Showing {filteredOrders.length} filtered orders from {orders.length} total orders
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-indigo-600">
                {orders.filter(o => o.status === 'shipped').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search Orders
                </label>
                <input
                  type="text"
                  placeholder="Search by order #, customer, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {filteredOrders.map((order) => {
                    const statusOption = statusOptions.find(s => s.value === order.status) || statusOptions[0];
                    
                    return (
                      <tr key={order._id || order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber || order._id?.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            ID: {order._id?.slice(-6)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer?.name || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer?.email || 'No email'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(order.createdAt || order.orderDate)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusOption.color}`}>
                            {statusOption.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link
                            href={`/admin/orders/${order._id || order.id}`}
                            className="text-primary-600 hover:text-primary-900 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                          >
                            View
                          </Link>
                          
                          {/* Status Update Dropdown */}
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id || order.id, e.target.value, order.orderNumber)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          
                          <button
                            onClick={() => deleteOrder(order._id || order.id, order.orderNumber)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-6">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                    ? 'No orders found' 
                    : 'No orders yet'
                  }
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your search terms or filters' 
                    : 'Orders will appear here when customers make purchases'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 py-4">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>
    </div>
  );
}