import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    
    if (!folder) {
      return NextResponse.json({ error: 'Folder parameter is required' }, { status: 400 });
    }

    // Define the base path for images (you'll need to create this folder structure)
    const basePath = join(process.cwd(), 'public', 'images', folder);
    
    try {
      // Read the directory to get all image files
      const files = await readdir(basePath);
      
      // Filter for image files (you can adjust these extensions as needed)
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      );
      
      if (imageFiles.length === 0) {
        // Return a placeholder image if no images found
        return NextResponse.json({ 
          imageUrl: '/api/placeholder-image',
          message: 'No images found in this folder'
        });
      }
      
      // Select a random image
      const randomIndex = Math.floor(Math.random() * imageFiles.length);
      const randomImage = imageFiles[randomIndex];
      
      // Return the image URL
      const imageUrl = `/images/${folder}/${randomImage}`;
      
      return NextResponse.json({ 
        imageUrl,
        fileName: randomImage,
        totalImages: imageFiles.length
      });
      
    } catch (error) {
      // If folder doesn't exist or can't be read, return placeholder
      console.warn(`Could not read folder ${basePath}:`, error);
      return NextResponse.json({ 
        imageUrl: '/api/placeholder-image',
        message: 'Folder not accessible, using placeholder'
      });
    }
    
  } catch (error) {
    console.error('Error in random-image API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      imageUrl: '/api/placeholder-image'
    }, { status: 500 });
  }
}
