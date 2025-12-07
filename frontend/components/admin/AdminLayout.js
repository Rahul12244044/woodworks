// components/admin/AdminLayout.js - DEBUG VERSION
'use client';

import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  console.log('🔐 AdminLayout RENDER - State:', {
    loading,
    user: user ? { 
      username: user.username, 
      role: user.role,
      id: user._id 
    } : 'null',
    pathname,
    authChecked
  });

  useEffect(() => {
    console.log('🔄 AdminLayout EFFECT - Starting auth check...');
    
    // Only check auth when loading is complete
    if (!loading) {
      console.log('✅ Loading complete, checking auth...');
      console.log('📋 User details:', user);
      
      if (!user) {
        console.log('❌ No user found, redirecting to login');
        console.log('📍 Current path:', pathname);
        router.push('/auth/login?redirect=' + encodeURIComponent(pathname));
        return;
      }
      
      // Check if user is admin
      const isAdmin = user.role === 'admin';
      console.log('👑 Admin check:', {
        userRole: user.role,
        isAdmin: isAdmin,
        requiredRole: 'admin'
      });
      
      if (!isAdmin) {
        console.log('🚫 User is NOT admin, redirecting to home');
        console.log('👤 User details:', {
          username: user.username,
          role: user.role,
          email: user.email
        });
        router.push('/');
        return;
      }
      
      console.log('🎉 ADMIN ACCESS GRANTED!');
      console.log('👤 Admin user:', user.username);
      setAuthChecked(true);
    } else {
      console.log('⏳ Still loading...');
    }
  }, [user, loading, pathname, router]);

  // Show different states based on auth status
  console.log('📊 AdminLayout - Current state:', {
    loading,
    hasUser: !!user,
    userRole: user?.role,
    authChecked,
    shouldShowContent: !loading && user && user.role === 'admin'
  });

  // 1. Show loading while checking auth
  if (loading) {
    console.log('🔄 Showing loading state...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
          <p className="text-xs text-gray-500 mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 2. Show redirect message if no user
  if (!loading && !user) {
    console.log('❌ No user - showing redirect to login');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
          <p className="text-xs text-gray-500 mt-2">Please log in to access admin panel</p>
        </div>
      </div>
    );
  }

  // 3. Show access denied if user exists but isn't admin
  if (!loading && user && user.role !== 'admin') {
    console.log('🚫 User is not admin - showing access denied');
    console.log('👤 Non-admin user details:', user);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-2">You don't have permission to access the admin panel.</p>
          <p className="text-sm text-gray-500 mb-4">
            Logged in as: <span className="font-medium">{user.username}</span> 
            (Role: <span className="font-medium">{user.role}</span>)
          </p>
          <div className="flex gap-3 justify-center">
            <Link 
              href="/" 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. If we get here, user should be admin
  console.log('✅ RENDERING ADMIN PANEL - User is admin:', user.username);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Products', href: '/admin/products', icon: '🌲' },
    { name: 'Blog', href: '/admin/blog', icon: '📝' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Projects', href: '/admin/projects', icon: '🔨' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Contact Messages', href: '/admin/contact-messages', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-2xl">🌲</span>
              <span className="font-bold text-gray-900">WoodWorks Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-xs text-primary-600 font-medium capitalize">
                  {user?.role || 'Admin'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                console.log('🚪 Admin logging out...');
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              <span className="text-lg">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Admin Top Bar - Only show on mobile */}
        <div className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl">🌲</span>
            <span className="font-bold text-gray-900">Admin</span>
          </Link>
          <span className="text-sm text-primary-600 font-medium capitalize">
            {user?.role}
          </span>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 text-sm">
              ✅ Admin access granted to <strong>{user.username}</strong> (Role: <strong>{user.role}</strong>)
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}