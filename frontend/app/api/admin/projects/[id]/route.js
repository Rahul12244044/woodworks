// app/api/admin/projects/[id]/route.js
import { NextResponse } from 'next/server';
import {connectDB} from '../../../../../lib/db';
import Project from '../../../../../models/Project';

// GET single project
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const project = await Project.findById(params.id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
    
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE project
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const project = await Project.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const project = await Project.findByIdAndDelete(params.id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}