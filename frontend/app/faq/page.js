// app/faq/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqSections = [
    {
      title: "Ordering & Payment",
      items: [
        {
          id: 'order-1',
          question: "How do I place an order?",
          answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You can checkout as a guest or create an account for faster future purchases."
        },
        {
          id: 'order-2',
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through encrypted channels."
        },
        {
          id: 'order-3',
          question: "Can I modify or cancel my order?",
          answer: "Orders can be modified or cancelled within 1 hour of placement. After that, please contact our customer service team immediately at support@woodworks.com or call (555) 123-WOOD."
        },
        {
          id: 'order-4',
          question: "Do you offer volume discounts?",
          answer: "Yes! We offer quantity discounts for bulk orders. Contact our sales team at sales@woodworks.com for custom pricing on large projects or commercial quantities."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      items: [
        {
          id: 'shipping-1',
          question: "What are your shipping options and costs?",
          answer: "We offer standard shipping (5-7 business days, $15), express shipping (2-3 business days, $25), and overnight shipping (next business day, $45). Shipping costs are calculated at checkout based on order size and destination."
        },
        {
          id: 'shipping-2',
          question: "How long does processing take before shipping?",
          answer: "Most orders are processed within 1-2 business days. Custom cuts or specialty items may take 3-5 business days. You'll receive a tracking number once your order ships."
        },
        {
          id: 'shipping-3',
          question: "Do you ship internationally?",
          answer: "Currently, we ship within the United States and Canada. International shipping may be available for large commercial orders - please contact us for details."
        },
        {
          id: 'shipping-4',
          question: "Can I track my order?",
          answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'My Orders' section."
        },
        {
          id: 'shipping-5',
          question: "What if I'm not home when my order arrives?",
          answer: "Most of our wood products don't require signature confirmation. The carrier will leave the package at your door. For high-value orders, you may request signature confirmation during checkout."
        }
      ]
    },
    {
      title: "Wood & Materials",
      items: [
        {
          id: 'wood-1',
          question: "Are your woods sustainably sourced?",
          answer: "Absolutely! We're committed to sustainable forestry practices. All our wood comes from responsibly managed forests, and we provide certification details for each species when available."
        },
        {
          id: 'wood-2',
          question: "What's the moisture content of your wood?",
          answer: "Our lumber is properly dried to 6-8% moisture content for indoor use. Slabs and thicker pieces may have slightly higher moisture content suitable for their intended applications."
        },
        {
          id: 'wood-3',
          question: "Can I request custom dimensions?",
          answer: "Yes! We offer custom cutting services. During checkout, specify your required dimensions in the product notes, or contact us directly for complex custom requirements."
        },
        {
          id: 'wood-4',
          question: "Do you offer wood samples?",
          answer: "We offer sample packs of our most popular species for $25 (refundable with your first order). Contact us to request a sample pack."
        },
        {
          id: 'wood-5',
          question: "How should I store and acclimate the wood?",
          answer: "Store wood in a dry, climate-controlled environment. Allow 1-2 weeks for acclimation to your shop's conditions before beginning your project. Keep wood flat and supported to prevent warping."
        }
      ]
    },
    {
      title: "Returns & Warranty",
      items: [
        {
          id: 'returns-1',
          question: "What is your return policy?",
          answer: "We accept returns within 30 days of delivery for unused wood in original condition. Custom-cut pieces and finished products are final sale. Return shipping is the customer's responsibility."
        },
        {
          id: 'returns-2',
          question: "What if I receive damaged wood?",
          answer: "Inspect your shipment immediately. If you find damage, take photos and contact us within 48 hours. We'll arrange for replacement or refund of damaged items at no cost to you."
        },
        {
          id: 'returns-3',
          question: "Do you guarantee wood quality?",
          answer: "We carefully select and inspect all wood before shipping. Natural characteristics like knots, grain variations, and color differences are normal and not considered defects. We guarantee against structural defects and excessive warping."
        },
        {
          id: 'returns-4',
          question: "What about wood that warps after delivery?",
          answer: "Minor movement is natural in wood. Significant warping occurring within 30 days due to manufacturing issues will be addressed. Proper storage and acclimation are essential for wood stability."
        }
      ]
    },
    {
      title: "Projects & Support",
      items: [
        {
          id: 'project-1',
          question: "Do you offer woodworking advice or project plans?",
          answer: "Yes! Check out our Project Gallery for inspiration and free basic plans. For complex projects, we offer consultation services and detailed plans starting at $25."
        },
        {
          id: 'project-2',
          question: "Can you help me choose the right wood for my project?",
          answer: "Absolutely! Our wood experts are available to help you select the perfect species and grade for your project. Contact us with your project details and requirements."
        },
        {
          id: 'project-3',
          question: "Do you offer finishing advice?",
          answer: "We provide basic finishing guidance for all our wood species. Check our blog for finishing tutorials, or contact us for specific project advice."
        },
        {
          id: 'project-4',
          question: "Can I visit your showroom?",
          answer: "We have a showroom at 123 Woodcraft Lane, Artisanville. Open Monday-Friday 9AM-6PM, Saturday 10AM-4PM. Please call ahead for large project consultations."
        }
      ]
    },
    {
      title: "Account & Technical",
      items: [
        {
          id: 'account-1',
          question: "How do I create an account?",
          answer: "Click 'Sign Up' in the top navigation, or create an account during checkout. Having an account lets you track orders, save favorites, and get personalized recommendations."
        },
        {
          id: 'account-2',
          question: "I forgot my password. How can I reset it?",
          answer: "Click 'Forgot Password' on the login page. We'll send a reset link to your email. The link expires in 2 hours for security."
        },
        {
          id: 'account-3',
          question: "How do I update my account information?",
          answer: "Log into your account and go to 'Account Settings' to update your personal information, shipping addresses, and notification preferences."
        },
        {
          id: 'account-4',
          question: "Is my personal information secure?",
          answer: "Yes! We use industry-standard encryption and never store your complete payment information. Read our Privacy Policy for details on how we protect your data."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about ordering, shipping, wood selection, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              onChange={(e) => {
                // Simple search implementation
                const searchTerm = e.target.value.toLowerCase();
                if (searchTerm) {
                  const allItems = faqSections.flatMap(section => section.items);
                  const matchingItems = allItems.filter(item => 
                    item.question.toLowerCase().includes(searchTerm) || 
                    item.answer.toLowerCase().includes(searchTerm)
                  );
                  console.log('Search results:', matchingItems.length);
                }
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            {faqSections.map((section, index) => (
              <a
                key={index}
                href={`#section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqSections.map((section, sectionIndex) => (
            <section 
              key={sectionIndex} 
              id={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {section.title}
              </h2>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-lg"
                    >
                      <span className="text-lg font-medium text-gray-900 pr-4">
                        {item.question}
                      </span>
                      <svg
                        className={`h-5 w-5 text-gray-500 transform transition-transform ${
                          openItems[item.id] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openItems[item.id] && (
                      <div className="px-6 pb-4">
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Still have questions?</h2>
            <p className="text-primary-700 mb-6">
              Our wood experts are here to help you with any questions about materials, projects, or orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@woodworks.com"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Email Support
              </a>
              <a
                href="tel:5551239663"
                className="bg-white text-primary-600 border border-primary-300 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                Call (555) 123-WOOD
              </a>
              <Link
                href="/contact"
                className="bg-white text-primary-600 border border-primary-300 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                Contact Form
              </Link>
            </div>
            <div className="mt-6 text-sm text-primary-600">
              <p>Monday - Friday: 8:00 AM - 6:00 PM EST</p>
              <p>Saturday: 9:00 AM - 4:00 PM EST</p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/projects"
            className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">🔨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Project Gallery</h3>
            <p className="text-gray-600 text-sm">Get inspired by woodworking projects</p>
          </Link>
          
          <Link
            href="/blog"
            className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">Woodworking Blog</h3>
            <p className="text-gray-600 text-sm">Tips, tutorials, and techniques</p>
          </Link>
          
          <Link
            href="/materials-guide"
            className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">🌲</div>
            <h3 className="font-semibold text-gray-900 mb-2">Wood Guide</h3>
            <p className="text-gray-600 text-sm">Learn about different wood species</p>
          </Link>
        </div>
      </div>
    </div>
  );
}