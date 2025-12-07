import API from './axios';
import { sampleProducts as initialSampleProducts } from './sampleData';

// Helper function to simulate API delay
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  
  const token = localStorage.getItem('token');
  return token ? { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {};
};

// Get products from localStorage or use initial sample data
const getPersistedProducts = () => {
  console.log('🔄 Loading products from storage...');
  
  if (typeof window === 'undefined') {
    console.log('📦 Server side - returning initial sample data:', initialSampleProducts.length, 'products');
    return initialSampleProducts;
  }
  
  try {
    const storedProducts = localStorage.getItem('woodworks_products');
    
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      console.log('📦 Found stored products:', parsedProducts.length);
      
      // Merge with initial sample products to ensure we always have the predefined data
      const mergedProducts = [...initialSampleProducts];
      
      // Add any custom products that aren't in the sample data
      parsedProducts.forEach(customProduct => {
        const exists = mergedProducts.some(sampleProduct => 
          sampleProduct._id === customProduct._id
        );
        if (!exists) {
          mergedProducts.push(customProduct);
        }
      });
      
      console.log('✅ Final merged products:', mergedProducts.length);
      return mergedProducts;
    } else {
      console.log('📦 No stored products - returning initial sample data:', initialSampleProducts.length, 'products');
    }
  } catch (error) {
    console.error('❌ Error loading products from localStorage:', error);
  }
  
  console.log('📦 Returning initial sample data as fallback');
  return initialSampleProducts;
};

// Save products to localStorage
const saveProductsToStorage = (products) => {
  if (typeof window !== 'undefined') {
    try {
      // Only save custom products, not the predefined sample products
      const customProducts = products.filter(product => 
        !initialSampleProducts.some(sampleProduct => sampleProduct._id === product._id)
      );
      localStorage.setItem('woodworks_products', JSON.stringify(customProducts));
      console.log('💾 Saved custom products to storage:', customProducts.length);
    } catch (error) {
      console.error('❌ Error saving products to localStorage:', error);
    }
  }
};

// Initialize products from storage
let sampleProducts = getPersistedProducts();

// Helper function to filter products based on filters
const filterProducts = (products, filters) => {
  let filteredProducts = [...products];
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.species.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.category && filters.category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === filters.category);
  }
  
  if (filters.species && filters.species !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.species === filters.species);
  }
  
  if (filters.minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= Number(filters.minPrice));
  }
  
  if (filters.maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= Number(filters.maxPrice));
  }
  
  if (filters.grainPattern && filters.grainPattern.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.grainPattern && p.grainPattern.some(pattern => filters.grainPattern.includes(pattern))
    );
  }

  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(p => p.inStock === true);
  }

  if (filters.featured) {
    filteredProducts = filteredProducts.filter(p => p.featured === true);
  }
  
  // Sort products
  if (filters.sort) {
    switch (filters.sort) {
      case 'price':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case '-price':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'species':
        filteredProducts.sort((a, b) => a.species.localeCompare(b.species));
        break;
      case 'name':
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }
  
  return filteredProducts;
};

// Get admin credentials from environment variables
const getAdminCredentials = () => {
  // These should be set in your .env.local file
  return {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@woodworks.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin@1224',
    adminUsername: process.env.ADMIN_USERNAME || 'admin'
  };
};

// Products API with fallback
// Products API with fallback
const productsAPI = {
  getProducts: async (filters = {}) => {
    console.log('🚀 Getting products from real database with filters:', filters);
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      }
    });
    
    console.log('🌐 Calling real products API...');
    
    try {
      const response = await fetch(`/api/products?${params}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('📡 Real API response received');
      return { data };
    } catch (error) {
      console.error('❌ API call failed:', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    console.log('🔍 Getting product from database:', id);
    
    // Make sure the ID is valid
    if (!id || id === 'undefined') {
      throw new Error('Invalid product ID');
    }
    
    const response = await fetch(`/api/products/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  },

  createProduct: async (productData) => {
    console.log('➕ Creating new product in database:', productData.name);
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  },

  updateProduct: async (id, productData) => {
    console.log('✏️ Updating product in database:', id);
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  },

  deleteProduct: async (id) => {
    console.log('🗑️ Deleting product from database:', id);
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  }
};

// Projects API
const projectsAPI = {
  getProjects: async () => {
    await simulateDelay(700);
    
    try {
      const response = await API.get('/projects');
      return response;
    } catch (error) {
      console.log('Using projects fallback - demo mode');
      
      // Sample projects data for demo
      const sampleProjects = [
        {
          _id: 'project_1',
          title: 'Rustic Wood Coffee Table',
          description: 'Build a beautiful rustic coffee table using reclaimed wood and hairpin legs. Perfect for beginners looking to create their first furniture piece.',
          category: 'furniture',
          difficulty: 'beginner',
          estimatedHours: 8,
          materials: ['Reclaimed wood', 'Hairpin legs', 'Wood glue', 'Sandpaper'],
          tools: ['Circular saw', 'Drill', 'Sander', 'Clamps'],
          steps: [
            'Cut wood to size',
            'Sand all surfaces',
            'Assemble table top',
            'Attach legs',
            'Apply finish'
          ],
          images: [
            {
              url: '/images/projects/coffee-table.jpg',
              alt: 'Finished rustic coffee table'
            }
          ],
          featured: true,
          published: true,
          hasVideo: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      return {
        data: { projects: sampleProjects }
      };
    }
  },

  updateProject: async (id, updates) => {
    await simulateDelay(500);
    
    try {
      const response = await API.put(`/projects/${id}`, updates);
      return response;
    } catch (error) {
      console.log('Using update project fallback - demo mode');
      return {
        data: { message: 'Project updated successfully' }
      };
    }
  },

  deleteProject: async (id) => {
    await simulateDelay(500);
    
    try {
      const response = await API.delete(`/projects/${id}`);
      return response;
    } catch (error) {
      console.log('Using delete project fallback - demo mode');
      return {
        data: { message: 'Project deleted successfully' }
      };
    }
  },

  createProject: async (projectData) => {
    await simulateDelay(1000);
    
    try {
      const response = await API.post('/projects', projectData);
      return response;
    } catch (error) {
      console.log('Using create project fallback - demo mode');
      
      // Simulate successful creation
      const newProject = {
        ...projectData,
        _id: `project_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        data: { project: newProject, message: 'Project created successfully' }
      };
    }
  }
};

// Orders API with fallback
// lib/api.js - Update ordersAPI section
// lib/api.js - Update ordersAPI section (NO FALLBACK)
// lib/api.js - Update ordersAPI section
const ordersAPI = {
  getOrders: async (filters = {}) => {
    console.log('🟡 Fetching orders from real database API...');
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await fetch(`/api/orders?${params}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Orders API failed:', errorText);
      throw new Error(`Failed to fetch orders: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log(data);
    console.log(`✅ Successfully fetched ${data.length} orders from database`);
    return { data };
  },

  getOrder: async (id) => {
    console.log('🟡 Fetching single order from database:', id);
    
    const response = await fetch(`/api/orders/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  },
  // ADD THIS MISSING METHOD
  createOrder: async (orderData) => {
    console.log('🟡 Creating new order in database...');
    console.log('📦 Order data:', orderData);
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Create order API failed:', errorText);
      throw new Error(`Failed to create order: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Order created successfully:', data);
    return { data };
  },

  updateOrder: async (id, orderData) => {
    console.log('🟡 Updating order in database:', id);
    
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  },

  updateOrderStatus: async (id, status) => {
    console.log('🟡 Updating order status in database:', { id, status });
    
    const response = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  },

  deleteOrder: async (id) => {
    console.log('🟡 Deleting order from database:', id);
    
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete order: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  }
};
// lib/api.js - Update your API functions
const blogAPI = {
  // Get all posts - FIXED: Use getAllPosts consistently
  getAllPosts: async () => {
    try {
      console.log('📝 Fetching blog posts from API...');
      const response = await fetch('/api/blog/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Blog posts fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { data: [] };
    }
  },

  // Create post
  createPost: async (postData) => {
    try {
      console.log('📤 Creating new blog post:', postData);
      
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Blog post created:', result);
      return result;
      
    } catch (error) {
      console.error('❌ API call failed:', error);
      return { 
        error: error.message,
        data: null 
      };
    }
  },

  // Get single post
  getPost: async (id) => {
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      return { data: null };
    }
  },

  // Update post
  updatePost: async (id, postData) => {
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      return { error: error.message };
    }
  },

  // Delete post
  deletePost: async (id) => {
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting post:', error);
      return { error: error.message };
    }
  },
};
// Auth API with fallback - UPDATED WITH ENV VARIABLES
const authAPI = {
  login: async (email, password) => {
    await simulateDelay(800);
    
    try {
      const response = await API.post('/auth/login', { email, password });
      console.log("response: ");
      console.log(response);
      return response;
    } catch (error) {
      console.log('Using auth fallback - demo mode');

      // Demo admin credentials for fallback mode only
      const demoAdmin = {
        email: 'admin@woodworks.com',
        password: 'admin@1224',
        username: 'admin'
      };

      // Check against demo admin (fallback mode only)
      if (email === demoAdmin.email && password === demoAdmin.password) {
        // Generate token in the SAME format as your server-side API
        const tokenPayload = {
          userId: 'admin-user',
          username: demoAdmin.username,
          email: demoAdmin.email,
          role: 'admin',
          iat: Date.now(),
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        
        // Use Base64 encoding (same as server-side)
        const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
        
        return {
          data: {
            _id: 'admin-user',
            username: demoAdmin.username,
            email: demoAdmin.email,
            role: 'admin',
            token: token // Now matches server format
          }
        };
      }

      // Simulate successful login for demo customers
      if (email && password) {
        // Generate token in the SAME format as your server-side API
        const tokenPayload = {
          userId: 'demo-user-' + Date.now(),
          username: email.split('@')[0],
          email: email,
          role: 'customer',
          iat: Date.now(),
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        
        // Use Base64 encoding (same as server-side)
        const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
        
        return {
          data: {
            _id: 'demo-user-' + Date.now(),
            username: email.split('@')[0],
            email: email,
            role: 'customer',
            token: token // Now matches server format
          }
        };
      } else {
        throw new Error('Email and password are required');
      }
    }
  },

  register: async (userData) => {
    await simulateDelay(800);
    
    try {
      const response = await API.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.log('Using auth fallback - demo mode');
      
      // Validate required fields for fallback mode
      if (!userData.firstName || !userData.lastName) {
        throw new Error('First name and last name are required');
      }

      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Username, email, and password are required');
      }

      // Prevent registering with admin email
      const { adminEmail } = getAdminCredentials();
      if (userData.email === adminEmail) {
        throw new Error('This email is reserved for admin use');
      }

      // Generate token in the SAME format as your server-side API
      const tokenPayload = {
        userId: 'demo-user-' + Date.now(),
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'customer',
        iat: Date.now(),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      };
      
      // Use Base64 encoding (same as server-side)
      const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

      // Create demo user with all required fields
      return {
        data: {
          _id: 'demo-user-' + Date.now(),
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: `${userData.firstName} ${userData.lastName}`,
          role: 'customer',
          token: token, // Now matches server format
          notifications: {
            orderUpdates: true,
            promotionalEmails: true,
            newProducts: true,
            projectIdeas: true
          },
          settings: {
            emailVerified: false,
            twoFactorEnabled: false,
            privacyLevel: 'private'
          },
          addresses: []
        }
      };
    }
  },

  getProfile: async () => {
    await simulateDelay(300);
    
    try {
      const response = await API.get('/auth/profile');
      return response;
    } catch (error) {
      console.log('Using auth profile fallback - demo mode');

      const token = localStorage.getItem('token');
      const { adminEmail, adminUsername } = getAdminCredentials();

      // Decode token to check what type it is
      if (token) {
        try {
          // Try to decode as base64 (server format)
          const decoded = JSON.parse(atob(token));
          console.log('🔍 Token decoded:', decoded);
          
          if (decoded.role === 'admin') {
            return {
              data: {
                _id: 'admin-user',
                username: adminUsername,
                email: adminEmail,
                firstName: 'Admin',
                lastName: 'User',
                name: 'Admin User',
                role: 'admin',
                notifications: {
                  orderUpdates: true,
                  promotionalEmails: true,
                  newProducts: true,
                  projectIdeas: true
                },
                settings: {
                  emailVerified: true,
                  twoFactorEnabled: false,
                  privacyLevel: 'private'
                },
                addresses: []
              }
            };
          }
        } catch (e) {
          console.log('❌ Could not decode token as base64:', e.message);
        }
      }

      return {
        data: {
          _id: 'demo-user',
          username: 'demouser',
          email: 'demo@woodworks.com',
          firstName: 'Demo',
          lastName: 'User',
          name: 'Demo User',
          role: 'customer',
          notifications: {
            orderUpdates: true,
            promotionalEmails: true,
            newProducts: true,
            projectIdeas: true
          },
          settings: {
            emailVerified: false,
            twoFactorEnabled: false,
            privacyLevel: 'private'
          },
          addresses: []
        }
      };
    }
  },

  logout: async () => {
    await simulateDelay(300);
    
    try {
      const response = await API.post('/auth/logout');
      return response;
    } catch (error) {
      console.log('Using logout fallback - demo mode');
      return {
        data: { message: 'Logged out successfully' }
      };
    }
  }
};
// Users API with fallback
const usersAPI = {
  getUsers: async (filters = {}) => {
    try {
      console.log('📡 Fetching users from API with filters:', filters);
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/users?${params}`);
      console.log('📡 Get users response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Get users response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch users: ${response.status}`);
      }
      
      // Handle different response structures
      if (data.users && Array.isArray(data.users)) {
        return { data: data.users };
      } else if (data.data && Array.isArray(data.data)) {
        return { data: data.data };
      } else if (Array.isArray(data)) {
        return { data };
      } else {
        console.warn('Unexpected API response structure:', data);
        return { data: [] };
      }
      
    } catch (error) {
      console.error('❌ Get users API error:', error);
      // Don't fallback to demo data - throw the error so component can handle it
      throw new Error('Failed to fetch users from server: ' + error.message);
    }
  },

  updateUser: async (id, userData) => {
    try {
      console.log('📡 Updating user:', id);
      console.log('📦 Update data:', userData);
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Update user response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Update user response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to update user: ${response.status}`);
      }
      
      // Return the data in a consistent format
      return { 
        data: {
          success: data.success,
          user: data.user || data.data, // Handle both response structures
          message: data.message
        }
      };
      
    } catch (error) {
      console.error('❌ Update user API error:', error);
      throw new Error('Failed to update user: ' + error.message);
    }
  },

  deleteUser: async (id) => {
    try {
      console.log('📡 Deleting user:', id);
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      console.log('📡 Delete user response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Delete user response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to delete user: ${response.status}`);
      }
      
      return { 
        data: {
          success: data.success,
          message: data.message
        }
      };
      
    } catch (error) {
      console.error('❌ Delete user API error:', error);
      throw new Error('Failed to delete user: ' + error.message);
    }
  },
   createUser: async (userData) => {
  try {
    console.log('📡 Creating new user:', userData);
    
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📡 Create user response status:', response.status);
    console.log('📡 Create user response headers:', response.headers);
    
    // Check if response is empty
    const text = await response.text();
    console.log('📡 Create user response text:', text);
    
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError, 'Response text:', text);
      throw new Error('Server returned invalid JSON response');
    }
    
    if (!response.ok) {
      console.error('❌ Backend error details:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      throw new Error(data.error || data.message || `Failed to create user: ${response.status} ${response.statusText}`);
    }
    
    // Return the data in a consistent format
    return { 
      data: {
        success: data.success,
        user: data.user || data.data, // Handle both response structures
        message: data.message
      }
    };
    
  } catch (error) {
    console.error('❌ Create user API error:', error);
    throw new Error('Failed to create user: ' + error.message);
  }
}
};
// Dashboard API with fallback
const dashboardAPI = {
  getStats: async () => {
    await simulateDelay(800);
    
    try {
      const response = await API.get('/dashboard/stats');
      return response;
    } catch (error) {
      console.log('Using dashboard stats fallback - demo mode');
      // Reload products from storage to get accurate count
      sampleProducts = getPersistedProducts();
      
      return {
        data: {
          totalProducts: sampleProducts.length,
          totalOrders: 3,
          totalUsers: 4,
          pendingOrders: 1,
          revenue: 665.74,
          recentOrders: [
            {
              _id: 'order-1',
              orderNumber: 'WOOD001',
              customerName: 'John Smith',
              totalAmount: 450.00,
              status: 'pending',
              createdAt: new Date().toISOString()
            },
            {
              _id: 'order-2',
              orderNumber: 'WOOD002',
              customerName: 'Sarah Johnson',
              totalAmount: 125.75,
              status: 'confirmed',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ]
        }
      };
    }
  }
};

// Utility function to check backend connectivity
const checkBackendHealth = async () => {
  try {
    const response = await API.get('/health');
    return { healthy: true, data: response.data };
  } catch (error) {
    return { 
      healthy: false, 
      message: 'Backend not available, using demo mode',
      error: error.message 
    };
  }
};

// Export a flag to indicate if we're in demo mode
const isDemoMode = async () => {
  const health = await checkBackendHealth();
  return !health.healthy;
};

// Debug utilities
const debugAPI = {
  resetProducts: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('woodworks_products');
      sampleProducts = [...initialSampleProducts];
      saveProductsToStorage(sampleProducts);
      console.log('✅ Products reset to sample data:', sampleProducts.length, 'products');
      return sampleProducts;
    }
    return initialSampleProducts;
  },
  
  checkProducts: () => {
    const current = getPersistedProducts();
    console.log('📦 Current products:', {
      count: current.length,
      names: current.map(p => p.name)
    });
    return current;
  }
};

// Export all APIs
export {
  authAPI,
  productsAPI,
  ordersAPI,
  projectsAPI,
  usersAPI,
  dashboardAPI,
  checkBackendHealth,
  isDemoMode,
  debugAPI,
  blogAPI
};