// app/admin/projects/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Force refresh the projects list
  const refreshProjects = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Refresh the list after deletion
      refreshProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  // Listen for custom event from new project creation
  useEffect(() => {
    const handleProjectCreated = () => {
      refreshProjects();
    };

    window.addEventListener('projectCreated', handleProjectCreated);
    
    return () => {
      window.removeEventListener('projectCreated', handleProjectCreated);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Gallery</h1>
          <p className="text-gray-600 mt-2">Manage your featured woodworking projects</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={refreshProjects}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Refresh
          </button>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add New Project
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Projects ({projects.length})</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {projects.map((project) => (
            <div key={project._id || project.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0].url}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">🔨</span>
                    )}
                  </div>
                  <div>
  <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
  <div className="text-gray-600 text-sm mt-1">
    {project.woodSpecies && project.woodSpecies.length > 0 ? (
      <div className="flex flex-wrap items-center gap-1">
        <span className="font-medium text-gray-700">Wood Species:</span>
        {project.woodSpecies.map((species, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-gray-700 text-xs"
          >
            {species}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-gray-400 italic">No wood species specified</span>
    )}
  </div>
  <div className="flex items-center space-x-4 mt-2">
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      project.status === 'published' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {project.status}
    </span>
    {project.featured && (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Featured
      </span>
    )}
    <span className="text-xs text-gray-500">
      Created: {new Date(project.createdAt).toLocaleDateString()}
    </span>
  </div>
</div>
                </div>
                
                <div className="flex items-center space-x-2">
                <Link
                   href={`/admin/projects/${project._id}/edit`}
                   className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Edit
                </Link>
                  <button
                    onClick={() => handleDelete(project._id || project.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔨</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first project.</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}