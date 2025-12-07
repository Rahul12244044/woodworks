import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Wood for<br />Your Masterpieces
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Discover the finest selection of hardwoods, live edge slabs, and exotic woods
            </p>
            <Link href="/products" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-3">
              Explore Our Wood
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌲</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Carefully selected woods with perfect moisture content</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Sizing</h3>
              <p className="text-gray-600">Get exactly what you need with our custom cutting service</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nationwide Shipping</h3>
              <p className="text-gray-600">Safe and secure delivery to your workshop</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
