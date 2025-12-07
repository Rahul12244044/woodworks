'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const itemCount = getCartItemsCount();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    console.log('🔄 Logout initiated for user:', user?.username);
    setIsLoggingOut(true);
    
    try {
      // Clear auth state first
      logout();
      console.log('✅ Auth state cleared');
      
      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force redirect to home page
      console.log('🔄 Redirecting to home page...');
      window.location.href = '/';
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Fallback redirect
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Debug info
  console.log('🔍 Header - Current user:', user);
  console.log('🔍 Header - User exists:', !!user);
  console.log('🔍 Header - User role:', user?.role);
  const handleAdminDashboardClick = (e) => {
  console.log('🔄 Admin Dashboard clicked');
  console.log('🔍 Current user in Header:', user);
  console.log('🔍 User role:', user?.role);
  console.log('🔍 Is user authenticated:', !!user);
  
  // Check localStorage directly
  const token = localStorage.getItem('token');
  console.log('🔍 Token in localStorage:', token);
  
  if (!user || user.role !== 'admin') {
    console.log('❌ Blocking navigation - user is not admin');
    e.preventDefault();
    return;
  }
  
  console.log('✅ Allowing navigation to admin dashboard');
};
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">WoodWorks</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Products
            </Link>
            <Link href="/species" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Wood Species
            </Link>
            <Link href="/projects" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Projects
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Menu - This should show Login/Sign Up when user is null */}
            {user ? (
              <div className="relative group">
                {/* Admin User */}
                {user.role === 'admin' ? (
                  <Link href="/admin"  onClick={handleAdminDashboardClick} className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
                      {user.username?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <span className="hidden sm:block font-medium">{user.username}</span>
                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full hidden md:block">
                      Admin
                    </span>
                  </Link>
                ) : (
                  // Regular User
                  <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
                      {user.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block font-medium">{user.username}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
                
                {/* Dropdown Menu for Regular Users */}
                {user.role !== 'admin' && (
                  <div className="absolute right-0 w-56 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link href="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        My Orders
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging out...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Dropdown Menu for Admin Users */}
                {user.role === 'admin' && (
                  <div className="absolute right-0 w-56 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-primary-600 font-medium capitalize">Administrator</p>
                    </div>
                    <div className="p-2">
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 bg-primary-50 rounded-md transition-colors font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging out...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // This should show when user is null (after logout)
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center space-x-6 pb-4 border-t border-gray-200 pt-4">
          <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium">
            Products
          </Link>
          <Link href="/species" className="text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium">
            Species
          </Link>
          <Link href="/projects" className="text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium">
            Projects
          </Link>
        </div>
      </div>
    </header>
  );
}