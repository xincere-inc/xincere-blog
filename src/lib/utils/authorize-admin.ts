// lib/utils/auth.ts

import { UnAuthorizedError } from "@/api/client";
import getSession from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function authorizeAdmin(): Promise<NextResponse<UnAuthorizedError> | null> {
  // Get user session
  const session = await getSession();
  const sessionExpired =
    session?.expires && new Date(session.expires).getTime() < Date.now();

  if (!session || sessionExpired) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the logged-in user is an admin
  const isAdmin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });


  if (isAdmin?.role !== "admin") {
    return NextResponse.json(
      { error: "You're unauthorized to access this request" },
      { status: 401 }
    )
  }

  // Return null if authorization is successful (to proceed with the request)
  return null;
}
