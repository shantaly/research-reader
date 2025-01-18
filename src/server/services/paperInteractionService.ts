import { supabase } from '../config/supabase';
import { PaperInteraction } from '../types/paper';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export class PaperInteractionService {
  async createInteraction(
    userId: string,
    paperId: string,
    highlightedText: string,
    interactionType: PaperInteraction['interaction_type'],
    pageLocation: number,
    customQuestion?: string,
    contextText?: string
  ) {
    // Check if paper exists
    const { data: paper } = await supabase
      .from('papers')
      .select()
      .eq('id', paperId)
      .single();

    // If paper doesn't exist, create a new one with custom ID
    if (!paper) {
      const customPaperId = `custom_paper_${uuidv4()}`;
      
      await supabase
        .from('papers')
        .insert({
          id: customPaperId,
          arxiv_id: 'custom',
          title: 'Custom Paper',
          abstract: highlightedText,
          full_text: contextText || highlightedText
        });

      paperId = customPaperId;
    }

    const aiResponse = await this.generateAIResponse(
      highlightedText,
      interactionType,
      customQuestion,
      contextText
    );

    const { data } = await supabase
      .from('paper_interactions')
      .insert({
        user_id: userId,
        paper_id: paperId,
        highlighted_text: highlightedText,
        interaction_type: interactionType,
        custom_question: customQuestion,
        page_location: pageLocation,
        context_text: contextText,
        ai_response: aiResponse
      })
      .select()
      .single();

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