// components/checkout/OrderSummary.js
import Image from 'next/image';
import { useCheckout } from '../../contexts/CheckoutContext';
import { useCart } from '../../contexts/CartContext';

export default function OrderSummary() {
  const { items } = useCart();
  const { cartTotal, shippingCost, tax, orderTotal } = useCheckout();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-xl text-gray-400">🪵</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
              <p className="text-xs text-gray-500 capitalize">
                {item.species} • Qty: {item.quantity}
              </p>
              <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-3">
          <span>Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Secure checkout • SSL encrypted</span>
        </div>
      </div>
    </div>
  );
}