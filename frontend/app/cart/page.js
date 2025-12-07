// app/cart/page.js
'use client';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/cart/CartItem';
import Button from '../../components/ui/Button';

export default function CartPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 0 ? 15.00 : 0; // Free shipping over $100?
  const tax = cartTotal * 0.08; // 8% tax
  const orderTotal = cartTotal + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any wood products to your cart yet. Start exploring our premium collection!
          </p>
          <Link href="/products">
            <Button variant="primary">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Cart Items ({items.length})
            </h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/checkout" className="block">
                <Button variant="primary" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Security Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-4 text-gray-500">
                <div className="flex items-center gap-1 text-sm">
                  <span>🔒</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span>🛡️</span>
                  <span>Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}