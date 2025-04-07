import {
  AdminDeleteUsers400Response,
  AdminDeleteUsersRequest,
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError
} from "@/api/client";
import getSession from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/utils/authorize-admin";
import { validateUUIDSSchema } from "@/lib/zod/common/common";
import { NextResponse } from "next/server";
import { z } from "zod";
/**
 * @swagger
 * /api/admin/users/delete-user:
 *   delete:
 *     summary: Delete users by IDs
 *     description: Deletes users from the database based on the provided IDs.
 *     operationId: adminDeleteUsers
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"]
 *     responses:
 *       200:
 *         description: Users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Success"
 *       400:
 *         description: Validation errors or malformed request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: "ids"
 *                       message:
 *                         type: string
 *                         example: "Invalid UUID"
 *       404:
 *         description: Some users not found with the provided IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Some users not found with the provided ids"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */
export async function DELETE(req: Request): Promise<
  NextResponse<
    | UnAuthorizedError
    | Success
    | ValidationError
    | InternalServerError
    | AdminDeleteUsers400Response
  >
> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError; // If authorization fails, return the error response
    }

    // Get user from session
    const session = await getSession();

    // Logged user id 
    const loggedUserId = session?.user?.id;

    // Parse the request body
    const { ids }: AdminDeleteUsersRequest
      = await req.json();

    // Validate the request body using the Zod schema
    const parsedBody = await validateUUIDSSchema.safeParseAsync(ids);

    // Delete users excluding admins and the logged-in user(s)
    await prisma.user.deleteMany({
      where: {
        AND: [
          {
            id: {
              in: ids
            }
          },
          {
            role: {
              not: "admin"
            }
          },
          {
            id: {
              not: loggedUserId
            }
          }
        ]
      }
    });

    return NextResponse.json(
      { message: "User(s) deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          errors: error.errors.map((error) => ({
            path: error.path[0],
            message: error.message,
          })),
        },
        { status: 400 }
      );
    } else {
      console.error("Error during user deletion:", error);
      return NextResponse.json({
        error: "Internal server error",
        message: "Error during user deletion",
      }, { status: 500 });
    }
  }
}
