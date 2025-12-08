// contexts/CartContext.js
'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Import your existing AuthContext

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, loading } = useAuth(); // Use your auth context

  // Generate user-specific localStorage key
  const getCartKey = () => {
    return user ? `woodshop-cart-${user._id}` : 'woodshop-guest-cart';
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);
    
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, [user]); // Re-run when user changes

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(state.items));
  }, [state.items, user]);

  const addToCart = (product, quantity = 1) => {
    if (!user && !loading) {
      // For guests, show login prompt
      return { 
        success: false, 
        message: 'Please login to add items to cart',
        requiresLogin: true 
      };
    }

    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    return { success: true, message: `${product.name} added to cart` };
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Transfer cart from guest to user when they login
  const transferGuestCart = () => {
    if (!user || loading) return;
    
    const guestCart = localStorage.getItem('woodshop-guest-cart');
    if (guestCart) {
      try {
        const guestItems = JSON.parse(guestCart);
        const userCart = localStorage.getItem(`woodshop-cart-${user._id}`);
        const userItems = userCart ? JSON.parse(userCart) : [];
        
        // Merge carts
        const mergedItems = [...userItems];
        
        guestItems.forEach(guestItem => {
          const existingItem = mergedItems.find(item => item._id === guestItem._id);
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            mergedItems.push(guestItem);
          }
        });
        
        // Save merged cart
        localStorage.setItem(`woodshop-cart-${user._id}`, JSON.stringify(mergedItems));
        localStorage.removeItem('woodshop-guest-cart');
        
        // Update state
        dispatch({ type: 'LOAD_CART', payload: mergedItems });
      } catch (error) {
        console.error('Error transferring guest cart:', error);
      }
    }
  };

  // Transfer cart when user logs in
  useEffect(() => {
    if (user && !loading) {
      transferGuestCart();
    }
  }, [user, loading]);

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isLoggedIn: !!user,
    isLoading: loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};