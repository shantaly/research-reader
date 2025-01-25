import { supabase } from '../config/supabase';

export class UserService {
  static async getUserPapers(userId: string) {
    const { data: paper_interactions, error } = await supabase
      .from('paper_interactions')
      .select('papers:paper_id(arxiv_id)')
      .eq('user_id', userId)
      .order('created_at') as { data: { papers: { arxiv_id?: string } }[], error: any };

    if (error) throw error;
    const unique_papers = [...new Set(paper_interactions.map(item => item.papers.arxiv_id))];
    return unique_papers;
  }
}

