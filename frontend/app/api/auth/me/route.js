// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // For demo purposes, return a user based on the token
      // In a real app, you'd fetch from database
      if (token.includes('admin')) {
        return NextResponse.json({
          user: {
            _id: 'admin-user',
            username: 'admin',
            email: 'admin@woodworks.com',
            role: 'admin'
          }
        });
      } else {
        return NextResponse.json({
          user: {
            _id: 'demo-user',
            username: 'demouser',
            email: 'demo@woodworks.com', 
            role: 'customer'
          }
        });
      }
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}