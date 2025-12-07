import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    console.log('🔑 Login API called');
    
    const body = await request.json();
    console.log('📦 Login request body:', { 
      email: body.email, 
      password: '***' 
    });
    
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing login fields:', { email: !!email, password: !!password });
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if it's admin login
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@woodworks.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@1224';

    if (email === adminEmail) {
      console.log('🔐 Admin login attempt');
      
      // Verify admin password
      if (password === adminPassword) {
        console.log('✅ Admin login successful');
        
        // Generate admin token
        const tokenPayload = {
          userId: 'admin-user',
          username: 'admin',
          email: adminEmail,
          role: 'admin',
          iat: Date.now(),
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        
        const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

        // Return admin user data
        const adminUser = {
          _id: 'admin-user',
          firstName: 'Admin',
          lastName: 'User',
          name: 'Admin User',
          username: 'admin',
          email: adminEmail,
          phone: '',
          role: 'admin',
          active: true,
          lastLogin: new Date(),
          notifications: {
            orderUpdates: true,
            promotionalEmails: true,
            newProducts: true,
            projectIdeas: true
          },
          settings: {
            emailVerified: true,
            twoFactorEnabled: false,
            privacyLevel: 'private'
          },
          addresses: []
        };

        return NextResponse.json({
          success: true,
          token,
          user: adminUser
        });
      } else {
        console.log('❌ Invalid admin password');
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Regular user login - connect to database
    console.log('✅ Database connecting for regular user...');
    await connectDB();
    console.log('✅ Database connected');

    // Find regular user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('🔐 Verifying user password...');
    // Verify password for regular user
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ User login successful for:', user.email);

    // ✅ ADD THIS: Update last login timestamp
    console.log('🕒 Updating last login timestamp...');
    user.lastLogin = new Date();
    await user.save();
    console.log('✅ Last login updated:', user.lastLogin);

    // Generate token for regular user
    const tokenPayload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    // Return user data (without password) - ADD active and lastLogin fields
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      active: user.active !== undefined ? user.active : true,
      lastLogin: user.lastLogin,
      notifications: user.notifications,
      settings: user.settings,
      addresses: user.addresses || []
    };

    console.log('🎉 Login successful, returning user data');
    return NextResponse.json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}