import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../../lib/db';
import User from '../../../../../../../models/User';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  try {
    const { userId, addressId } = params;
    
    console.log('🔵 PUT /default - User ID:', userId);
    console.log('🔵 PUT /default - Address ID:', addressId);
    
    if (!userId || !addressId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Address ID are required' },
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

    console.log('🔵 User addresses before update:', user.addresses);
    
    let addressFound = false;

    // Update all addresses - set only the target address as default
    const updatedAddresses = user.addresses.map(addr => {
      const addrId = addr._id.toString();
      const isTarget = addrId === addressId;
      
      if (isTarget) {
        addressFound = true;
        console.log('🔵 Found target address:', addr);
      }
      
      return {
        ...addr.toObject(),
        isDefault: isTarget
      };
    });

    if (!addressFound) {
      console.log('🔴 Address not found for setting default');
      console.log('🔴 Looking for addressId:', addressId);
      console.log('🔴 Available addresses:');
      user.addresses.forEach((addr, idx) => {
        console.log(`  [${idx}] _id: ${addr._id.toString()}`);
      });
      
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // Replace the addresses array
    user.addresses = updatedAddresses;

    await user.save({ validateBeforeSave: false });

    console.log('✅ Default address updated successfully');
    console.log('🔵 User addresses after:', user.addresses);

    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully',
      addresses: user.addresses
    });

  } catch (error) {
    console.error('🔴 Error setting default address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set default address: ' + error.message },
      { status: 500 }
    );
  }
}