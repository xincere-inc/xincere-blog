import { NextRequest } from 'next/server';
import { uploadBufferToS3 } from './s3';

export interface UploadResult {
  url: string;
  fileName: string;
  mimeType: string;
}

/**
 * App Routerのformdata APIを使用してファイルをS3にアップロードする
 */
export async function handleFileUpload(
  req: NextRequest,
  folderPath: string
): Promise<UploadResult> {
  try {
    // formDataからファイルを取得
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file uploaded');
    }

    const fileName = file.name;
    const mimeType = file.type;
    // ファイル名の一意性を確保するためにタイムスタンプを追加
    const key = `${folderPath}/${Date.now()}-${fileName}`;

    // ファイルをバッファに変換
    const buffer = Buffer.from(await file.arrayBuffer());

    // S3に直接アップロード
    const url = await uploadBufferToS3(
      buffer,
      key,
      process.env.S3_BUCKET_NAME!,
      mimeType
    );

    return {
      url,
      fileName,
      mimeType,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}
