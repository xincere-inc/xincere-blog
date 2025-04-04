import { z } from "zod";

// Define the Zod schema for creating the new user by admin
export const adminCreateUserSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(8, "Address must be at least 8 characters"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .optional(),
  role: z.enum(["USER", "ADMIN", "CUSTOMER"], {
    errorMap: () => ({
      message: "Role must be one of 'USER', 'ADMIN', or 'CUSTOMER'.",
    }),
  }),
});

// Define the zod schema for updating the user by admin
export const updateUserSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required")
    .optional(),
  name: z.string().min(1, "Name is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .optional(),
  role: z
    .enum(["USER", "ADMIN", "CUSTOMER"], {
      errorMap: () => ({
        message: "Role must be one of 'USER', 'ADMIN', or 'CUSTOMER'.",
      }),
    })
    .optional(),
});
