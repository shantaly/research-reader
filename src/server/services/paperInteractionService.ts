import { supabase } from '../config/supabase';
import { PaperInteraction } from '../types/paper';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';

interface InteractionRequest {
  highlightedText: string;
  interactionType: PaperInteraction['interaction_type'];
  pageLocation: number;
  arxivId: string;
  customQuestion?: string;
  contextText?: string;
  userId?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export class PaperInteractionService {
  async createInteraction(request: InteractionRequest) {
    const {
      highlightedText,
      interactionType,
      pageLocation,
      arxivId,
      customQuestion,
      contextText,
      userId
    } = request;

    if (interactionType === 'custom' && !customQuestion) {
      throw new Error('Custom question is required for custom interaction type');
    }

    const aiResponse = await this.generateAIResponse(
      highlightedText,
      interactionType,
      customQuestion,
      contextText
    );

    // First lookup the paper ID using arxiv_id
    const { data: paper } = await supabase
      .from('papers')
      .select('id')
      .eq('arxiv_id', arxivId)
      .single();

    if (!paper) {
      throw new Error(`No paper found with arxiv_id: ${arxivId}`);
    }

    // Create the complete interaction record
    const interactionData = {
      id: uuidv4(),
      user_id: userId || '123e4567-e89b-12d3-a456-426614174000',
      paper_id: paper.id,
      highlighted_text: highlightedText,
      interaction_type: interactionType,
      custom_question: customQuestion,
      page_location: pageLocation,
      context_text: contextText,
      ai_response: aiResponse
    };

    // Store in database
    const { data, error } = await supabase
      .from('paper_interactions')
      .insert(interactionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async generateAIResponse(
    highlightedText: string,
    interactionType: PaperInteraction['interaction_type'],
    customQuestion?: string,
    contextText?: string
  ): Promise<string> {
    let prompt = '';
    
    switch (interactionType) {
      case 'explain':
        prompt = `Explain this technical concept in detail: "${highlightedText}"`;
        break;
      case 'clarify':
        prompt = `Clarify this passage in simpler terms: "${highlightedText}"`;
        break;
      case 'eli5':
        prompt = `Explain this concept like I'm 5 years old: "${highlightedText}"`;
        break;
      case 'quiz':
        prompt = `Generate a multiple choice question about this concept: "${highlightedText}"`;
        break;
      case 'custom':
        prompt = `${customQuestion} Context: "${highlightedText}"`;
        break;
    }

    if (contextText) {
      prompt += `\nAdditional context from the paper: "${contextText}"`;
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    return completion.choices[0].message.content || 'No response generated';
  }
} 