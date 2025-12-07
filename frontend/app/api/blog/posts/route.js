// app/api/blog/posts/route.js - FIXED IMPORT
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import BlogPost from '../../../../models/BlogPosts'; // FIXED: Changed from BlogPosts to BlogPost

// Helper function to connect to database
async function connectToDB() {
  try {
    await connectDB();
    return { success: true };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, error: 'Database connection failed' };
  }
}

export async function GET(request) {
  try {
    const dbConnection = await connectToDB();
    if (!dbConnection.success) {
      return NextResponse.json(
        { error: dbConnection.error },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    // Get posts with population
    let posts;
    try {
      posts = await BlogPost.find(query)
        .populate('author', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } catch (populateError) {
      console.warn('Author population failed, using fallback author data');
      // If population fails, get posts without author and add fallback
      posts = await BlogPost.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      posts = posts.map(post => ({
        ...post,
        author: {
          name: 'WoodWorks Team',
          role: 'Wood Expert',
          email: 'team@woodworks.com'
        }
      }));
    }

    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);

    console.log(`📝 GET /api/blog/posts - Found ${posts.length} posts`);

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const dbConnection = await connectToDB();
    if (!dbConnection.success) {
      return NextResponse.json(
        { error: dbConnection.error },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('📝 POST /api/blog/posts - Creating new post');

    // Validate required fields
    if (!body.title || !body.excerpt || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'Title, excerpt, content, and category are required' },
        { status: 400 }
      );
    }

    // For demo purposes, use a default author if not provided
    const authorId = body.author || '65a1b2c3d4e5f67890123456'; // Default demo author ID

    // Create slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      );
    }

    const newPost = new BlogPost({
      ...body,
      slug,
      author: authorId,
      readTime: body.readTime || 5,
      tags: body.tags || [],
      featured: body.featured || false,
      status: body.status || 'draft'
    });

    const savedPost = await newPost.save();
    
    // Try to populate author, but handle if it fails
    try {
      await savedPost.populate('author', 'name email role');
    } catch (populateError) {
      console.warn('Author population failed after save');
      // Add default author data
      savedPost.author = {
        name: 'WoodWorks Team',
        role: 'Wood Expert',
        email: 'team@woodworks.com'
      };
    }

    console.log('✅ Blog post created successfully:', savedPost._id);

    return NextResponse.json(
      { 
        data: savedPost,
        message: 'Blog post created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error creating blog post:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}