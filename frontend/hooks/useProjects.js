import { useState, useEffect } from 'react';
import { sampleProjects } from '../data/projectData';

export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
          let filteredProjects = sampleProjects;
          
          // Apply filters
          if (filters.category) {
            filteredProjects = filteredProjects.filter(p => p.category === filters.category);
          }
          if (filters.difficulty) {
            filteredProjects = filteredProjects.filter(p => p.difficulty === filters.difficulty);
          }
          if (filters.featured) {
            filteredProjects = filteredProjects.filter(p => p.featured);
          }
          
          setProjects(filteredProjects);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        setError('Failed to fetch projects');
        setProjects([]);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  return { projects, loading, error };
}