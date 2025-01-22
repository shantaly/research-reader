import { NextRequest, NextResponse } from 'next/server';
import { PaperService } from '@/server/services/paperService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const url = searchParams.get('url');
    
    console.log(id, url);

    // Early validation of required parameters
    if (!id && !url) {
      return NextResponse.json(
        { error: 'Either id or url parameter must be provided' },
        { status: 400 }
      );
    }

    const result = await PaperService.searchPaperByIdOrUrl(id, url);
    return new NextResponse(result.pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${result.arxivId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process paper' },
      { status: 500 }
    );
  }
}