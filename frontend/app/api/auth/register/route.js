import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    console.log('🔧 Register API called');
    
    const body = await request.json();
    console.log('📦 Raw request body received:', body);
    
    // Destructure with debugging
    const { firstName, lastName, username, email, password, phone } = body;
    
    console.log('🔍 Destructured fields:', {
      firstName: typeof firstName,
      lastName: typeof lastName, 
      username: typeof username,
      email: typeof email,
      password: typeof password,
      phone: typeof phone
    });

    console.log('🔍 Field values:', {
      firstName,
      lastName,
      username,
      email,
      password: password ? '***' : 'MISSING',
      phone
    });

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      const missing = [];
      if (!firstName) missing.push('firstName');
      if (!lastName) missing.push('lastName');
      if (!username) missing.push('username');
      if (!email) missing.push('email');
      if (!password) missing.push('password');
      
      console.log('❌ Missing required fields:', missing);
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missing.join(', ')}` 
        },
        { status: 400 }
      );
    }

    console.log('✅ Database connecting...');
    await connectDB();
    console.log('✅ Database connected');

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      console.log('❌ User already exists:', { email, username });
      const field = existingUser.email === email ? 'email' : 'username';
      return NextResponse.json(
        { 
          success: false, 
          error: `User already exists with this ${field}` 
        },
        { status: 400 }
      );
    }

    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('👤 Creating user object...');
    // Create the user object with explicit field assignment
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: (phone || '').trim(),
      role: 'customer'
    };

    console.log('📝 User data to save:', userData);

    console.log('💾 Saving user to database...');
    const user = new User(userData);
    
    // Validate the user object before saving
    const validationError = user.validateSync();
    if (validationError) {
      console.log('❌ User validation failed before save:', validationError.errors);
      throw validationError;
    }

    await user.save();
    console.log('✅ User saved to database:', user._id);

    // Log the saved user to verify fields
    console.log('✅ Saved user details:', {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      username: user.username,
      email: user.email
    });

    // Generate token
    const tokenPayload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    // Return user data
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      notifications: user.notifications,
      settings: user.settings,
      addresses: user.addresses || []
    };

    console.log('🎉 Registration successful!');
    return NextResponse.json({
      success: true,
      token,
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // More detailed error logging
    if (error.name === 'ValidationError') {
      console.error('🔍 Validation errors:');
      Object.keys(error.errors).forEach(field => {
        console.error(`  - ${field}:`, error.errors[field].message);
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { 
          success: false, 
          error: `${field} already exists` 
        },
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: errors.join(', ') 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed: ' + error.message 
      },
      { status: 500 }
    );
  }
}