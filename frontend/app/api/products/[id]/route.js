// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import Product from '../../../../models/Product';
import { connectDB } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/session';

// GET /api/products/[id] - Get single product
export async function GET(request, { params }) {
  try {
    console.log('🔍 GET /api/products/[id] - Fetching product:', params.id);
    
    await connectDB();
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      console.log('❌ Product not found:', params.id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Product found:', product.name);
    return NextResponse.json(product);
    
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request, { params }) {
  console.log('✏️ PUT /api/products/[id] - Updating product:', params.id);
  
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Verify authentication
    const session = await verifySessionTokenFromRequest(request);
    console.log('🔐 Session verification:', session ? 'Success' : 'Failed');
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📦 Update data received:', body);

    // For partial updates, don't validate all required fields
    // Only validate if we're doing a full update
    const isPartialUpdate = Object.keys(body).length < 10; // Adjust threshold as needed
    
    if (!isPartialUpdate) {
      // Only validate required fields for full updates
      if (!body.name || !body.description || !body.price || !body.category || !body.species) {
        return NextResponse.json(
          { error: 'Missing required fields for full update' },
          { status: 400 }
        );
      }
    }

    // Prepare update data - only include fields that are provided
    const updateData = {};
    
    // Add fields only if they exist in the request
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) updateData.originalPrice = parseFloat(body.originalPrice);
    if (body.category !== undefined) updateData.category = body.category;
    if (body.species !== undefined) updateData.species = body.species;
    if (body.boardFeet !== undefined) updateData.boardFeet = parseFloat(body.boardFeet);
    if (body.moistureContent !== undefined) updateData.moistureContent = parseFloat(body.moistureContent);
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;
    if (body.grainPattern !== undefined) updateData.grainPattern = body.grainPattern;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.inStock !== undefined) updateData.inStock = body.inStock;
    if (body.quantity !== undefined) updateData.quantity = parseInt(body.quantity);
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.isUniqueItem !== undefined) updateData.isUniqueItem = body.isUniqueItem;

    console.log('💾 Updating product with data:', updateData);

    // Update product
    const product = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      console.log('❌ Product not found for update:', params.id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('✅ Product updated successfully:', product.name);
    return NextResponse.json(product);

  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product: ' + error.message },
      { status: 500 }
    );
  }
}
// DELETE /api/products/[id] - Delete product
export async function DELETE(request, { params }) {
  console.log('🗑️ DELETE /api/products/[id] - Deleting product:', params.id);
  
  try {
    await connectDB();

    // Verify authentication
    const session = await verifySessionTokenFromRequest(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('✅ Product deleted successfully:', product.name);
    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

// Helper function to verify session token from request
async function verifySessionTokenFromRequest(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const session = await verifySessionToken(token);
    
    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}