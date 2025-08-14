import { NextResponse } from 'next/server';

export async function GET() {
  // Create a simple SVG placeholder image
  const svg = `
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" fill="#F0F0F0"/>
      <circle cx="64" cy="64" r="32" fill="#E0E0E0"/>
      <path d="M64 40C50.745 40 40 50.745 40 64C40 77.255 50.745 88 64 88C77.255 88 88 77.255 88 64C88 50.745 77.255 40 64 40ZM64 80C55.163 80 48 72.837 48 64C48 55.163 55.163 48 64 48C72.837 48 80 55.163 80 64C80 72.837 72.837 80 64 80Z" fill="#B0B0B0"/>
      <path d="M64 56C58.477 56 54 60.477 54 66C54 71.523 58.477 76 64 76C69.523 76 74 71.523 74 66C74 60.477 69.523 56 64 56ZM64 72C60.686 72 58 69.314 58 66C58 62.686 60.686 60 64 60C67.314 60 70 62.686 70 66C70 69.314 67.314 72 64 72Z" fill="#909090"/>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
