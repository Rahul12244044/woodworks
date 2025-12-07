'use client';

import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import ProjectGrid from '../../components/projects/ProjectGrid';
import ProjectFilters from '../../components/projects/ProjectFilters';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ProjectsPage() {
  const [filters, setFilters] = useState({});
  const { projects, loading, error } = useProjects(filters);

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({});
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading projects</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Inspiration</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover beautiful projects made with our premium woods. Get inspired and see what you can create!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4">
          <ProjectFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {/* Project Grid */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
              <p className="text-gray-600 mt-1">
                Real projects from our community of woodworkers
              </p>
            </div>
            <div className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600">Loading projects...</span>
            </div>
          ) : (
            <ProjectGrid projects={projects} />
          )}
        </div>
      </div>
    </div>
  );
}