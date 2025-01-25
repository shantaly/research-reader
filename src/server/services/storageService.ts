import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY!,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY!
  },
  forcePathStyle: true
});

const bucketName = process.env.SUPABASE_STORAGE_BUCKET!;

export class StorageService {
  static async uploadPDF(file: Buffer, fileName: string, userId: string): Promise<string> {
    try {
      const filePath = `${userId}/${fileName}`;
      
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        Body: file,
        ContentType: 'application/pdf'
      });

      await s3Client.send(command);

      // Construct the public URL
      return `${process.env.SUPABASE_S3_ENDPOINT}/${bucketName}/${filePath}`;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }

  static async deletePDF(filePath: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filePath
      });

      await s3Client.send(command);
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  }
} 