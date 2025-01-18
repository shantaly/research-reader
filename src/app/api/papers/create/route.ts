import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/server/config/supabase';
import { v4 as uuidv4 } from 'uuid';
import { ArxivService } from '@/server/services/arxivService';
import { extractArxivId } from '@/server/utils/arxiv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, abstract, fullText, arxivId } = body;

    const extractedArxivId = extractArxivId(arxivId);
    
    // If valid arXiv ID, check if paper exists
    if (extractedArxivId) {
      const { data: existingPaper } = await supabase
        .from('papers')
        .select()
        .eq('arxiv_id', extractedArxivId)
        .single();

      if (existingPaper) {
        console.log('Paper already exists:', extractedArxivId);
        return NextResponse.json(existingPaper);
      }

      // Fetch from arXiv API only if paper doesn't exist
      try {
        const arxivData = await ArxivService.fetchPaperData(extractedArxivId);
        const paperId = uuidv4();
        
        const { data, error } = await supabase
          .from('papers')
          .insert({
            id: paperId,
            arxiv_id: arxivData.arxivId,
            title: arxivData.title,
            abstract: arxivData.abstract,
            full_text: arxivData.fullText
          })
          .select()
          .single();

        if (error) throw error;
        console.log('Successfully added paper to database:', extractedArxivId);
        return NextResponse.json(data);
      } catch (error) {
        console.error('Error processing arXiv paper:', error);
        return NextResponse.json(
          { error: 'Failed to process arXiv paper' },
          { status: 400 }
        );
      }
    }

    // Handle custom paper creation
    const paperId = uuidv4();
    const { data, error } = await supabase
      .from('papers')
      .insert({
        id: paperId,
        arxiv_id: 'custom',
        title: title || 'Custom Document',
        abstract: abstract || '',
        full_text: fullText || ''
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating paper:', error);
    return NextResponse.json(
      { error: 'Failed to create paper' },
      { status: 500 }
    );
  }
}