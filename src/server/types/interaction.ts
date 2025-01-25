import { PaperInteraction } from './paper';

export interface InteractionRequest {
  highlightedText: string;
  interactionType: PaperInteraction['interaction_type'];
  pageLocation: number;
  arxivId: string;
  customQuestion?: string;
  contextText?: string;
  userId?: string;
}

export interface UserInteraction {
  id: string;
  user_id: string;
  paper_id: string;
  highlighted_text: string;
  interaction_type: string;
  custom_question: string;
  page_location: number;
  // context_text?: string;
  ai_response: string;
  created_at: string;
}