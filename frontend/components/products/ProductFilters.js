// components/products/ProductFilters.js
'use client';

import Input from '../ui/Input';

export default function ProductFilters({ filters, onFilterChange }) {
  const woodSpecies = ['oak', 'walnut', 'maple', 'cherry', 'pine', 'cedar', 'teak', 'mahogany', 'birch'];
  const categories = ['lumber', 'slab', 'plywood', 'turning_blank', 'project_kit'];
  const grainPatterns = ['straight', 'curly', 'birdseye', 'burl', 'quartered', 'flat_sawn'];

  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
  };

  const clearFilters = () => {
    onFilterChange('clear');
  };

  // Get min and max from priceRange object
  const minPrice = filters.priceRange?.min || '';
  const maxPrice = filters.priceRange?.max || '';

  const handlePriceChange = (type, value) => {
    const currentPriceRange = filters.priceRange || {};
    const newPriceRange = {
      ...currentPriceRange,
      [type]: value === '' ? '' : Number(value)
    };
    
    // Only send if both are valid or if we're clearing one
    onFilterChange('priceRange', newPriceRange);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Filters</h3>
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
                checked={filters.category === category}
                onChange={(e) => handleFilterChange('category', e.target.checked ? category : '')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">
                {category.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Wood Species Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Wood Species</h4>
        <div className="space-y-2">
          {woodSpecies.map(species => (
            <label key={species} className="flex items-center">
              <input
                type="radio"
                name="species"
                checked={filters.species === species}
                onChange={(e) => handleFilterChange('species', e.target.checked ? species : '')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">{species}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range - UPDATED */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Price Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="text-sm"
          />
        </div>
        {/* Quick Price Filters */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => handleFilterChange('priceRange', { min: 0, max: 50 })}
            className={`text-xs px-2 py-1 rounded ${filters.priceRange?.min === 0 && filters.priceRange?.max === 50 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Under $50
          </button>
          <button
            onClick={() => handleFilterChange('priceRange', { min: 50, max: 100 })}
            className={`text-xs px-2 py-1 rounded ${filters.priceRange?.min === 50 && filters.priceRange?.max === 100 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            $50-$100
          </button>
          <button
            onClick={() => handleFilterChange('priceRange', { min: 100, max: 200 })}
            className={`text-xs px-2 py-1 rounded ${filters.priceRange?.min === 100 && filters.priceRange?.max === 200 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            $100-$200
          </button>
          <button
            onClick={() => handleFilterChange('priceRange', { min: 200, max: 500 })}
            className={`text-xs px-2 py-1 rounded ${filters.priceRange?.min === 200 && filters.priceRange?.max === 500 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            $200-$500
          </button>
        </div>
        {(minPrice || maxPrice) && (
          <button
            onClick={() => handleFilterChange('priceRange', null)}
            className="text-xs text-primary-600 hover:text-primary-800 mt-2"
          >
            Clear price filter
          </button>
        )}
      </div>

      {/* Grain Pattern */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Grain Pattern</h4>
        <div className="space-y-2">
          {grainPatterns.map(pattern => (
            <label key={pattern} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.grainPattern?.includes(pattern) || false}
                onChange={(e) => {
                  const updatedPatterns = e.target.checked
                    ? [...(filters.grainPattern || []), pattern]
                    : (filters.grainPattern || []).filter(p => p !== pattern);
                  handleFilterChange('grainPattern', updatedPatterns);
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">
                {pattern.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}