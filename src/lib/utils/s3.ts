import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
});

export async function uploadBufferToS3(
  buffer: Buffer,
  key: string,
  bucket: string = process.env.S3_BUCKET_NAME!,
  contentType: string = 'application/octet-stream'
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${process.env.S3_ENDPOINT}/${bucket}/${key}`;
}
