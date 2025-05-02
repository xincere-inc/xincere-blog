import { RegisterRequest } from '@/api/client';
import { z } from 'zod';
import { prisma } from '../../prisma';

export const registerSchemaBase: z.ZodType<RegisterRequest> = z
  .object({
    firstName: z
      .string({ required_error: 'Firstname is required' })
      .max(50, { message: 'Firstname must be at most 50 characters' })
      .regex(/^[a-zA-Z ]*$/, {
        message: 'Firstname must contain only letters and spaces',
      }),

    lastName: z
      .string()
      .max(50, { message: 'Lastname must be at most 50 characters' })
      .regex(/^[a-zA-Z ]*$/, {
        message: 'Lastname must contain only letters and spaces',
      })
      .optional(),

    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),

    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Gender is required',
    }),

    country: z
      .string({ required_error: 'Country is required' })
      .min(1, 'Please select a country'),

    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must be 8 characters, include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character',
        }
      ),

    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const registerSchema = registerSchemaBase
  .refine(
    async ({ email }) => {
      const isUnique = !(await prisma.user.findUnique({ where: { email } }));
      return isUnique;
    },
    {
      message: 'Email is already in use',
      path: ['email'],
    }
  )

// Define the Zod schema for the sign-in
export const signInSchema = z.object({
  email: z.string({ required_error: 'Email is required' }),
  password: z.string({ required_error: 'Password is required' }),
});

// Define the Zod schema for the email
export const emailSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

// Define the Zod schema for changing the password
export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: 'Old password is required' })
    .min(8, { message: 'Old password must be at least 8 characters' }),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, { message: 'New password must be at least 8 characters' }),
});

// Define the schema for resetting the password
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, { message: 'New password must be at least 8 characters' }),
});
