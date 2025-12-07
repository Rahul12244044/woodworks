// app/returns/page.js
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ReturnsPage() {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // In your returns page, update the handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);

  // Client-side validation
  if (!selectedOrder || !returnReason || !description) {
    setSubmitStatus({
      type: 'error',
      message: 'Please fill in all required fields'
    });
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await fetch('/api/orders/returns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderNumber: selectedOrder.trim(),
        reason: returnReason,
        description: description.trim(),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSubmitStatus({
        type: 'success',
        message: data.message || 'Return request submitted successfully!',
        returnId: data.returnId
      });
      // Reset form
      setSelectedOrder('');
      setReturnReason('');
      setDescription('');
    } else {
      setSubmitStatus({
        type: 'error',
        message: data.error || 'Failed to submit return request. Please try again.'
      });
    }
  } catch (error) {
    setSubmitStatus({
      type: 'error',
      message: 'Network error. Please check your connection and try again.'
    });
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Easy returns and exchanges within 30 days of purchase
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {submitStatus.type === 'success' ? '✅' : '❌'}
              <div>
                <p className="font-medium">{submitStatus.message}</p>
                {submitStatus.returnId && (
                  <p className="text-sm mt-1">
                    <strong>Return ID:</strong> {submitStatus.returnId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Return Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Request a Return</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  placeholder="e.g., WOOD-20251123-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Find your order number in your order confirmation email or order history
                </p>
              </div>

              <div>
                <label htmlFor="returnReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Return *
                </label>
                <select
                  id="returnReason"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="wrong-item">Wrong item received</option>
                  <option value="damaged">Item arrived damaged</option>
                  <option value="not-as-described">Not as described</option>
                  <option value="size-issue">Size doesn't fit</option>
                  <option value="changed-mind">Changed my mind</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Please provide detailed information about why you're returning the item..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Return Request'
                )}
              </button>
            </form>
          </div>

          {/* Return Policy Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Return Policy</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p><strong>30-Day Return Window:</strong> Returns accepted within 30 days of delivery</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p><strong>Free Returns:</strong> We provide free return shipping labels</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p><strong>Full Refund:</strong> Refund issued to original payment method</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p><strong>Condition:</strong> Items must be unused and in original packaging</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">What Happens Next?</h3>
              <div className="space-y-2 text-blue-700 text-sm">
                <p>1. Submit your return request</p>
                <p>2. We'll review your request within 24 hours</p>
                <p>3. You'll receive a return shipping label</p>
                <p>4. Ship the items back to us</p>
                <p>5. Receive your refund once we process the return</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Notes</h3>
              <ul className="space-y-2 text-yellow-700 text-sm">
                <li>• Custom-cut wood cannot be returned</li>
                <li>• Return processing takes 5-7 business days</li>
                <li>• Refunds appear in 3-5 business days after processing</li>
                <li>• Keep your original packaging until return is complete</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <Link 
              href="/orders" 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              View My Orders
            </Link>
            <Link 
              href="/contact" 
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}