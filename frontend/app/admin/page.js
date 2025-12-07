// app/admin/page.js
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { connectDB } from '../../lib/db';


// Import models with correct paths - adjust based on your folder structure
import Product from '../../models/Product';
import User from '../../models/User';
import Order from '../../models/Orders';

async function getDashboardStats() {
  try {
    console.log('🟡 Starting dashboard stats fetch...');
    console.log('🟡 Models loaded - Product:', !!Product, 'User:', !!User, 'Order:', !!Order);
    
    // Connect to database FIRST
    console.log('🟡 Testing database connection...');
    await connectDB();
    console.log('🟢 Database connected successfully');

    // Test if models are working
    if (!Product) {
      throw new Error('Product model is not loaded');
    }

    console.log('🟡 Testing Product collection...');
    const productCount = await Product.countDocuments();
    console.log('🟢 Product count:', productCount);

    console.log('🟡 Testing User collection...');
    const userCount = await User.countDocuments();
    console.log('🟢 User count:', userCount);

    console.log('🟡 Testing Order collection...');
    const orderCount = await Order.countDocuments();
    console.log('🟢 Order count:', orderCount);

    console.log('🟡 Testing pending orders...');
    const pendingOrderCount = await Order.countDocuments({ status: 'pending' });
    console.log('🟢 Pending orders:', pendingOrderCount);

    const stats = {
      totalProducts: productCount,
      totalOrders: orderCount,
      totalUsers: userCount,
      pendingOrders: pendingOrderCount,
      revenue: 0 // Temporary
    };

    console.log('🟢 FINAL STATS:', stats);
    return stats;

  } catch (error) {
    console.error('🔴 CRITICAL ERROR fetching dashboard stats:', error);
    console.error('🔴 Error details:', error.message);
    
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      pendingOrders: 0,
      revenue: 0
    };
  }
}

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your woodworks store admin panel</p>
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
        <pre className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
          {JSON.stringify(stats, null, 2)}
        </pre>
        <p className="text-xs text-yellow-600 mt-2">
          Check browser console for detailed debug logs
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <span className="text-2xl">🌲</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/admin/products/new"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow block"
        >
          <div className="text-3xl mb-3">➕</div>
          <h3 className="font-semibold text-gray-900 mb-2">Add New Product</h3>
          <p className="text-gray-600 text-sm">Create a new wood product listing</p>
        </Link>

        <Link 
          href="/admin/orders"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow block"
        >
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Orders</h3>
          <p className="text-gray-600 text-sm">View and process customer orders</p>
        </Link>

        <Link 
          href="/admin/projects"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow block"
        >
          <div className="text-3xl mb-3">🔨</div>
          <h3 className="font-semibold text-gray-900 mb-2">Project Gallery</h3>
          <p className="text-gray-600 text-sm">Manage featured woodworking projects</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-700">Dashboard stats updated</span>
            </div>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-sm text-gray-700">Database connected successfully</span>
            </div>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-sm text-gray-700">System running normally</span>
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}