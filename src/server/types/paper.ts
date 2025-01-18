export interface PaperInteraction {
  id: string;
  user_id: string;
  paper_id: string;
  highlighted_text: string;
  interaction_type: 'explain' | 'clarify' | 'eli5' | 'quiz' | 'custom';
  custom_question?: string;
  page_location: number;
  context_text?: string;
  ai_response: string;
  created_at: string;
}

export interface Paper {
  id: string;
  arxiv_id: string;
  title: string;
  abstract: string;
  full_text: string;
  created_at: string;
} 