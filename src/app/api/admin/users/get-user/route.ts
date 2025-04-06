import {
  AdminGetUsers200Response,
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
 *   get:
 *     summary: Fetch users with pagination and search
 *     description: Retrieves users from the database with pagination and optional search.
 *     operationId: adminGetUsers
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of users per page
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: search
 *         in: query
 *         description: Optional search term to filter users by fields like email, first name, last name, etc.
 *         required: false
 *         schema:
 *           type: string
 *           example: "john"
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
export async function GET(req: Request): Promise<
  NextResponse<
    | UnAuthorizedError
    | AdminGetUsers200Response
    | ValidationError
    | InternalServerError
  >
> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError; // If authorization fails, return the error response
    }

    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");
    const searchParam = url.searchParams.get("search");

    // Validate pagination and search parameters using Zod
    const parsedParams = await paginationWithSearchSchema.safeParseAsync({
      page: pageParam ? parseInt(pageParam, 10) : undefined,
      limit: limitParam ? parseInt(limitParam, 10) : undefined,
      search: searchParam,
    });

    // Destructure the validated pagination and search data
    const { page, limit, search } = parsedParams as any;

    // Build the search condition
    let whereCondition = {};

    if (search) {
      whereCondition = {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { country: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
          { role: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // Pagination logic
    const totalUsers = await prisma.user.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalUsers / limit);



    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereCondition,
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

    // Map users to ensure all optional fields return `undefined` instead of `null`
    const sanitizedUsers = users.map((user) => ({
      ...user,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      country: user.country ?? "",
      address: user.address ?? "",
      phone: user.phone ?? "",
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
          error: "Validation error",
          errors: error.errors.map((error) => ({
            path: error.path[0],
            message: error.message
          }))
        },
        { status: 400 }
      );
    } else {
      console.error("Error during get users:", error);
      return NextResponse.json(
        {
          error: "Internal server error",
          message: "Error during get users",
        },
        { status: 500 }
      );
    }
  }
}
