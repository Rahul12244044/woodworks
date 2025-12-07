import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white mb-4 block">
              WoodWorks
            </Link>
            <p className="text-gray-300 mb-6">
              Premium wood and craftsmanship for your next project. 
              We provide the finest selection of hardwoods, live edge slabs, and exotic woods.
            </p>
            
            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="text-gray-300 space-y-2">
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  123 Woodcraft Avenue, Portland, OR 97201
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📞</span>
                  (555) 123-4567
                </p>
                <p className="flex items-center">
                  <span className="mr-2">✉️</span>
                  info@woodworks.com
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🕒</span>
                  Mon-Fri: 9 AM - 6 PM | Sat: 10 AM - 4 PM
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🌲</span>
                Products
              </Link></li>
              <li><Link href="/species" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🌳</span>
                Wood Species
              </Link></li>
              <li><Link href="/projects" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🔨</span>
                Projects
              </Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <span className="mr-2">🏢</span>
                About Us
              </Link></li>
            </ul>
          </div>

          {/* Support & Map */}
          <div className="space-y-8">
            {/* Support Section */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">💬</span>
                  Contact
                </Link></li>
                <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">🚚</span>
                  Shipping
                </Link></li>
                <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">↩️</span>
                  Returns
                </Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">❓</span>
                  FAQ
                </Link></li>
              </ul>
            </div>

            {/* Map & Directions Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <span className="mr-2">🗺️</span>
                Find Us
              </h3>
              
              {/* Google Map */}
              <div className="bg-gray-700 rounded-lg overflow-hidden h-40 mb-3">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.3822570499425!2d-122.67647968423277!3d45.52306213755999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950a021e6f2c9b%3A0x5c5c5c5c5c5c5c5c!2sPortland%2C%20OR%2C%20USA!5e0!3m2!1sen!2sus!4v1633456789012!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="WoodWorks Location"
                  className="rounded-lg"
                ></iframe>
              </div>
              
              {/* Enhanced Get Directions Button with Earth */}
              
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Simplified */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} WoodWorks. All rights reserved.</p>
            <p className="text-sm mt-2">Premium Wood & Craftsmanship</p>
          </div>
        </div>
      </div>
    </footer>
  );
}