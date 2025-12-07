// app/workshops/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WorkshopsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const workshops = [
    {
      id: 1,
      title: "Woodworking Fundamentals",
      category: "beginner",
      duration: "2 days",
      level: "Beginner",
      price: "$299",
      instructor: "Sarah Johnson",
      date: "2024-12-15",
      seats: 8,
      image: "🔨",
      description: "Learn essential woodworking skills including measuring, cutting, joining, and finishing.",
      skills: ["Measuring & Marking", "Basic Cuts", "Sanding", "Assembly"],
      tools: "All tools provided",
      location: "Main Workshop"
    },
    {
      id: 2,
      title: "Furniture Making: Coffee Table",
      category: "intermediate",
      duration: "3 days",
      level: "Intermediate",
      price: "$449",
      instructor: "Mike Chen",
      date: "2024-12-20",
      seats: 6,
      image: "🪑",
      description: "Build a beautiful solid wood coffee table with advanced joinery techniques.",
      skills: ["Mortise & Tenon", "Tabletop Construction", "Finishing"],
      tools: "Bring your own hand tools",
      location: "Advanced Studio"
    },
    {
      id: 3,
      title: "Japanese Joinery Workshop",
      category: "advanced",
      duration: "4 days",
      level: "Advanced",
      price: "$599",
      instructor: "Kenji Tanaka",
      date: "2024-12-28",
      seats: 4,
      image: "🎎",
      description: "Master traditional Japanese woodworking joints without nails or screws.",
      skills: ["Dovetail Joints", "Mortise & Tenon", "Japanese Tools"],
      tools: "Specialized tools provided",
      location: "Traditional Workshop"
    },
    {
      id: 4,
      title: "Wood Carving for Beginners",
      category: "beginner",
      duration: "1 day",
      level: "Beginner",
      price: "$149",
      instructor: "Emily Rodriguez",
      date: "2024-12-10",
      seats: 10,
      image: "✂️",
      description: "Discover the art of wood carving with hands-on projects and expert guidance.",
      skills: ["Knife Safety", "Relief Carving", "Sharpening"],
      tools: "Carving kit included",
      location: "Carving Studio"
    },
    {
      id: 5,
      title: "Woodturning: Bowls & Vessels",
      category: "intermediate",
      duration: "2 days",
      level: "Intermediate",
      price: "$349",
      instructor: "Tom Baker",
      date: "2024-12-18",
      seats: 6,
      image: "🌀",
      description: "Learn to create beautiful turned bowls and vessels on the lathe.",
      skills: ["Lathe Safety", "Bowl Turning", "Sanding", "Finishing"],
      tools: "Lathes and tools provided",
      location: "Turning Studio"
    },
    {
      id: 6,
      title: "Advanced Cabinet Making",
      category: "advanced",
      duration: "5 days",
      level: "Advanced",
      price: "$799",
      instructor: "James Wilson",
      date: "2024-12-22",
      seats: 4,
      image: "🗄️",
      description: "Professional cabinet making techniques for custom furniture projects.",
      skills: ["Case Construction", "Drawer Making", "Hardware Installation"],
      tools: "Bring your own measuring tools",
      location: "Cabinet Shop"
    },
    {
      id: 7,
      title: "Kids Woodworking Camp",
      category: "kids",
      duration: "3 days",
      level: "Kids (8-12)",
      price: "$199",
      instructor: "Lisa Park",
      date: "2024-12-12",
      seats: 12,
      image: "👧",
      description: "Fun and safe woodworking projects designed for young makers.",
      skills: ["Tool Safety", "Simple Projects", "Creative Design"],
      tools: "Child-safe tools provided",
      location: "Kids Workshop"
    },
    {
      id: 8,
      title: "Restoration Workshop",
      category: "intermediate",
      duration: "2 days",
      level: "Intermediate",
      price: "$279",
      instructor: "David Thompson",
      date: "2024-12-14",
      seats: 8,
      image: "🔧",
      description: "Learn to restore and repair antique furniture and wooden objects.",
      skills: ["Stripping", "Repair", "Refinishing", "Preservation"],
      tools: "Restoration tools provided",
      location: "Restoration Lab"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Workshops', count: workshops.length },
    { id: 'beginner', name: 'Beginner', count: workshops.filter(workshop => workshop.category === 'beginner').length },
    { id: 'intermediate', name: 'Intermediate', count: workshops.filter(workshop => workshop.category === 'intermediate').length },
    { id: 'advanced', name: 'Advanced', count: workshops.filter(workshop => workshop.category === 'advanced').length },
    { id: 'kids', name: 'Kids Classes', count: workshops.filter(workshop => workshop.category === 'kids').length }
  ];

  const filteredWorkshops = selectedCategory === 'all' 
    ? workshops 
    : workshops.filter(workshop => workshop.category === selectedCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-blue-100 text-blue-800',
      'Advanced': 'bg-purple-100 text-purple-800',
      'Kids (8-12)': 'bg-yellow-100 text-yellow-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getSeatsColor = (seats) => {
    if (seats <= 2) return 'text-red-600';
    if (seats <= 4) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Workshops & Classes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hands-on woodworking classes for all skill levels. Learn from expert instructors in our fully equipped workshops.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Skill Level</h2>
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

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkshops.map(workshop => (
            <div key={workshop.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{workshop.image}</div>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(workshop.level)}`}>
                    {workshop.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{workshop.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{workshop.description}</p>
                
                {/* Instructor */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium">Instructor:</span>
                  <span className="ml-2">{workshop.instructor}</span>
                </div>
                
                {/* Location */}
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{workshop.location}</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-grow">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(workshop.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="text-sm font-medium text-gray-900">{workshop.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Seats Available:</span>
                    <span className={`text-sm font-medium ${getSeatsColor(workshop.seats)}`}>
                      {workshop.seats} spots left
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills You'll Learn:</h4>
                  <div className="flex flex-wrap gap-1">
                    {workshop.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Tools:</span> {workshop.tools}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-600">{workshop.price}</div>
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎓</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workshops found</h3>
            <p className="text-gray-600">Try selecting a different category or check back later for new classes.</p>
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-primary-900 mb-4">What to Expect</h3>
            <ul className="space-y-2 text-primary-700">
              <li className="flex items-center">
                <span className="text-lg mr-3">✅</span>
                Small class sizes (4-12 students)
              </li>
              <li className="flex items-center">
                <span className="text-lg mr-3">✅</span>
                All necessary tools and materials provided
              </li>
              <li className="flex items-center">
                <span className="text-lg mr-3">✅</span>
                Take home your completed project
              </li>
              <li className="flex items-center">
                <span className="text-lg mr-3">✅</span>
                Safety equipment and instruction included
              </li>
              <li className="flex items-center">
                <span className="text-lg mr-3">✅</span>
                Refreshments and lunch provided for full-day classes
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="text-lg mr-3">📅</span>
                Full refund up to 7 days before class
              </li>
              <li className="flex items-center">
                <span className="text-lg mr-3">🔄</span>
                50% refund up to 48 hours before class
              </li>
              <li className="flex items-center">
                <span className="text-lg mr-3">🎁</span>
                Transfer to another class available
              </li>
              <li className="flex items-center">
                <span className="text-lg mr-3">⏰</span>
                Late arrivals may not be admitted
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about our workshops?
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            Contact Us
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}