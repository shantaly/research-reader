import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/server/services/storageService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      );
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;

    const fileUrl = await StorageService.uploadPDF(buffer, fileName, userId);

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Error in PDF upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload PDF' },
      { status: 500 }
    );
  }
} 