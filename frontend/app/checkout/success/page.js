'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // You could also track the conversion here
    console.log('Purchase completed successfully');
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✅</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Thank you for your purchase! Your order has been received and is being processed. 
          You will receive a confirmation email shortly with your order details and tracking information.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Order confirmation email within 5 minutes</li>
            <li>• Processing time: 1-2 business days</li>
            <li>• Shipping notification with tracking number</li>
            <li>• Delivery in 3-7 business days</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary px-8 py-3">
            Continue Shopping
          </Link>
          <Link href="/profile/orders" className="btn-outline px-8 py-3">
            View Order History
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Questions about your order? <Link href="/contact" className="text-primary-600 hover:text-primary-700">Contact us</Link>
        </div>
      </div>
    </div>
  );
}