// app/products/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/products/ProductGrid';
import ProductFilters from '../../components/products/ProductFilters';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';

export default function ProductsPage() {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();
  const speciesFilter = searchParams.get('species');
  
  const { products, loading, error } = useProducts(filters);

  // Initialize species filter from URL
  useEffect(() => {
    if (speciesFilter) {
      setFilters(prev => ({ ...prev, species: speciesFilter }));
    }
  }, [speciesFilter]);

  // Debug: Log products whenever they change
  useEffect(() => {
    console.log('Products in component:', products);
    console.log('Products length:', products?.length || 0);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Current filters:', filters);
    console.log('URL species filter:', speciesFilter);
  }, [products, loading, error, filters, speciesFilter]);

  // Debounced search - update filters after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters(prev => ({ ...prev, search: searchQuery.trim() }));
      } else {
        const { search, ...restFilters } = filters;
        setFilters(restFilters);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // In ProductsPage.js - update the price range handling
const handleFilterChange = (key, value) => {
  console.log('🔄 handleFilterChange:', key, value);
  
  if (key === 'clear') {
    setFilters({});
    setSearchQuery('');
    setSortBy('name');
  } else if (key === 'priceRange') {
    // Handle price range specially
    if (!value || (value.min === '' && value.max === '')) {
      // Remove price filter
      const { priceRange, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      // Set price range filter
      setFilters(prev => ({ ...prev, priceRange: value }));
    }
  } else if (value === '' || value === null || value === undefined) {
    // Remove filter if value is empty
    const { [key]: removed, ...restFilters } = filters;
    setFilters(restFilters);
  } else {
    // Set normal filter
    setFilters(prev => ({ ...prev, [key]: value }));
  }
};

// Update sort handler
const handleSortChange = (sortValue) => {
  console.log('🔄 Sort changed to:', sortValue);
  setSortBy(sortValue);
  
  if (sortValue === 'name') {
    // Remove sort filter for default
    const { sort, ...restFilters } = filters;
    setFilters(restFilters);
  } else {
    setFilters(prev => ({ ...prev, sort: sortValue }));
  }
};
  const activeFilterCount = Object.keys(filters).filter(key => 
    key !== 'sort' && filters[key] && filters[key] !== ''
  ).length;

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    setSortBy('name');
  };

  const clearSpeciesFilter = () => {
    const { species, ...restFilters } = filters;
    setFilters(restFilters);
  };

  // Test API directly (for debugging)
  const testAPI = async () => {
    console.log('Testing API directly...');
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      console.log('Direct API test:', data);
    } catch (err) {
      console.error('Direct API test failed:', err);
    }
  };

  // Test the productsAPI directly
  const testProductsAPI = async () => {
    console.log('Testing productsAPI...');
    try {
      const { productsAPI } = await import('../../lib/api');
      const response = await productsAPI.getProducts();
      console.log('productsAPI response:', response);
    } catch (err) {
      console.error('productsAPI test failed:', err);
    }
  };

  // Get display title based on filters
  const getPageTitle = () => {
    if (filters.species) {
      return `${filters.species.charAt(0).toUpperCase() + filters.species.slice(1)} Wood Products`;
    }
    return 'Premium Wood Collection';
  };

  // Get results description
  const getResultsDescription = () => {
    if (filters.species) {
      return `Hand-selected ${filters.species} wood products for your projects`;
    }
    return 'Discover the finest selection of hardwoods, exotic woods, and live edge slabs for your next masterpiece';
  };

  // Safe products array
  const safeProducts = products || [];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Error loading products</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Try Again
            </Button>
            <Button 
              onClick={testAPI}
              variant="outline"
            >
              Test API
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Debug Panel - Remove this after fixing */}
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Debug Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Products Count:</span> {safeProducts.length}
          </div>
          <div>
            <span className="font-medium">Loading:</span> {loading ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Error:</span> {error || 'None'}
          </div>
          <div>
            <span className="font-medium">Filters:</span> {Object.keys(filters).length}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={testAPI}
            size="sm"
            variant="outline"
          >
            Test Direct API
          </Button>
          <Button 
            onClick={testProductsAPI}
            size="sm"
            variant="outline"
          >
            Test productsAPI
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            size="sm"
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div> */}

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl">
              {getResultsDescription()}
            </p>
            
            {/* Species Filter Badge */}
            {filters.species && (
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <span>Filtering by: {filters.species}</span>
                  <button
                    onClick={clearSpeciesFilter}
                    className="text-primary-600 hover:text-primary-800 text-lg"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by wood species, category, or description..."
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="species">Wood Species</option>
            </select>

            {activeFilterCount > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="whitespace-nowrap"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-4">
            <ProductFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="lg:w-3/4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {loading ? 'Loading...' : `${safeProducts.length} Wood Products`}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {safeProducts.length > 0 
                  ? (filters.species 
                      ? `Showing ${filters.species} wood products`
                      : 'Hand-selected premium woods for your projects'
                    )
                  : 'No products found'
                }
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">Loading premium wood collection...</p>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {safeProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <div className="text-gray-400 text-6xl mb-4">🌲</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filters.species ? `No ${filters.species} products found` : 'No products found'}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {Object.keys(filters).length > 0 
                      ? filters.species
                        ? `We don't have any ${filters.species} wood products in stock at the moment. Try browsing other wood species.`
                        : "We couldn't find any products matching your filters. Try adjusting your search criteria."
                      : "No products are available at the moment. Please check back later."
                    }
                  </p>
                  {Object.keys(filters).length > 0 && (
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={clearAllFilters}
                        variant="primary"
                      >
                        Show All Products
                      </Button>
                      {filters.species && (
                        <Button
                          onClick={clearSpeciesFilter}
                          variant="outline"
                        >
                          Show Other Species
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <ProductGrid products={safeProducts} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}