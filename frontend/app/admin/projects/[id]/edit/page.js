// app/admin/projects/[id]/edit/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    woodSpecies: [],
    tags: [],
    featured: false,
  });
  const [inputValues, setInputValues] = useState({
    woodSpecies: '',
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch project data on component mount
  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Initialize input values when formData is loaded
  useEffect(() => {
    setInputValues({
      woodSpecies: formData.woodSpecies.join(', '),
      tags: formData.tags.join(', ')
    });
  }, [formData.woodSpecies, formData.tags]);

  const fetchProject = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/admin/projects/${projectId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      const project = data.project;

      // Populate form with existing data
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'draft',
        woodSpecies: project.woodSpecies || [],
        tags: project.tags || [],
        featured: project.featured || false,
      });

      // Set existing images
      if (project.images && project.images.length > 0) {
        setImages(project.images.map((img, index) => ({
          id: `existing-${index}`,
          url: img.url,
          filename: img.filename,
          name: img.alt || `Image ${index + 1}`,
          preview: img.url,
          isExisting: true,
        })));
      }

    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Failed to load project data');
      router.push('/admin/projects');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const projectData = {
        ...formData,
        images: images.map(img => ({
          url: img.url,
          filename: img.filename,
          alt: img.name
        })),
      };

      console.log('🟡 FRONTEND: Updating project:', projectData);
      
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update project');
      }

      console.log('🟢 FRONTEND: Project updated successfully:', result);
      
      window.dispatchEvent(new Event('projectCreated'));
      router.push('/admin/projects');
      
    } catch (error) {
      console.error('🔴 FRONTEND: Error updating project:', error);
      alert(`Failed to update project: ${error.message}`);
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

  // Handle input changes for array fields (just update the display value)
  const handleArrayInputChange = (field, value) => {
    setInputValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Convert input values to arrays when needed (on blur or submit)
  const convertInputToArray = (field, value) => {
    if (!value.trim()) {
      return [];
    }

    const arrayValue = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');

    return arrayValue;
  };

  // Update formData when input loses focus
  const handleArrayInputBlur = (field) => {
    const arrayValue = convertInputToArray(field, inputValues[field]);
    
    setFormData(prev => ({
      ...prev,
      [field]: arrayValue
    }));

    // Also update the input value to show the cleaned version
    setInputValues(prev => ({
      ...prev,
      [field]: arrayValue.join(', ')
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
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB`);
        }

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        return {
          id: Date.now() + Math.random(),
          file,
          url: data.url,
          filename: data.filename,
          name: file.name,
          preview: URL.createObjectURL(file),
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedImages]);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
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

  if (fetchLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">Loading project data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600 mt-2">Update your woodworking project details</p>
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

          {/* Wood Species Field - FIXED */}
          <div>
            <label htmlFor="woodSpecies" className="block text-sm font-medium text-gray-700">
              Wood Species
            </label>
            <input
              type="text"
              id="woodSpecies"
              name="woodSpecies"
              value={inputValues.woodSpecies}
              onChange={(e) => handleArrayInputChange('woodSpecies', e.target.value)}
              onBlur={() => handleArrayInputBlur('woodSpecies')}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., walnut, maple, cherry (comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple species with commas. Current: [{formData.woodSpecies.join(', ')}]
            </p>
          </div>

          {/* Tags Field - FIXED */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={inputValues.tags}
              onChange={(e) => handleArrayInputChange('tags', e.target.value)}
              onBlur={() => handleArrayInputBlur('tags')}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., furniture, table, live edge (comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas. Current: [{formData.tags.join(', ')}]
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
              <option value="archived">Archived</option>
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
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            
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

            {images.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Project Images ({images.length})
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
                      {image.isExisting && (
                        <span className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-1 rounded">
                          Existing
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}