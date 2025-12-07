// app/admin/projects/new/page.js
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    woodSpecies: [],
    tags: [],
    featured: false,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Basic validation
  if (!formData.title.trim() || !formData.description.trim()) {
    alert('Please fill in all required fields');
    return;
  }

  setLoading(true);
  
  try {
    // Prepare form data with images
    const projectData = {
      ...formData,
      images: images.map(img => ({
        url: img.url,
        filename: img.filename,
        alt: img.name
      })),
    };

    console.log('🟡 FRONTEND: Sending project data:', projectData);
    
    // API call to create project
    const response = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create project');
    }

    console.log('🟢 FRONTEND: Project created successfully:', result);
    
    // Trigger refresh on the projects page
    window.dispatchEvent(new Event('projectCreated'));
    
    // Redirect back to projects list
    router.push('/admin/projects');
    
  } catch (error) {
    console.error('🔴 FRONTEND: Error creating project:', error);
    alert(`Failed to create project: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayFieldChange = (fieldName, value) => {
    const arrayValue = value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({
      ...prev,
      [fieldName]: arrayValue
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleImageUpload = async (files) => {
    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB`);
        }

        // Create form data for upload
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        // Upload to our API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        return {
          id: Date.now() + Math.random(), // Temporary ID
          file,
          url: data.url, // URL from upload service
          filename: data.filename,
          name: file.name,
          preview: URL.createObjectURL(file), // Local preview
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedImages]);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
        <p className="text-gray-600 mt-2">Create a new woodworking project for your gallery</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Walnut Live Edge Dining Table"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe your woodworking project..."
            />
          </div>

          <div>
            <label htmlFor="woodSpecies" className="block text-sm font-medium text-gray-700">
              Wood Species
            </label>
            <input
              type="text"
              id="woodSpecies"
              name="woodSpecies"
              value={formData.woodSpecies.join(', ')}
              onChange={(e) => handleArrayFieldChange('woodSpecies', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., walnut, maple, cherry (comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple species with commas
            </p>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayFieldChange('tags', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., furniture, table, live edge (comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Feature this project on the homepage
            </label>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Images
            </label>
            
            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            
            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                  <p className="text-gray-600">Uploading images...</p>
                </div>
              ) : (
                <>
                  <div className="text-gray-400 text-4xl mb-2">📷</div>
                  <p className="text-gray-600">Click to select images or drag and drop</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Supports JPG, PNG, WEBP • Max 5MB per image
                  </p>
                </>
              )}
            </div>

            {/* Selected Images Preview */}
            {images.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Selected Images ({images.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}