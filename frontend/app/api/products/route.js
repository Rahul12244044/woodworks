// app/api/products/route.js
import { NextResponse } from 'next/server';
import Product from '../../../models/Product';
import { connectDB } from '../../../lib/db';
import { verifySessionToken } from '../../../lib/session';

// app/api/products/route.js - UPDATED


// app/api/products/route.js - FIXED (remove fallback)


export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    console.log('🔵 Product API called with params:', Object.fromEntries(searchParams));
    
    // Build query
    let query = {};
    
    // Handle search
    const search = searchParams.get('search');
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { species: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Handle species filter
    const species = searchParams.get('species');
    if (species) {
      query.species = { $regex: species, $options: 'i' };
    }
    
    // Handle category filter
    const category = searchParams.get('category');
    if (category) {
      query.category = category;
    }
    
    // Handle price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }
    
    // Handle grain pattern filter
    const grainPattern = searchParams.get('grainPattern');
    if (grainPattern) {
      query.grainPattern = grainPattern;
    }
    
    // Handle inStock filter
    const inStock = searchParams.get('inStock');
    if (inStock === 'true') {
      query.inStock = true;
    }
    
    // Handle featured filter
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      query.featured = true;
    }
    
    console.log('🔵 MongoDB query:', query);
    
    // Handle sorting
    let sort = {};
    const sortParam = searchParams.get('sort');
    
    if (sortParam) {
      if (sortParam === 'price') {
        sort.price = 1; // Ascending
      } else if (sortParam === '-price') {
        sort.price = -1; // Descending
      } else if (sortParam === 'name') {
        sort.name = 1; // Ascending
      } else if (sortParam === '-name') {
        sort.name = -1; // Descending
      } else if (sortParam === 'species') {
        sort.species = 1;
      } else if (sortParam === 'createdAt') {
        sort.createdAt = -1;
      } else {
        // Default sorting by creation date (newest first)
        sort.createdAt = -1;
      }
    } else {
      sort.createdAt = -1; // Default sort
    }
    
    console.log('🔵 Sorting by:', sort);
    
    // Execute query - NO FALLBACK
    const products = await Product.find(query)
      .sort(sort)
      .limit(100); // Limit results for performance
    
    console.log('🔵 Found products:', products.length);
    
    // REMOVED THE FALLBACK LOGIC - return empty array if no matches
    return NextResponse.json({ 
      success: true, 
      products: products, // Always return actual filtered results
      count: products.length,
      query: query,
      sort: sort
    });
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  console.log('🟢 POST /api/products - Starting product creation');
  
  try {
    // Step 1: Connect to database
    console.log('🔌 Step 1: Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');

    // Step 2: Verify authentication
    console.log('🔐 Step 2: Verifying authentication...');
    const session = await verifySessionTokenFromRequest(request);
    console.log('🔐 Session result:', session ? `User: ${session.email}, Role: ${session.role}` : 'No session');
    
    if (!session || session.role !== 'admin') {
      console.log('❌ Authentication failed - unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ Authentication successful');

    // Step 3: Parse request body
    console.log('📦 Step 3: Parsing request body...');
    const body = await request.json();
    console.log('📦 Received body:', JSON.stringify(body, null, 2));

    // Step 4: Validate required fields
    console.log('✅ Step 4: Validating required fields...');
    if (!body.name || !body.description || !body.price || !body.category || !body.species) {
      console.log('❌ Missing required fields:', {
        name: !body.name,
        description: !body.description,
        price: !body.price,
        category: !body.category,
        species: !body.species
      });
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category, species' },
        { status: 400 }
      );
    }
    console.log('✅ All required fields present');

    // Step 5: Transform data to match schema
    console.log('🔄 Step 5: Transforming data for schema...');
    const productData = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : parseFloat(body.price),
      category: body.category,
      species: body.species,
      boardFeet: body.boardFeet ? parseFloat(body.boardFeet) : undefined,
      moistureContent: body.moistureContent ? parseFloat(body.moistureContent) : undefined,
      dimensions: body.dimensions ? {
        length: body.dimensions.length ? parseFloat(body.dimensions.length) : undefined,
        width: body.dimensions.width ? parseFloat(body.dimensions.width) : undefined,
        thickness: body.dimensions.thickness ? parseFloat(body.dimensions.thickness) : undefined,
        unit: body.dimensions.unit || 'inches'
      } : undefined,
      grainPattern: body.grainPattern || [],
      images: body.images || [],
      inStock: body.inStock !== undefined ? body.inStock : true,
      quantity: body.quantity ? parseInt(body.quantity) : 0,
      featured: body.featured || false,
      isUniqueItem: body.isUniqueItem || false
    };

    console.log('📝 Transformed product data:', JSON.stringify(productData, null, 2));

    // Step 6: Create and save product
    console.log('💾 Step 6: Creating product in database...');
    const product = new Product(productData);
    console.log('📝 Product instance created, saving...');
    
    await product.save();
    console.log('✅ Product saved successfully with ID:', product._id);

    // Step 7: Return success response
    console.log('🎉 Step 7: Returning success response');
    return NextResponse.json(
      { 
        message: 'Product created successfully', 
        product 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ ERROR IN PRODUCT CREATION:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Check for specific MongoDB errors
    if (error.name === 'ValidationError') {
      console.error('❌ Mongoose Validation Error:', error.errors);
    }
    if (error.name === 'MongoServerError') {
      console.error('❌ MongoDB Server Error:', error.code, error.keyPattern);
    }
    
    return NextResponse.json(
      { error: `Failed to create product: ${error.message}` },
      { status: 500 }
    );
  }
}

// Helper function to verify session token from request
async function verifySessionTokenFromRequest(request) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header found');
      return null;
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token extracted (first 20 chars):', token.substring(0, 20) + '...');
    
    const session = await verifySessionToken(token);
    console.log('🔐 Session verification result:', session);
    
    return session;
  } catch (error) {
    console.error('❌ Session verification error:', error);
    return null;
  }
}