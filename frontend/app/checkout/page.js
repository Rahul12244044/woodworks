// app/checkout/page.js
'use client';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useCheckout } from '../../contexts/CheckoutContext';
import CheckoutSteps from '../../components/checkout/CheckoutSteps';
import ShippingForm from '../../components/checkout/ShippintForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import OrderReview from '../../components/checkout/OrderReview';
import OrderSummary from '../../components/checkout/OrderSummary';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const { shippingAddress, paymentMethod } = useCheckout();
  const [currentStep, setCurrentStep] = useState('shipping'); // shipping → payment → review
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 0 ? 15.00 : 0;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingCost + tax;

  // Validation functions
  const isShippingValid = () => {
    return shippingAddress.firstName && 
           shippingAddress.lastName && 
           shippingAddress.email && 
           shippingAddress.address && 
           shippingAddress.city && 
           shippingAddress.state && 
           shippingAddress.zipCode;
  };

  const isPaymentValid = () => {
    return paymentMethod && paymentMethod !== '';
  };

  const handleNextStep = () => {
    if (currentStep === 'shipping' && isShippingValid()) {
      setCurrentStep('payment');
    } else if (currentStep === 'payment' && isPaymentValid()) {
      setCurrentStep('review');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call to process order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      window.location.href = '/checkout/success';
      
    } catch (error) {
      console.error('Order processing failed:', error);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some wood products to your cart before checking out.</p>
          <a href="/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Steps */}
        <CheckoutSteps currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Checkout Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {currentStep === 'shipping' && (
                <ShippingForm onNext={handleNextStep} />
              )}
              
              {currentStep === 'payment' && (
                <PaymentForm 
                  onNext={handleNextStep} 
                  onBack={handlePreviousStep}
                />
              )}
              
              {currentStep === 'review' && (
                <OrderReview 
                  onPlaceOrder={handlePlaceOrder}
                  onBack={handlePreviousStep}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary 
              items={items}
              cartTotal={cartTotal}
              shippingCost={shippingCost}
              tax={tax}
              orderTotal={orderTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}