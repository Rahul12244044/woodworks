// app/shipping/page.js
'use client';

import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600">
            Fast, reliable shipping for all your woodworking needs
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Main Content */}
          <div className="p-8">
            {/* Shipping Methods */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Methods & Times</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-3xl mb-3">🚚</div>
                  <h3 className="font-semibold text-blue-900 mb-2">Standard Shipping</h3>
                  <p className="text-blue-700 text-sm mb-2">3-5 business days</p>
                  <p className="text-blue-600 text-sm">Free on orders over $100</p>
                  <p className="text-blue-600 text-sm">$9.99 for orders under $100</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-semibold text-green-900 mb-2">Express Shipping</h3>
                  <p className="text-green-700 text-sm mb-2">1-2 business days</p>
                  <p className="text-green-600 text-sm">$19.99 flat rate</p>
                  <p className="text-green-600 text-sm">Order by 2 PM for same-day dispatch</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="text-3xl mb-3">🏠</div>
                  <h3 className="font-semibold text-purple-900 mb-2">Local Pickup</h3>
                  <p className="text-purple-700 text-sm mb-2">Same day available</p>
                  <p className="text-purple-600 text-sm">Free - ready in 2 hours</p>
                  <p className="text-purple-600 text-sm">123 Craftsmanship Lane</p>
                </div>
              </div>
            </div>

            {/* Shipping Rates */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Rates</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Order Value</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Standard</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Express</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">Under $50</td>
                        <td className="py-3 px-4 text-gray-600">$12.99</td>
                        <td className="py-3 px-4 text-gray-600">$24.99</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">$50 - $100</td>
                        <td className="py-3 px-4 text-gray-600">$9.99</td>
                        <td className="py-3 px-4 text-gray-600">$19.99</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-700">Over $100</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">FREE</td>
                        <td className="py-3 px-4 text-gray-600">$19.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Delivery Areas */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Areas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🇺🇸 United States</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• All 50 states</li>
                    <li>• Free standard shipping over $100</li>
                    <li>• No shipping to PO boxes for large items</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🌍 International</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Canada & Mexico: $29.99</li>
                    <li>• Europe: $49.99</li>
                    <li>• Rest of World: $79.99</li>
                    <li>• Customs fees may apply</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Special Handling */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Handling Items</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📦</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Large Wood Pieces</h4>
                    <p className="text-gray-600 text-sm">Extra handling fee may apply for pieces over 8 feet</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🔨</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Heavy Machinery</h4>
                    <p className="text-gray-600 text-sm">Specialized freight shipping for equipment over 150 lbs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🌡️</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Temperature Sensitive</h4>
                    <p className="text-gray-600 text-sm">Some finishes and adhesives require climate-controlled shipping</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How long does processing take?</h4>
                  <p className="text-gray-600">Most orders are processed within 24 hours. Custom cuts and specialty items may take 2-3 business days.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Do you ship on weekends?</h4>
                  <p className="text-gray-600">We process orders Monday-Friday. Weekend delivery may be available for express shipping in some areas.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I track my order?</h4>
                  <p className="text-gray-600">Yes! You'll receive a tracking number via email as soon as your order ships.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What if my wood arrives damaged?</h4>
                  <p className="text-gray-600">Contact us within 48 hours of delivery with photos. We'll arrange a replacement or refund.</p>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary-900 mb-3">Need Help With Shipping?</h3>
              <p className="text-primary-700 mb-4">
                Our customer service team is here to help with any shipping questions or special requirements.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/contact" 
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Contact Support
                </Link>
                <Link 
                  href="/faq" 
                  className="border border-primary-600 text-primary-600 px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/returns" className="text-primary-600 hover:text-primary-700">
              Returns Policy
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/terms" className="text-primary-600 hover:text-primary-700">
              Terms of Service
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}