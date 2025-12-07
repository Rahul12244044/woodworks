// app/api/test-db/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Product from '../../../models/Product';

export async function GET() {
  try {
    console.log('🔌 Testing database connection...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Try to count products
    const productCount = await Product.countDocuments();
    console.log(`📊 Products in database: ${productCount}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      productCount 
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}