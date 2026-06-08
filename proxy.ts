import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-in/(.*)",
  "/sign-up",
  "/sign-up/(.*)",
  "/org/register",
  "/api/webhooks/clerk",
  "/_next/(.*)",
  "/favicon.ico"
]);

// In Next.js 16, the middleware function is named/exported as proxy
export const proxy = clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const authObj = await auth();
  const { userId, orgId, orgRole } = authObj;

  // 1. If user is signed in and visits / → redirect to /dashboard
  if (pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Allow all other public routes to pass through
  if (isPublicRoute(request)) {
    return;
  }

  // 3. For any other route, protect it
  if (!userId) {
    return authObj.redirectToSignIn({ returnBackUrl: request.url });
  }

  // 4. Role-based and Org-based routing rules
  
  // If user has orgRole "org:admin" → allow /admin routes
  if (pathname.startsWith("/admin")) {
    if (orgRole !== "org:admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return;
  }

  // If user has orgRole "org:member" → allow /member routes
  if (pathname.startsWith("/member")) {
    if (orgRole !== "org:member") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return;
  }

  // If user has no org → only allow /dashboard, /learn, /streak, /leaderboard, /profile, /friends, /onboarding, /battle
  if (!orgId || !orgRole) {
    const allowedPaths = [
      "/dashboard",
      "/learn",
      "/streak",
      "/leaderboard",
      "/profile",
      "/friends",
      "/onboarding",
      "/battle",
      "/api"
    ];

    // Check if the route is allowed for user without an organization
    const isAllowed = allowedPaths.some(path => pathname === path || pathname.startsWith(path + "/"));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
