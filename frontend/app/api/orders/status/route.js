// app/api/orders/[id]/status/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import Order from '../../../../../models/Order';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status, note, updatedBy } = await request.json();
    
    console.log('🟡 PATCH /api/orders/[id]/status - Updating status:', { id, status });

    await connectDB();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Use the updateStatus method from your model
    await order.updateStatus(status, note, updatedBy);

    return NextResponse.json({ 
      message: 'Order status updated successfully',
      order: order 
    });

  } catch (error) {
    console.error('🔴 Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status', details: error.message },
      { status: 500 }
    );
  }
}