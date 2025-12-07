// app/profile/addresses/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Debug the editingAddress state
  useEffect(() => {
    if (editingAddress) {
      console.log('🟡 editingAddress object:', editingAddress);
      console.log('🟡 editingAddress._id:', editingAddress._id);
    }
  }, [editingAddress]);
  

  // Fetch addresses from database
useEffect(() => {
  const fetchAddresses = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user._id}/addresses`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('✅ Fetched addresses:', data.addresses);
        setAddresses(data.addresses || []);
      } else {
        console.error('Failed to fetch addresses:', data.error);
        alert('Failed to load addresses. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      alert('Error loading addresses. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    fetchAddresses();
  }
}, [user]);

  const handleAddAddress = async (newAddress) => {
    try {
      const response = await fetch(`/api/users/${user._id}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAddresses([...addresses, data.address]);
        setShowAddForm(false);
      } else {
        console.error('Failed to add address:', data.error);
        alert('Failed to add address. Please try again.');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Error adding address. Please try again.');
    }
  };

  const handleEditAddress = async (updatedAddress) => {
    try {
      console.log('🟡 Editing address with ID:', updatedAddress._id);
      
      const response = await fetch(`/api/users/${user._id}/addresses/${updatedAddress._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAddress),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAddresses(addresses.map(addr => 
          addr._id === updatedAddress._id ? data.address : addr
        ));
        setEditingAddress(null);
      } else {
        console.error('Failed to update address:', data.error);
        alert('Failed to update address. Please try again.');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Error updating address. Please try again.');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (addresses.length <= 1) {
      alert('You must have at least one address.');
      return;
    }

    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${user._id}/addresses/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAddresses(addresses.filter(addr => addr._id !== id));
      } else {
        console.error('Failed to delete address:', data.error);
        alert('Failed to delete address. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Error deleting address. Please try again.');
    }
  };

  const setDefaultAddress = async (id) => {
  try {
    console.log('🟡 Setting default address:', id);
    console.log('🟡 Current user ID:', user._id);
    
    // Use the existing PUT route with a special flag
    const response = await fetch(`/api/users/${user._id}/addresses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _isDefaultOnly: true  // Special flag to indicate this is only for setting default
      }),
    });

    // Check if response is OK before parsing JSON
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Update the local state to reflect the change
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === id
      })));
      console.log('✅ Default address updated successfully');
    } else {
      console.error('Failed to set default address:', data.error);
      alert('Failed to set default address. Please try again.');
    }
  } catch (error) {
    console.error('Error setting default address:', error);
    console.error('Error details:', error.message);
    
    if (error.message.includes('404')) {
      alert('Address not found. Please refresh the page and try again.');
    } else if (error.message.includes('400')) {
      alert('Invalid request. Please try again.');
    } else {
      alert('Error setting default address. Please try again.');
    }
  }
};
  // ADD THIS MISSING FUNCTION
  const handleEditClick = (address) => {
    console.log('🟡 Setting editing address:', address);
    console.log('🟡 Address _id:', address._id);
    setEditingAddress(address);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your addresses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
          <p className="text-gray-600 mt-1">Manage your shipping and billing addresses</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Add New Address
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading addresses...</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingAddress) && (
        <AddressForm
          address={editingAddress}
          onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
          onCancel={() => {
            setShowAddForm(false);
            setEditingAddress(null);
          }}
        />
      )}

      {/* Addresses Grid */}
      {!loading && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{address.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    address.type === 'shipping' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {address.type === 'shipping' ? 'Shipping' : 'Billing'}
                  </span>
                  {address.isDefault && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 ml-2">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="text-gray-600 hover:text-gray-900 p-1"
                  >
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>{address.street}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p className="mt-2">{address.phone}</p>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address._id)}
                  className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && addresses.length === 0 && !showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses yet</h3>
          <p className="text-gray-600 mb-6">Add your first address to get started with orders.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
}

// Address Form Component - FIXED VERSION
function AddressForm({ address, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: address?.type || 'shipping',
    name: address?.name || '',
    street: address?.street || '',
    apartment: address?.apartment || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    country: address?.country || 'United States',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // FIX: Include the _id when editing an existing address
      const submitData = address 
        ? { ...formData, _id: address._id }  // Include the _id for edits
        : formData;                          // No _id for new addresses
      
      console.log('🟡 Submitting data:', submitData);
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {address ? 'Edit Address' : 'Add New Address'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields remain the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="shipping">Shipping Address</option>
              <option value="billing">Billing Address</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="123 Main St"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            value={formData.apartment}
            onChange={(e) => handleChange('apartment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Portland"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="OR"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="97205"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => handleChange('isDefault', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
            Set as default address
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : (address ? 'Update Address' : 'Add Address')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}