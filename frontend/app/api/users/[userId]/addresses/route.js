// app/api/users/[userId]/addresses/route.js - ADD THIS PUT METHOD
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import User from '../../../../../models/User';

export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const addressId = searchParams.get('addressId');
    
    console.log('🟡 PUT /addresses - User ID:', userId);
    console.log('🟡 PUT /addresses - Action:', action);
    console.log('🟡 PUT /addresses - Address ID:', addressId);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // This route ONLY handles setting default addresses
    if (action !== 'setDefault' || !addressId) {
      return NextResponse.json(
        { success: false, error: 'This endpoint only handles setting default addresses. Use /api/users/[userId]/addresses/[addressId] for address updates.' },
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

    console.log('🟡 Setting default address:', addressId);
    console.log('🟡 User addresses before:', user.addresses);
    
    let addressFound = false;

    // Update all addresses - set only the target address as default
    user.addresses.forEach(addr => {
      const isTarget = addr._id.toString() === addressId;
      if (isTarget) {
        addressFound = true;
        console.log('🟡 Found target address:', addr);
      }
      addr.isDefault = isTarget;
    });

    if (!addressFound) {
      console.log('🔴 Address not found for setting default');
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    await user.save({ validateBeforeSave: false });

    console.log('✅ Default address updated successfully');
    console.log('🟡 User addresses after:', user.addresses);

    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully'
    });

  } catch (error) {
    console.error('🔴 Error in addresses PUT:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Your existing GET and POST methods should remain...
export async function GET(request, { params }) {
  try {
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId).select('addresses');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      addresses: user.addresses || []
    });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { userId } = params;
    const addressData = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
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

    // Create new address object
    const newAddress = {
      type: addressData.type || 'shipping',
      name: addressData.name || '',
      street: addressData.street || '',
      apartment: addressData.apartment || '',
      city: addressData.city || '',
      state: addressData.state || '',
      zipCode: addressData.zipCode || '',
      country: addressData.country || 'United States',
      phone: addressData.phone || '',
      isDefault: addressData.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate required fields
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.phone) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // If this is the first address or user wants it as default, set it as default
    if (newAddress.isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      newAddress.isDefault = true;
    }

    // Add the new address
    user.addresses.push(newAddress);

    // Save without validating the entire user document
    await user.save({ validateBeforeSave: false });

    // Get the saved address with the generated _id
    const savedAddress = user.addresses[user.addresses.length - 1];

    return NextResponse.json({
      success: true,
      address: savedAddress
    });

  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add address' },
      { status: 500 }
    );
  }
}