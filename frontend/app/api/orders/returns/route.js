// app/api/orders/returns/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import Order from '../../../../models/Orders';

export async function POST(request) {
  try {
    console.log('🟡 POST /api/orders/returns - Starting...');
    
    await connectDB();
    const returnData = await request.json();
    
    console.log('📦 Return request data:', returnData);

    const { orderNumber, reason, description } = returnData;

    // Validate required fields
    if (!orderNumber || !reason || !description) {
      return NextResponse.json(
        { error: 'Order number, reason, and description are required' },
        { status: 400 }
      );
    }

    // Clean the order number
    const cleanOrderNumber = orderNumber.trim();
    console.log('🔍 Searching for order with number:', cleanOrderNumber);

    // Find the order - try multiple approaches
    let order = await Order.findOne({ orderNumber: cleanOrderNumber });
    
    if (!order) {
      console.log('❌ Order not found with exact match, trying case-insensitive...');
      
      // Try case-insensitive search
      order = await Order.findOne({ 
        orderNumber: { $regex: new RegExp(`^${cleanOrderNumber}$`, 'i') }
      });
    }

    if (!order) {
      console.log('❌ Order not found with case-insensitive match, trying partial match...');
      
      // Try partial match (in case there are extra/missing characters)
      const allOrders = await Order.find({}).select('orderNumber status createdAt').sort({ createdAt: -1 }).limit(10);
      console.log('📋 Recent orders in database:', allOrders.map(o => ({
        orderNumber: o.orderNumber,
        status: o.status,
        createdAt: o.createdAt
      })));
      
      // Check if any order number contains the search term
      const matchingOrder = allOrders.find(o => 
        o.orderNumber.toLowerCase().includes(cleanOrderNumber.toLowerCase()) ||
        cleanOrderNumber.toLowerCase().includes(o.orderNumber.toLowerCase())
      );
      
      if (matchingOrder) {
        console.log('🔍 Found partial match:', matchingOrder.orderNumber);
        order = await Order.findById(matchingOrder._id);
      }
    }

    if (!order) {
      console.log('❌ Order not found after all search attempts');
      return NextResponse.json(
        { 
          error: `Order "${cleanOrderNumber}" not found. Please check your order number and try again.` 
        },
        { status: 404 }
      );
    }

    console.log('✅ Found order:', {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      itemsCount: order.items.length
    });

    // Check if order is eligible for return (delivered within 30 days)
    const deliveredDate = order.deliveredAt || order.createdAt;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    console.log('📅 Date check:', {
      deliveredDate,
      thirtyDaysAgo,
      isWithin30Days: deliveredDate >= thirtyDaysAgo
    });
    
    if (deliveredDate < thirtyDaysAgo) {
      return NextResponse.json(
        { error: 'This order is outside the 30-day return window' },
        { status: 400 }
      );
    }

    // Check if order status allows returns
    console.log('🔍 Order status check:', order.status);
    if (!['delivered', 'return_requested'].includes(order.status)) {
      return NextResponse.json(
        { error: `Returns can only be requested for delivered orders. Current order status: ${order.status}` },
        { status: 400 }
      );
    }

    // Generate return ID
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    const returnId = `RET-${timestamp}-${randomStr}`;

    console.log('🆔 Generated return ID:', returnId);

    // Create return request
    const returnRequest = {
      returnId,
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        reason: reason,
        description: description,
        status: 'pending'
      })),
      reason,
      description,
      status: 'pending',
      requestedAt: new Date()
    };

    console.log('📝 Created return request for', order.items.length, 'items');

    // Initialize returnRequests array if it doesn't exist
    if (!order.returnRequests) {
      order.returnRequests = [];
    }

    // Add return request to order
    order.returnRequests.push(returnRequest);
    
    // Update order status if this is the first return request
    if (order.status !== 'return_requested') {
      order.status = 'return_requested';
      order.statusHistory.push({
        status: 'return_requested',
        note: 'Return requested by customer',
        updatedAt: new Date()
      });
    }

    // Save the order
    await order.save();

    console.log('✅ Return request created successfully for order:', order.orderNumber);
    console.log('📊 Order return requests count:', order.returnRequests.length);
    
    return NextResponse.json({
      success: true,
      returnId,
      orderNumber: order.orderNumber,
      message: 'Return request submitted successfully. We will review your request within 24 hours.'
    }, { status: 201 });

  } catch (error) {
    console.error('🔴 Error creating return request:', error);
    console.error('🔴 Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to submit return request', details: error.message },
      { status: 500 }
    );
  }
}