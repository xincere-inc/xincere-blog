import { z } from 'zod';

// Define the Zod schema for creating the new user by admin
export const adminCreateUserSchema = z.object({
  email: z.string().email().min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  address: z
    .string()
    .max(50, 'Address must not exceed 50 characters')
    .optional(),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(50, 'Country must be at most 50 characters'),
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({
      message: "Role must be one of 'user' or 'admin'",
    }),
  }),
});

// Define the zod schema for updating the user by admin
export const updateAdminUserSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  email: z.string().email('Invalid email format').optional(),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters')
    .optional(),
  address: z.string().min(1, 'Address is required').optional(),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(50, 'Country must be at most 50 characters')
    .optional(),
  role: z
    .enum(['user', 'admin'], {
      errorMap: () => ({
        message: "Role must be one of 'user' or 'admin'.",
      }),
    })
    .optional(),
});
