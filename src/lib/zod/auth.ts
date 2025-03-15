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
