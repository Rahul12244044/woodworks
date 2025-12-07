// app/profile/page.js
'use client';

import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    favoriteWood: 'None'
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email) {
        console.log('No user email found');
        return;
      }
      
      setLoading(true);
      try {
        console.log('🟡 Fetching orders for email:', user.email);
        
        // Use the email-based API endpoint to get real orders
        const ordersResponse = await fetch(`/api/orders/user/email/${encodeURIComponent(user.email)}`);
        const ordersData = await ordersResponse.json();
        console.log("🟡 Orders data by email:", ordersData);

        if (ordersResponse.ok && ordersData.success) {
          const userOrders = ordersData.orders || [];
          console.log("🟡 Found orders by email:", userOrders.length);
          console.log("🟡 All orders:", userOrders);

          // Calculate stats from real orders
          const totalOrders = userOrders.length;
          const pendingOrders = userOrders.filter(order => 
            ['pending', 'processing', 'shipped', 'return_requested'].includes(order.status)
          ).length;
          
          // Calculate total spent from ALL orders using finalAmount
          const totalSpent = userOrders.reduce((sum, order) => {
            const orderAmount = order.finalAmount || order.totalAmount || 0;
            console.log(`Order ${order.orderNumber}: amount = ${orderAmount}`);
            return sum + orderAmount;
          }, 0);

          console.log("🟡 Total spent raw:", totalSpent);

          // Calculate favorite wood type
          const woodCount = {};
          userOrders.forEach(order => {
            order.items?.forEach(item => {
              const woodType = item.species || item.product?.species || 'Unknown';
              if (woodType && woodType !== 'Unknown') {
                woodCount[woodType] = (woodCount[woodType] || 0) + item.quantity;
              }
            });
          });

          const favoriteWood = Object.keys(woodCount).length > 0 
            ? Object.entries(woodCount).sort((a, b) => b[1] - a[1])[0][0]
            : 'None';

          console.log("🟡 Final stats:", {
            totalOrders,
            pendingOrders,
            totalSpent,
            favoriteWood
          });

          setStats({
            totalOrders,
            pendingOrders,
            totalSpent,
            favoriteWood
          });

          // Set recent orders (last 3 orders)
          setRecentOrders(userOrders.slice(0, 3));
        } else {
          console.error('Failed to fetch orders by email:', ordersData.error);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email) {
      fetchDashboardData();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'return_requested': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <Link href="/auth/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-medium text-2xl">
              {user.username?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name || user.username}!
            </h1>
            <p className="text-gray-600">
              {stats.totalOrders > 0 
                ? "Here's what's happening with your woodworking projects."
                : "Ready to start your first woodworking project?"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Single Layout with wider Total Spent */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Total Spent - Wider on medium screens and up */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:col-span-2">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Total Amount Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalSpent)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Across {stats.totalOrders} order{stats.totalOrders !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Favorite Wood */}
        
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            {stats.totalOrders > 0 && (
              <Link href="/profile/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-gray-600 text-sm">No recent orders</p>
              <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link 
                  key={order._id} 
                  href={`/profile/orders/${order._id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.createdAt ? formatDate(order.createdAt) : 'Date unavailable'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status?.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ') || 'Unknown'}
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatCurrency(order.finalAmount || order.totalAmount || 0)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/products"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🛒</div>
              <p className="font-medium text-gray-900">Shop Wood</p>
              <p className="text-sm text-gray-600">Browse our collection</p>
            </Link>

            {stats.totalOrders > 0 && (
              <Link 
                href="/profile/orders"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                <p className="font-medium text-gray-900">My Orders</p>
                <p className="text-sm text-gray-600">View order history</p>
              </Link>
            )}

            <Link 
              href="/projects"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔨</div>
              <p className="font-medium text-gray-900">Projects</p>
              <p className="text-sm text-gray-600">Get inspiration</p>
            </Link>

            <Link 
              href="/profile/settings"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
              <p className="font-medium text-gray-900">Settings</p>
              <p className="text-sm text-gray-600">Manage account</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}