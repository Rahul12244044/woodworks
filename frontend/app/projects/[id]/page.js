'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sampleProjects } from '../../../data/projectData';
import { sampleProducts } from '../../../lib/sampleData';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;
  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProject = sampleProjects.find(p => p._id === projectId);
      setProject(foundProject);
      setLoading(false);
    }, 500);
  }, [projectId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading project...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link href="/projects" className="btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-400 hover:text-gray-500">Home</Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <Link href="/projects" className="text-gray-400 hover:text-gray-500">Projects</Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-600">{project.title}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Project Images & Details */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              {project.images?.[selectedImage] ? (
                <Image
                  src={project.images[selectedImage].url}
                  alt={project.images[selectedImage].alt}
                  width={800}
                  height={450}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-primary-600 text-4xl">🔨</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {project.images && project.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Project Description */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
            <div className="prose max-w-none text-gray-700">
              {project.fullDescription.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Project Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h1>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <span className={`text-sm px-3 py-1 rounded-full capitalize ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{project.estimatedTime}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Category:</strong> <span className="capitalize">{project.category}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>By:</strong> {project.author}
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Materials Used */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Materials Used</h3>
              <div className="space-y-2">
                {project.materials.map((material, index) => {
                  const product = sampleProducts.find(p => p._id === material.productId);
                  return (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <Link 
                          href={`/products/${material.productId}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {material.name}
                        </Link>
                        <div className="text-gray-500">Qty: {material.quantity}</div>
                      </div>
                      {product && (
                        <div className="text-right">
                          <div className="font-medium">${product.price}</div>
                          <Link 
                            href={`/products/${material.productId}`}
                            className="text-primary-600 hover:text-primary-700 text-xs"
                          >
                            View Product
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tools Required */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Tools Required</h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Get Inspired Button */}
            <Link
              href="/products"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center block"
            >
              Get Materials for Your Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}