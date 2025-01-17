import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing ID parameter', { status: 400 });
    }

    // Sanitize the ID to prevent directory traversal
    const sanitizedId = id.replace(/[^a-zA-Z0-9.-]/g, '');
    const pdfPath = path.join(process.cwd(), 'public', 'pdfs', `${sanitizedId}.pdf`);

    try {
      const pdfBuffer = await readFile(pdfPath);
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${sanitizedId}.pdf"`,
        },
      });
    } catch (error) {
      console.error('Error reading PDF:', error);
      return new NextResponse('PDF not found', { status: 404 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 