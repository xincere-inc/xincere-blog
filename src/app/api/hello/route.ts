/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns a greeting message.
 *     responses:
 *       200:
 *         description: A successful response.
 */
export async function GET() {
  return new Response("Hello, world!", { status: 200 });
}
