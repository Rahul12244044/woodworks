// app/api/orders/user/email/[email]/route.js
import { NextResponse } from 'next/server';
import Order from '../../../../../../models/Orders';
import { connectDB } from '../../../../../../lib/db';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { email } = params;
    console.log('🔵 Looking for orders with email:', email);
    
    // Search in the correct fields based on your Order model
    const orders = await Order.find({
      $or: [
        // For registered users
        { 'shippingAddress.email': email },
        // For guest users
        { 'guestUser.email': email },
        // Legacy field names (if any)
        { userEmail: email },
        { 'user.email': email },
        { 'customer.email': email }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('items.productId') // Changed from 'items.product' to 'items.productId'
    .populate('userId', 'username email firstName lastName'); // Populate user info if needed
    
    console.log('🔵 Found orders count:', orders.length);
    
    if (orders.length > 0) {
      console.log('🔵 Sample order details:', {
        orderId: orders[0]._id,
        orderNumber: orders[0].orderNumber,
        orderType: orders[0].orderType,
        userId: orders[0].userId,
        guestUser: orders[0].guestUser,
        shippingEmail: orders[0].shippingAddress?.email,
        status: orders[0].status,
        finalAmount: orders[0].finalAmount,
        itemCount: orders[0].items?.length
      });
    }
    
    if (orders.length === 0) {
      return NextResponse.json({ 
        success: true, 
        orders: [],
        message: 'No orders found for this email' 
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      orders: orders,
      count: orders.length,
      message: `Found ${orders.length} order(s)`
    });
    
  } catch (error) {
    console.error('❌ Error fetching orders by email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch orders',
        details: error.message 
      },
      { status: 500 }
    );
  }
}