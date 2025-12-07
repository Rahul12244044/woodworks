// app/materials-guide/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MaterialsGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const woodSpecies = [
    // Hardwoods
    {
      id: 1,
      name: "Oak",
      category: "hardwood",
      subcategory: "domestic",
      hardness: "Hard",
      color: "Light to medium brown",
      grain: "Prominent, straight grain",
      workability: "Moderate",
      uses: ["Furniture", "Flooring", "Cabinets"],
      price: "$$",
      image: "🌳",
      description: "Strong, durable wood with prominent grain. Excellent for furniture and flooring.",
      sustainability: "Sustainable"
    },
    {
      id: 2,
      name: "Maple",
      category: "hardwood",
      subcategory: "domestic",
      hardness: "Very Hard",
      color: "Light, creamy white",
      grain: "Fine, straight grain",
      workability: "Difficult",
      uses: ["Cutting boards", "Butcher blocks", "Furniture"],
      price: "$$",
      image: "🍁",
      description: "Extremely hard and durable. Perfect for high-wear surfaces.",
      sustainability: "Sustainable"
    },
    {
      id: 3,
      name: "Walnut",
      category: "hardwood",
      subcategory: "domestic",
      hardness: "Hard",
      color: "Rich dark brown",
      grain: "Straight, sometimes wavy",
      workability: "Easy",
      uses: ["Fine furniture", "Gunstocks", "Carving"],
      price: "$$$",
      image: "🌰",
      description: "Prized for rich color and excellent workability. Premium choice.",
      sustainability: "Sustainable"
    },
    {
      id: 4,
      name: "Cherry",
      category: "hardwood",
      subcategory: "domestic",
      hardness: "Medium-Hard",
      color: "Reddish-brown, darkens with age",
      grain: "Fine, straight grain",
      workability: "Easy",
      uses: ["Furniture", "Cabinets", "Turnings"],
      price: "$$$",
      image: "🍒",
      description: "Darkens beautifully with age. Smooth, fine grain that's easy to work.",
      sustainability: "Sustainable"
    },

    // Softwoods
    {
      id: 5,
      name: "Pine",
      category: "softwood",
      subcategory: "domestic",
      hardness: "Soft",
      color: "Light yellow to white",
      grain: "Straight, prominent grain",
      workability: "Easy",
      uses: ["Furniture", "Construction", "Cabinets"],
      price: "$",
      image: "🌲",
      description: "Affordable and easy to work with. Perfect for beginners.",
      sustainability: "Sustainable"
    },
    {
      id: 6,
      name: "Cedar",
      category: "softwood",
      subcategory: "domestic",
      hardness: "Soft",
      color: "Reddish-brown",
      grain: "Straight grain",
      workability: "Easy",
      uses: ["Outdoor furniture", "Closets", "Decks"],
      price: "$$",
      image: "🏔️",
      description: "Naturally resistant to rot and insects. Ideal for outdoor projects.",
      sustainability: "Sustainable"
    },
    {
      id: 7,
      name: "Fir",
      category: "softwood",
      subcategory: "domestic",
      hardness: "Medium",
      color: "Pale yellow to reddish-brown",
      grain: "Straight, pronounced grain",
      workability: "Moderate",
      uses: ["Framing", "Doors", "Windows"],
      price: "$",
      image: "🎄",
      description: "Strong structural wood. Common in construction applications.",
      sustainability: "Sustainable"
    },

    // Exotic Woods
    {
      id: 8,
      name: "Mahogany",
      category: "hardwood",
      subcategory: "exotic",
      hardness: "Medium-Hard",
      color: "Reddish-brown",
      grain: "Straight, fine grain",
      workability: "Easy",
      uses: ["Fine furniture", "Boats", "Musical instruments"],
      price: "$$$",
      image: "🪵",
      description: "Known for stability and workability. Beautiful reddish color.",
      sustainability: "Check Source"
    },
    {
      id: 9,
      name: "Teak",
      category: "hardwood",
      subcategory: "exotic",
      hardness: "Hard",
      color: "Golden brown",
      grain: "Straight, coarse grain",
      workability: "Moderate",
      uses: ["Outdoor furniture", "Boats", "Decks"],
      price: "$$$$",
      image: "⛵",
      description: "Extremely durable and weather-resistant. Top choice for outdoor use.",
      sustainability: "Endangered"
    },
    {
      id: 10,
      name: "Rosewood",
      category: "hardwood",
      subcategory: "exotic",
      hardness: "Very Hard",
      color: "Dark brown with black streaks",
      grain: "Interlocking grain",
      workability: "Difficult",
      uses: ["Musical instruments", "Luxury furniture", "Turnings"],
      price: "$$$$",
      image: "🎸",
      description: "Dense, aromatic wood with beautiful figuring. Prized for instruments.",
      sustainability: "Endangered"
    },
    {
      id: 11,
      name: "Ebony",
      category: "hardwood",
      subcategory: "exotic",
      hardness: "Extremely Hard",
      color: "Jet black",
      grain: "Fine, even texture",
      workability: "Difficult",
      uses: ["Inlays", "Piano keys", "Carving"],
      price: "$$$$$",
      image: "⚫",
      description: "Extremely dense and hard. The blackest wood available.",
      sustainability: "Endangered"
    },

    // Reclaimed Woods
    {
      id: 12,
      name: "Reclaimed Barnwood",
      category: "reclaimed",
      subcategory: "vintage",
      hardness: "Varies",
      color: "Weathered gray, brown",
      grain: "Character marks, nail holes",
      workability: "Moderate",
      uses: ["Accent walls", "Furniture", "Decor"],
      price: "$$",
      image: "🏚️",
      description: "Aged wood with unique character. Environmentally friendly choice.",
      sustainability: "Very Sustainable"
    },
    {
      id: 13,
      name: "Reclaimed Oak",
      category: "reclaimed",
      subcategory: "vintage",
      hardness: "Hard",
      color: "Patinaed brown",
      grain: "Prominent with character",
      workability: "Moderate",
      uses: ["Flooring", "Tables", "Beams"],
      price: "$$$",
      image: "🪚",
      description: "Aged oak with beautiful patina. Denser than new oak.",
      sustainability: "Very Sustainable"
    },

    // Engineered Woods
    {
      id: 14,
      name: "Plywood",
      category: "engineered",
      subcategory: "sheet",
      hardness: "Medium",
      color: "Varies by veneer",
      grain: "Layered construction",
      workability: "Easy",
      uses: ["Cabinets", "Shelving", "Structural"],
      price: "$",
      image: "📦",
      description: "Strong, stable sheet material. Resists warping and cracking.",
      sustainability: "Moderate"
    },
    {
      id: 15,
      name: "MDF",
      category: "engineered",
      subcategory: "sheet",
      hardness: "Medium",
      color: "Light brown",
      grain: "Smooth, uniform",
      workability: "Easy",
      uses: ["Painted furniture", "Cabinets", "Millwork"],
      price: "$",
      image: "📄",
      description: "Smooth surface ideal for painting. Consistent and stable.",
      sustainability: "Moderate"
    },
    {
      id: 16,
      name: "Particle Board",
      category: "engineered",
      subcategory: "sheet",
      hardness: "Soft",
      color: "Light brown",
      grain: "Composite texture",
      workability: "Easy",
      uses: ["IKEA furniture", "Substrate", "Temporary projects"],
      price: "$",
      image: "🧩",
      description: "Economical composite material. Best for lightweight applications.",
      sustainability: "Moderate"
    },

    // Specialty Woods
    {
      id: 17,
      name: "Bamboo",
      category: "specialty",
      subcategory: "grass",
      hardness: "Very Hard",
      color: "Light yellow",
      grain: "Straight, fine",
      workability: "Moderate",
      uses: ["Flooring", "Cutting boards", "Modern furniture"],
      price: "$$",
      image: "🎍",
      description: "Fast-growing grass. Extremely hard and sustainable.",
      sustainability: "Very Sustainable"
    },
    {
      id: 18,
      name: "Cork",
      category: "specialty",
      subcategory: "bark",
      hardness: "Soft",
      color: "Light brown",
      grain: "Porous texture",
      workability: "Easy",
      uses: ["Bulletin boards", "Flooring", "Insulation"],
      price: "$$",
      image: "🍾",
      description: "Sustainable bark material. Excellent for sound and thermal insulation.",
      sustainability: "Very Sustainable"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Woods', count: woodSpecies.length },
    { id: 'hardwood', name: 'Hardwoods', count: woodSpecies.filter(wood => wood.category === 'hardwood').length },
    { id: 'softwood', name: 'Softwoods', count: woodSpecies.filter(wood => wood.category === 'softwood').length },
    { id: 'exotic', name: 'Exotic Woods', count: woodSpecies.filter(wood => wood.subcategory === 'exotic').length },
    { id: 'reclaimed', name: 'Reclaimed', count: woodSpecies.filter(wood => wood.category === 'reclaimed').length },
    { id: 'engineered', name: 'Engineered', count: woodSpecies.filter(wood => wood.category === 'engineered').length },
    { id: 'specialty', name: 'Specialty', count: woodSpecies.filter(wood => wood.category === 'specialty').length }
  ];

  const filteredWoods = selectedCategory === 'all' 
    ? woodSpecies 
    : selectedCategory === 'hardwood' || selectedCategory === 'softwood'
    ? woodSpecies.filter(wood => wood.category === selectedCategory)
    : woodSpecies.filter(wood => wood.subcategory === selectedCategory || wood.category === selectedCategory);

  const getPriceColor = (price) => {
    const colors = {
      '$': 'text-green-600',
      '$$': 'text-yellow-600',
      '$$$': 'text-orange-600',
      '$$$$': 'text-red-600',
      '$$$$$': 'text-purple-600'
    };
    return colors[price] || 'text-gray-600';
  };

  const getSustainabilityColor = (sustainability) => {
    const colors = {
      'Very Sustainable': 'text-green-600',
      'Sustainable': 'text-blue-600',
      'Moderate': 'text-yellow-600',
      'Check Source': 'text-orange-600',
      'Endangered': 'text-red-600'
    };
    return colors[sustainability] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Wood Species Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore domestic, exotic, reclaimed, engineered, and specialty woods for your projects.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Wood Species Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWoods.map(wood => (
            <div key={wood.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">{wood.image}</div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      wood.category === 'hardwood' 
                        ? 'bg-blue-100 text-blue-800' 
                        : wood.category === 'softwood'
                        ? 'bg-green-100 text-green-800'
                        : wood.category === 'exotic'
                        ? 'bg-purple-100 text-purple-800'
                        : wood.category === 'reclaimed'
                        ? 'bg-orange-100 text-orange-800'
                        : wood.category === 'engineered'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {wood.category}
                    </span>
                    {wood.subcategory && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        {wood.subcategory}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{wood.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{wood.description}</p>
                
                {/* Sustainability Badge */}
                <div className={`text-xs font-medium ${getSustainabilityColor(wood.sustainability)} mb-3`}>
                  🌱 {wood.sustainability}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Hardness:</span>
                    <span className="text-sm font-medium text-gray-900">{wood.hardness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Workability:</span>
                    <span className="text-sm font-medium text-gray-900">{wood.workability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className={`text-sm font-medium ${getPriceColor(wood.price)}`}>
                      {wood.price}
                    </span>
                  </div>
                </div>

                {/* Uses */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Common Uses:</h4>
                  <div className="flex flex-wrap gap-1">
                    {wood.uses.map((use, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWoods.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wood species found</h3>
            <p className="text-gray-600">Try selecting a different category.</p>
          </div>
        )}

        {/* Category Guides */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Hardwoods Guide</h3>
            <p className="text-blue-700 text-sm">
              Deciduous trees with dense wood. Ideal for furniture, flooring, and high-wear applications.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-2">Softwoods Guide</h3>
            <p className="text-green-700 text-sm">
              Coniferous trees that grow faster. Great for construction, framing, and outdoor projects.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-2">Exotic Woods</h3>
            <p className="text-purple-700 text-sm">
              Imported species with unique colors and grains. Check sustainability before purchasing.
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-orange-900 mb-2">Reclaimed Wood</h3>
            <p className="text-orange-700 text-sm">
              Environmentally friendly option with unique character. May require extra preparation.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Engineered Wood</h3>
            <p className="text-gray-700 text-sm">
              Manufactured products offering consistency and stability. Cost-effective for many applications.
            </p>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="font-semibold text-teal-900 mb-2">Specialty Materials</h3>
            <p className="text-teal-700 text-sm">
              Unique materials like bamboo and cork. Sustainable alternatives with special properties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}