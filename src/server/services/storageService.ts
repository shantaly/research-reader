import { createClient } from '@supabase/supabase-js';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET!;

export class StorageService {
  static async uploadPDF(file: Buffer, fileName: string, userId: string): Promise<string> {
    try {
      // Create an authenticated Supabase client using cookies
      const supabase = createServerComponentClient({ cookies });
      
      const filePath = `${userId}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }

  static async deletePDF(filePath: string): Promise<void> {
    try {
      const supabase = createServerComponentClient({ cookies });

      const { error } = await supabase.storage
        .from(storageBucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  }
} 