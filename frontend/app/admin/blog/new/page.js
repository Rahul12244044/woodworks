// app/admin/blog/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { blogAPI } from '../../../../lib/api';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'beginner',
    readTime: 5,
    tags: [],
    featured: false,
    status: 'draft'
  });

  const categories = [
    { value: 'beginner', label: 'Beginner Guides' },
    { value: 'techniques', label: 'Techniques' },
    { value: 'projects', label: 'Projects' },
    { value: 'tips', label: 'Tips & Tricks' },
    { value: 'materials', label: 'Materials' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'tools', label: 'Tools' },
    { value: 'business', label: 'Business' }
  ];
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  console.log('📝 Form data being submitted:', formData);

  // Enhanced validation
  if (!formData.title?.trim()) {
    alert('Please enter a title');
    setLoading(false);
    return;
  }

  if (!formData.excerpt?.trim()) {
    alert('Please enter an excerpt');
    setLoading(false);
    return;
  }

  if (!formData.content?.trim()) {
    alert('Please enter content');
    setLoading(false);
    return;
  }

  try {
    console.log('🚀 Calling blogAPI.createPost...');
    const response = await blogAPI.createPost(formData);
    console.log('✅ Full API Response:', response);
    
    // Check if response has data
    if (response && response.data) {
      alert('Blog post created successfully!');
      router.push('/admin/blog');
    } 
    // Check if response has error
    else if (response && response.error) {
      console.error('❌ API returned error:', response.error);
      alert(`Failed to create blog post: ${response.error}`);
    }
    // Handle empty response
    else {
      console.error('❌ Empty or unexpected response structure:', response);
      alert('Failed to create blog post: Empty response from server');
    }
  } catch (error) {
    console.error('❌ Error in handleSubmit:', error);
    alert(`Failed to create blog post: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
          <p className="text-gray-600 mt-2">Write and publish a new blog post</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter blog post title"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  maxLength={200}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief description of the post (max 200 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt.length}/200 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    required
                    min="1"
                    max="60"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={15}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                placeholder="Write your blog post content here..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports HTML formatting
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => {
                    const tagsArray = e.target.value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(tag => tag !== '');
                    setFormData(prev => ({ ...prev, tags: tagsArray }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="woodworking, beginner, tips (comma separated)"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Feature this post</span>
                </label>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}