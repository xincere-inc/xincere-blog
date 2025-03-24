import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./lib/authOptions";
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from "./lib/routes";

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  const { nextUrl } = req;

  // Check if the user is authenticated (req.auth will be populated after NextAuth is invoked)
  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  // Check if the route is /api-docs or /verify-email or /verify-email-request  (open routes) and allow access
  const isApiDocsRoute =
    nextUrl.pathname === "/api-docs" ||
    nextUrl.pathname === "/verify-email" ||
    nextUrl.pathname === "/verify-email-request" ||
    nextUrl.pathname === "/forget-password" ||
    nextUrl.pathname === "/reset-password";

  // Allow free access to /api-docs and /verify-email routes
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
