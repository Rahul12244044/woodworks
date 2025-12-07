// app/api/blog/posts/[id]/route.js - UPDATED VERSION
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import BlogPost from '../../../../../models/BlogPosts'; // FIXED: Changed from BlogPosts to BlogPost

async function connectToDB() {
  try {
    await connectDB();
    return { success: true };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, error: 'Database connection failed' };
  }
}

export async function GET(request, { params }) {
  try {
    const dbConnection = await connectToDB();
    if (!dbConnection.success) {
      return NextResponse.json(
        { error: dbConnection.error },
        { status: 500 }
      );
    }

    const { id } = params;
    console.log(`📝 GET /api/blog/posts/${id} - Fetching post`);

    // Try to find by ID first, then by slug
    let post;
    try {
      // Try with population first
      post = await BlogPost.findById(id)
        .populate('author', 'name email role');
      
      if (!post) {
        post = await BlogPost.findOne({ slug: id })
          .populate('author', 'name email role');
      }
    } catch (populateError) {
      console.warn('Author population failed, trying without population');
      // If population fails, try without it
      post = await BlogPost.findById(id);
      
      if (!post) {
        post = await BlogPost.findOne({ slug: id });
      }
    }

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Ensure author data exists (handle case where population failed)
    if (!post.author || typeof post.author === 'string') {
      post.author = {
        name: 'WoodWorks Team',
        role: 'Wood Expert',
        email: 'team@woodworks.com'
      };
    }

    // Convert to plain object for response
    const postData = post.toObject ? post.toObject() : post;
    
    // Increment views (don't await to avoid blocking response)
    BlogPost.findByIdAndUpdate(postData._id, { $inc: { views: 1 } })
      .catch(err => console.warn('Failed to increment views:', err));

    return NextResponse.json({ data: postData });

  } catch (error) {
    console.error('❌ Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const dbConnection = await connectToDB();
    if (!dbConnection.success) {
      return NextResponse.json(
        { error: dbConnection.error },
        { status: 500 }
      );
    }

    const { id } = params;
    const body = await request.json();
    console.log(`📝 PUT /api/blog/posts/${id} - Updating post`);

    let updatedPost;
    try {
      updatedPost = await BlogPost.findByIdAndUpdate(
        id,
        { ...body, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('author', 'name email role');
    } catch (populateError) {
      console.warn('Author population failed after update');
      updatedPost = await BlogPost.findByIdAndUpdate(
        id,
        { ...body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      // Add default author data
      if (updatedPost) {
        updatedPost = {
          ...updatedPost.toObject(),
          author: {
            name: 'WoodWorks Team',
            role: 'Wood Expert',
            email: 'team@woodworks.com'
          }
        };
      }
    }

    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    console.log('✅ Blog post updated successfully:', updatedPost._id);

    return NextResponse.json({
      data: updatedPost,
      message: 'Blog post updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating blog post:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const dbConnection = await connectToDB();
    if (!dbConnection.success) {
      return NextResponse.json(
        { error: dbConnection.error },
        { status: 500 }
      );
    }

    const { id } = params;
    console.log(`📝 DELETE /api/blog/posts/${id} - Deleting post`);

    const deletedPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    console.log('✅ Blog post deleted successfully:', id);

    return NextResponse.json({
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}