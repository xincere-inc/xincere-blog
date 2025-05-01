// import serveSwaggerDoc from '../../../lib/swagger';

// export async function GET() {
//   return serveSwaggerDoc();
// }
import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/api/specs', 'swagger.yaml');
  const file = await readFile(filePath, 'utf8');

  return new NextResponse(file, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-yaml',
    },
  });
}
