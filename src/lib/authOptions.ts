import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "./zod/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Validate input using Zod schema
        const parsedBody = signInSchema.safeParse({
          email: credentials.email,
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

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
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
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in", // Corrected typo in path
  },
};
