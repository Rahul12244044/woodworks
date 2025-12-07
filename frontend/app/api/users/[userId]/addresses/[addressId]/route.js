// app/api/users/[userId]/addresses/[addressId]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/db';
import User from '../../../../../../models/User';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  try {
    const { userId, addressId } = params;
    const updateData = await request.json();
    
    console.log('🟡 PUT - User ID:', userId);
    console.log('🟡 PUT - Address ID:', addressId);
    console.log('🟡 PUT - Update data:', updateData);
    
    if (!userId || !addressId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Address ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('🟡 User addresses:', user.addresses);
    
    // Try different ways to find the address
    let addressIndex = -1;
    
    // Method 1: Direct string comparison
    addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    // Method 2: If above fails, try with ObjectId comparison
    if (addressIndex === -1 && mongoose.Types.ObjectId.isValid(addressId)) {
      const addressObjectId = new mongoose.Types.ObjectId(addressId);
      addressIndex = user.addresses.findIndex(addr => addr._id.equals(addressObjectId));
    }
    
    // Method 3: Try without conversion
    if (addressIndex === -1) {
      addressIndex = user.addresses.findIndex(addr => addr._id == addressId);
    }

    console.log('🟡 Found address index:', addressIndex);
    
    if (addressIndex === -1) {
      console.log('🔴 Address not found. Available addresses:');
      user.addresses.forEach((addr, idx) => {
        console.log(`  [${idx}] _id: ${addr._id}, type: ${typeof addr._id}, string: ${addr._id.toString()}`);
      });
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // NEW: Check if this is specifically a default address set request
    const isSettingDefaultOnly = updateData._isDefaultOnly === true;

    if (isSettingDefaultOnly) {
      // Handle ONLY setting default address (no other updates)
      console.log('🟡 Setting address as default only:', addressId);
      
      // Set all addresses to non-default, then set the target as default
      user.addresses.forEach(addr => {
        addr.isDefault = addr._id.toString() === addressId;
      });

      await user.save({ validateBeforeSave: false });

      console.log('✅ Default address set successfully');

      return NextResponse.json({
        success: true,
        message: 'Default address updated successfully',
        addresses: user.addresses
      });
    }

    // EXISTING: Handle normal address updates
    // If setting as default in normal update, update all other addresses
    if (updateData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Update the address
    const updatedAddress = {
      ...user.addresses[addressIndex].toObject(),
      type: updateData.type || user.addresses[addressIndex].type,
      name: updateData.name || user.addresses[addressIndex].name,
      street: updateData.street || user.addresses[addressIndex].street,
      apartment: updateData.apartment !== undefined ? updateData.apartment : user.addresses[addressIndex].apartment,
      city: updateData.city || user.addresses[addressIndex].city,
      state: updateData.state || user.addresses[addressIndex].state,
      zipCode: updateData.zipCode || user.addresses[addressIndex].zipCode,
      country: updateData.country || user.addresses[addressIndex].country,
      phone: updateData.phone || user.addresses[addressIndex].phone,
      isDefault: updateData.isDefault !== undefined ? updateData.isDefault : user.addresses[addressIndex].isDefault,
      updatedAt: new Date()
    };

    // Validate required address fields
    if (!updatedAddress.name || !updatedAddress.street || !updatedAddress.city || !updatedAddress.state || !updatedAddress.zipCode || !updatedAddress.phone) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    user.addresses[addressIndex] = updatedAddress;

    // Save without validating the entire user document
    await user.save({ validateBeforeSave: false });

    console.log('✅ Address updated successfully');

    return NextResponse.json({
      success: true,
      address: user.addresses[addressIndex]
    });

  } catch (error) {
    console.error('🔴 Error updating address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  try {
    const { userId, addressId } = params;
    
    console.log('🟡 DELETE - User ID:', userId);
    console.log('🟡 DELETE - Address ID:', addressId);
    
    if (!userId || !addressId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Address ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('🟡 User addresses:', user.addresses);
    
    // Try different ways to find the address
    let addressIndex = -1;
    
    // Method 1: Direct string comparison
    addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    // Method 2: If above fails, try with ObjectId comparison
    if (addressIndex === -1 && mongoose.Types.ObjectId.isValid(addressId)) {
      const addressObjectId = new mongoose.Types.ObjectId(addressId);
      addressIndex = user.addresses.findIndex(addr => addr._id.equals(addressObjectId));
    }
    
    // Method 3: Try without conversion
    if (addressIndex === -1) {
      addressIndex = user.addresses.findIndex(addr => addr._id == addressId);
    }

    console.log('🟡 Found address index:', addressIndex);
    
    if (addressIndex === -1) {
      console.log('🔴 Address not found. Available addresses:');
      user.addresses.forEach((addr, idx) => {
        console.log(`  [${idx}] _id: ${addr._id}, type: ${typeof addr._id}, string: ${addr._id.toString()}`);
      });
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // Don't allow deleting the last address
    if (user.addresses.length <= 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the last address' },
        { status: 400 }
      );
    }

    const deletedAddress = user.addresses[addressIndex];
    user.addresses.splice(addressIndex, 1);

    // If we deleted the default address, set the first one as default
    if (deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    // Save without validating the entire user document
    await user.save({ validateBeforeSave: false });

    console.log('✅ Address deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('🔴 Error deleting address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}