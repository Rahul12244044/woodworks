// components/checkout/PaymentForm.js
'use client';
import { useState } from 'react';
import { useCheckout } from '../../contexts/CheckoutContext';

export default function PaymentForm({ onNext, onBack }) {
  const { 
    paymentMethod, 
    setPaymentMethod, 
    sameAsShipping, 
    setSameAsShipping,
    billingAddress,
    setBillingAddress,
    shippingAddress
  } = useCheckout();
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors(prev => ({ ...prev, paymentMethod: '' }));
  };

  const handleCardChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBillingAddressChange = (field, value) => {
    setBillingAddress({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.number.trim()) newErrors.number = 'Card number is required';
      else if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) newErrors.number = 'Invalid card number';
      
      if (!cardDetails.name.trim()) newErrors.name = 'Name on card is required';
      
      if (!cardDetails.expiry.trim()) newErrors.expiry = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) newErrors.expiry = 'Invalid expiry date (MM/YY)';
      
      if (!cardDetails.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(cardDetails.cvv)) newErrors.cvv = 'Invalid CVV';
    }

    if (!sameAsShipping) {
      if (!billingAddress.firstName?.trim()) newErrors.billingFirstName = 'First name is required';
      if (!billingAddress.lastName?.trim()) newErrors.billingLastName = 'Last name is required';
      if (!billingAddress.address?.trim()) newErrors.billingAddress = 'Address is required';
      if (!billingAddress.city?.trim()) newErrors.billingCity = 'City is required';
      if (!billingAddress.state?.trim()) newErrors.billingState = 'State is required';
      if (!billingAddress.zipCode?.trim()) newErrors.billingZipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Method</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'card', name: 'Credit Card', icon: '💳' },
              { id: 'paypal', name: 'PayPal', icon: '🔵' },
              { id: 'applepay', name: 'Apple Pay', icon: '🍎' },
              { id: 'googlepay', name: 'Google Pay', icon: '📱' }
            ].map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => handlePaymentMethodChange(method.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <span className="text-xl mr-2">{method.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{method.name}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.paymentMethod && <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>}
        </div>

        {/* Credit Card Form */}
        {paymentMethod === 'card' && (
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Card Details</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardDetails.number}
                  onChange={(e) => handleCardChange('number', formatCardNumber(e.target.value))}
                  maxLength={19}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234 5678 9012 3456"
                />
                {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number}</p>}
              </div>

              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card *
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={cardDetails.name}
                  onChange={(e) => handleCardChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    id="cardExpiry"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardChange('expiry', e.target.value)}
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.expiry ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="MM/YY"
                  />
                  {errors.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>}
                </div>

                <div>
                  <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cardCvv"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                    maxLength={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123"
                  />
                  {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Address */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="sameAsShipping" className="ml-2 text-sm font-medium text-gray-900">
              Billing address same as shipping address
            </label>
          </div>

          {!sameAsShipping && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billingFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="billingFirstName"
                    value={billingAddress.firstName}
                    onChange={(e) => handleBillingAddressChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.billingFirstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billingFirstName && <p className="mt-1 text-sm text-red-600">{errors.billingFirstName}</p>}
                </div>

                <div>
                  <label htmlFor="billingLastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="billingLastName"
                    value={billingAddress.lastName}
                    onChange={(e) => handleBillingAddressChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.billingLastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billingLastName && <p className="mt-1 text-sm text-red-600">{errors.billingLastName}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="billingAddress"
                  value={billingAddress.address}
                  onChange={(e) => handleBillingAddressChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.billingAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.billingAddress && <p className="mt-1 text-sm text-red-600">{errors.billingAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="billingCity"
                    value={billingAddress.city}
                    onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.billingCity ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billingCity && <p className="mt-1 text-sm text-red-600">{errors.billingCity}</p>}
                </div>

                <div>
                  <label htmlFor="billingState" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="billingState"
                    value={billingAddress.state}
                    onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.billingState ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billingState && <p className="mt-1 text-sm text-red-600">{errors.billingState}</p>}
                </div>

                <div>
                  <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="billingZipCode"
                    value={billingAddress.zipCode}
                    onChange={(e) => handleBillingAddressChange('zipCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.billingZipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.billingZipCode && <p className="mt-1 text-sm text-red-600">{errors.billingZipCode}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Shipping
          </button>
          
          <button
            type="submit"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Review Order
          </button>
        </div>
      </form>
    </div>
  );
}