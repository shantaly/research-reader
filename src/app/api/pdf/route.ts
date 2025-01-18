import { NextRequest, NextResponse } from 'next/server';
import { PaperService } from '@/server/services/paperService';
import { extractArxivId } from '@/server/utils/arxiv';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const url = searchParams.get('url');
    
    let arxivId: string | null = null;
    
    if (id) {
      arxivId = id;
    } else if (url) {
      arxivId = extractArxivId(url);
    }

    if (!arxivId) {
      return new NextResponse('Missing or invalid arXiv ID/URL parameter', { status: 400 });
    }

    console.log('Requesting PDF for id:', arxivId);
    const pdfBuffer = await PaperService.getPaperPDF(arxivId);

    // Also adding the paper to the database if it doesn't exist
    await PaperService.getOrCreatePaper(arxivId);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${arxivId}.pdf"`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'PDF not found') {
      return new NextResponse('PDF not found', { status: 404 });
    }
    console.error('Server error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 