import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../prisma';
import { signInSchema } from '../zod/auth/auth';

const credentialsProvider = CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: {},
    password: {},
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Missing email or password');
    }

    // Validate input using Zod schema
    const parsedBody = signInSchema.safeParse({
      email: credentials.email,
      password: credentials.password,
    });

    // If validation fails, throw an error with the validation errors
    if (!parsedBody.success) {
      const errorResponse = {
        error: 'Validation error',
        details: parsedBody.error.errors,
      };
      throw new Error(JSON.stringify(errorResponse));
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: credentials.email }],
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Validate the password
    const isValidPassword = await bcrypt.compare(
      credentials.password as string,
      user.password
    );
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Return user object if authentication is successful
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName ?? '',
      role: user.role,
      emailVerified: user.emailVerified,
    };
  },
});

export default credentialsProvider;
