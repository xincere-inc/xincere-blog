import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a greeting message
 *     description: A simple example API route
 *     tags:
 *       - Example
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function GET() {
  return NextResponse.json({ message: "Hello, World!" });
}
