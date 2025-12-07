// components/checkout/ShippingForm.js
'use client';
import { useState } from 'react';
import { useCheckout } from '../../contexts/CheckoutContext';

export default function ShippingForm({ onNext }) {
  const { 
    shippingAddress, 
    setShippingAddress, 
    setSameAsShipping,
    shippingMethod,
    setShippingMethod,
    shippingCost // Add this to see the current shipping cost
  } = useCheckout();
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setShippingAddress({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingAddress.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingAddress.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingAddress.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) newErrors.email = 'Email is invalid';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSameAsShipping(true); // Default to same billing address
      onNext();
    }
  };

  const shippingMethods = [
    { 
      id: 'standard', 
      name: 'Standard Shipping', 
      price: 15.00, 
      displayPrice: '$15.00',
      time: '5-7 business days' 
    },
    { 
      id: 'express', 
      name: 'Express Shipping', 
      price: 25.00, 
      displayPrice: '$25.00',
      time: '2-3 business days' 
    },
    { 
      id: 'overnight', 
      name: 'Overnight Shipping', 
      price: 45.00, 
      displayPrice: '$45.00',
      time: 'Next business day' 
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={shippingAddress.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={shippingAddress.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={shippingAddress.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={shippingAddress.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            id="address"
            value={shippingAddress.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main St"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            id="apartment"
            value={shippingAddress.apartment}
            onChange={(e) => handleChange('apartment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Apt 4B"
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={shippingAddress.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Portland"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              id="state"
              value={shippingAddress.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="OR"
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>
          
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              value={shippingAddress.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.zipCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="97205"
            />
            {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
          </div>
        </div>

        {/* Shipping Method */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Method</h3>
          <div className="space-y-3">
            {shippingMethods.map((method) => (
              <label 
                key={method.id} 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  shippingMethod === method.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method.id}
                    checked={shippingMethod === method.id}
                    onChange={(e) => handleShippingMethodChange(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">{method.name}</span>
                    <span className="block text-sm text-gray-500">{method.time}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{method.displayPrice}</span>
              </label>
            ))}
          </div>
          
          {/* Live Price Update Display */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Selected Shipping:</strong> {shippingMethods.find(m => m.id === shippingMethod)?.name} - {
                shippingMethods.find(m => m.id === shippingMethod)?.displayPrice
              }
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Current Shipping Cost:</strong> ${shippingCost.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}