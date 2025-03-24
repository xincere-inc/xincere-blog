import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

export const { auth, handlers } = NextAuth(authOptions);
