// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = path.parse(file.name).name;
    const extension = path.extname(file.name);
    const filename = `project_${timestamp}_${originalName}${extension}`;
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Define upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    
    // Create directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.log('Upload directory already exists');
    }

    // Save file to public directory
    const filepath = path.join(uploadDir, safeFilename);
    await writeFile(filepath, buffer);

    // Return the public URL and file info for database storage
    const publicUrl = `/uploads/projects/${safeFilename}`;

    console.log('🟢 UPLOAD: File uploaded successfully');

    return NextResponse.json({
      url: publicUrl,
      filename: safeFilename,
      originalName: file.name,
      size: file.size,
      mimetype: file.type,
      success: true,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}