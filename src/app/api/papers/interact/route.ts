import { NextRequest, NextResponse } from 'next/server';
import { PaperInteractionService } from '@/server/services/paperInteractionService';

const paperInteractionService = new PaperInteractionService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await paperInteractionService.createInteraction(
      body.userId,
      body.paperId,
      body.highlightedText,
      body.interactionType,
      body.pageLocation,
      body.customQuestion,
      body.contextText
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in paper interaction:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
