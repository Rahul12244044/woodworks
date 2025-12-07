// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import Order from '../../../../models/Orders';

// Helper function to transform order data
function transformOrder(order) {
  return {
    _id: order._id.toString(),
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
    customer: order.userId ? {
      name: order.userId.name || order.userId.username,
      email: order.userId.email
    } : {
      name: order.guestUser?.name || `${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}`,
      email: order.guestUser?.email || order.shippingAddress?.email
    },
    
    // Items with product data
    items: order.items?.map(item => ({
      productId: item.productId,
      productName: item.productName,
      species: item.species || item.productId?.species,
      quantity: item.quantity,
      price: item.price,
      dimensions: item.dimensions,
      subtotal: item.subtotal,
      product: item.productId ? {
        name: item.productId.name,
        price: item.productId.price,
        species: item.productId.species,
        images: item.productId.images || []
      } : null
    })) || [],
    
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
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('🟡 GET /api/orders/[id] - Fetching order:', id);
    
    await connectDB();

    const order = await Order.findById(id)
      .populate('userId', 'name email username')
      .populate('items.productId', 'name price images species')
      .lean();

    if (!order) {
      console.log('❌ Order not found:', id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', order.orderNumber);
    const transformedOrder = transformOrder(order);

    return NextResponse.json(transformedOrder);

  } catch (error) {
    console.error('🔴 Error fetching order:', error);
    
    // Handle specific error types
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('🟡 PUT /api/orders/[id] - Updating order:', id);
    
    await connectDB();
    const updateData = await request.json();

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    )
    .populate('userId', 'name email username')
    .populate('items.productId', 'name price images species');

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const transformedOrder = transformOrder(updatedOrder.toObject());
    console.log('✅ Order updated:', updatedOrder.orderNumber);

    return NextResponse.json(transformedOrder);

  } catch (error) {
    console.error('🔴 Error updating order:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('🟡 DELETE /api/orders/[id] - Deleting order:', id);
    
    await connectDB();

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order deleted:', deletedOrder.orderNumber);
    
    return NextResponse.json({ 
      message: 'Order deleted successfully',
      deletedOrder: {
        orderNumber: deletedOrder.orderNumber,
        id: deletedOrder._id.toString()
      }
    });

  } catch (error) {
    console.error('🔴 Error deleting order:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to delete order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}