// app/api/admin/projects/route.js
import { NextResponse } from 'next/server';
import {connectDB} from '../../../../lib/db';
import Project from '../../../../models/Project';

export async function POST(request) {
  try {
    await connectDB();
    console.log('🔵 API: Connected to database');
    
    const body = await request.json();
    console.log('🔵 API: Request body received');

    const { title, description, status, images, woodSpecies, tags, featured } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Check if project with same title already exists
    const existingProject = await Project.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') } 
    });
    
    if (existingProject) {
      return NextResponse.json(
        { error: 'A project with this title already exists' },
        { status: 409 }
      );
    }

    console.log('🟡 API: Creating project in database...');

    // Create new project in database
    const newProject = await Project.create({
      title: title.trim(),
      description: description.trim(),
      status: status || 'draft',
      images: images || [],
      woodSpecies: woodSpecies || [],
      tags: tags || [],
      featured: featured || false
    });

    console.log('🟢 API: Project created in database:', newProject._id);

    return NextResponse.json(
      { 
        message: 'Project created successfully',
        project: newProject 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('🔴 API: Database Error creating project:', error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    // MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A project with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET all projects with pagination and filtering
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get projects with pagination
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Project.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      projects,
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
    console.error('Database Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}