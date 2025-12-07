// app/blog/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogAPI } from '../../../lib/api';

export default function BlogPostPage({ params }) {
  const { id } = params;
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching blog post:', id);
      
      const response = await blogAPI.getPost(id);
      console.log('📥 Blog post response:', response);
      
      if (response.data) {
        setBlogPost(response.data);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('❌ Error fetching blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

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
      tools: 'bg-red-100 text-red-800',
      business: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading blog post...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The requested blog post could not be found.'}</p>
            <Link 
              href="/blog" 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          <div className="h-64 bg-gray-200 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <span className="text-white text-6xl">🪵</span>
            </div>
            <div className="absolute top-4 left-4">
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(blogPost.category)}`}>
                {blogPost.category.charAt(0).toUpperCase() + blogPost.category.slice(1)}
              </span>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
              <span>{formatDate(blogPost.createdAt || blogPost.date)}</span>
              <span className="mx-2">•</span>
              <span>{blogPost.readTime || '5'} min read</span>
              {blogPost.tags && blogPost.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex flex-wrap gap-1">
                    {blogPost.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {blogPost.title}
            </h1>

            {/* Author */}
            <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <span className="text-lg font-medium text-gray-600">
                  {blogPost.author?.name?.split(' ').map(n => n[0]).join('') || 'WW'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {blogPost.author?.name || 'WoodWorks Team'}
                </p>
                <p className="text-sm text-gray-500">
                  {blogPost.author?.role || 'Wood Expert'}
                </p>
              </div>
            </div>

            {/* Article Body */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Article Stats */}
            <div className="mt-8 flex items-center text-sm text-gray-500">
              <span>{blogPost.views || 0} views</span>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
              <div className="flex space-x-4">
                <button className="text-gray-600 hover:text-blue-600 transition-colors">
                  <span className="sr-only">Share on Facebook</span>
                  <span className="text-xl">📘</span>
                </button>
                <button className="text-gray-600 hover:text-blue-400 transition-colors">
                  <span className="sr-only">Share on Twitter</span>
                  <span className="text-xl">🐦</span>
                </button>
                <button className="text-gray-600 hover:text-blue-700 transition-colors">
                  <span className="sr-only">Share on LinkedIn</span>
                  <span className="text-xl">💼</span>
                </button>
                <button className="text-gray-600 hover:text-red-600 transition-colors">
                  <span className="sr-only">Share on Pinterest</span>
                  <span className="text-xl">📌</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles - You can implement this later with actual API */}
        <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">More Articles</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900 mb-2">Essential Tools for Beginners</h3>
        <p className="text-gray-600 text-sm mb-4">The must-have tools to start your woodworking journey.</p>
      </div>
      <Link href="/blog/692174f319e9fb386ef6a80a" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-auto">
        Read More →
      </Link>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900 mb-2">5 Common Mistakes to Avoid</h3>
        <p className="text-gray-600 text-sm mb-4">Learn from common beginner errors and save time.</p>
      </div>
      <Link href="/blog/692181f119e9fb386ef6a836" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-auto">
        Read More →
      </Link>
    </div>
     <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900 mb-2">Understanding Wood Movement</h3>
        <p className="text-gray-600 text-sm mb-4">How wood expands and contracts with seasons.</p>
      </div>
      <Link href="/blog/6921836819e9fb386ef6a83d" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-auto">
        Read More →
      </Link>
    </div>
     </div>
     </div>
        
      </div>
    </div>
  );
}