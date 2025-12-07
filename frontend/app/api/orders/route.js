// app/api/orders/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Order from '../../../models/Orders';
import Product from '../../../models/Product';
import User from '../../../models/User';

export async function GET(request) {
  try {
    console.log('🟡 GET /api/orders - Starting...');
    
    // Connect to database
    await connectDB();
    console.log('🟢 Database connected');

    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId'); // Add userId parameter
    
    console.log('🔍 Query parameters:', { status, userId });

    // Build query
    let query = {};
    if (status && status !== 'all' && status !== 'null') {
      query.status = status;
    }
    
    // Add user filtering if userId is provided
    if (userId && userId !== 'null' && userId !== 'undefined') {
      console.log('👤 Filtering by user ID:', userId);
      query.userId = userId;
    }

    // Get orders from database
    console.log('📦 Fetching orders from database with query:', query);
    
    // First, try with population
    let orders;
    try {
      orders = await Order.find(query)
        .populate('userId', 'name email username') // Add username to population
        .populate('items.productId', 'name price images species') // Add species to population
        .sort({ createdAt: -1 })
        .lean();
    } catch (populateError) {
      console.log('🟡 Population failed, falling back to basic query:', populateError.message);
      // Fallback: get orders without population
      orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .lean();
    }

    console.log(`✅ Found ${orders.length} orders for user: ${userId}`);

    // Transform the data for the frontend
    const transformedOrders = orders.map(order => {
      // Safely get customer name and email
      let customerName = 'Unknown Customer';
      let customerEmail = 'No email';
      let customerUsername = '';
      
      if (order.userId && typeof order.userId === 'object') {
        // User is populated
        customerName = order.userId.name || order.userId.username || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim();
        customerEmail = order.userId.email || order.shippingAddress?.email;
        customerUsername = order.userId.username || '';
      } else if (order.guestUser) {
        // Guest user
        customerName = order.guestUser.name || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim();
        customerEmail = order.guestUser.email || order.shippingAddress?.email;
      } else if (order.shippingAddress) {
        // Fallback to shipping address
        customerName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim();
        customerEmail = order.shippingAddress?.email;
      }

      return {
        // Basic order info
        _id: order._id?.toString() || order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        orderType: order.orderType,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        
        // Financial information
        totalAmount: order.totalAmount || 0,
        finalAmount: order.finalAmount || 0,
        shippingCost: order.shippingCost || 0,
        taxAmount: order.taxAmount || 0,
        discountAmount: order.discountAmount || 0,
        
        // Payment information
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        
        // Customer information
        userId: order.userId,
        guestUser: order.guestUser,
        customer: {
          name: customerName,
          email: customerEmail,
          username: customerUsername
        },
        
        // Items with product data
        items: order.items?.map(item => {
          let productName = item.productName;
          let productPrice = item.price;
          let productSpecies = item.species;
          
          // If product is populated, use that data
          if (item.productId && typeof item.productId === 'object') {
            productName = item.productId.name || productName;
            productPrice = item.productId.price || productPrice;
            productSpecies = item.productId.species || productSpecies;
          }
          
          return {
            productId: item.productId,
            productName: productName,
            species: productSpecies,
            quantity: item.quantity,
            price: item.price,
            dimensions: item.dimensions,
            subtotal: item.subtotal,
            product: {
              name: productName,
              price: productPrice,
              species: productSpecies,
              // Include images if available from populated product
              images: (item.productId && typeof item.productId === 'object') ? item.productId.images : []
            }
          };
        }) || [],
        
        // Shipping information
        shippingAddress: order.shippingAddress,
        
        // Additional fields
        statusHistory: order.statusHistory || [],
        notes: order.notes,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        deliveredAt: order.deliveredAt,
        cancelledAt: order.cancelledAt,
        cancellationReason: order.cancellationReason,
        
        // Return requests
        returnRequests: order.returnRequests || []
      };
    });

    console.log('📊 Transformed orders for frontend:', transformedOrders.length);
    return NextResponse.json(transformedOrders);

  } catch (error) {
    console.error('🔴 Error in /api/orders:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('🟡 POST /api/orders - Starting...');
    
    await connectDB();
    const orderData = await request.json();
    
    console.log('📦 Creating new order with type:', orderData.orderType);

    // Validate required fields
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!orderData.shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Generate order number
    try {
      orderData.orderNumber = await Order.generateOrderNumber();
    } catch (error) {
      console.error('🔴 Error generating order number:', error);
      // Fallback order number
      orderData.orderNumber = `WOOD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Calculate totals if not provided
    if (!orderData.totalAmount) {
      orderData.totalAmount = orderData.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
    }

    if (!orderData.finalAmount) {
      orderData.finalAmount = (orderData.totalAmount || 0) + 
                             (orderData.shippingCost || 0) + 
                             (orderData.taxAmount || 0) - 
                             (orderData.discountAmount || 0);
    }

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    
    console.log('✅ Order created successfully:', savedOrder.orderNumber);
    console.log('📊 Order details:', {
      type: savedOrder.orderType,
      items: savedOrder.items.length,
      total: savedOrder.finalAmount
    });

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('🔴 Error creating order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}