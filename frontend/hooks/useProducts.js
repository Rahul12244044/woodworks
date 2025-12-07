// hooks/useProducts.js - UPDATED with grainPattern support
import { useState, useEffect } from 'react';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query string from filters
        const params = new URLSearchParams();
        
        // Standard filters
        if (filters.category) params.append('category', filters.category);
        if (filters.species) params.append('species', filters.species);
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.page) params.append('page', filters.page);
        
        // Handle price range specially
        if (filters.priceRange) {
          const { min, max } = filters.priceRange;
          if (min !== undefined && min !== '' && !isNaN(min)) {
            params.append('minPrice', min);
          }
          if (max !== undefined && max !== '' && !isNaN(max)) {
            params.append('maxPrice', max);
          }
        }
        
        // Handle grain pattern
        if (filters.grainPattern && filters.grainPattern.length > 0) {
          // If it's an array, join it
          if (Array.isArray(filters.grainPattern)) {
            params.append('grainPattern', filters.grainPattern.join(','));
          } else {
            params.append('grainPattern', filters.grainPattern);
          }
        }
        
        // Handle other boolean filters
        if (filters.inStock === 'true') {
          params.append('inStock', 'true');
        }
        if (filters.featured === 'true') {
          params.append('featured', 'true');
        }

        const queryString = params.toString();
        const url = `/api/products${queryString ? `?${queryString}` : ''}`;

        console.log('🔍 useProducts: Fetching from URL:', url);
        console.log('🔍 useProducts: Filters object:', filters);
        console.log('🔍 useProducts: Query params:', Object.fromEntries(params));

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('🔍 useProducts: API Response:', {
          status: response.status,
          success: data.success,
          count: data.count || data.products?.length || 0,
          hasProducts: !!(data.products || Array.isArray(data))
        });
        
        // Handle response structure
        let productsArray = [];
        
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data.products && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (data.data && Array.isArray(data.data)) {
          productsArray = data.data;
        } else {
          console.warn('⚠️ useProducts: Unexpected API response structure:', data);
          productsArray = [];
        }

        console.log('🔍 useProducts: Final products array length:', productsArray.length);
        
        // Debug first product if available
        if (productsArray.length > 0) {
          console.log('🔍 useProducts: First product sample:', {
            name: productsArray[0].name,
            price: productsArray[0].price,
            species: productsArray[0].species,
            category: productsArray[0].category
          });
        }

        setProducts(productsArray);
      } catch (err) {
        console.error('❌ useProducts: Fetch error:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error };
}