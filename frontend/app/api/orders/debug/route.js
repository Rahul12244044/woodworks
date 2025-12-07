// app/api/orders/debug/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import Order from '../../../../models/Orders';

export async function GET() {
  try {
    await connectDB();
    
    // Get all orders with user information
    const allOrders = await Order.find({})
      .populate('userId', 'username email _id')
      .select('_id orderNumber userId orderType status createdAt shippingAddress guestUser')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('📋 ALL ORDERS IN DATABASE:', allOrders.length);
    
    // Count orders by user and type
    const orderStats = {
      total: allOrders.length,
      byUser: {},
      byType: {},
      userDetails: {}
    };
    
    allOrders.forEach(order => {
      const userId = order.userId?._id?.toString() || order.userId?.toString() || 'guest';
      const orderType = order.orderType || 'unknown';
      const username = order.userId?.username || 'guest';
      const email = order.guestUser?.email || order.shippingAddress?.email || 'no-email';
      
      orderStats.byUser[userId] = (orderStats.byUser[userId] || 0) + 1;
      orderStats.byType[orderType] = (orderStats.byType[orderType] || 0) + 1;
      
      if (userId !== 'guest') {
        orderStats.userDetails[userId] = {
          username: order.userId?.username,
          email: order.userId?.email,
          orderCount: orderStats.byUser[userId]
        };
      }
    });
    
    return NextResponse.json({
      totalOrders: allOrders.length,
      orderStats,
      orders: allOrders.map(order => ({
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: order.userId?._id?.toString() || order.userId?.toString(),
        userDetails: order.userId ? {
          username: order.userId.username,
          email: order.userId.email
        } : null,
        guestUser: order.guestUser,
        shippingEmail: order.shippingAddress?.email,
        orderType: order.orderType,
        status: order.status,
        createdAt: order.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}