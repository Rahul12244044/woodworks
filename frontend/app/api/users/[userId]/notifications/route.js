import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import User from '../../../../../models/User';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const notificationsData = await request.json();

    console.log('🟡 Updating notifications for user:', userId);
    console.log('🟡 Notifications data:', notificationsData);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid User ID' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update notification preferences
    if (notificationsData.orderUpdates !== undefined) {
      user.notifications.orderUpdates = notificationsData.orderUpdates;
    }
    if (notificationsData.promotionalEmails !== undefined) {
      user.notifications.promotionalEmails = notificationsData.promotionalEmails;
    }
    if (notificationsData.newProducts !== undefined) {
      user.notifications.newProducts = notificationsData.newProducts;
    }
    if (notificationsData.projectIdeas !== undefined) {
      user.notifications.projectIdeas = notificationsData.projectIdeas;
    }

    await user.save();

    console.log('✅ Notifications updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      notifications: user.notifications
    });

  } catch (error) {
    console.error('🔴 Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}