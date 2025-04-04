import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/utils/authorize-admin";
import { paginationWithSearchSchema } from "@/lib/zod/common";
import { handleValidationError } from "@/lib/zod/validation-error";
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
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
    const parsedParams = paginationWithSearchSchema.safeParse({
      page: pageParam,
      limit: limitParam,
      search: searchParam,
    });

    if (!parsedParams.success) {
      return handleValidationError(parsedParams.error); // Use the reusable validation handler
    }

    // Destructure the validated pagination and search data
    const { page, limit, search } = parsedParams.data;

    // Build the search condition
    let whereCondition = {};

    if (search) {
      whereCondition = {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
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
        name: true,
        address: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        data: users,
        pagination: {
          page,
          limit,
          showPerPage: users.length, // Number of users displayed on this page
          totalUsers,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
