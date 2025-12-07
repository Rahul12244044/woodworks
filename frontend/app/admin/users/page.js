'use client';

import { useState, useEffect } from 'react';
import { usersAPI } from '../../../lib/api';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await usersAPI.getUsers();
    console.log('✅ Users fetched successfully:', response.data);
    
    if (response.data && Array.isArray(response.data)) {
      setUsers(response.data);
    } else {
      console.warn('Unexpected users data structure:', response.data);
      setUsers([]);
    }
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    alert('Error loading users: ' + error.message);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

const updateUserRole = async (userId, newRole, userName) => {
  try {
    console.log('🔄 Starting role update for user:', userId);
    
    const response = await usersAPI.updateUser(userId, { role: newRole });
    console.log('✅ Update role API response:', response);
    
    if (response.data && response.data.success) {
      if (response.data.user) {
        // Update with the returned user data
        setUsers(prev => prev.map(user => 
          (user._id || user.id) === userId 
            ? { ...user, ...response.data.user }
            : user
        ));
      } else {
        // If no user data returned, update locally and refresh
        setUsers(prev => prev.map(user => 
          (user._id || user.id) === userId 
            ? { ...user, role: newRole }
            : user
        ));
      }
      alert(`User ${userName} role updated to ${newRole}`);
    } else {
      throw new Error('Update failed - no success response from server');
    }
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    alert('Error updating user role: ' + error.message);
  }
};

const toggleUserStatus = async (userId, currentlyActive, userName) => {
  try {
    console.log('🔄 Starting status toggle for user:', userId);
    
    const response = await usersAPI.updateUser(userId, { active: !currentlyActive });
    console.log('✅ Toggle status API response:', response);
    
    if (response.data && response.data.success) {
      if (response.data.user) {
        // Update with the returned user data
        setUsers(prev => prev.map(user => 
          (user._id || user.id) === userId 
            ? { ...user, ...response.data.user }
            : user
        ));
      } else {
        // If no user data returned, update locally and refresh
        setUsers(prev => prev.map(user => 
          (user._id || user.id) === userId 
            ? { ...user, active: !currentlyActive }
            : user
        ));
      }
      alert(`User ${userName} ${!currentlyActive ? 'activated' : 'deactivated'}`);
    } else {
      throw new Error('Update failed - no success response from server');
    }
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    alert('Error updating user status: ' + error.message);
  }
};

const deleteUser = async (userId, userName, currentUserId) => {
  if (userId === currentUserId) {
    alert('You cannot delete your own account');
    return;
  }

  if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
    try {
      console.log('🗑️ Starting user deletion for:', userId);
      
      const response = await usersAPI.deleteUser(userId);
      console.log('✅ Delete user API response:', response);
      
      if (response.data && response.data.success) {
        // Update local state
        setUsers(prev => prev.filter(user => (user._id || user.id) !== userId));
        alert('User deleted successfully');
      } else {
        throw new Error('Delete failed - no success response from server');
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      alert('Error deleting user: ' + error.message);
    }
  }
};
  // Force refresh users
  const forceRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.active) ||
                         (statusFilter === 'inactive' && !user.active);

    const matchesDate = dateFilter === 'all' || isWithinDateRange(user.createdAt, dateFilter);

    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  // Helper function for date filtering
  function isWithinDateRange(userDate, range) {
    const userDateObj = new Date(userDate);
    const now = new Date();
    
    switch (range) {
      case 'today':
        return userDateObj.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return userDateObj >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return userDateObj >= monthAgo;
      default:
        return true;
    }
  }

  // Role options
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'user', label: 'User', color: 'bg-blue-100 text-blue-800' },
    { value: 'moderator', label: 'Moderator', color: 'bg-green-100 text-green-800' }
  ];

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Date filter options
  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' }
  ];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role color
  const getRoleColor = (role) => {
    const option = roleOptions.find(opt => opt.value === role);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  // Get current user ID (in real app, this would come from auth context)
  const currentUserId = 'current_user_id'; // This should come from your auth context

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading users...</span>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-gray-600 mt-2">View and manage user accounts and permissions</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={forceRefresh}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Refresh users"
              >
                🔄 Refresh
              </button>
              <Link href="/admin/users/new">
                <Button>Add New User</Button>
              </Link>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Debug Info:</strong> Showing {filteredUsers.length} filtered users from {users.length} total users
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.active).length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => !u.active).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search Users
                </label>
                <input
                  type="text"
                  placeholder="Search by name, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
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
                  Joined Date
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

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id || user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 text-sm font-medium">
                                {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username || 'nousername'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.createdAt || user.joinDate)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        
                        
                        {/* Role Update Dropdown */}
                        
                        
                        <button
                          onClick={() => toggleUserStatus(user._id || user.id, user.active, user.name)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          {user.active ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        <button
                          onClick={() => deleteUser(user._id || user.id, user.name, currentUserId)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          disabled={user._id === currentUserId}
                          title={user._id === currentUserId ? 'Cannot delete your own account' : 'Delete user'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-6">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'No users found' 
                    : 'No users yet'
                  }
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your search terms or filters' 
                    : 'Users will appear here when they register accounts'
                  }
                </p>
                {!searchTerm && roleFilter === 'all' && statusFilter === 'all' && dateFilter === 'all' && (
                  <Link href="/admin/users/new">
                    <Button>Add Your First User</Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 py-4">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>
    </div>
  );
}