import pdf from 'pdf-parse';
import { PDFData } from '../types/pdfData';
import { supabase } from '../config/supabase';
import { PaperService } from './paperService';

export class PDFService {
  static async extractFromPDF(pdfBuffer: Buffer): Promise<PDFData> {
    try {
      const data = await pdf(pdfBuffer);
      return data;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  static async addFullTextToPaper(pdfBuffer: Buffer, arxivId: string): Promise<void> {
    try {
      const pdfData = await this.extractFromPDF(pdfBuffer);

      const { error } = await supabase
        .from('papers')
        .update({
          full_text: pdfData.text
        })
        .eq('arxiv_id', arxivId);

      if (error) throw error;
      console.log('Successfully added full text to paper:', arxivId);
    } catch (error) {
      console.error('Error adding full text to paper:', error);
      throw error;
    }
  }

  static async updatePapersTablebyId(arxivId: string): Promise<void> {
    try {
      const pdfBuffer = await PaperService.getPaperPDF(arxivId);
      const pdfData = await this.extractFromPDF(pdfBuffer);

      const { error } = await supabase
        .from('papers')
        .update({
          full_text: pdfData.text
        })
        .eq('arxiv_id', arxivId);

      if (error) throw error;
      console.log('Successfully updated papers table:', arxivId);
    } catch (error) {
      console.error('Error updating papers table:', error);
      throw error;
    }
  }
}
