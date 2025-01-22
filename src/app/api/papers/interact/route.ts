import { NextRequest, NextResponse } from 'next/server';
import { PaperInteractionService } from '@/server/services/paperInteractionService';

const paperInteractionService = new PaperInteractionService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await paperInteractionService.createInteraction(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in paper interaction:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
