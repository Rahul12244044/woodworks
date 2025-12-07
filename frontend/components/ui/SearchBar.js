// components/ui/SearchBar.js - MOST FLEXIBLE VERSION
import { useState, useEffect } from 'react';

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search products...",
  debounceTime = 500 // Add debounce for better UX
}) {
  const [query, setQuery] = useState(value || '');

  // Sync with parent value
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    // If onSearch is provided but not onChange, use debounce
    if (onSearch && !onChange) {
      // You could add debounce here if needed
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else if (onChange) {
      onChange(query);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        
        {/* Clear button when there's text */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Search/Submit button */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}