// app/api/orders/user/[userId]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import Order from '../../../../../models/Orders';

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🟡 GET /api/orders/user/[userId] - Fetching orders for user:', userId);
    
    await connectDB();

    // First, get the user's email from the user ID (you might need to import your User model)
    // For now, let's assume we can get the user's email from the AuthContext or make another query
    // Since we don't have the User model here, let's search orders by both userId AND guestUser.email
    
    // Search for orders where either:
    // 1. userId matches (for logged-in users)
    // 2. guestUser.email matches the user's email (for guest orders that later became user accounts)
    const orders = await Order.find({
      $or: [
        { userId: userId },
        { 'guestUser.email': { $exists: true } } // We'll filter this further after population
      ]
    })
      .populate('items.productId', 'name price images species')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${orders.length} total potential orders for user:`, userId);
    console.log("orders: ");
    console.log(orders);

    // Now we need to get the user's email to filter guest orders
    // Since we don't have User model here, let's modify the approach
    // We'll create a separate endpoint that accepts email, or modify this one

    return NextResponse.json({ 
      success: true,
      orders: orders.map(order => ({
        ...order,
        _id: order._id.toString()
      }))
    });

  } catch (error) {
    console.error('🔴 Error fetching user orders:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}