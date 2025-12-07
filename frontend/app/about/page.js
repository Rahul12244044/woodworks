// app/about/page.js
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'John Timberlake',
      role: 'Founder & Master Woodworker',
      bio: 'With over 20 years of experience in fine woodworking, John started WoodWorks to share his passion for premium wood materials with fellow craftsmen.',
      image: '/team/john.jpg',
      specialty: 'Live Edge Slabs'
    },
    {
      name: 'Sarah Oakenshield',
      role: 'Wood Specialist',
      bio: 'Sarah brings her expertise in wood species identification and sustainable sourcing to ensure we offer only the finest materials.',
      image: '/team/sarah.jpg',
      specialty: 'Exotic Woods'
    },
    {
      name: 'Mike Carpenter',
      role: 'Operations Manager',
      bio: 'Mike ensures that every order is processed efficiently and that our customers receive their materials in perfect condition.',
      image: '/team/mike.jpg',
      specialty: 'Customer Service'
    },
    {
      name: 'Emily Forest',
      role: 'Project Consultant',
      bio: 'Emily helps our customers choose the right materials for their projects and provides expert advice on woodworking techniques.',
      image: '/team/emily.jpg',
      specialty: 'Project Planning'
    }
  ];

  const values = [
    {
      icon: '🌳',
      title: 'Sustainable Sourcing',
      description: 'We partner with responsible forestry operations to ensure our wood comes from sustainable sources.'
    },
    {
      icon: '🔨',
      title: 'Craftsmanship',
      description: 'Every piece of wood is hand-selected by our experts to meet the highest standards of quality.'
    },
    {
      icon: '💝',
      title: 'Customer Focus',
      description: 'We\'re dedicated to helping woodworkers of all skill levels bring their creative visions to life.'
    },
    {
      icon: '🚚',
      title: 'Reliable Delivery',
      description: 'Your materials are carefully packaged and shipped to arrive in perfect condition, ready for your projects.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Wood Species' },
    { number: '10,000+', label: 'Satisfied Customers' },
    { number: '25+', label: 'Years Experience' },
    { number: '50+', label: 'Countries Served' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At WoodWorks, we believe that every piece of wood tells a story. Our mission is 
                to connect woodworkers with the perfect materials that bring their creative visions 
                to life while promoting sustainable practices in the wood industry.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From rare exotic woods to locally sourced hardwoods, we carefully select each piece 
                for its unique character, grain pattern, and potential to become something extraordinary.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products" 
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Explore Our Products
                </Link>
                <Link 
                  href="/contact" 
                  className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🌲</span>
                  <p className="text-primary-800 font-medium text-lg">
                    Quality Wood for Quality Craftsmanship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">By The Numbers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to quality and service has helped us grow and serve woodworkers around the world.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from selecting materials to serving our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate wood experts dedicated to helping you find the perfect materials for your projects.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl text-primary-600">👤</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">⭐</span>
                    <span>Specialty: {member.specialty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From forest to your workshop, we ensure every step meets our high standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sourcing', description: 'We partner with sustainable forestry operations worldwide', icon: '🌍' },
              { step: '2', title: 'Selection', description: 'Each piece is hand-selected by our wood experts', icon: '👁️' },
              { step: '3', title: 'Processing', description: 'Careful milling and preparation for your projects', icon: '🔧' },
              { step: '4', title: 'Delivery', description: 'Secure packaging and reliable shipping to your door', icon: '📦' }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <div className="text-3xl mb-3">{process.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Next Project?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of premium woods and find the perfect materials for your masterpiece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
            >
              Shop All Products
            </Link>
            <Link 
              href="/contact" 
              className="border border-white text-white px-8 py-3 rounded-lg hover:bg-primary-800 transition-colors font-medium text-lg"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}