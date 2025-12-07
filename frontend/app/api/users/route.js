import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import User from '../../../models/User';

export async function POST(request) {
  try {
    console.log('🔵 POST /api/users called');
    
    // Connect to database
    await dbConnect();
    console.log('✅ Database connected');
    
    // Parse request body
    const userData = await request.json();
    console.log('📦 Received user data:', userData);
    
    // Validate required fields
    const requiredFields = ['username', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: userData.email },
        { username: userData.username }
      ]
    });
    
    if (existingUser) {
      console.log('❌ User already exists:', { email: userData.email, username: userData.username });
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    
    // Set default values
    if (!userData.role) userData.role = 'customer';
    if (userData.active === undefined) userData.active = true;
    if (!userData.firstName) userData.firstName = userData.name?.split(' ')[0] || 'User';
    if (!userData.lastName) userData.lastName = userData.name?.split(' ')[1] || 'Account';
    
    // Create user
    console.log('👤 Creating user in database...');
    const user = await User.create(userData);
    console.log('✅ User created:', user._id);
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return NextResponse.json(
      { 
        success: true, 
        user: userResponse,
        message: 'User created successfully'
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('❌ Create user error:', error);
    
    // Return a proper JSON error response
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    console.log('👥 Get Users API called');
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search');

    console.log('📦 Query parameters:', { role, page, limit, search });

    await connectDB();
    console.log('✅ Database connected');

    // Build query
    let query = {};
    
    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }

    // Search by username, email, or name
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(query)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Format user data
    const usersData = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      phone: user.phone,
      role: user.role,
      active: user.active !== undefined ? user.active : true, // Default to true,
      lastLogin: user.lastLogin,
      notifications: user.notifications,
      settings: user.settings,
      addresses: user.addresses,
      orderCount: user.orders ? user.orders.length : 0, // You might want to add an orders field to your User model
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    console.log(`✅ Found ${users.length} users out of ${total} total`);

    return NextResponse.json({
      success: true,
      users: usersData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}