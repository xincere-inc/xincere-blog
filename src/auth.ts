import { authOptions } from "@/lib/auth/authOptions";
import NextAuth from "next-auth";

export const { auth, handlers } = NextAuth(authOptions);
