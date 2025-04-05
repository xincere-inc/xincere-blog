import NextAuth from "next-auth";
import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";
import { authOptions } from "./lib/auth/authOptions";
import getSession from "./lib/auth/getSession";
import {
  ACCESS_ALL,
  DEFAULT_REDIRECT,
  PUBLIC_ROUTES,
  ROOT,
} from "./lib/auth/routes";

const { auth } = NextAuth(authOptions);

export default auth(async (req) => {
  const { nextUrl } = req;

  // Check if the user is authenticated (req.auth will be populated after NextAuth is invoked)
  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.some((route => nextUrl.pathname.includes(route)));

  // Check if the route is allow access with and without authentication
  const isApiDocsRoute = ACCESS_ALL.some((route => nextUrl.pathname.includes(route)));

  const session = await getSession();

  if (session?.expires && Date.now() > new Date(session.expires).getTime()) {
    await signOut();
    return NextResponse.redirect(new URL("/", nextUrl)); // Redirect to / after sign-out
  }

  // Allow free access to
  if (isApiDocsRoute) {
    return NextResponse.next(); // Continue without redirect
  }

  // Redirect authenticated users from public routes (they should be redirected to a default page)
  if (isPublicRoute && isAuthenticated) {
    console.log("Authenticated user attempting to access a public route.");
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    console.log("Unauthenticated user attempting to access a protected route.");
    return NextResponse.redirect(new URL(ROOT, nextUrl));
  }

  // If none of the above conditions matched, continue with the request
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
