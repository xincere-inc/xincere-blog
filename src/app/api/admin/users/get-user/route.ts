import {
  AdminGetUsers200Response,
  AdminGetUsersRequest,
  InternalServerError,
  UnAuthorizedError,
  ValidationError
} from "@/api/client";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/utils/authorize-admin";
import { paginationWithSearchSchema } from "@/lib/zod/common/common";
import { NextResponse } from "next/server";
import { z } from "zod";
/**
 * @swagger
 * /api/admin/users/get-user:
 *   post:
 *     summary: Fetch users with pagination and search
 *     description: Retrieves users from the database with pagination and optional search.
 *     operationId: adminGetUsers
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 example: 10
 *               search:
 *                 type: string
 *                 example: "john"
 *     responses:
 *       200:
 *         description: Successfully retrieved users with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       email:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       country:
 *                         type: string
 *                       username:
 *                         type: string
 *                       address:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       role:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     showPerPage:
 *                       type: integer
 *                       example: 10
 *                     totalUsers:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
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
 *                         example: "page"
 *                       message:
 *                         type: string  
 *                         example: "Page must be a number"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */
export async function POST(req: Request): Promise<
  NextResponse<AdminGetUsers200Response | ValidationError | InternalServerError | UnAuthorizedError>
> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError; // If authorization fails, return the error response
    }

    const body: AdminGetUsersRequest = await req.json();
    const parsedBody = await paginationWithSearchSchema.parseAsync(body);

    // Destructure the validated pagination and search data
    const { page, limit, search } = parsedBody;

    // Build the search condition
    let whereCondition: any = {};

    // Set up the condition for string fields using contains
    if (search) {
      whereCondition = {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { country: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      };

      // Add condition for enums (e.g., role) using equals
      if (search in ['user', 'admin']) { // Assuming your `search` could match enum values (case-sensitive)
        whereCondition.OR.push({ role: { equals: search } });
      }
    }

    // Use findMany to get the users with the search condition
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit, // Skip records based on the current page
      take: limit, // Limit the number of records per page
      where: whereCondition, // Apply the search condition
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        country: true,
        username: true,
        address: true,
        phone: true,
        role: true,
      },
    });

    // Get the total count of users matching the search condition
    const totalUsers = await prisma.user.count({
      where: whereCondition, // Use the same whereCondition for total count
    });

    const totalPages = Math.ceil(totalUsers / limit);

    // Map users to ensure all optional fields return `undefined` instead of `null`
    const sanitizedUsers = users.map((user) => ({
      ...user,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      country: user.country ?? '',
      address: user.address ?? '',
      phone: user.phone ?? '',
    }));

    return NextResponse.json(
      {
        data: sanitizedUsers,
        pagination: {
          page,
          limit,
          showPerPage: sanitizedUsers.length, // Number of users returned in this page
          totalUsers,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors.map((err) => ({
            path: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 }
      );
    } else {
      console.error('Error during get users:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during get users',
        },
        { status: 500 }
      );
    }
  }
}


