'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useCart } from './CartContext';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const { items, clearCart, getCartTotal } = useCart();
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate order totals reactively using useMemo
  const cartTotal = useMemo(() => getCartTotal(), [items, getCartTotal]);
  
  const shippingCost = useMemo(() => {
    const rates = {
      standard: 15.00,
      express: 25.00,
      overnight: 45.00
    };
    return rates[shippingMethod] || rates.standard;
  }, [shippingMethod]);
  
  const tax = useMemo(() => cartTotal * 0.08, [cartTotal]);
  
  const orderTotal = useMemo(() => 
    cartTotal + shippingCost + tax, 
    [cartTotal, shippingCost, tax]
  );

  // Reset checkout when cart is empty
  useEffect(() => {
    if (items.length === 0) {
      resetCheckout();
    }
  }, [items.length]);

  const resetCheckout = () => {
    setShippingAddress({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    });
    setBillingAddress({
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    });
    setSameAsShipping(true);
    setShippingMethod('standard');
    setPaymentMethod('');
    setOrderNotes('');
    setIsProcessing(false);
  };

  // Create order in database
  const createOrder = async () => {
    if (items.length === 0) {
      throw new Error('Cart is empty');
    }

    setIsProcessing(true);

    try {
      // Get user information
      const userInfo = await getUserInfoForOrder();
      
      // Prepare order data
      const orderData = {
        // Only include userId if we have a valid authenticated user
        ...(userInfo.isAuthenticated && { userId: userInfo.userId }),
        
        // Always include guestUser for guest orders
        ...(!userInfo.isAuthenticated && {
          guestUser: {
            email: shippingAddress.email,
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            phone: shippingAddress.phone
          }
        }),
        
        items: items.map(item => ({
          productId: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          dimensions: item.dimensions,
          subtotal: item.price * item.quantity
        })),
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        },
        shippingMethod: shippingMethod, // Include shipping method in order data
        paymentMethod: mapPaymentMethod(paymentMethod),
        totalAmount: cartTotal,
        shippingCost: shippingCost,
        taxAmount: tax,
        discountAmount: 0,
        finalAmount: orderTotal,
        notes: orderNotes,
        status: 'pending',
        statusHistory: [{
          status: 'pending',
          note: 'Order created',
          updatedAt: new Date()
        }],
        orderType: userInfo.isAuthenticated ? 'user' : 'guest'
      };

      console.log('📦 Creating order with data:', orderData);
      console.log('🚚 Shipping method:', shippingMethod);
      console.log('💰 Shipping cost:', shippingCost);

      // Call the API directly instead of using ordersAPI to see the raw response
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      
      console.log('📨 API Response:', result);
      console.log('📨 Response status:', response.status);
      console.log('📨 Response OK:', response.ok);

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      // Handle different response formats
      let createdOrder;
      
      if (result.order) {
        // Case 1: { success: true, order: {...} }
        createdOrder = result.order;
      } else if (result._id) {
        // Case 2: Direct order object
        createdOrder = result;
      } else if (result.data) {
        // Case 3: { data: {...} }
        createdOrder = result.data;
      } else {
        // Case 4: Try to use the result directly
        createdOrder = result;
      }

      console.log('✅ Extracted order:', createdOrder);

      if (createdOrder && (createdOrder._id || createdOrder.orderNumber)) {
        console.log('🎉 Order created successfully!');
        console.log('🆔 Order ID:', createdOrder._id);
        console.log('📋 Order Number:', createdOrder.orderNumber);
        
        clearCart();
        return createdOrder;
      } else {
        console.error('❌ No valid order data returned:', createdOrder);
        throw new Error('No valid order data returned from server');
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to get user information
  const getUserInfoForOrder = async () => {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, userId: null };
    }

    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('🔐 Authenticated user:', userData.username);
        
        // Validate if userId is a valid MongoDB ObjectId
        if (userData._id && /^[0-9a-fA-F]{24}$/.test(userData._id)) {
          return {
            isAuthenticated: true,
            userId: userData._id,
            userData: userData
          };
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Guest user
    console.log('🎭 Guest checkout detected');
    return { isAuthenticated: false, userId: null };
  };

  // Map frontend payment method to backend enum
  // In your CheckoutContext, update the mapPaymentMethod function
// Map frontend payment method to backend enum
const mapPaymentMethod = (method) => {
  const methodMap = {
    'card': 'credit_card',
    'paypal': 'paypal',
    'applepay': 'apple_pay',
    'googlepay': 'google_pay'
  };
  return methodMap[method] || 'credit_card';
};

  const value = {
    // State
    shippingAddress,
    billingAddress,
    sameAsShipping,
    shippingMethod,
    paymentMethod,
    orderNotes,
    isProcessing,
    
    // Calculated values
    cartTotal,
    shippingCost,
    tax,
    orderTotal,

    // Setters
    setShippingAddress: (updates) => setShippingAddress(prev => ({ ...prev, ...updates })),
    setBillingAddress: (updates) => setBillingAddress(prev => ({ ...prev, ...updates })),
    setSameAsShipping,
    setShippingMethod,
    setPaymentMethod,
    setOrderNotes,

    // Actions
    createOrder,
    resetCheckout
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}