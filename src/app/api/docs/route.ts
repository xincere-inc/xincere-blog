import serveSwaggerDoc from '../../../lib/swagger';

export async function GET() {
  return serveSwaggerDoc();
}
