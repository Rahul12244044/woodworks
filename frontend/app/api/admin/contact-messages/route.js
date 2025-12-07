// app/api/admin/contact-messages/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import ContactMessage from '../../../../models/ContactMessage';

// GET all contact messages with filtering and pagination
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { woodType: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await ContactMessage.countDocuments(query);

    // Get messages with sorting and pagination
    const messages = await ContactMessage.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Update message status
export async function POST(request) {
  try {
    await connectDB();
    
    const { messageId, status, adminNotes } = await request.json();

    if (!messageId || !status) {
      return NextResponse.json(
        { error: 'Message ID and status are required' },
        { status: 400 }
      );
    }

    const message = await ContactMessage.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Update message
    message.status = status;
    if (adminNotes) {
      message.adminNotes = adminNotes;
    }

    await message.save();

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });

  } catch (error) {
    console.error('❌ Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update contact message', details: error.message },
      { status: 500 }
    );
  }
}