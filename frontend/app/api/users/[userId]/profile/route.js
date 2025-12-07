import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import User from '../../../../../models/User';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const updateData = await request.json();

    console.log('🟡 Updating profile for user:', userId);
    console.log('🟡 Update data:', updateData);

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

    // Update user profile fields
    const allowedFields = ['firstName', 'lastName', 'username', 'email', 'phone'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    await user.save();

    console.log('✅ Profile updated successfully');

    // Return user data without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      notifications: user.notifications,
      settings: user.settings
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('🔴 Error updating profile:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}