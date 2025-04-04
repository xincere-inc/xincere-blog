import { z } from "zod";

// Define the Zod schema for the sign-up
export const signUpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  name: z
    .string({ required_error: "name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
});

// Define the Zod schema for the sign-in
export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Define the Zod schema for the email
export const emailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
});

// Define the Zod schema for changing the password
export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: "Old password is required" })
    .min(8, { message: "Old password must be at least 8 characters" }),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(8, { message: "New password must be at least 8 characters" }),
});

// Define the schema for resetting the password
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(8, { message: "New password must be at least 8 characters" }),
});
