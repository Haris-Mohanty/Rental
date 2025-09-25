import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./src/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const decoded = verifyToken(token);

  const { pathname } = req.nextUrl;

  if (decoded && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!decoded && pathname.startsWith("/booking-history")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/booking-history"],
};