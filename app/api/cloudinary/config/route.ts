import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    });
  } catch (error) {
    console.error('Error getting Cloudinary config:', error);
    return NextResponse.json(
      { error: 'Failed to get Cloudinary config' },
      { status: 500 }
    );
  }
}
