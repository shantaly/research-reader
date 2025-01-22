import { NextRequest, NextResponse } from 'next/server';
import { PaperInteractionService } from '@/server/services/paperInteractionService';

const paperInteractionService = new PaperInteractionService();

export async function POST(request: NextRequest) {
  try {
    const { text, action } = await request.json();
    
    // For now, we'll use a mock response since we don't have the full paper context
    const mockResponse = {
      explain: 'Here is an explanation of the selected text...',
      quiz: 'Here is a quiz question based on the text...',
      define: 'Here is the definition of the selected terms...',
      recap: 'Here is a summary of the key points...',
    };

    // In a real implementation, we would call paperInteractionService
    // const result = await paperInteractionService.createInteraction({
    //   highlightedText: text,
    //   interactionType: action,
    //   pageLocation: 1,
    //   arxivId: 'mock-id',
    // });

    return NextResponse.json({
      content: mockResponse[action as keyof typeof mockResponse] || 'Action not supported',
      type: action,
    });
  } catch (error) {
    console.error('Error in paper interaction:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
