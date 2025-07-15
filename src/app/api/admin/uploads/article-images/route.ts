import { NextRequest, NextResponse } from 'next/server';
import { handleFileUpload } from '@/lib/utils/upload-handler';

export async function POST(req: NextRequest) {
  try {
    const result = await handleFileUpload(req, 'articles');
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
