// app/terms/page.js
export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to WoodWorks. These Terms of Service govern your use of our website and services. 
                By accessing or using our services, you agree to be bound by these terms.
              </p>
            </section>

            {/* Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide accurate and complete information. 
                You are responsible for maintaining the confidentiality of your account and password.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You must be at least 18 years old to create an account</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any security breach</li>
              </ul>
            </section>

            {/* Orders and Payments */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Orders and Payments</h2>
              <p className="text-gray-700 mb-4">
                All orders are subject to acceptance and availability. We reserve the right to refuse 
                or cancel any order for any reason.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Prices are subject to change without notice</li>
                <li>Payment must be completed before order processing</li>
                <li>We accept various payment methods as displayed during checkout</li>
              </ul>
            </section>

            {/* Shipping and Delivery */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Shipping and Delivery</h2>
              <p className="text-gray-700 mb-4">
                We aim to process and ship orders promptly. Delivery times are estimates and may vary.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Shipping costs are calculated during checkout</li>
                <li>Risk of loss passes to you upon delivery</li>
                <li>You are responsible for providing accurate shipping information</li>
              </ul>
            </section>

            {/* Returns and Refunds */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Returns and Refunds</h2>
              <p className="text-gray-700 mb-4">
                We offer returns within 30 days of delivery for most items. Some restrictions apply.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Items must be in original condition</li>
                <li>Return shipping may be at customer's expense</li>
                <li>Refunds will be processed to the original payment method</li>
              </ul>
            </section>

            {/* Product Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Product Information</h2>
              <p className="text-gray-700 mb-4">
                We strive to provide accurate product descriptions and images. However, wood products 
                may have natural variations in color, grain, and texture.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Colors may vary due to monitor settings</li>
                <li>Dimensions are approximate</li>
                <li>Natural wood characteristics are not considered defects</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on this website, including text, images, logos, and designs, is the property 
                of WoodWorks and protected by intellectual property laws.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                WoodWorks shall not be liable for any indirect, incidental, special, or consequential 
                damages resulting from your use of our services.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Continued use of our services 
                after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 text-gray-700">
                <p>Email: legal@woodworks.com</p>
                <p>Phone: (555) 123-WOOD</p>
                <p>Address: 123 Woodcraft Lane, Portland, OR 97205</p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="border-t border-gray-200 pt-8">
              <p className="text-gray-700 italic">
                By using our website and services, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}