import { supabase } from '../config/supabase';
import { ArxivService } from './arxivService';
import { extractArxivId } from '../utils/arxiv';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readFile } from 'fs/promises';
import path from 'path';
import axios from 'axios';

export class PaperService {
  static async getOrCreatePaper(arxivInput: string) {
    const extractedArxivId = extractArxivId(arxivInput);
    if (!extractedArxivId) {
      throw new Error('Invalid arXiv ID or URL');
    }

    // Check if paper exists
    const { data: existingPaper } = await supabase
      .from('papers')
      .select()
      .eq('arxiv_id', extractedArxivId)
      .single();

    if (existingPaper) {
      console.log('Paper already exists:', extractedArxivId);
      return existingPaper;
    }

    // Fetch and create new paper
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
    return data;
  }

  static async getPaperPDF(paperId: string): Promise<Buffer> {
    try {
      // First try to get from local storage
      try {
        const sanitizedId = paperId.replace(/[^a-zA-Z0-9.-]/g, '');
        const pdfPath = path.join(process.cwd(), 'public', 'pdfs', `${sanitizedId}.pdf`);
        return await readFile(pdfPath);
      } catch (error) {
        // If local file not found, try to fetch from arXiv
        const response = await axios.get(`https://arxiv.org/pdf/${paperId}.pdf`, {
          responseType: 'arraybuffer'
        });
        
        const pdfBuffer = Buffer.from(response.data);
        
        // TODO: Optionally save the PDF locally for future use
        
        return pdfBuffer;
      }
    } catch (error) {
      console.error('Error in getPaperPDF:', error);
      throw new Error('PDF not found');
    }
  }

  static async searchPaperByIdOrUrl(id: string | null, url: string | null): Promise<{ arxivId: string, pdf: Buffer }> {
    try {
      // Validate that at least one parameter is provided
      if (!id && !url) {
        throw new Error('Either id or url parameter must be provided');
      }

      let arxivId: string | null = null;
      
      if (id) {
        arxivId = extractArxivId(id);
      } else if (url) {
        arxivId = extractArxivId(url);
      }

      if (!arxivId) {
        throw new Error('Missing or invalid arXiv ID/URL parameter');
      }

      // Create/update paper record in background without waiting
      this.getOrCreatePaper(arxivId).catch(error => {
        console.error('Error creating/updating paper record:', error);
      });
      
      // Return both arxivId and PDF buffer
      const pdfBuffer = await this.getPaperPDF(arxivId);
      return {
        arxivId,
        pdf: pdfBuffer
      };

    } catch (error) {
      console.error('Error in searchPaperByIdOrUrl:', error);
      throw error;
    }
  }
} 