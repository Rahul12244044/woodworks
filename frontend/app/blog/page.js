'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogAPI } from '../../lib/api';

export default function BlogPage() {
  const [filter, setFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   // Subscription states
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionError, setSubscriptionError] = useState('');

  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'beginner', name: 'Beginner Guides' },
    { id: 'techniques', name: 'Techniques' },
    { id: 'projects', name: 'Projects' },
    { id: 'tips', name: 'Tips & Tricks' },
    { id: 'materials', name: 'Materials' },
    { id: 'sustainability', name: 'Sustainability' },
    { id: 'tools', name: 'Tools' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  // Handle subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setSubscriptionError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setSubscriptionError('Please enter a valid email address');
      return;
    }

    setSubscribing(true);
    setSubscriptionError('');
    setSubscriptionMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionMessage(data.message);
        setEmail(''); // Clear the input
      } else {
        setSubscriptionError(data.error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionError('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  

  // Fixed fetchPosts function
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching blog posts for public page...');
      
      const response = await blogAPI.getAllPosts();
      console.log('📥 Public blog API Response:', response);
      
      // Handle the response based on your API structure
      const postsData = response.data || response.posts || response || [];
      console.log('📝 Setting posts data:', postsData);
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on selected category
  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800',
      techniques: 'bg-purple-100 text-purple-800',
      projects: 'bg-green-100 text-green-800',
      tips: 'bg-yellow-100 text-yellow-800',
      materials: 'bg-orange-100 text-orange-800',
      sustainability: 'bg-teal-100 text-teal-800',
      tools: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading blog posts...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Blog</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchPosts}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">WoodWorks Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Woodworking tips, project guides, material insights, and inspiration for makers of all skill levels.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Category Filters */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setFilter(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map(post => (
                <article key={post._id || post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <span className="text-white text-4xl">🪵</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
                        {categories.find(cat => cat.id === post.category)?.name || post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{formatDate(post.createdAt || post.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime || '5'} min read</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {post.author?.name?.split(' ').map(n => n[0]).join('') || 'WW'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {post.author?.name || 'WoodWorks Team'}
                          </p>
                          <p className="text-xs text-gray-500">{post.author?.role || 'Wood Expert'}</p>
                        </div>
                      </div>
                      
                      <Link
                        href={`/blog/${post._id || post.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                      >
                        Read More
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try selecting a different category or check back later for new posts.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
           <div className="lg:w-1/4">
        <div className="space-y-6">
          {/* Updated Newsletter Signup */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="font-semibold text-primary-900 mb-3">Join Our Community</h3>
            <p className="text-primary-700 text-sm mb-4">
              Get weekly woodworking tips, project ideas, and exclusive offers.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribing}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={subscribing}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {/* Messages */}
            {subscriptionMessage && (
              <div className="mt-3 p-2 bg-green-100 border border-green-200 text-green-700 text-sm rounded">
                ✅ {subscriptionMessage}
              </div>
            )}
            
            {subscriptionError && (
              <div className="mt-3 p-2 bg-red-100 border border-red-200 text-red-700 text-sm rounded">
                ❌ {subscriptionError}
              </div>
            )}
          </div>
              {/* Popular Posts */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Popular Articles</h3>
                <div className="space-y-4">
                  {posts.slice(0, 3).map(post => (
                    <Link
                      key={post._id || post.id}
                      href={`/blog/${post.slug || post._id || post.id}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{post.readTime || '5'} min read</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.filter(cat => cat.id !== 'all').map(category => (
                    <button
                      key={category.id}
                      onClick={() => setFilter(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filter === category.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {posts.filter(post => post.category === category.id).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                <div className="space-y-3">
                  <Link href="/faq" className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                    <span className="text-lg mr-3">❓</span>
                    <span className="text-sm">FAQ & Help Center</span>
                  </Link>
                  <Link href="/projects" className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                    <span className="text-lg mr-3">🔨</span>
                    <span className="text-sm">Project Gallery</span>
                  </Link>
                  <Link href="/materials-guide" className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                    <span className="text-lg mr-3">🌲</span>
                    <span className="text-sm">Wood Species Guide</span>
                  </Link>
                  <Link href="/workshops" className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                    <span className="text-lg mr-3">🎓</span>
                    <span className="text-sm">Workshops & Classes</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}