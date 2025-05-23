import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware to protect admin routes and apply security headers
export async function middleware(req: NextRequest) {
  // Check for authenticated token
  const token = await getToken({ req });

  // Only protect /admin routes
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  let response: NextResponse;

  // Redirect unauthenticated users trying to access /admin
  if (isAdminRoute && !token) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    response = NextResponse.redirect(loginUrl);
  } else {
    response = NextResponse.next();
  }

  // Set headers to enforce strong security
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://vcxi741wge.ufs.sh; font-src 'self'; connect-src 'self' https://uploadthing.com https://*.uploadthing.com https://sea1.ingest.uploadthing.com; object-src 'none'; frame-ancestors 'none'; base-uri 'self';"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), camera=(), microphone=()"
  );
  response.headers.set("Cache-Control", "no-store");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
