'use client';

import Link from 'next/link';

export default function SpeciesPage() {
  const woodSpecies = [
    {
      name: 'Oak',
      scientificName: 'Quercus',
      description: 'Strong, durable wood with prominent grain patterns. Excellent for furniture and flooring.',
      hardness: 'Hard',
      color: 'Light to medium brown',
      commonUses: ['Furniture', 'Flooring', 'Cabinetry', 'Barrels'],
      characteristics: ['Prominent grain', 'Durable', 'Stains well']
    },
    {
      name: 'Walnut',
      scientificName: 'Juglans',
      description: 'Premium dark wood with rich chocolate brown color and straight grain.',
      hardness: 'Hard',
      color: 'Dark brown to purplish-black',
      commonUses: ['Fine furniture', 'Gunstocks', 'Veneer', 'Carving'],
      characteristics: ['Rich color', 'Straight grain', 'Premium quality']
    },
    {
      name: 'Maple',
      scientificName: 'Acer',
      description: 'Hard, light-colored wood that can feature beautiful birdseye or curly patterns.',
      hardness: 'Very Hard',
      color: 'Creamy white to light reddish-brown',
      commonUses: ['Butcher blocks', 'Flooring', 'Musical instruments', 'Bowling alleys'],
      characteristics: ['Very hard', 'Can have figured patterns', 'Light color']
    },
    {
      name: 'Cherry',
      scientificName: 'Prunus',
      description: 'Beautiful wood that darkens to a rich reddish-brown with age and exposure to light.',
      hardness: 'Medium-Hard',
      color: 'Light pinkish-brown to rich reddish-brown',
      commonUses: ['Fine furniture', 'Cabinetry', 'Turned objects', 'Veneer'],
      characteristics: ['Darkens with age', 'Smooth grain', 'Rich patina']
    },
    {
      name: 'Teak',
      scientificName: 'Tectona grandis',
      description: 'Durable tropical wood with natural oils that provide excellent weather resistance.',
      hardness: 'Hard',
      color: 'Golden to medium brown',
      commonUses: ['Outdoor furniture', 'Boat building', 'Decking', 'Cutting boards'],
      characteristics: ['Weather resistant', 'Natural oils', 'Durable outdoors']
    },
    {
      name: 'Mahogany',
      scientificName: 'Swietenia',
      description: 'Classic reddish-brown wood with straight, fine grain that works easily.',
      hardness: 'Medium-Hard',
      color: 'Reddish-brown to deep red',
      commonUses: ['Fine furniture', 'Boat building', 'Musical instruments', 'Veneer'],
      characteristics: ['Straight grain', 'Easy to work', 'Stable']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Wood Species Guide</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn about different wood species and their characteristics to choose the perfect wood for your project.
        </p>
      </div>

      {/* Wood Species Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {woodSpecies.map((wood, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="p-6 flex flex-col flex-grow">
              {/* Header with name and hardness */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{wood.name}</h3>
                  <p className="text-sm text-gray-500 italic">{wood.scientificName}</p>
                </div>
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  {wood.hardness}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-3 min-h-[72px]">
                {wood.description}
              </p>

              {/* Content Area - Flexible */}
              <div className="space-y-3 flex-grow">
                <div>
                  <span className="text-sm font-medium text-gray-700">Color: </span>
                  <span className="text-sm text-gray-600">{wood.color}</span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Common Uses:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {wood.commonUses.map((use, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Characteristics:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {wood.characteristics.map((char, i) => (
                      <span key={i} className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Products Link - Always at bottom */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link 
                  href={`/products?species=${wood.name.toLowerCase()}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
                >
                  View {wood.name} Products 
                  <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Project?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Browse our collection of premium woods and find the perfect material for your next masterpiece.
        </p>
        <Link href="/products" className="btn-primary text-lg px-8 py-3">
          Browse All Woods
        </Link>
      </div>
    </div>
  );
}