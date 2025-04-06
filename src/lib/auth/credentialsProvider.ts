import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../prisma";
import { signInSchema } from "../zod/auth";

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: {},
    password: {},
  },
  async authorize(credentials) {
    console.log(credentials, "credentials");
    if (!credentials?.username || !credentials?.password) {
      throw new Error("Missing email or password");
    }

    // Validate input using Zod schema
    const parsedBody = signInSchema.safeParse({
      username: credentials.username,
      password: credentials.password,
    });

    // If validation fails, throw an error with the validation errors
    if (!parsedBody.success) {
      const errorResponse = {
        error: "Validation error",
        details: parsedBody.error.errors,
      };
      throw new Error(JSON.stringify(errorResponse));
    }

    // Find the user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: credentials.username },
          { username: credentials.username },
        ],
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Validate the password
    const isValidPassword = await bcrypt.compare(
      credentials.password as string,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    // Return user object if authentication is successful
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName ?? "",
      username: user.username,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  },
});

export default credentialsProvider;
