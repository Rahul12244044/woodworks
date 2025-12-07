'use client';

export default function ProjectFilters({ filters, onFilterChange }) {
  const categories = ['all', 'furniture', 'kitchen', 'outdoor', 'accessories'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
  };

  const clearFilters = () => {
    onFilterChange('clear');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Filter Projects</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear All
        </button>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Category</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === category || (category === 'all' && !filters.category)}
                onChange={(e) => handleFilterChange('category', e.target.checked ? (category === 'all' ? '' : category) : '')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Skill Level</h4>
        <div className="space-y-2">
          {difficulties.map(difficulty => (
            <label key={difficulty} className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                checked={filters.difficulty === difficulty || (difficulty === 'all' && !filters.difficulty)}
                onChange={(e) => handleFilterChange('difficulty', e.target.checked ? (difficulty === 'all' ? '' : difficulty) : '')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">
                {difficulty}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Featured Only */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.featured || false}
            onChange={(e) => handleFilterChange('featured', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-600">Featured Projects Only</span>
        </label>
      </div>
    </div>
  );
}