import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import User from '../../../../models/User';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const updateData = await request.json();

    console.log('✏️ Update User API called for:', userId);
    console.log('📦 Update data:', updateData);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('✅ Database connected');

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

    // Prevent modifying admin user's role or email
    if (user.role === 'admin') {
      if (updateData.role && updateData.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Cannot change admin user role' },
          { status: 400 }
        );
      }
      if (updateData.email && updateData.email !== user.email) {
        return NextResponse.json(
          { success: false, error: 'Cannot change admin user email' },
          { status: 400 }
        );
      }
    }

    // Update fields
    if (updateData.role !== undefined && user.role !== 'admin') {
      user.role = updateData.role;
    }
    
    if (updateData.active !== undefined) {
      user.active = updateData.active;
    }
    
    if (updateData.firstName !== undefined) {
      user.firstName = updateData.firstName;
    }
    
    if (updateData.lastName !== undefined) {
      user.lastName = updateData.lastName;
    }
    
    if (updateData.username !== undefined) {
      user.username = updateData.username;
    }
    
    if (updateData.phone !== undefined) {
      user.phone = updateData.phone;
    }

    await user.save();
    console.log('✅ User updated successfully');

    // ✅ IMPORTANT: Re-fetch the user to get the updated data
    const updatedUser = await User.findById(userId);

    // Return COMPLETE updated user data
    const userResponse = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      active: updatedUser.active !== undefined ? updatedUser.active : true,
      lastLogin: updatedUser.lastLogin,
      notifications: updatedUser.notifications || {
        orderUpdates: true,
        promotionalEmails: true,
        newProducts: true,
        projectIdeas: true
      },
      settings: updatedUser.settings || {
        emailVerified: false,
        twoFactorEnabled: false,
        privacyLevel: 'private'
      },
      addresses: updatedUser.addresses || [],
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    console.log('✅ Returning updated user data:', userResponse);

    // ✅ FIX: Make sure to return the user object
    return NextResponse.json({
      success: true,
      user: userResponse, // This must be included
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('❌ Update user error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = params;

    console.log('🗑️ Delete User API called for:', userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('✅ Database connected');

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

    // Prevent deleting admin user
    if (user.role === 'admin') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete admin user' },
        { status: 400 }
      );
    }

    // Prevent deleting the last user
    const totalUsers = await User.countDocuments();
    if (totalUsers <= 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the last user' },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(userId);
    console.log('✅ User deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}