'use client';
import { useCart } from '../../contexts/CartContext';
import { useCheckout } from '../../contexts/CheckoutContext';
import { useRouter } from 'next/navigation';

export default function OrderReview({ onBack, isProcessing }) {
  const { items, getCartTotal } = useCart();
  const { 
    shippingAddress, 
    billingAddress, 
    sameAsShipping, 
    shippingMethod, 
    paymentMethod, 
    orderNotes,
    createOrder,
    cartTotal,
    shippingCost,
    tax,
    orderTotal
  } = useCheckout();
  
  const router = useRouter();

  // OrderReview.js - Update handlePlaceOrder function
const handlePlaceOrder = async () => {
  try {
    console.log('🟡 Starting order placement...');
    const order = await createOrder();
    
    console.log('📦 Order creation result:', order);
    
    // Try multiple possible ID locations
    const orderId = order?._id || order?.order?._id || order?.data?._id;
    const orderNumber = order?.orderNumber || order?.order?.orderNumber;
    
    console.log('🔍 Extracted order ID:', orderId);
    console.log('🔍 Extracted order number:', orderNumber);

    if (orderId) {
      console.log('✅ Redirecting to confirmation with order ID:', orderId);
      router.push(`/checkout/confirmation?orderId=${orderId}`);
    } else if (orderNumber) {
      console.log('✅ Redirecting to confirmation with order number:', orderNumber);
      router.push(`/checkout/confirmation?orderNumber=${orderNumber}`);
    } else {
      console.error('❌ No order ID or order number found in response:', order);
      throw new Error('No order identification returned. Please check console for details.');
    }
  } catch (error) {
    console.error('🔴 Failed to place order:', error);
    alert(`Failed to place order: ${error.message}`);
  }
};

  const getShippingMethodName = () => {
    switch (shippingMethod) {
      case 'standard': return 'Standard Shipping (5-7 business days)';
      case 'express': return 'Express Shipping (2-3 business days)';
      case 'overnight': return 'Overnight Shipping (Next business day)';
      default: return 'Standard Shipping';
    }
  };

  // components/checkout/OrderReview.js - Update getPaymentMethodName function
   const getPaymentMethodName = () => {
    switch (paymentMethod) {
    case 'card': return 'Credit Card';
    case 'paypal': return 'PayPal';
    case 'applepay': return 'Apple Pay';
    case 'googlepay': return 'Google Pay';
    default: return 'Credit Card';
  }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
      
      <div className="space-y-8">
        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
            <p>{shippingAddress.address}</p>
            {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
            <p>{shippingAddress.country}</p>
            <p className="mt-2">{shippingAddress.email}</p>
            <p>{shippingAddress.phone}</p>
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Billing Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {sameAsShipping ? (
              <p className="text-gray-600">Same as shipping address</p>
            ) : (
              <>
                <p className="font-medium">{billingAddress.firstName} {billingAddress.lastName}</p>
                <p>{billingAddress.address}</p>
                {billingAddress.apartment && <p>{billingAddress.apartment}</p>}
                <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                <p>{billingAddress.country}</p>
              </>
            )}
          </div>
        </div>

        {/* Shipping Method */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Method</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{getShippingMethodName()}</p>
            <p className="text-gray-600">${shippingCost.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{getPaymentMethodName()}</p>
            {paymentMethod === 'card' && <p className="text-gray-600">Card ending in •••• 3456</p>}
          </div>
        </div>

        {/* Order Notes */}
        {orderNotes && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Order Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">{orderNotes}</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
          <div className="border border-gray-200 rounded-lg">
            {items.map((item, index) => (
              <div key={item._id} className={`flex items-center justify-between p-4 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🪵</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {item.species} • Qty: {item.quantity}
                    </p>
                    {item.dimensions && (
                      <p className="text-xs text-gray-500">
                        {typeof item.dimensions === 'string' 
                          ? item.dimensions 
                          : `${item.dimensions.thickness}" × ${item.dimensions.width}" × ${item.dimensions.length}"`
                        }
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>By placing this order, you agree to our terms of service and privacy policy.</p>
                <p className="mt-1">Wood products may have natural variations in color and grain pattern.</p>
                <p className="mt-1">Orders are stored securely in our database and can be viewed in your account.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Back to Payment
          </button>
          
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Order...
              </>
            ) : (
              `Place Order - $${orderTotal.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}