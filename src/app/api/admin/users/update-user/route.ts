import {
  AdminUpdateUserRequest,
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError
} from "@/api/client";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/utils/authorize-admin";
import { updateAdminUserSchema } from "@/lib/zod/admin/user-management/user";
import { NextResponse } from "next/server";
// Role is an enum in your Prisma schema
import { Role } from "@prisma/client";
import { z } from "zod";
/**
 * @swagger
 * /api/admin/users/update-user:
 *   put:
 *     summary: Update user details
 *     description: Update details of an existing user based on the provided user ID.
 *     operationId: adminUpdateUser
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the user to update.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "johndoe@example.com"
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: "johndoe"
 *               address:
 *                 type: string
 *                 description: The address of the user.
 *                 example: "123 Main St, Springfield, IL"
 *               phone:
 *                 type: string
 *                 description: The phone number of the user.
 *                 example: "+1234567890"
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *                 description: The role of the user.
 *                 example: "user"
 *               country:
 *                 type: string
 *                 description: The country of the user.
 *                 example: "USA"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     address:
 *                       type: string
 *                       example: "123 Main St, Springfield, IL"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     role:
 *                       type: string
 *                       enum:
 *                         - USER
 *                         - ADMIN
 *                       example: "USER"
 *                     country:
 *                       type: string
 *                       example: "USA"
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
 *                         example: "email"
 *                       message:
 *                         type: string
 *                         example: "Invalid email format"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 message:
 *                   type: string
 *                   example: "Error during registration"
 */

export async function PUT(req: Request): Promise<
  NextResponse<Success | ValidationError | InternalServerError | UnAuthorizedError
  >
> {
  try {
    // Admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError;
    }

    const body: AdminUpdateUserRequest = await req.json();

    // Validate input
    const parsed = await updateAdminUserSchema.safeParseAsync(body);

    const {
      id,
      email,
      firstName,
      lastName,
      username,
      address,
      phone,
      role,
      country,
    } = parsed.data as any;

    const userExists = await prisma.user.findUnique({ where: { id } })

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email or phone is already taken by another user (excluding the current user)
    if (email || phone) {

      // Check for conflicts individually and return specific messages
      if (email) {
        const emailTaken = await prisma.user.findFirst({
          where: {
            email,
            NOT: { id },
          },
        });
        if (emailTaken) {
          return NextResponse.json(
            { error: "Email already taken by another user" },
            { status: 400 }
          );
        }
      }

      if (phone) {
        const phoneTaken = await prisma.user.findFirst({
          where: {
            phone,
            NOT: { id },
          },
        });
        if (phoneTaken) {
          return NextResponse.json(
            { error: "Phone already taken by another user" },
            { status: 400 }
          );
        }
      }

      if (username) {
        const usernameTaken = await prisma.user.findFirst({
          where: {
            username,
            NOT: { id },
          },
        });
        if (usernameTaken) {
          return NextResponse.json(
            { error: "Username already taken by another user" },
            { status: 400 }
          );
        }
      }

    }

    // Prepare updated fields
    const updatedData: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      username: string;
      country: string;
      address: string;
      phone: string;
      role: Role;
    }> = {};

    if (email) updatedData.email = email;
    if (firstName) updatedData.firstName = firstName;
    if (lastName) updatedData.lastName = lastName;
    if (username) updatedData.username = username;
    if (country) updatedData.country = country;
    if (address) updatedData.address = address;
    if (phone) updatedData.phone = phone;
    if (role) updatedData.role = role as Role;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          username: updatedUser.username,
          country: updatedUser.country,
          address: updatedUser.address,
          phone: updatedUser.phone,
          role: updatedUser.role,
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
            message: error.message,
          })),
        },
        { status: 400 }
      );
    } else {
      console.error("Error during update user:", error);
      return NextResponse.json({
        error: "Internal server error",
        message: "Error during update user",
      }, { status: 500 });
    }
  }
}
